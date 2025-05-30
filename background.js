// background.js (source, not bundled output)
console.log('[background.js] Starting service worker...');

import { Client, Account } from 'appwrite';

console.log('[background.js] Service worker loaded');

const ENV = {
  VITE_APPWRITE_ENDPOINT: 'https://appwrite.the-tower-run-tracker.com/v1',
  VITE_APPWRITE_PROJECT_ID: '68190de700097b8f59df',
  VITE_APP_URL: 'http://localhost:3000',
};

const client = new Client();
client
  .setEndpoint(ENV.VITE_APPWRITE_ENDPOINT)
  .setProject(ENV.VITE_APPWRITE_PROJECT_ID);
const account = new Account(client);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.type === 'LOGIN_WITH_DISCORD') {
    console.log('[background.js] LOGIN_WITH_DISCORD received');
    // Force the correct extension-based redirect URI
    // This will always be chrome-extension://<extension-id>/oauth2
    const extensionId = chrome.runtime.id;
    const redirectUri = `chrome-extension://${extensionId}/oauth2`;
    console.log('[background.js] Using redirectUri:', redirectUri);
    const authUrl = `${ENV.VITE_APPWRITE_ENDPOINT.replace(/\/$/, '')}/account/sessions/oauth2/discord?project=${ENV.VITE_APPWRITE_PROJECT_ID}&success=${encodeURIComponent(redirectUri)}&failure=${encodeURIComponent(redirectUri)}`;
    console.log('[background.js] Launching WebAuthFlow:', authUrl);
    chrome.identity.launchWebAuthFlow({
      url: authUrl,
      interactive: true
    }, async (responseUrl) => {
      if (chrome.runtime.lastError) {
        console.error('[background.js] WebAuthFlow error:', chrome.runtime.lastError.message);
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
        return;
      }
      if (!responseUrl) {
        console.error('[background.js] WebAuthFlow: No responseUrl returned (user may have closed window)');
        sendResponse({ success: false, error: 'No response from OAuth window.' });
        return;
      }
      console.log('[background.js] WebAuthFlow completed, responseUrl:', responseUrl);
      try {
        const user = await account.get();
        console.log('[background.js] Appwrite session established, user:', user);
        sendResponse({ success: true, user });
      } catch (err) {
        console.error('[background.js] Appwrite session error:', err);
        sendResponse({ success: false, error: err.message || String(err) });
      }
    });
    return true; // Keep the message channel open for async response
  }
  if (message && message.type === 'GET_SESSION_USER') {
    account.get().then(user => {
      sendResponse({ success: true, user });
    }).catch(err => {
      sendResponse({ success: false, error: err.message || String(err) });
    });
    return true;
  }
});