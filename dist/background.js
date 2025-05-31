// env.js
var ENV = {
  VITE_APPWRITE_ENDPOINT: "https://appwrite.the-tower-run-tracker.com/v1",
  VITE_APPWRITE_PROJECT_ID: "68190de700097b8f59df",
  VITE_APP_URL: "http://localhost:3000"
};
self.ENV = ENV;

// background.js
console.log("[background.js] Starting service worker...");
console.log("[background.js] Service worker loaded");
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.type === "LOGIN_WITH_DISCORD") {
    console.log("[background.js] LOGIN_WITH_DISCORD received");
    const extensionId = chrome.runtime.id;
    const redirectUri = `chrome-extension://${extensionId}/oauth2`;
    console.log("[background.js] Using redirectUri:", redirectUri);
    const authUrl = `${ENV.VITE_APPWRITE_ENDPOINT.replace(/\/$/, "")}/account/sessions/oauth2/discord?project=${ENV.VITE_APPWRITE_PROJECT_ID}&success=${encodeURIComponent(redirectUri)}&failure=${encodeURIComponent(redirectUri)}`;
    console.log("[background.js] Launching WebAuthFlow:", authUrl);
    chrome.identity.launchWebAuthFlow({
      url: authUrl,
      interactive: true
    }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
  if (message && message.type === "GET_SESSION_USER") {
    account.get().then((user) => {
      sendResponse({ success: true, user });
    }).catch((err) => {
      sendResponse({ success: false, error: err.message || String(err) });
    });
    return true;
  }
});
//# sourceMappingURL=background.js.map
