# Patriot Showers - Measurement Workbook Tool (Enhanced)

Professional measurement and site assessment tool for Patriot Showers sales representatives.

## New Features (v2.0)

✨ **Auto-Save to localStorage** - Never lose your work! Data automatically saves as you type.
📸 **Image Compression** - Photos compressed to ~80% quality, reducing file sizes by 60-80%.
📏 **Measurement Validation** - Smart warnings if measurements don't make sense.
🔄 **Quick Retake** - Click X on any photo to remove and retake instantly.
💾 **Persistent Storage** - Return to incomplete workbooks anytime - data stays saved.

## Overview

This web-based application streamlines the bathroom measurement and site assessment process for shower installations. It guides reps through a smooth 6-step process to capture all necessary information for accurate quoting and installation planning.

## Features

### 6-Step Guided Process
1. **Job Information** - Customer details and job info
2. **Shower Type & Configuration** - Existing setup and desired changes  
3. **Photo Documentation** - 16+ organized photo upload sections
4. **Measurements** - Complete A-G measurement matrix with validation
5. **Site Conditions** - Issues, access notes, and special requirements
6. **Review & Submit** - Summary and data export

### Enhanced Capabilities
- ✅ **Auto-save** - Data saves automatically every second after typing stops
- ✅ **Image compression** - Photos automatically compressed to reduce file size
- ✅ **Measurement validation** - Warns if measurements seem incorrect
- ✅ **Quick photo retake** - Easy remove and retake for any photo
- ✅ **Mobile-friendly** responsive design
- ✅ **Progress tracking** with visual indicators
- ✅ **Data export** to JSON (includes compressed base64 photos)
- ✅ **Print-friendly** format
- ✅ **Patriot Showers branding** (exact match to pricing tool)

## Technical Features

### Auto-Save
- Saves form data to browser localStorage every 1 second after input stops
- Saves photos separately to avoid storage limits
- Visual indicator shows when data is saved
- Automatically loads saved data when page is reopened
- "Clear All Data" button to start fresh

### Image Compression
- Automatically resizes images to max 1200px width
- Compresses to 80% JPEG quality
- Typical 60-80% file size reduction
- Preserves quality for measurement verification
- Shows total compressed size in summary

### Measurement Validation
- Validates width (A): typical 28-72"
- Validates depth (B): typical 28-72"
- Validates height (D): typical 72-120"
- Checks C/C2/E/E2 against depth (B)
- Shows warnings in real-time as you type
- Doesn't block submission - just warns

## Live Demo

🔗 [https://measure.patriotshowers.com](https://measure.patriotshowers.com)

## Installation

### GitHub Pages Deployment

1. Upload these files to your repo:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `README.md`

2. Enable GitHub Pages in Settings → Pages

3. Select `main` branch as source

4. Site will be live at `https://yourusername.github.io/repo-name`

### Custom Domain Setup

1. Add `CNAME` file to repo with your domain:
   ```
   measure.patriotshowers.com
   ```

2. Configure DNS at your domain provider:
   - Add CNAME record: `measure` → `yourusername.github.io`
   - Or use A records pointing to GitHub Pages IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`

3. Wait for DNS propagation (usually 5-30 minutes)

## File Structure

```
measure-tool/
├── index.html          # Main HTML structure
├── styles.css          # Patriot Showers branded styles
├── app.js              # Enhanced application logic
└── README.md           # This file
```

## Usage

### For Sales Reps

1. **Open tool** in your mobile browser (bookmark it!)
2. **Fill out** customer information as you go
3. **Select** shower type and check site conditions
4. **Take photos** - tap box, take photo, it auto-compresses
5. **Enter measurements** - get warned if something seems off
6. **Note issues** - check all that apply
7. **Review** - everything in one summary
8. **Download** - one file with everything
9. **Come back later** - all your data is saved automatically!

### Data Persistence

Your work is **automatically saved** as you type:
- Form fields save to localStorage
- Photos save separately (compressed)
- Data persists across browser sessions
- Close browser and reopen - everything's still there
- Use "Clear All Data" button to start fresh

### Photo Management

Photos are:
- Automatically compressed to ~80% quality
- Resized to max 1200px width
- Stored in browser localStorage
- Embedded as base64 in exported JSON
- **Quick retake:** Click X to remove, tap box to retake

### Data Export

The exported JSON file contains:
- All form data
- All compressed photos (base64)
- Photo size information
- Export timestamp
- Complete measurement matrix
- All site conditions and notes

Use the file to:
- Email to the office
- Upload to project management system
- Import to quote generator
- Archive for project records

## Browser Compatibility

- ✅ Chrome/Edge (recommended for mobile)
- ✅ Safari (iOS)
- ✅ Firefox
- ✅ All modern mobile browsers

## Storage Limits

- **localStorage limit:** ~5-10MB per domain
- **Compressed photos:** ~50-200KB each
- **Typical workbook:** 2-5MB total
- **Recommendation:** Export and clear after completing each job

## Tips for Best Results

1. **Photos:**
   - Use good lighting
   - Get close to show detail
   - Include tape measure in measurement photos
   - Review photos before moving to next section

2. **Measurements:**
   - Double-check critical dimensions (A, B, D)
   - Note any unusual conditions
   - Pay attention to validation warnings

3. **Data Management:**
   - Export completed workbooks promptly
   - Clear data after export to free storage
   - Keep exported files organized by customer name

## Troubleshooting

**Photos not uploading?**
- Check browser storage isn't full
- Try clearing old data
- Use "Clear All Data" if needed

**Auto-save not working?**
- Check browser allows localStorage
- Disable private/incognito mode
- Check browser console for errors

**Measurements showing warnings?**
- Warnings are suggestions, not blockers
- Double-check measurements if warned
- Add notes explaining unusual dimensions

## Integration

Works alongside the [Patriot Showers Pricing Tool](https://pricing.patriotshowers.com):
1. Measure on-site with this tool
2. Export measurement data
3. Use in pricing tool for accurate quotes
4. Complete quote with customer

## Support

For issues or questions:
- Email: support@patriotshowers.com
- Open an issue on GitHub

## License

© 2024 Patriot Showers. All rights reserved.

## Changelog

### Version 2.0.0 (2025-02-04)
- ✨ Added auto-save to localStorage
- 📸 Added automatic image compression
- 📏 Added measurement validation with warnings
- 🔄 Added quick photo retake functionality
- 🎨 Improved visual design and animations
- 📱 Enhanced mobile experience
- 💾 Added data persistence across sessions
- 🧹 Added "Clear All Data" option

### Version 1.0.0 (2024-02-04)
- Initial release
- 6-step measurement process
- Photo upload functionality
- Data export capability
- Print-friendly format
- Mobile-responsive design