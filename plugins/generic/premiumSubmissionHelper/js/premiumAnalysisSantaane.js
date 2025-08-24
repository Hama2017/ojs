/**
 * Santaane AI Analysis JavaScript - AIML API Version
 * 
 * @package    SantaaneAI
 * @author     HAMADOU BA <contact@hamadouba.com>
 * @version    1.0.0
 * @copyright  2025 HAMADOU BA
 * @license    MIT License
 * @created    2025-08-23
 * @updated    2025-08-23
 * 
 * Description: AI-powered abstract analysis using AIML API
 * Features: Real AI analysis, TinyMCE integration, custom notifications
 * Dependencies: TinyMCE, Font Awesome 6.4.0+
 */

class SantaaneAI {
    /**
     * Constructor - Initialize the Santaane AI Analysis system
     */
    constructor() {
        this.analyzeBtn = document.getElementById('santaane-analyze-btn');
        this.resultsContainer = document.getElementById('santaane-results');
        this.errorContainer = document.getElementById('santaane-error');
        this.applyBtn = document.getElementById('apply-enhanced-btn');
        this.currentAnalysisData = null;
        
        // AIML API Configuration
        this.AIML_API_KEY = '129edc202c934c9fa84238257fe86fa8'; // Replace with your actual API key
        this.AIML_API_URL = 'https://api.aimlapi.com/v1/chat/completions';
        this.AI_MODEL = 'deepseek/deepseek-r1';
        
        this.init();
    }

    /**
     * Initialize event listeners and setup
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
     * Run AI analysis on the abstract text using AIML API
     */
    async runAnalysis() {
        try {
            this.showLoading(true);
            this.hideResults();

            const abstractText = this.getAbstractText();
            
            if (!abstractText || abstractText.trim() === '') {
                throw new Error('Please enter an abstract to analyze.');
            }

            console.log('Analyzing abstract:', abstractText);

            // Call AIML API for analysis
            const analysisData = await this.callAIMLAPI(abstractText);
            
            this.currentAnalysisData = analysisData;
            this.displayResults(analysisData);
            
        } catch (error) {
            console.error('Analysis error:', error);
            this.showError(error.message);
        } finally {
            this.showLoading(false);
        }
    }

    /**
     * Call AIML API for abstract analysis
     */
    async callAIMLAPI(abstractText) {
        try {
            const prompt = this.buildAnalysisPrompt(abstractText);
            
            const response = await fetch(this.AIML_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.AIML_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: this.AI_MODEL,
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 2000
                }),
            });

            if (!response.ok) {
                throw new Error(`AIML API error! Status ${response.status}`);
            }

            const data = await response.json();
            console.log('AIML API Response:', data);

            // Parse the AI response
            const aiAnalysis = data.choices[0].message.content;
            return this.parseAIResponse(aiAnalysis, abstractText);
            
        } catch (error) {
            console.error('AIML API Error:', error);
            throw new Error('Failed to analyze with AI: ' + error.message);
        }
    }

    /**
     * Build analysis prompt for AI
     */
    buildAnalysisPrompt(abstractText) {
        return `Please analyze this academic abstract and provide a structured analysis in JSON format:

Abstract to analyze:
"${abstractText}"

Please provide your analysis in this exact JSON format:
{
  "wordCount": [number of words],
  "sentenceCount": [number of sentences],
  "clarityScore": [score from 60-100],
  "suggestions": [
    "Suggestion 1 for improvement",
    "Suggestion 2 for improvement", 
    "Suggestion 3 for improvement"
  ],
  "aiEnhanced": "[Provide an improved version of the abstract]",
  "analysisTimestamp": "${new Date().toISOString()}"
}

Focus on:
- Academic writing clarity and structure
- Sentence complexity and readability
- Research contribution clarity
- Abstract completeness (objective, method, results, conclusion)
- Grammar and style improvements

Return ONLY the JSON, no additional text or explanations.`;
    }

    /**
     * Parse AI response and format for display
     */
    parseAIResponse(aiResponse, originalText) {
        try {
            // Try to extract JSON from the response
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                
                // Add status and ensure all fields are present
                return {
                    status: true,
                    wordCount: parsed.wordCount || this.countWords(originalText),
                    sentenceCount: parsed.sentenceCount || this.countSentences(originalText),
                    clarityScore: parsed.clarityScore || 75,
                    suggestions: parsed.suggestions || ['AI analysis completed successfully.'],
                    aiEnhanced: parsed.aiEnhanced || originalText,
                    analysisTimestamp: parsed.analysisTimestamp || new Date().toISOString()
                };
            }
        } catch (error) {
            console.error('Error parsing AI response:', error);
        }

        // Fallback analysis if JSON parsing fails
        return this.createFallbackAnalysis(originalText, aiResponse);
    }

    /**
     * Create fallback analysis if AI parsing fails
     */
    createFallbackAnalysis(originalText, aiResponse) {
        return {
            status: true,
            wordCount: this.countWords(originalText),
            sentenceCount: this.countSentences(originalText),
            clarityScore: 78,
            suggestions: [
                'AI analysis provided general feedback.',
                'Consider reviewing the structure of your abstract.',
                'Ensure all key research elements are clearly stated.'
            ],
            aiEnhanced: aiResponse || originalText,
            analysisTimestamp: new Date().toISOString()
        };
    }

    /**
     * Count words in text
     */
    countWords(text) {
        return text.trim().split(/\s+/).length;
    }

    /**
     * Count sentences in text
     */
    countSentences(text) {
        return text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    }

    /**
     * Get abstract text from TinyMCE editor
     */
    getAbstractText() {
        // Try multiple possible TinyMCE editor IDs
        const possibleIds = [
            'titleAbstract-abstract-control-en',
            'abstract-control-en',
            'abstract-en',
            'titleAbstract-abstract-control',
            'abstract-control'
        ];
        
        for (const editorId of possibleIds) {
            if (typeof tinymce !== 'undefined' && tinymce.get(editorId)) {
                const editor = tinymce.get(editorId);
                return editor.getContent({ format: 'text' });
            }
        }
        
        // Fallback: try to find textarea with abstract in name/id
        const textareas = document.querySelectorAll('textarea[id*="abstract"], textarea[name*="abstract"]');
        if (textareas.length > 0) {
            return textareas[0].value;
        }
        
        return '';
    }

    /**
     * Display analysis results in the interface
     */
    displayResults(data) {
        // Update stats
        document.getElementById('word-count').textContent = data.wordCount || 0;
        document.getElementById('sentence-count').textContent = data.sentenceCount || 0;
        document.getElementById('clarity-score').textContent = data.clarityScore ? `${data.clarityScore}%` : 'N/A';

        // Display suggestions
        this.displaySuggestions(data.suggestions || []);

        // Display enhanced version
        document.getElementById('enhanced-text').textContent = data.aiEnhanced || 'No enhanced version available.';

        // Display timestamp
        const timestamp = data.analysisTimestamp ? 
            new Date(data.analysisTimestamp).toLocaleString() : 
            new Date().toLocaleString();
        document.getElementById('analysis-time').textContent = `Analysis completed on ${timestamp}`;

        // Show results with animation
        this.showResults();
    }

    /**
     * Display improvement suggestions
     */
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
     */
    async applyEnhancedVersion() {
        if (!this.currentAnalysisData || !this.currentAnalysisData.aiEnhanced) {
            this.showCustomAlert('No enhanced version available to apply.', 'warning');
            return;
        }

        const confirmed = await this.showCustomConfirm(
            'Replace Abstract?',
            'Are you sure you want to replace your current abstract with the AI-enhanced version?'
        );
        
        if (confirmed) {
            const possibleIds = [
                'titleAbstract-abstract-control-en',
                'abstract-control-en',
                'abstract-en',
                'titleAbstract-abstract-control',
                'abstract-control'
            ];

            let editorFound = false;
            
            for (const editorId of possibleIds) {
                if (typeof tinymce !== 'undefined' && tinymce.get(editorId)) {
                    const editor = tinymce.get(editorId);
                    const enhancedContent = this.currentAnalysisData.aiEnhanced;
                    
                    editor.setContent(enhancedContent);
                    editor.fire('change');
                    
                    this.showSuccessToast('Abstract successfully updated with AI-enhanced version!');
                    
                    const editorContainer = document.querySelector('.tox-tinymce');
                    if (editorContainer) {
                        editorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    
                    editorFound = true;
                    break;
                }
            }

            if (!editorFound) {
                // Fallback: try to find textarea
                const textareas = document.querySelectorAll('textarea[id*="abstract"], textarea[name*="abstract"]');
                if (textareas.length > 0) {
                    textareas[0].value = this.currentAnalysisData.aiEnhanced;
                    this.showSuccessToast('Abstract successfully updated with AI-enhanced version!');
                } else {
                    this.showCustomAlert('Could not find the abstract editor.', 'error');
                }
            }
        }
    }

    /**
     * Show custom confirmation modal
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

    /**
     * Show custom alert notification
     */
    showCustomAlert(message, type = 'info') {
        const alert = document.createElement('div');
        alert.className = `santaane-alert santaane-alert-${type}`;
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            max-width: 400px;
            padding: 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10001;
            animation: slideInRight 0.3s ease-out;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        const colors = {
            info: { bg: '#dbeafe', border: '#60a5fa', text: '#1e40af', icon: '#3b82f6' },
            warning: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e', icon: '#f59e0b' },
            error: { bg: '#fecaca', border: '#f87171', text: '#991b1b', icon: '#ef4444' },
            success: { bg: '#d1fae5', border: '#34d399', text: '#065f46', icon: '#10b981' }
        };
        
        const color = colors[type];
        alert.style.background = color.bg;
        alert.style.border = `1px solid ${color.border}`;
        alert.style.color = color.text;
        
        const icons = {
            info: 'fas fa-info-circle',
            warning: 'fas fa-exclamation-triangle',
            error: 'fas fa-times-circle',
            success: 'fas fa-check-circle'
        };
        
        alert.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 12px;">
                <i class="${icons[type]}" style="color: ${color.icon}; font-size: 18px; margin-top: 2px;"></i>
                <div style="flex: 1;">
                    <span style="font-weight: 500; font-size: 14px;">${message}</span>
                </div>
                <button class="alert-close" style="background: none; border: none; cursor: pointer; padding: 0; margin-left: 8px;">
                    <i class="fas fa-times" style="color: ${color.text}; font-size: 14px;"></i>
                </button>
            </div>
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

    /**
     * Show success toast notification
     */
    showSuccessToast(message) {
        this.showCustomAlert(message, 'success');
    }

    /**
     * Show/hide loading state on analyze button
     */
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

    /**
     * Show results container with animation
     */
    showResults() {
        this.resultsContainer.style.display = 'block';
        this.resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /**
     * Hide results container
     */
    hideResults() {
        this.resultsContainer.style.display = 'none';
    }

    /**
     * Show error message
     */
    showError(message) {
        this.showCustomAlert(message, 'error');
    }
}

/**
 * Add required CSS animations
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes scaleIn {
        from { transform: scale(0.9); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }
`;
document.head.appendChild(style);

/**
 * Initialize Santaane AI when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Santaane AI with AIML API...');
    new SantaaneAI();
});