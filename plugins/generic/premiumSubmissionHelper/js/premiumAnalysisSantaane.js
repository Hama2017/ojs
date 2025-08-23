/**
 * Santaane AI Analysis JavaScript
 * 
 * @package    SantaaneAI
 * @author     HAMADOU BA <contact@hamadouba.com>
 * @version    1.0.0
 * @copyright  2025 HAMADOU BA
 * @license    MIT License
 * @created    2025-08-23
 * @updated    2025-08-23
 * 
 * Description: AI-powered abstract analysis for OJS submission workflow
 * Features: TinyMCE integration, real-time analysis, custom notifications
 * Dependencies: TinyMCE, Font Awesome 6.4.0+
 * 
 * @class SantaaneAI
 * @classdesc Main class handling AI analysis functionality
 */

/**
 * SantaaneAI Class - Main application controller
 * Handles AI analysis workflow for OJS abstract enhancement
 */

class SantaaneAI {
    /**
     * Constructor - Initialize the Santaane AI Analysis system
     * @constructor
     * @author HAMADOU BA
     */
    constructor() {
        this.analyzeBtn = document.getElementById('santaane-analyze-btn');
        this.resultsContainer = document.getElementById('santaane-results');
        this.errorContainer = document.getElementById('santaane-error');
        this.applyBtn = document.getElementById('apply-enhanced-btn');
        this.currentAnalysisData = null;
        
        this.init();
    }

    /**
     * Initialize event listeners and setup
     * @method init
     * @author HAMADOU BA
     */

    init() {
        if (this.analyzeBtn) {
            this.analyzeBtn.addEventListener('click', () => this.runAnalysis());
        }
        
        if (this.applyBtn) {
            this.applyBtn.addEventListener('click', () => this.applyEnhancedVersion());
        }
        
    }

    /**
     * Run AI analysis on the abstract text
     * @async
     * @method runAnalysis  
     * @author HAMADOU BA
     * @returns {Promise<void>}
     */
    async runAnalysis() {
        try {
            this.showLoading(true);
            this.hideResults();

            const abstractText = this.getAbstractText();
            
            if (!abstractText || abstractText.trim() === '') {
                throw new Error('Please enter an abstract to analyze.');
            }

            // MOCK API - Comment this block to use real API
            const mockResponse = {
                "wordCount": 145,
                "sentenceCount": 7,
                "keywordCheck": {
                    "AI": true,
                    "Blockchain": false,
                    "SmartContracts": true
                },
                "clarityScore": 82,
                "suggestions": [
                    "Consider adding more references to Blockchain concepts.",
                    "Break long sentences into shorter ones for better readability.",
                    "Add a concluding sentence to summarize the abstract."
                ],
                "aiEnchanched": "The abstract could be slightly expanded to include Blockchain references and a stronger concluding sentence for clarity.",
                "analysisTimestamp": new Date().toISOString()
            };

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.currentAnalysisData = mockResponse;
            this.displayResults(mockResponse);

            /* REAL API CALL - Uncomment when your backend is ready
            const response = await fetch('/index.php/your-journal/api/santaane/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    text: abstractText
                })
            });

            if (!response.ok) {
                throw new Error(`Analysis failed: ${response.statusText}`);
            }

            const data = await response.json();
            this.currentAnalysisData = data;
            this.displayResults(data);
            */
            
        } catch (error) {
            console.error('Analysis error:', error);
            this.showError(error.message);
        } finally {
            this.showLoading(false);
        }
    }

    /**
     * Get abstract text from TinyMCE editor
     * @method getAbstractText
     * @author HAMADOU BA
     * @returns {string} The abstract text content
     */
    getAbstractText() {
        const tinyMCEId = 'titleAbstract-abstract-control-en';
        
        if (typeof tinymce !== 'undefined' && tinymce.get(tinyMCEId)) {
            const editor = tinymce.get(tinyMCEId);
            return editor.getContent({ format: 'text' });
        }
        
        return '';
    }

    /**
     * Display analysis results in the interface
     * @method displayResults
     * @author HAMADOU BA
     * @param {Object} data - Analysis data from API
     */
    displayResults(data) {
        // Update stats
        document.getElementById('word-count').textContent = data.wordCount || 0;
        document.getElementById('sentence-count').textContent = data.sentenceCount || 0;
        document.getElementById('clarity-score').textContent = data.clarityScore ? `${data.clarityScore}%` : 'N/A';

        // Display keywords
        this.displayKeywords(data.keywordCheck || {});

        // Display suggestions
        this.displaySuggestions(data.suggestions || []);

        // Display enhanced version
        document.getElementById('enhanced-text').textContent = data.aiEnchanched || data.aiEnhanced || 'No enhanced version available.';

        // Display timestamp
        const timestamp = data.analysisTimestamp ? 
            new Date(data.analysisTimestamp).toLocaleString() : 
            new Date().toLocaleString();
        document.getElementById('analysis-time').textContent = `Analysis completed on ${timestamp}`;

        // Show results with animation
        this.showResults();
    }

    displayKeywords(keywords) {
        const container = document.getElementById('keywords-container');
        container.innerHTML = '';

        Object.entries(keywords).forEach(([keyword, present]) => {
            const tag = document.createElement('div');
            tag.className = `keyword-tag ${present ? 'present' : 'absent'}`;
            
            const icon = present ? 'fas fa-check' : 'fas fa-times';
            tag.innerHTML = `
                <i class="${icon}"></i>
                <span>${keyword}</span>
            `;
            
            container.appendChild(tag);
        });
    }

    displaySuggestions(suggestions) {
        const container = document.getElementById('suggestions-container');
        container.innerHTML = '';

        if (suggestions.length === 0) {
            container.innerHTML = '<p class="suggestion-text">No specific suggestions available.</p>';
            return;
        }

        suggestions.forEach(suggestion => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.innerHTML = `
                <i class="suggestion-icon fas fa-lightbulb"></i>
                <p class="suggestion-text">${suggestion}</p>
            `;
            container.appendChild(item);
        });
    }

    /**
     * Apply the AI-enhanced version to TinyMCE editor
     * @async
     * @method applyEnhancedVersion
     * @author HAMADOU BA
     * @returns {Promise<void>}
     */
    async applyEnhancedVersion() {
        if (!this.currentAnalysisData || !this.currentAnalysisData.aiEnchanched) {
            this.showCustomAlert('No enhanced version available to apply.', 'warning');
            return;
        }

        const confirmed = await this.showCustomConfirm(
            'Replace Abstract?',
            'Are you sure you want to replace your current abstract with the AI-enhanced version?'
        );
        
        if (confirmed) {
            const tinyMCEId = 'titleAbstract-abstract-control-en';

            if (typeof tinymce !== 'undefined' && tinymce.get(tinyMCEId)) {
                const editor = tinymce.get(tinyMCEId);
                const enhancedContent = this.currentAnalysisData.aiEnchanched || this.currentAnalysisData.aiEnhanced;
                
                editor.setContent(enhancedContent);
                editor.fire('change');
                
                this.showSuccessToast('Abstract successfully updated with AI-enhanced version!');
                
                const editorContainer = document.querySelector('.tox-tinymce');
                if (editorContainer) {
                    editorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else {
                this.showCustomAlert('Could not find the TinyMCE editor.', 'error');
            }
        }
    }

    /**
     * Show custom confirmation modal
     * @method showCustomConfirm
     * @author HAMADOU BA
     * @param {string} title - Modal title
     * @param {string} message - Modal message
     * @returns {Promise<boolean>} User's confirmation choice
     */
    showCustomConfirm(title, message) {
        return new Promise((resolve) => {
            // Create overlay
            const overlay = document.createElement('div');
            overlay.className = 'santaane-modal-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease-out;
            `;
            
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'santaane-modal';
            modal.style.cssText = `
                background: white;
                border-radius: 12px;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                animation: scaleIn 0.3s ease-out;
            `;
            
            modal.innerHTML = `
                <div class="santaane-modal-header" style="padding: 24px 24px 0 24px; text-align: center;">
                    <i class="fas fa-question-circle" style="font-size: 48px; color: #6366f1; margin-bottom: 16px;"></i>
                    <h3 class="modal-title" style="margin: 0; font-size: 24px; font-weight: 600; color: #1f2937;">${title}</h3>
                </div>
                <div class="santaane-modal-body" style="padding: 16px 24px; text-align: center;">
                    <p class="modal-message" style="margin: 0; color: #6b7280; font-size: 16px; line-height: 1.5;">${message}</p>
                </div>
                <div class="santaane-modal-footer" style="padding: 0 24px 24px 24px; display: flex; gap: 12px; justify-content: center;">
                    <button class="santaane-btn modal-cancel" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; background: linear-gradient(135deg, #ef4444, #dc2626); color: white;">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                    <button class="santaane-btn modal-confirm" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; background: linear-gradient(135deg, #10b981, #059669); color: white;">
                        <i class="fas fa-check"></i> Yes, Apply It!
                    </button>
                </div>
            `;
            
            overlay.appendChild(modal);
            document.body.appendChild(overlay);
            
            // Add event listeners
            const cancelBtn = modal.querySelector('.modal-cancel');
            const confirmBtn = modal.querySelector('.modal-confirm');
            
            const cleanup = () => {
                overlay.style.animation = 'fadeOut 0.3s ease-out forwards';
                setTimeout(() => {
                    if (document.body.contains(overlay)) {
                        document.body.removeChild(overlay);
                    }
                }, 300);
            };
            
            cancelBtn.addEventListener('click', () => {
                cleanup();
                resolve(false);
            });
            
            confirmBtn.addEventListener('click', () => {
                cleanup();
                resolve(true);
            });
            
            // Close on overlay click
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    cleanup();
                    resolve(false);
                }
            });
            
            // Close on ESC key
            const escapeHandler = (e) => {
                if (e.key === 'Escape') {
                    cleanup();
                    resolve(false);
                    document.removeEventListener('keydown', escapeHandler);
                }
            };
            document.addEventListener('keydown', escapeHandler);
        });
    }

    // Custom Alert System
    showCustomAlert(message, type = 'info') {
        const alert = document.createElement('div');
        alert.className = `santaane-alert santaane-alert-${type}`;
        
        const icons = {
            info: 'fas fa-info-circle',
            warning: 'fas fa-exclamation-triangle',
            error: 'fas fa-times-circle',
            success: 'fas fa-check-circle'
        };
        
        alert.innerHTML = `
            <div class="alert-content">
                <i class="${icons[type]}"></i>
                <span class="alert-message">${message}</span>
            </div>
            <button class="alert-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(alert);
        
        // Auto close after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.style.animation = 'slideOutRight 0.3s ease-out forwards';
                setTimeout(() => {
                    if (alert.parentNode) {
                        document.body.removeChild(alert);
                    }
                }, 300);
            }
        }, 5000);
        
        // Manual close
        alert.querySelector('.alert-close').addEventListener('click', () => {
            alert.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => {
                if (alert.parentNode) {
                    document.body.removeChild(alert);
                }
            }, 300);
        });
    }

    // Success Toast
    showSuccessToast(message) {
        const toast = document.createElement('div');
        toast.className = 'santaane-success-toast';
        
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => {
                if (toast.parentNode) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 4000);
    }

    showLoading(show) {
        const btnText = this.analyzeBtn.querySelector('.btn-text');
        const btnIcon = this.analyzeBtn.querySelector('.btn-icon');
        const spinner = this.analyzeBtn.querySelector('.loading-spinner');

        if (show) {
            this.analyzeBtn.disabled = true;
            btnText.style.opacity = '0';
            btnIcon.style.opacity = '0';
            spinner.style.display = 'block';
        } else {
            this.analyzeBtn.disabled = false;
            btnText.style.opacity = '1';
            btnIcon.style.opacity = '1';
            spinner.style.display = 'none';
        }
    }

    showResults() {
        this.resultsContainer.style.display = 'block';
        this.resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    hideResults() {
        this.resultsContainer.style.display = 'none';
    }

    showError(message) {
        this.showCustomAlert(message, 'error');
    }

  }

/**
 * Initialize Santaane AI when DOM is ready
 */

document.addEventListener('DOMContentLoaded', function() {
    new SantaaneAI();
});
