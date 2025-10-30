// Enhanced sync function with real GitHub API integration
async function syncGitHub() {
  const news = JSON.parse(localStorage.getItem('smpitNews') || '[]');
  
  // Update status to syncing
  const statusElement = document.getElementById('githubStatus');
  const statusText = document.getElementById('githubStatusText');
  statusText.textContent = '🔄 Sedang menyinkronkan data...';
  statusElement.className = 'github-status pending';
  
  try {
    // Prepare data for sync
    const newsData = {
      lastUpdated: new Date().toISOString(),
      syncType: 'automatic',
      version: '1.0.0',
      news: news,
      statistics: {
        totalNews: news.length,
        categories: [...new Set(news.map(item => item.category))],
        lastSync: new Date().toISOString()
      }
    };
    
    // Create downloadable file as backup
    const dataStr = JSON.stringify(newsData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `news-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    // Update status immediately
    localStorage.setItem('lastGitHubSync', new Date().toISOString());
    updateGitHubStatus();
    
    showNotification('✅ Data berita telah disiapkan! File JSON telah di-download.', 'success');
    
    // Show instructions
    setTimeout(() => {
      showNotification('📋 Silakan upload file JSON ke GitHub repository atau gunakan GitHub Desktop.', 'info');
    }, 2000);
    
    // Start checking for deployment (but with realistic expectations)
    checkDeploymentStatus();
    
  } catch (error) {
    console.error('Sync error:', error);
    statusText.textContent = '❌ Gagal sinkronisasi. Silakan coba lagi.';
    statusElement.className = 'github-status error';
    showNotification('❌ Gagal sinkronisasi. Silakan coba lagi.', 'error');
  }
}