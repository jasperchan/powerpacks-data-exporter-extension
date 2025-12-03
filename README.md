# Power Packs Data Exporter

> **Installation Guide:** https://www.notion.so/cdcm/Power-Packs-Extension-Installation-2beb28c4b267801c842dec02b79365f8

A browser extension to export your Power Packs collection data from powerpacks.gamestop.com.

## Features

- Export your ACTIVE and SOLD collectibles
- Downloads as a text file in JSON Lines format
- Supports Chrome and Firefox

## Development

### Prerequisites

- Node.js

### Scripts

```bash
npm run build          # Build for both browsers
npm run build:chrome   # Build for Chrome only
npm run build:firefox  # Build for Firefox only

npm run package        # Create zip files for both browsers
npm run package:chrome # Create Chrome zip
npm run package:firefox # Create Firefox zip

npm run bump           # Bump minor version
npm run clean          # Remove dist folder and zip files
```

### Loading for Development

**Chrome:**

1. Run `npm run build:chrome`
2. Go to `chrome://extensions`
3. Enable "Developer mode"
4. Click "Load unpacked" and select `dist/chrome`

**Firefox:**

1. Run `npm run build:firefox`
2. Go to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select any file in `dist/firefox`
