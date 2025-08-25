<?php

/**
 * Premium Submission Helper Plugin
 *
 * @package    PremiumSubmissionHelper
 * @subpackage SantaaneAI
 * @author     HAMADOU BA <contact@hamadouba.com>
 * @version    1.1.1
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
use PKP\security\Role;
use Exception;

/**
 * PremiumSubmissionHelperPlugin Class
 *
 * Main plugin class for integrating Santaane AI analysis into OJS submission workflow
 * Handles premium user checks and submission wizard enhancements
 */
class PremiumSubmissionHelperPlugin extends GenericPlugin
{
    /** @var string Target page for submission enhancement */
    public const SUBMISSION_PAGE_TARGET = 'submission';

    /** @var string Premium subscription type name */
    public const PREMIUM = 'premium';

    /** @var bool Indicates if current user has premium access */
    private bool $isPremium = false;

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
     * Retrieve the names of roles assigned to a user within a journal
     * Notice Not Working Properly but this is a starting point
     *
     * @method getUserRolesNames
     * @author HAMADOU BA
     * @param object $journal Journal instance
     * @param object $user User instance
     * @return array Array of role names (strings)
     */
    private function getUserRolesNames($journal, $user): array
    {
        $roleNames = [];

        if (!$user || !$journal) {
            return $roleNames;
        }

        try {
            // Retrieve Role objects for the user
            $userRoles = $user->getRoles($journal->getId());

            if (empty($userRoles)) {
                return $roleNames;
            }

            // Extract Role IDs
            $userRoleIds = array_map(fn($role) => $role->getId(), $userRoles);

            // Get role names using Application::getRoleNames()
            $userRoleNames = \APP\core\Application::getRoleNames(false, $userRoleIds);

            foreach ($userRoleNames as $fullRoleName) {
                // fullRoleName format: "user.role.manager" or "user.role.premium"
                $parts = explode('.', $fullRoleName);
                $lastPart = end($parts); // Extract the last part
                $roleNames[] = $lastPart;
            }
        } catch (Exception $e) {
            // Ignore errors silently
        }

        return $roleNames;
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
            // Notice Not Working Properly but this is a starting point
            // thats why i implemented the role check with subscription checks
            // Check if user has 'premium' role first

            $userRoles = $this->getUserRolesNames($journal, $user);
            $isPremiumUser = in_array(self::PREMIUM, $userRoles);

            if ($isPremiumUser) {
                return true;
            }

            // Check individual premium subscription Additional feature Works properly
            if ($this->checkIndividualPremiumSubscription($journal, $user)) {
                return true;
            }

            // Check institutional premium subscription Additional feature Works properly
            if ($this->checkInstitutionalPremiumSubscription($journal, $user)) {
                return true;
            }
        } catch (Exception $e) {
            // Ignore errors silently
        }

        return false;
    }

    /**
     * Check if user has an active individual premium subscription
     *
     * @method checkIndividualPremiumSubscription
     * @author HAMADOU BA
     * @param object $journal Journal instance
     * @param object $user User instance
     * @return bool True if user has individual premium subscription, false otherwise
     */
    private function checkIndividualPremiumSubscription($journal, $user): bool
    {
        try {
            $subscriptionDao = DAORegistry::getDAO('IndividualSubscriptionDAO');
            $subscription = $subscriptionDao->getByUserIdForJournal($user->getId(), $journal->getId());

            return $subscription &&
                   !$subscription->isExpired() &&
                   trim($subscription->getSubscriptionTypeName()) === self::PREMIUM;
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * Check if user has an active institutional premium subscription
     *
     * @method checkInstitutionalPremiumSubscription
     * @author HAMADOU BA
     * @param object $journal Journal instance
     * @param object $user User instance
     * @return bool True if user has institutional premium subscription, false otherwise
     */
    private function checkInstitutionalPremiumSubscription($journal, $user): bool
    {
        try {
            $subscriptionInstitutionalDao = DAORegistry::getDAO('InstitutionalSubscriptionDAO');
            $institutionalSubscriptions = $subscriptionInstitutionalDao->getByUserIdForJournal(
                $user->getId(),
                $journal->getId()
            );

            if ($institutionalSubscriptions) {
                while ($subscription = $institutionalSubscriptions->next()) {
                    if (
                        $subscription->getUserId() === $user->getId() &&
                        !$subscription->isExpired() &&
                        trim($subscription->getSubscriptionTypeName()) === self::PREMIUM
                    ) {
                        return true;
                    }
                }
            }
        } catch (Exception $e) {
            return false;
        }

        return false;
    }

    /**
     * Handle template display and inject CSS/JS assets for premium users
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

        // Check if user is premium
        $this->isPremium = $this->checkUserPremiumStatus($journal, $user);

        if (!$this->isPremium) {
            return false;
        }

        // Add CSS and JS assets
        $templateMgr->addStylesheet(
            'plugin-premium-analysis-santaane-css',
            $request->getBaseUrl() . '/' . $this->getPluginPath() .
            '/vendor/css/fontawesome-free-6.7.2-web/css/all.min.css',
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
            $steps = array_map(function ($step) {
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
     * Handle submission wizard section rendering for premium users
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
