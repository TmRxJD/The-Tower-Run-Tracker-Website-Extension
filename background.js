const env = {
  VITE_APPWRITE_ENDPOINT: 'https://appwrite.the-tower-run-tracker.com/v1',
  VITE_APPWRITE_PROJECT_ID: '68190de700097b8f59df',
}

// background.js (source, not bundled output)
console.log('[background.js] Starting service worker...');

console.log('[background.js] Service worker loaded');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.type === 'LOGIN_WITH_DISCORD') {
    console.log('[background.js] LOGIN_WITH_DISCORD received');
    // Force the correct extension-based redirect URI
    // This will always be chrome-extension://<extension-id>/oauth2
    const extensionId = chrome.runtime.id;
    const redirectUri = `chrome-extension://${extensionId}/oauth2`;
    console.log('[background.js] Using redirectUri:', redirectUri);
    const authUrl = `${env.VITE_APPWRITE_ENDPOINT.replace(/\/$/, '')}/account/sessions/oauth2/discord?project=${env.VITE_APPWRITE_PROJECT_ID}&success=${encodeURIComponent(redirectUri)}&failure=${encodeURIComponent(redirectUri)}`;
    console.log('[background.js] Launching WebAuthFlow:', authUrl);
    chrome.identity.launchWebAuthFlow({
      url: authUrl,
      interactive: true
    }, () => {
      sendResponse({ success: true});
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