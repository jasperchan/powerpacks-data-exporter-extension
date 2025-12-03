# Power Packs Data Exporter

A browser extension to export your Power Packs collection data from https://powerpacks.gamestop.com/.

## Installation

### Chrome

1. Goto [chrome://extensions/](https://www.notion.so/Power-Packs-Extension-Installation-2beb28c4b267801c842dec02b79365f8?pvs=21).

2. Enable **Developer mode.**
   <img width="2132" height="412" alt="image" src="https://github.com/user-attachments/assets/df277bd4-cdf4-4510-abb7-d63451a3c3c9" />
    
3. Drag the .zip file onto the extensions window (download from https://github.com/jasperchan/powerpacks-data-exporter-extension/releases).
   <img width="2130" height="1140" alt="image" src="https://github.com/user-attachments/assets/09ae27bf-e825-487f-bd9e-c6e8442d7e0a" />

5. The extension will likely be in the extensions menu.
   <img width="1444" height="362" alt="image" src="https://github.com/user-attachments/assets/37609f26-5e8c-4834-8d11-5235688ac0e2" />
 
7. Navigate to https://powerpacks.gamestop.com/collection and ensure you’re signed in.

9. Open up the extension and click **Download Collection**.
   <img width="1994" height="728" alt="image" src="https://github.com/user-attachments/assets/96fba9ee-8e2a-46d4-bf28-3e983aeae42c" />
   Download will automatically start once the entire collection is fetched. Example download file: [powerpacks-collection-2025-12-03T06-49-11.txt](https://raw.githubusercontent.com/jasperchan/powerpacks-data-exporter-extension/refs/heads/main/examples/powerpacks-collection-2025-12-03T06-49-11.txt)

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
