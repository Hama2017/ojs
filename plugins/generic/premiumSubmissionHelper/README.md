# Premium Submission Helper Plugin

<div align="center">

<img src="https://i.ibb.co/PvTrC8Dc/12d69de3-0cd1-4ce1-af72-6000586f3532.png" alt="Premium Submission Helper Logo" width="500">

[![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)](https://github.com/your-username/premium-submission-helper/releases) [![OJS](https://img.shields.io/badge/OJS-3.5+-green.svg)](https://pkp.sfu.ca/software/ojs/) [![PHP](https://img.shields.io/badge/PHP-8.1+-purple.svg)](https://www.php.net/) [![AI](https://img.shields.io/badge/AI-AIMLAPI-orange.svg)](https://aimlapi.com) [![License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](LICENSE)

**Enhance your OJS submission workflow with real AI-powered premium features**

[Features](#features) • [Installation](#installation) • [Configuration](#configuration) • [Usage](#usage) • [Support](#support)

</div>

## Features

### Premium Subscription Management
- **Individual Subscription Detection** - Automatically identifies premium individual subscribers
- **Institutional Subscription Support** - Handles institutional premium access seamlessly  
- **Real-time Verification** - Dynamic subscription status checking during submission process

### Real AI Analysis Integration
- **Powered by AIMLAPI.com** - Uses genuine AI models (DeepSeek-R1) for authentic analysis
- **Intelligent Abstract Analysis** - Advanced text analysis with real AI insights
- **Smart Suggestions** - AI-generated recommendations for abstract improvement
- **Enhanced Text Generation** - AI-powered abstract enhancement and optimization
- **Premium-Only Access** - Exclusive AI features for subscribed users only

### Modern AI-Powered Features
- **Real-time AI Processing** - Direct integration with AIMLAPI for instant analysis
- **Advanced Language Models** - Leverages state-of-the-art AI models like DeepSeek-R1
- **Contextual Understanding** - AI comprehends academic writing context and structure
- **Quality Scoring** - AI-generated clarity and quality scores for abstracts
- **Professional Suggestions** - Academic writing improvement recommendations

### Enhanced UI/UX
- **Modern Interface** - Clean, intuitive submission wizard enhancement
- **Font Awesome Integration** - Beautiful icons and visual elements
- **Responsive Design** - Works seamlessly across all devices
- **Dynamic Asset Loading** - Resources loaded only for premium users

## Quick Start

### Prerequisites

- **OJS 3.5+** - Open Journal Systems
- **PHP 8.1+** - Server environment  
- **Font Awesome 6.4.0+** - Icon library
- **AIMLAPI Account** - Account at [aimlapi.com](https://aimlapi.com) with API key
- **Active Subscriptions** - Individual or institutional premium subscriptions configured

### Installation

1. **Download the plugin**
   ```bash
   git clone https://github.com/your-username/premium-submission-helper.git
   cd premium-submission-helper
   ```

2. **Upload to OJS plugins directory**
   ```bash
   cp -r . /path/to/ojs/plugins/generic/premiumSubmissionHelper/
   ```

3. **Configure AI API Key**
   - Edit `js/premiumAnalysisSantaane.js`
   - Replace `YOUR_AIMLAPI_KEY` with your actual AIMLAPI key:
   ```javascript
   this.AIML_API_KEY = 'your-actual-aimlapi-key-here';
   ```

4. **Enable the plugin**
   - Navigate to `Settings` → `Website` → `Plugins`
   - Find "Premium Submission Helper" in the Generic Plugins list
   - Click **Enable**

5. **Verify installation**
   - Check that premium users see enhanced submission features
   - Verify AI analysis works with real responses

## Configuration

### AIMLAPI Setup

1. **Get AIMLAPI Account**
   - Visit [aimlapi.com](https://aimlapi.com)
   - Create account and obtain API key
   - Ensure sufficient credits for AI model usage

2. **Configure API Key**
   ```javascript
   // In js/premiumAnalysisSantaane.js
   this.AIML_API_KEY = 'your-aimlapi-key-here';
   this.AI_MODEL = 'deepseek/deepseek-r1'; // Default model
   ```

### Subscription Types Setup

1. **Configure Subscription Types**
   ```
   Settings → Distribution → Subscriptions → Subscription Types
   ```
   - Create or modify subscription type with name: `premium`
   - Set appropriate pricing and duration

2. **Individual Subscriptions**
   ```
   Settings → Distribution → Subscriptions → Individual Subscriptions
   ```
   - Assign users to premium subscription type

3. **Institutional Subscriptions**
   ```
   Settings → Distribution → Subscriptions → Institutional Subscriptions
   ```
   - Configure institutional access with premium type

### Plugin Constants

The plugin uses these configurable constants:

```php
const SUBMISSION_PAGE_TARGET = 'submission';  // Target page for enhancement
const PREMIUM = 'premium';                    // Premium subscription type name
```

## Usage

### For Premium Users

1. **AI-Enhanced Submission Experience**
   - Navigate to journal submission page
   - Premium users automatically see Santaane AI section
   - Access real AI-powered analysis and suggestions

2. **Real AI-Powered Features**
   - **Abstract Analysis** - AI examines writing structure and clarity
   - **Quality Scoring** - AI-generated clarity scores (60-100%)
   - **Smart Suggestions** - AI recommendations for improvement
   - **Enhanced Version** - AI-generated improved abstract
   - **Academic Writing Optimization** - AI understands scholarly context

### For Administrators

1. **AI Integration Management**
   - Monitor AIMLAPI usage and costs
   - Configure AI model parameters
   - Track AI analysis success rates

2. **User Management**
   - Monitor premium subscription status
   - Manage individual and institutional access
   - Track feature usage through logs

## Development

### File Structure

```
premiumSubmissionHelper/
├── PremiumSubmissionHelperPlugin.php    # Main plugin class
├── css/
│   └── premiumAnalysisSantaane.css     # Plugin styles
├── js/
│   └── premiumAnalysisSantaane.js      # AI integration scripts
├── templates/
│   └── santaaneAiSection.tpl          # AI section template
├── vendor/
│   └── css/fontawesome-free-6.7.2-web/ # Font Awesome assets
└── README.md                           # Documentation
```

### AI Integration Architecture

```javascript
// AI Analysis Flow
class SantaaneAI {
    // Real AIMLAPI integration
    callAIMLAPI(abstractText)
    
    // AI prompt generation for academic context
    buildAnalysisPrompt(abstractText)
    
    // Parse structured AI responses
    parseAIResponse(aiResponse, originalText)
}
```

### Key Methods

```php
// Check user premium status
checkUserPremiumStatus($journal, $user): bool

// Individual subscription verification  
checkIndividualPremiumSubscription($journal, $user): bool

// Institutional subscription verification
checkInstitutionalPremiumSubscription($journal, $user): bool
```

### AI Model Configuration

```javascript
// Configurable AI parameters
this.AIML_API_URL = 'https://api.aimlapi.com/v1/chat/completions';
this.AI_MODEL = 'deepseek/deepseek-r1';
this.TEMPERATURE = 0.7;
this.MAX_TOKENS = 2000;
```

## Troubleshooting

### Common Issues

**Plugin not showing premium features**
- Verify user has active premium subscription
- Check subscription type name matches `'premium'`
- Ensure subscription is not expired

**AI Analysis not working**
- Verify AIMLAPI key is correctly configured
- Check AIMLAPI account has sufficient credits
- Ensure internet connectivity for API calls
- Check browser console for JavaScript errors

**API Rate Limiting**
- Monitor AIMLAPI usage limits
- Implement retry logic if needed
- Consider upgrading AIMLAPI plan for higher limits

**Assets not loading**
- Verify file permissions in plugin directory
- Check plugin is enabled in OJS admin
- Clear browser cache and OJS cache

### Debug Mode

Enable detailed logging:

```javascript
// Browser console debugging
console.log('AIMLAPI Response:', data);
console.log('Analysis completed:', result);
```

```php
// PHP logging
error_log('Premium subscription check: ' . $result);
```

## Support

### Get Help

- **Email**: [contact@hamadouba.com](mailto:contact@hamadouba.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/premium-submission-helper/issues)
- **Documentation**: [Wiki](https://github.com/your-username/premium-submission-helper/wiki)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/premium-submission-helper/discussions)
- **AIMLAPI Support**: [aimlapi.com/support](https://aimlapi.com/support)

### Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Changelog

## v1.1.1 - 2025-08-23

- Added role-based permission check for plugin access  



##### Implementation Notes

- **Role retrieval**: Currently, the plugin retrieves **user permissions** rather than exact roles.  
  - The logic works and ensures only eligible users access the AI section.  
  - Full role detection will be implemented in a future version.
- **Premium access**: Checks both individual and institutional premium subscriptions.  
- **Template injection**: Adds `santaaneAiSection` into the submission wizard dynamically.  
- **Clean logging**: Removed PHP `error_log` outputs for production readiness.


### v1.1.0 - 2025-08-23

**Major AI Integration Update**

- **Real AI Integration** - Replaced mock analysis with genuine AI via AIMLAPI
- **DeepSeek-R1 Model** - Integrated advanced language model for analysis
- **Simplified Architecture** - Removed complex PHP handlers, direct API integration
- **Enhanced Analysis** - Real AI-powered abstract analysis and suggestions
- **Improved Prompts** - Optimized AI prompts for academic writing context
- **Better UX** - Streamlined interface focusing on AI-generated insights
- **Removed Keywords** - Simplified analysis by removing keyword checking
- **Direct API Calls** - Client-side integration with AIMLAPI for better performance

### v1.0.0 - 2025-08-23

**Initial Release**

- Premium subscription verification (individual & institutional)
- Santaane AI integration for premium users
- Dynamic asset injection based on subscription status
- Enhanced submission wizard with AI section
- Font Awesome 6.7.2 integration
- Comprehensive error handling and logging
- Clean, maintainable code structure



## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Hamadou BA**
- Website: [hamadouba.com](https://hamadouba.com)
- Email: [contact@hamadouba.com](mailto:contact@hamadouba.com)
- GitHub: [@hamadouba](https://github.com/hamadouba)

---

<div align="center">


**Made with love for the OJS community**

⭐ Star us on GitHub if this plugin helped you!

</div>
