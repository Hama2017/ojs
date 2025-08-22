# Premium Submission Helper Plugin - Implementation Plan

## Plugin Information
- **Name**: PremiumSubmissionHelper  
- **Directory**: `/plugins/generic/premiumSubmissionHelper/`
- **Purpose**: Add AI-powered abstract analysis for premium users during manuscript submission

## Technical Implementation Plan (OJS 3.5)

### 1. OJS Hook Strategy
**Hook Used**: `TemplateManager::display`

**Modern Implementation** (OJS 3.5):
```php
use PKP\plugins\Hook;

public function register($category, $path, $mainContextId = null) {
    $success = parent::register($category, $path, $mainContextId);
    if ($success && $this->getEnabled()) {
        Hook::add('TemplateManager::display', [$this, 'handleTemplateDisplay']);
    }
    return $success;
}
```

**Implementation Logic**:
- Detect when submission form templates are being rendered
- Check if current user has "Premium" role/permission
- If premium user: inject custom button and results container
- Load custom JavaScript file via template assignment

### 2. Custom API Endpoint Strategy
**Approach**: Use `LoadHandler` hook to create custom route
**URL Pattern**: `/index.php/{journal}/premium/analyzeAbstract`
**HTTP Method**: POST
**Authentication**: Session-based (existing OJS auth)

**Request Format**:
```json
{
    "abstract": "The manuscript abstract text to analyze...",
    "submissionId": 123
}
```

**Response Format**:
```json
{
    "success": true,
    "analysis": {
        "wordCount": 150,
        "sentenceCount": 8,
        "clarityScore": 85,
        "readabilityGrade": "Graduate", 
        "keywords": ["research", "methodology", "analysis"],
        "suggestions": [
            "Consider shortening sentences for better clarity",
            "Add more specific keywords related to your field"
        ]
    }
}
```

**Mock Analysis Logic**:
- Word count and sentence count calculation
- Random clarity score (70-95) 
- Basic keyword extraction using PHP string functions
- Predefined suggestion pool with random selection

### 3. Frontend JavaScript Logic

**Modern Approach**:
- Use vanilla JavaScript (ES6+)
- Fetch API for AJAX requests
- Event delegation for dynamic content

**User Experience Flow**:
```
User clicks "Run Santaane AI Analysis" button
↓
Show loading spinner, disable button
↓
Send abstract text to custom handler
↓
Display formatted results or error message 
↓
Re-enable button for additional analyses
```

**DOM Elements**:
- Button: `#santaane-ai-analysis-btn`
- Results container: `#santaane-analysis-results` 
- Abstract textarea: `textarea[name*="abstract"]` (flexible selector)

## File Structure (OJS 3.4/3.5 Compatible)
```
/plugins/generic/premiumSubmissionHelper/
├── PremiumSubmissionHelperPlugin.php      # Main plugin class 
├── version.xml                            # Plugin metadata
├── PremiumAnalysisHandler.php             # Custom route handler 
├── js/
│   └── premium-analysis.js               # Frontend logic
├── templates/
│   └── analysisButton.tpl               # Button injection template
└── locale/
    └── en_US/
        └── locale.po                    # Translations 
```

## Development Milestones
1. ✅ Repository setup and planning
2. 🔄 Plugin structure creation
3. 🔄 Hook implementation for template injection
4. 🔄 Custom API endpoint registration
5. 🔄 Frontend JavaScript development
6. 🔄 Integration testing
7. 🔄 Code review and refinement
