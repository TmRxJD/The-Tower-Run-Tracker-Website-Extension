// content.js for old tracker site: extract run data from localStorage and send to extension
console.log('[content.js] Loaded on old tracker site');

try {
  const trackerEntries = localStorage.getItem('trackerEntries');
  if (trackerEntries) {
    const runs = JSON.parse(trackerEntries);
    console.log('[content.js] Extracted trackerEntries:', runs);
    chrome.runtime.sendMessage({ type: 'OLD_TRACKER_RUNS', runs });
  } else {
    console.warn('[content.js] trackerEntries not found in localStorage');
    chrome.runtime.sendMessage({ type: 'OLD_TRACKER_RUNS', runs: null, error: 'trackerEntries not found' });
  }
} catch (e) {
  console.error('[content.js] Failed to parse trackerEntries:', e);
  chrome.runtime.sendMessage({ type: 'OLD_TRACKER_RUNS', runs: null, error: e.message });
}
// content.js
(function() {
  // Only run on the main tracker site, not in the extension context
  if (!window.Appwrite) return;

  const { Client, Account } = window.Appwrite;
  const client = new Client();
  client
    .setEndpoint('https://appwrite.athyen.pl/v1')
    .setProject('68190de700097b8f59df');
  const account = new Account(client);

  account.get()
    .then(user => {
      window.postMessage({ type: 'TRACKER_USER', user }, '*');
    })
    .catch(() => {
      window.postMessage({ type: 'TRACKER_USER', user: null }, '*');
    });
})();