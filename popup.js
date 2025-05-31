// On load, check if user is authenticated; if not, redirect to login.html
fetch('https://appwrite.the-tower-run-tracker.com/v1/account', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': '68190de700097b8f59df'
          },
          credentials: 'include'
        })
  .then(res => res.ok ? res.json() : Promise.reject())
  .then(user => {
    // User is authenticated, show username
    const usernameValue = document.getElementById('usernameValue');
    if (usernameValue && user.name) {
      usernameValue.textContent = user.name;
    }
    // Continue with rest of popup logic
    mainPopupInit();

    // Add logout button logic
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        try {
          await fetch('https://the-tower-run-tracker.vercel.app/api/logout', {
            method: 'POST',
            credentials: 'include'
          });
        } catch (err) {}
        window.location.href = 'login.html';
      });
    }
  })
  .catch(() => {
    // Not authenticated, redirect to login page
    window.location.href = 'login.html';
  });

function mainPopupInit() {
  const fileInput = document.getElementById('fileInput');
  const dropZone = document.getElementById('dropZone');
  const uploadBtn = document.getElementById('uploadBtn');
  const uploadStatus = document.getElementById('uploadStatus');
  const importBtn = document.getElementById('importBtn');
  const importStatus = document.getElementById('importStatus');

  // Manual Entry Dialog logic
  const openManualEntryBtn = document.getElementById('openManualEntry');
  const manualEntryDialog = document.getElementById('manualEntryDialog');
  const cancelManualEntryBtn = document.getElementById('cancelManualEntry');
  const manualEntryForm = document.getElementById('manualEntryForm');
  const manualEntryError = document.getElementById('manualEntryError');

  if (openManualEntryBtn && manualEntryDialog && cancelManualEntryBtn && manualEntryForm) {
    openManualEntryBtn.addEventListener('click', () => {
      manualEntryDialog.classList.add('show');
      if (manualEntryError) manualEntryError.textContent = '';
    });

    cancelManualEntryBtn.addEventListener('click', () => {
      manualEntryDialog.classList.remove('show');
      manualEntryForm.reset();
      if (manualEntryError) manualEntryError.textContent = '';
    });

    manualEntryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (manualEntryError) manualEntryError.textContent = '';
      const formData = new FormData(manualEntryForm);
      const data = {};
      for (const [key, value] of formData.entries()) {
        data[key] = value;
      }
      // Optionally show loading state
      const submitBtn = manualEntryForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      try {
        const res = await fetch('https://the-tower-run-tracker.vercel.app/api/runs', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!res.ok) {
          let msg = 'Failed to add run.';
          try { const err = await res.json(); if (err && err.error) msg = err.error; } catch {}
          throw new Error(msg);
        }
        manualEntryDialog.classList.remove('show');
        manualEntryForm.reset();
        // Optionally show a success message
      } catch (err) {
        if (manualEntryError) manualEntryError.textContent = err.message || 'Error adding run.';
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  let selectedFile = null;

// Drag & Drop logic
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
      selectedFile = e.dataTransfer.files[0];
      fileInput.files = e.dataTransfer.files;
    }
  });

  // File selection
  fileInput.addEventListener('change', () => {
    selectedFile = fileInput.files[0];
  });

  // Upload logic
  uploadBtn.addEventListener('click', async () => {
    if (!selectedFile) {
      uploadStatus.textContent = '❌ No file selected.';
      return;
    }

    const formData = new FormData();
    formData.append('screenshot', selectedFile);

    try {
      const response = await fetch('https://your-tracker.com/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (response.ok) {
        uploadStatus.textContent = '✅ Screenshot uploaded!';
      } else {
        uploadStatus.textContent = '❌ Upload failed.';
      }
    } catch (err) {
      uploadStatus.textContent = '❌ Error uploading.';
      console.error(err);
    }
  });

  // Import old runs logic
  importBtn.addEventListener('click', async () => {
    try {
      // Run this script in context of old tracker
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const data = localStorage.getItem('runData');
          return data ? JSON.parse(data) : null;
        }
      }, async (results) => {
        const runs = results[0].result;
        if (!runs) {
          importStatus.textContent = '❌ No data found on old tracker.';
          return;
        }

        const response = await fetch('https://your-tracker.com/api/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ runs })
        });

        if (response.ok) {
          importStatus.textContent = '✅ Runs imported successfully!';
        } else {
          importStatus.textContent = '❌ Import failed.';
        }
      });
    } catch (err) {
      importStatus.textContent = '❌ Import error.';
      console.error(err);
    }
  });
}
