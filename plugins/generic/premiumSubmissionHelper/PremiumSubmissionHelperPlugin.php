<?php
/**
 * Premium Submission Helper Plugin
 * 
 * @package    PremiumSubmissionHelper
 * @subpackage SantaaneAI
 * @author     HAMADOU BA <contact@hamadouba.dev>
 * @version    1.0.0
 * @copyright  2025 HAMADOU BA
 * @license    MIT License
 * @created    2025-08-23
 * @updated    2025-08-23
 * 
 * Description: OJS Plugin for premium submission enhancement with AI analysis
 * Features: AI-powered abstract analysis, TinyMCE integration, submission wizard
 * Dependencies: OJS 3.5+, Font Awesome 6.4.0+
 * 
 * Plugin Structure:
 * - Template injection for submission wizard
 * - Asset management (CSS/JS)
 * - Hook integration with OJS workflow
 * - Santaane AI analysis integration
 */

namespace APP\plugins\generic\premiumSubmissionHelper;

use PKP\plugins\GenericPlugin;
use PKP\plugins\Hook;
use APP\core\Application;
use APP\template\TemplateManager;
use APP\pages\submission\SubmissionHandler;
use PKP\db\DAORegistry;

/**
 * PremiumSubmissionHelperPlugin Class
 * 
 * Main plugin class for integrating Santaane AI analysis into OJS submission workflow
 * 
 * @class PremiumSubmissionHelperPlugin
 * @extends GenericPlugin
 * @author HAMADOU BA
 */
class PremiumSubmissionHelperPlugin extends GenericPlugin 
{
    /** @var string Target page for submission enhancement */
    const SUBMISSION_PAGE_TARGET = 'submission';
    
    /** @var string Premium subscription type name */
    const PREMIUM = 'premium';
    
    /** @var bool Indicates if current user has premium access */
    private $isPremium = false;

    /**
     * Register the plugin and its hooks
     * 
     * @method register
     * @author HAMADOU BA
     * @param string $category Plugin category
     * @param string $path Plugin path
     * @param int|null $mainContextId Main context ID
     * @return bool Registration success status
     */
    public function register($category, $path, $mainContextId = null)
    {
        $success = parent::register($category, $path, $mainContextId);
        
        if ($success && $this->getEnabled($mainContextId)) {
            Hook::add('TemplateManager::display', [$this, 'handleTemplateDisplay']);
            Hook::add('Template::SubmissionWizard::Section', [$this, 'handleSubmissionWizardSection']);
        }
        
        return $success;
    }

    /**
     * Get plugin display name
     * 
     * @method getDisplayName
     * @author HAMADOU BA
     * @return string Plugin display name
     */
    public function getDisplayName(): string
    {
        return 'Premium Submission Helper';
    }

    /**
     * Get plugin description
     * 
     * @method getDescription
     * @author HAMADOU BA
     * @return string Plugin description
     */
    public function getDescription(): string
    {
        return 'Plugin to assist premium submission with Santaane AI analysis.';
    }

    /**
     * Check if user has an active premium subscription (individual or institutional)
     * 
     * @method checkUserPremiumStatus
     * @author HAMADOU BA
     * @param object $journal Journal instance
     * @param object $user User instance
     * @return bool True if user is premium, false otherwise
     */
    private function checkUserPremiumStatus($journal, $user): bool
    {
        if (!$user || !$journal) {
            return false;
        }

        try {
            // Check individual subscription first
            if ($this->checkIndividualPremiumSubscription($journal, $user)) {
                return true;
            }

            // Check institutional subscription
            if ($this->checkInstitutionalPremiumSubscription($journal, $user)) {
                return true;
            }

        } catch (Exception $e) {
            error_log('Error checking user premium status: ' . $e->getMessage());
        }

        return false;
    }

    /**
     * Check individual premium subscription
     * 
     * @method checkIndividualPremiumSubscription
     * @author HAMADOU BA
     * @param object $journal Journal instance
     * @param object $user User instance
     * @return bool True if user has individual premium subscription
     */
    private function checkIndividualPremiumSubscription($journal, $user): bool
    {
        try {
            $subscriptionDao = DAORegistry::getDAO('IndividualSubscriptionDAO');
            $subscription = $subscriptionDao->getByUserIdForJournal($user->getId(), $journal->getId());

            if ($subscription) {
                // Check if subscription is active and premium
                if (!$subscription->isExpired() && trim($subscription->getSubscriptionTypeName()) === self::PREMIUM) {
                    return true;
                }
            }

        } catch (Exception $e) {
            error_log('Error checking individual subscription: ' . $e->getMessage());
        }

        return false;
    }

    /**
     * Check institutional premium subscription
     * 
     * @method checkInstitutionalPremiumSubscription
     * @author HAMADOU BA
     * @param object $journal Journal instance
     * @param object $user User instance
     * @return bool True if user has institutional premium subscription
     */
    private function checkInstitutionalPremiumSubscription($journal, $user): bool
    {
        try {
            $subscriptionInstitutionalDao = DAORegistry::getDAO('InstitutionalSubscriptionDAO');
            $institutionalSubscriptions = $subscriptionInstitutionalDao->getByUserIdForJournal($user->getId(), $journal->getId());

            if ($institutionalSubscriptions) {
                while ($subscription = $institutionalSubscriptions->next()) {
                    // Check if subscription belongs to user and is premium
                    if ($subscription->getUserId() === $user->getId() &&
                        !$subscription->isExpired() &&
                        trim($subscription->getSubscriptionTypeName()) === self::PREMIUM) {
                        return true;
                    }
                }
            }

        } catch (Exception $e) {
            error_log('Error checking institutional subscription: ' . $e->getMessage());
        }

        return false;
    }

    /**
     * Handle template display and inject assets
     * 
     * @method handleTemplateDisplay
     * @author HAMADOU BA
     * @param string $hookName Hook name
     * @param array $args Hook arguments
     * @return bool Hook handling result
     */
    public function handleTemplateDisplay($hookName, $args)
    {
        $templateMgr = $args[0];
        $request = Application::get()->getRequest();
        $journal = $request->getJournal();
        $user = $request->getUser();

        // Only inject on submission pages
        if ($request->getRequestedPage() !== self::SUBMISSION_PAGE_TARGET) {
            return false;
        }

        // Check if user is premium and store in instance variable
        $this->isPremium = $this->checkUserPremiumStatus($journal, $user);

        if (!$this->isPremium) {
            return false;
        }

        // Add assets and inject Santaane AI section (for premium users only)
        $templateMgr->addStylesheet(
            'plugin-premium-analysis-santaane-css',
            $request->getBaseUrl() . '/' . $this->getPluginPath() . '/vendor/css/fontawesome-free-6.7.2-web/css/all.min.css',
            [
                'contexts' => 'backend',
                'priority' => TemplateManager::STYLE_SEQUENCE_LATE,
            ]
        );

        $templateMgr->addStylesheet(
            'plugin-premium-analysis-santaane-font-awesome-css',
            $request->getBaseUrl() . '/' . $this->getPluginPath() . '/css/premiumAnalysisSantaane.css',
            [
                'contexts' => 'backend',
                'priority' => TemplateManager::STYLE_SEQUENCE_LATE,
            ]
        );

        $templateMgr->addJavaScript(
            'plugin-premium-analysis-santaane-js',
            $request->getBaseUrl() . '/' . $this->getPluginPath() . '/js/premiumAnalysisSantaane.js',
            [
                'contexts' => 'backend',
                'priority' => TemplateManager::STYLE_SEQUENCE_LATE,
            ]
        );

        // Inject Santaane AI section into submission wizard
        $steps = $templateMgr->getState('steps');
        if ($steps) {
            $steps = array_map(function($step) {
                if ($step['id'] === 'details') {
                    $step['sections'][] = [
                        'id' => 'santaaneAiSection',
                        'type' => SubmissionHandler::SECTION_TYPE_TEMPLATE,
                    ];
                }
                return $step;
            }, $steps);

            $templateMgr->setState(['steps' => $steps]);
        }

        return false;
    }

    /**
     * Handle submission wizard section rendering
     * 
     * @method handleSubmissionWizardSection
     * @author HAMADOU BA
     * @param string $hookName Hook name
     * @param array $args Hook arguments
     * @return bool Hook handling result
     */
    public function handleSubmissionWizardSection($hookName, $args)
    {
        $smarty = $args[1];
        $output =& $args[2];

        // Only inject template if user is premium
        if (!$this->isPremium) {
            return false;
        }

        // Inject Santaane AI section template
        $output .= sprintf(
            '<template v-else-if="section.id === \'santaaneAiSection\'">%s</template>',
            $smarty->fetch($this->getTemplateResource('santaaneAiSection.tpl'))
        );

        return false;
    }
}