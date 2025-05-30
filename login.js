
console.log('[login.js] Script loaded');


window.addEventListener('message', function(event) {
  console.log('[login.js] window.message event received:', event);
  if (event.source !== window) {
    console.log('[login.js] Ignored message: not from window');
    return;
  }
  if (event.data && event.data.type === 'TRACKER_USER') {
    console.log('[login.js] TRACKER_USER message received:', event.data);
    const user = event.data.user;
    if (user) {
      const username = user.name || user.email || user.$id;
      console.log('[login.js] User found from TRACKER_USER:', username, user);
      localStorage.setItem('tracker_username', username);
      console.log('[login.js] Username saved to localStorage, redirecting to popup.html');
      window.location.href = 'popup.html';
    } else {
      console.log('[login.js] TRACKER_USER message received but user is null:', event.data);
    }
  } else {
    console.log('[login.js] window.message event ignored: wrong type or missing data', event.data);
  }
});



document.addEventListener('DOMContentLoaded', () => {
  console.log('[login.js] DOMContentLoaded');
  const statusDiv = document.getElementById('loginStatus');
  if (statusDiv) {
    statusDiv.textContent = 'Please log in with Discord to use the extension.';
    console.log('[login.js] Set loginStatus text');
  }
  const btn = document.getElementById('discordLoginBtn');
  if (btn) {
    btn.style.display = '';
    btn.addEventListener('click', function() {
      console.log('[login.js] Discord login button clicked');
      if (statusDiv) statusDiv.textContent = 'Logging in...';
      chrome.runtime.sendMessage({ type: 'LOGIN_WITH_DISCORD' }, (response) => {
        if (!response) {
          statusDiv.textContent = 'No response from background script.';
          return;
        }
        if (response.success) {
          const user = response.user;
          const username = user.name || user.email || user.$id;
          localStorage.setItem('tracker_username', username);
          console.log('[login.js] User authenticated after OAuth:', username);
          window.location.href = 'popup.html';
        } else {
          statusDiv.textContent = 'Login failed: ' + (response.error || 'Unknown error');
          console.error('Login failed after OAuth:', response.error);
        }
      });
    });
  }
});