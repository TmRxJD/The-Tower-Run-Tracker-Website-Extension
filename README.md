# The Tower Run Tracker Extension

A Chrome browser extension to help you track, upload, and import your game runs for The Tower. Includes OCR (Optical Character Recognition) functionality for extracting run data from screenshots using a local, CSP-compliant Tesseract.js solution.

## Features

- **Upload Game Runs:** Upload your run data to a remote server with a simple UI.
- **OCR from Screenshots:** Drag-and-drop or select a screenshot to extract run data using Tesseract.js, all processed locally for privacy and CSP compliance.
- **Manual Entry:** Add runs manually via a form.
- **Import from Old Tracker:** Import your previous runs from the legacy tracker site.
- **Appwrite Integration:** Uses Appwrite for authentication and data storage.
- **Manifest V3 Compliant:** All assets are loaded locally, and the extension works under Chrome Extension Manifest V3 CSP restrictions.

## Installation

1. **Clone or Download** this repository.
2. **Install dependencies** (if you want to build or develop):
	```sh
	npm install
	```
3. **Build (if needed):**
	```sh
	npm run build
	```
4. **Load the Extension in Chrome:**
	- Go to `chrome://extensions`.
	- Enable "Developer mode".
	- Click "Load unpacked" and select the project folder.

## Usage

- Open the extension popup from the Chrome toolbar.
- Drag and drop a screenshot or select an image file to extract run data via OCR.
- Fill in or edit the extracted data as needed.
- Click "Upload" to save your run.
- Use the "Add Run Manually" button for manual entry.
- Use the "Import" button to import runs from the old tracker.

## OCR Details

- Uses [Tesseract.js](https://github.com/naptha/tesseract.js) browser bundle for OCR.
- All Tesseract.js assets (WASM, worker, language data) are loaded locally from the `assets/` folder.
- No network requests are made for OCR processing, ensuring privacy and CSP compliance.

## File Structure

- `popup.html` — Main extension popup UI
- `popup.js` — Main logic for UI, OCR, and Appwrite integration
- `assets/` — Contains Tesseract.js browser bundle, worker, WASM, and language data
- `manifest.json` — Chrome extension manifest (Manifest V3)
- `appwrite.js`, `env.js` — Appwrite SDK and environment config

## Development

- Make sure to reload the extension in `chrome://extensions` after any changes.
- For OCR to work, ensure you are using the browser bundle of Tesseract.js and **do not set `workerPath`** in the config (let Tesseract.js create the worker from a Blob).
- All assets used by Tesseract.js must be listed in `web_accessible_resources` in `manifest.json`.

## Troubleshooting

- **OCR not working?**
  - Make sure `assets/tesseract.min.js` is the browser bundle.
  - Do not set `workerPath` in your JS config.
  - Reload the extension after changes.
  - Check the console for errors about missing assets or CSP violations.

