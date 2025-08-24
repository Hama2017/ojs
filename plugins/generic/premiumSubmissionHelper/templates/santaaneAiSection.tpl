<!--
 * Santaane AI Analysis Section Template - Sans Keywords
 * 
 * @package    SantaaneAI
 * @author     HAMADOU BA <contact@hamadouba.com>
 * @version    1.0.0
 * @copyright  2025 HAMADOU BA
 * @license    MIT License
 * @created    2025-08-23
 * @updated    2025-08-23
 * 
 * Description: Template for AI-powered abstract analysis interface
 * Features: TinyMCE integration, real-time analysis, custom modals
 * Dependencies: Font Awesome 6.4.0+
 * 
 * Template Structure:
 * - Header with branding
 * - Action button with loading state
 * - Results section with stats grid
 * - Improvement suggestions list
 * - AI enhanced version with apply button
 * - Footer with timestamp
 * - Error handling display
 -->

<!-- Santaane AI Analysis Section Template -->
<div class="santaane-ai-section">
    <!-- Header Section -->
    <div class="santaane-header">
        <div class="santaane-title-wrapper">
            <i class="fas fa-robot santaane-icon"></i>
            <h3 class="santaane-title">Santaane AI Analysis</h3>
        </div>
        <p class="santaane-subtitle">Enhance your abstract with intelligent analysis and suggestions</p>
    </div>

    <!-- Action Button -->
    <div class="santaane-action-section">
        <button id="santaane-analyze-btn" class="santaane-btn santaane-btn-primary" type="button">
            <i class="fas fa-magic btn-icon"></i>
            <span class="btn-text">Run Santaane AI Analysis</span>
            <div class="loading-spinner" style="display: none;">
                <i class="fas fa-spinner fa-spin"></i>
            </div>
        </button>
    </div>

    <!-- Results Section -->
    <div id="santaane-results" class="santaane-results-container" style="display: none;">
        
        <!-- Stats Cards -->
        <div class="santaane-stats-grid">
            <div class="santaane-stat-card">
                <div class="stat-icon">
                    <i class="fas fa-file-word"></i>
                </div>
                <div class="stat-content">
                    <span class="stat-value" id="word-count">-</span>
                    <span class="stat-label">Words</span>
                </div>
            </div>
            
            <div class="santaane-stat-card">
                <div class="stat-icon">
                    <i class="fas fa-list-ol"></i>
                </div>
                <div class="stat-content">
                    <span class="stat-value" id="sentence-count">-</span>
                    <span class="stat-label">Sentences</span>
                </div>
            </div>
            
            <div class="santaane-stat-card">
                <div class="stat-icon">
                    <i class="fas fa-star"></i>
                </div>
                <div class="stat-content">
                    <span class="stat-value" id="clarity-score">-</span>
                    <span class="stat-label">Clarity Score</span>
                </div>
            </div>
        </div>

        <!-- Suggestions Section -->
        <div class="santaane-section">
            <div class="section-header">
                <i class="fas fa-lightbulb"></i>
                <h4>Improvement Suggestions</h4>
            </div>
            <div id="suggestions-container" class="suggestions-container">
                <!-- Suggestions will be populated here -->
            </div>
        </div>

        <!-- AI Enhanced Version Section -->
        <div class="santaane-section ai-enhanced-section">
            <div class="section-header">
                <i class="fas fa-magic"></i>
                <h4>AI Enhanced Version</h4>
            </div>
            <div class="enhanced-content">
                <div class="enhanced-text-wrapper">
                    <p id="enhanced-text" class="enhanced-text"></p>
                </div>
                <div class="enhanced-actions">
                    <button id="apply-enhanced-btn" class="santaane-btn santaane-btn-success" type="button">
                        <i class="fas fa-check"></i>
                        Apply AI Enhanced Version
                    </button>
                </div>
            </div>
        </div>

        <!-- Analysis Info -->
        <div class="santaane-footer">
            <div class="analysis-timestamp">
                <i class="fas fa-clock"></i>
                <span id="analysis-time">Analysis completed</span>
            </div>
        </div>
    </div>

    <!-- Error Message -->
    <div id="santaane-error" class="santaane-error" style="display: none;">
        <i class="fas fa-exclamation-triangle"></i>
        <span class="error-message">An error occurred during analysis. Please try again.</span>
    </div>
</div>