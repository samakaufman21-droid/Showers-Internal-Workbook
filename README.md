# Patriot Showers - Measurement Workbook Tool

Digital measurement and site assessment tool for Patriot Showers sales representatives.

## Overview

This web-based application streamlines the bathroom measurement and site assessment process for shower installations. It guides reps through a 6-step process to capture all necessary information for accurate quoting and installation planning.

## Features

### 6-Step Guided Process
1. **Job Information** - Customer details and job info
2. **Shower Type & Configuration** - Existing setup and desired changes
3. **Photo Documentation** - 16+ organized photo upload sections
4. **Measurements** - Complete A-G measurement matrix
5. **Site Conditions** - Issues, access notes, and special requirements
6. **Review & Submit** - Summary and data export

### Key Capabilities
- ✅ Mobile-friendly responsive design
- ✅ Photo upload with preview and management
- ✅ Comprehensive measurement tracking
- ✅ Site condition checklists
- ✅ Customer request notes
- ✅ Progress tracking
- ✅ Data export to JSON (includes base64 photos)
- ✅ Print-friendly format
- ✅ Matches Patriot Showers branding

## Live Demo

🔗 [https://measure.patriotshowers.com](https://measure.patriotshowers.com)

## Installation

### Option 1: GitHub Pages Deployment

1. Fork this repository
2. Go to Settings → Pages
3. Select `main` branch as source
4. Your site will be live at `https://yourusername.github.io/measure-tool`

### Option 2: Custom Domain

1. Follow GitHub Pages setup above
2. Add a `CNAME` file with your domain: `measure.patriotshowers.com`
3. Configure DNS:
   - Add CNAME record pointing to `yourusername.github.io`
   - Or use A records for GitHub Pages IPs

### Option 3: Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/measure-tool.git

# Navigate to directory
cd measure-tool

# Open in browser (any local server works)
python -m http.server 8000
# or
npx serve
```

## File Structure

```
measure-tool/
├── index.html          # Main HTML structure
├── styles.css          # Patriot Showers branded styles
├── app.js              # Application logic
└── README.md           # Documentation
```

## Usage

### For Sales Reps

1. Open the measurement tool in your mobile browser
2. Fill out customer information
3. Select shower type and site conditions
4. Take and upload photos on-site
5. Enter measurements using tape measure
6. Note any special conditions or customer requests
7. Download the workbook data file
8. Attach to customer quote or email to office

### Data Export

The tool exports a JSON file containing:
- All form data
- All photos (base64 encoded)
- Complete measurement matrix
- Site conditions and notes

This file can be:
- Emailed to the office
- Uploaded to project management system
- Used for automated quote generation
- Archived for project records

## Browser Compatibility

- ✅ Chrome/Edge (recommended for mobile)
- ✅ Safari (iOS)
- ✅ Firefox
- ✅ Mobile browsers

## Photo Storage

Photos are:
- Stored in browser memory during session
- Embedded as base64 in exported JSON
- Not uploaded to any server
- Cleared when page is refreshed

**Note**: Save your work frequently by downloading the data file!

## Customization

### Branding
All branding elements are in `styles.css`:
- Colors: `#1e3a5f` (navy) and `#dc2626` (red)
- Logo underline pattern
- Button styles

### Measurements
To modify measurement fields, edit the `measurements-table` in `index.html`

### Photo Sections
Photo upload sections can be added/removed in the Section 3 photo grids

## Integration with Pricing Tool

This tool is designed to work alongside the [Patriot Showers Pricing Tool](https://pricing.patriotshowers.com):

1. Use measurement tool on-site
2. Export measurement data
3. Use measurements in pricing tool for accurate quotes
4. Complete quote with customer

## Support

For issues or questions:
- Email: support@patriotshowers.com
- Open an issue on GitHub

## License

© 2024 Patriot Showers. All rights reserved.

## Changelog

### Version 1.0.0 (2024-02-04)
- Initial release
- 6-step measurement process
- Photo upload functionality
- Data export capability
- Print-friendly format
- Mobile-responsive design