// authStore.js
// Pinia-like Auth Store for plain JS (for use in Chrome extension, not Vue)
// Requires Appwrite SDK loaded globally as window.Appwrite

class AuthStore {
  constructor(client) {
    this.client = client;
    // Use Account from global if available, else fallback
    const AccountClass = window.Appwrite ? window.Appwrite.Account : Account;
    this.account = new AccountClass(client);
    this.isAuthenticated = undefined;
    this.username = '';
    this.uid = '';
    this.error = '';
    this.loading = false;
  }

  async authenticate() {
    this.loading = true;
    try {
      const session = await this.account.getSession('current');
      if (session) {
        const accountData = await this.account.get();
        this.isAuthenticated = true;
        this.username = accountData.name;
        this.uid = session.providerUid;
      } else {
        this.isAuthenticated = false;
        this.username = '';
        this.uid = '';
      }
    } catch (err) {
      console.error('Error initializing user session:', err);
      this.isAuthenticated = false;
      this.username = '';
      this.uid = '';
      this.error = err.message || String(err);
    } finally {
      this.loading = false;
    }
  }

  async logout() {
    this.loading = true;
    try {
      await this.account.deleteSession('current');
    } catch (err) {}
    this.isAuthenticated = false;
    this.username = '';
    this.uid = '';
    this.error = '';
    this.loading = false;
  }
}

// Usage example:
// const client = new window.Appwrite.Client();
// client.setEndpoint('https://[YOUR_APPWRITE_ENDPOINT]').setProject('[YOUR_PROJECT_ID]');
// const authStore = new AuthStore(client);
// await authStore.authenticate();
// if (authStore.isAuthenticated) { ... }

window.AuthStore = AuthStore;
