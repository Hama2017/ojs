# Premium Submission Helper Plugin

<div align="center">

<img src="https://i.ibb.co/9Lrd2M1/b00e9043-b6ca-4f61-8328-f6bb99c2c396.png" alt="Premium Submission Helper Logo" width="500">

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/your-username/premium-submission-helper/releases) [![OJS](https://img.shields.io/badge/OJS-3.5+-green.svg)](https://pkp.sfu.ca/software/ojs/) [![PHP](https://img.shields.io/badge/PHP-8.1+-purple.svg)](https://www.php.net/) [![License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](LICENSE)

**Enhance your OJS submission workflow with AI-powered premium features**

[Features](#features) • [Installation](#installation) • [Configuration](#configuration) • [Usage](#usage) • [Support](#support)

</div>

## Features

### Premium Subscription Management
- **Individual Subscription Detection** - Automatically identifies premium individual subscribers
- **Institutional Subscription Support** - Handles institutional premium access seamlessly  
- **Real-time Verification** - Dynamic subscription status checking during submission process

### Santaane AI Integration
- **AI-Powered Analysis** - Enhanced abstract and content analysis for premium users
- **Smart Suggestions** - Intelligent recommendations for submission improvement
- **Premium-Only Access** - Exclusive AI features for subscribed users

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

3. **Enable the plugin**
   - Navigate to `Settings` → `Website` → `Plugins`
   - Find "Premium Submission Helper" in the Generic Plugins list
   - Click **Enable**

4. **Verify installation**
   - Check that premium users see enhanced submission features
   - Verify non-premium users have standard access

## Configuration

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

1. **Enhanced Submission Experience**
   - Navigate to journal submission page
   - Premium users automatically see Santaane AI section
   - Access advanced analysis and suggestions

2. **AI-Powered Features**
   - Abstract analysis and improvement suggestions
   - Content optimization recommendations
   - Smart formatting assistance

### For Administrators

1. **User Management**
   - Monitor premium subscription status
   - Manage individual and institutional access
   - Track feature usage through logs

2. **Customization**
   - Modify CSS in `/css/premiumAnalysisSantaane.css`
   - Update JavaScript in `/js/premiumAnalysisSantaane.js`
   - Customize templates in `/templates/`

## Development

### File Structure

```
premiumSubmissionHelper/
├── PremiumSubmissionHelperPlugin.php    # Main plugin class
├── css/
│   └── premiumAnalysisSantaane.css     # Plugin styles
├── js/
│   └── premiumAnalysisSantaane.js      # Plugin scripts
├── templates/
│   └── santaaneAiSection.tpl          # AI section template
├── vendor/
│   └── css/fontawesome-free-6.7.2-web/ # Font Awesome assets
└── README.md                           # Documentation
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

### Debugging

Enable debug logging to monitor subscription checks:

```php
// Individual subscription debug
error_log('Individual subscription check: ' . $result);

// Institutional subscription debug  
error_log('Institutional subscription check: ' . $result);
```

## Troubleshooting

### Common Issues

**Plugin not showing premium features**
- Verify user has active premium subscription
- Check subscription type name matches `'premium'`
- Ensure subscription is not expired

**Assets not loading**
- Verify file permissions in plugin directory
- Check plugin is enabled in OJS admin
- Clear browser cache and OJS cache

**Subscription detection fails**
- Check OJS logs for error messages
- Verify database subscription entries
- Test with both individual and institutional subscriptions

### Debug Mode

Enable detailed logging:

```php
// Add to config.inc.php
[debug]
display_errors = On
log_errors = On
```

## Support

### Get Help

- **Email**: [contact@hamadouba.com](mailto:contact@hamadouba.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/premium-submission-helper/issues)
- **Documentation**: [Wiki](https://github.com/your-username/premium-submission-helper/wiki)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/premium-submission-helper/discussions)

### Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Changelog

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

Star us on GitHub if this plugin helped you!

</div>