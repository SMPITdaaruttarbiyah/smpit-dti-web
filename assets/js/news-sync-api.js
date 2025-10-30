// API endpoint untuk otomatisasi sinkronisasi berita
// Ini akan menghubungkan admin panel dengan GitHub Actions

class NewsSyncAPI {
  constructor() {
    this.apiEndpoint = 'https://api.github.com/repos/SMPITdaaruttarbiyah/smpit-dti-web';
    this.token = process.env.GITHUB_TOKEN || '';
  }

  // Fungsi untuk trigger GitHub Actions
  async triggerSync(newsData) {
    try {
      console.log('🔄 Triggering GitHub Actions sync...');
      
      // Simpan data ke localStorage untuk diambil oleh GitHub Actions
      localStorage.setItem('smpitNews', JSON.stringify(newsData.news));
      localStorage.setItem('lastSyncData', JSON.stringify({
        timestamp: new Date().toISOString(),
        newsCount: newsData.news.length,
        syncType: 'automatic'
      }));

      // Trigger GitHub Actions via repository dispatch
      const response = await fetch(`${this.apiEndpoint}/dispatches`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${this.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event_type: 'news-sync',
          client_payload: {
            news_count: newsData.news.length,
            timestamp: new Date().toISOString()
          }
        })
      });

      if (response.ok) {
        console.log('✅ GitHub Actions triggered successfully!');
        return { success: true, message: 'Sync triggered successfully' };
      } else {
        throw new Error(`Failed to trigger: ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ Error triggering sync:', error);
      return { success: false, error: error.message };
    }
  }

  // Fungsi untuk membuat pull request otomatis
  async createPullRequest(newsData) {
    try {
      const branchName = `news-update-${Date.now()}`;
      const commitMessage = `Update news data - ${new Date().toISOString()}`;
      
      // Create file content
      const content = btoa(JSON.stringify(newsData, null, 2));
      
      // Create or update file
      const fileResponse = await fetch(`${this.apiEndpoint}/contents/assets/data/news.json`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${this.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: commitMessage,
          content: content,
          branch: 'main'
        })
      });

      if (fileResponse.ok) {
        console.log('✅ News data updated successfully!');
        return { success: true, message: 'Data updated successfully' };
      } else {
        throw new Error(`Failed to update file: ${fileResponse.statusText}`);
      }
    } catch (error) {
      console.error('❌ Error creating pull request:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export untuk digunakan di admin panel
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NewsSyncAPI;
} else {
  window.NewsSyncAPI = NewsSyncAPI;
}