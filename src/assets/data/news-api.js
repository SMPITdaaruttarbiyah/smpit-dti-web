/**
 * SMPIT DTI News API
 * Handles news management, image uploads, and GitHub synchronization
 */

class NewsAPI {
  constructor() {
    this.storageKey = 'smpitNews';
    this.imageStorageKey = 'smpitImages';
    this.syncStatusKey = 'smpitSyncStatus';
    this.initializeStorage();
  }

  initializeStorage() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.imageStorageKey)) {
      localStorage.setItem(this.imageStorageKey, JSON.stringify({}));
    }
    if (!localStorage.getItem(this.syncStatusKey)) {
      localStorage.setItem(this.syncStatusKey, JSON.stringify({
        status: 'never',
        lastSync: null,
        lastSyncType: null
      }));
    }
  }

  // News Management
  getAllNews() {
    try {
      const news = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      return news.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
      console.error('Error loading news:', error);
      return [];
    }
  }

  getNewsById(id) {
    try {
      const news = this.getAllNews();
      return news.find(item => item.id === id);
    } catch (error) {
      console.error('Error finding news:', error);
      return null;
    }
  }

  addNews(newsData) {
    return new Promise((resolve, reject) => {
      try {
        const news = this.getAllNews();
        const newNews = {
          id: Date.now(),
          ...newsData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        news.push(newNews);
        localStorage.setItem(this.storageKey, JSON.stringify(news));
        
        // Update sync status
        this.updateSyncStatus('pending');
        
        resolve(newNews);
      } catch (error) {
        reject(error);
      }
    });
  }

  updateNews(id, newsData) {
    return new Promise((resolve, reject) => {
      try {
        const news = this.getAllNews();
        const index = news.findIndex(item => item.id === id);
        
        if (index === -1) {
          reject(new Error('News not found'));
          return;
        }
        
        news[index] = {
          ...news[index],
          ...newsData,
          updatedAt: new Date().toISOString()
        };
        
        localStorage.setItem(this.storageKey, JSON.stringify(news));
        this.updateSyncStatus('pending');
        
        resolve(news[index]);
      } catch (error) {
        reject(error);
      }
    });
  }

  deleteNews(id) {
    return new Promise((resolve, reject) => {
      try {
        const news = this.getAllNews();
        const filteredNews = news.filter(item => item.id !== id);
        
        if (news.length === filteredNews.length) {
          reject(new Error('News not found'));
          return;
        }
        
        localStorage.setItem(this.storageKey, JSON.stringify(filteredNews));
        this.updateSyncStatus('pending');
        
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Image Management
  async uploadImage(file) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        reject(new Error('Invalid file type. Please upload an image.'));
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        reject(new Error('File too large. Maximum size is 5MB.'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const images = JSON.parse(localStorage.getItem(this.imageStorageKey) || '{}');
          const imageId = Date.now().toString();
          
          const imageData = {
            id: imageId,
            name: file.name,
            size: file.size,
            type: file.type,
            data: e.target.result,
            uploadedAt: new Date().toISOString()
          };
          
          images[imageId] = imageData;
          localStorage.setItem(this.imageStorageKey, JSON.stringify(images));
          
          resolve(imageData);
        } catch (error) {
          reject(new Error('Failed to save image: ' + error.message));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsDataURL(file);
    });
  }

  getImage(imageId) {
    try {
      const images = JSON.parse(localStorage.getItem(this.imageStorageKey) || '{}');
      return images[imageId] || null;
    } catch (error) {
      console.error('Error loading image:', error);
      return null;
    }
  }

  deleteImage(imageId) {
    try {
      const images = JSON.parse(localStorage.getItem(this.imageStorageKey) || '{}');
      delete images[imageId];
      localStorage.setItem(this.imageStorageKey, JSON.stringify(images));
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }

  // Statistics
  getStatistics() {
    try {
      const news = this.getAllNews();
      const today = new Date().toISOString().split('T')[0];
      
      const stats = {
        total: news.length,
        today: news.filter(item => item.date === today).length,
        categories: new Set(news.map(item => item.category || 'Umum')).size
      };
      
      return stats;
    } catch (error) {
      console.error('Error calculating statistics:', error);
      return { total: 0, today: 0, categories: 0 };
    }
  }

  // Search and Filter
  searchNews(query) {
    try {
      const news = this.getAllNews();
      const lowerQuery = query.toLowerCase();
      
      return news.filter(item => 
        item.title.toLowerCase().includes(lowerQuery) ||
        item.content.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery) ||
        item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    } catch (error) {
      console.error('Error searching news:', error);
      return [];
    }
  }

  getNewsByCategory(category) {
    try {
      const news = this.getAllNews();
      return news.filter(item => 
        (item.category || 'Umum').toLowerCase() === category.toLowerCase()
      );
    } catch (error) {
      console.error('Error filtering by category:', error);
      return [];
    }
  }

  getNewsByDateRange(startDate, endDate) {
    try {
      const news = this.getAllNews();
      return news.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
      });
    } catch (error) {
      console.error('Error filtering by date range:', error);
      return [];
    }
  }

  // GitHub Synchronization
  async syncToGitHub() {
    return new Promise((resolve, reject) => {
      try {
        // Prepare data for GitHub
        const newsData = this.getAllNews();
        const images = JSON.parse(localStorage.getItem(this.imageStorageKey) || '{}');
        
        const syncData = {
          news: newsData,
          images: images,
          metadata: {
            lastUpdated: new Date().toISOString(),
            version: '1.0.0',
            totalNews: newsData.length,
            totalImages: Object.keys(images).length
          }
        };

        // Create a GitHub API request (simplified for demo)
        // In production, this would use GitHub's REST API
        this.simulateGitHubSync(syncData)
          .then(() => {
            this.updateSyncStatus('synced', 'manual');
            resolve({ success: true, message: 'Data synced to GitHub' });
          })
          .catch(error => {
            this.updateSyncStatus('error');
            reject(error);
          });
          
      } catch (error) {
        reject(new Error('Failed to prepare sync data: ' + error.message));
      }
    });
  }

  simulateGitHubSync(data) {
    return new Promise((resolve, reject) => {
      // Simulate API call delay
      setTimeout(() => {
        try {
          // In a real implementation, this would make an actual API call to GitHub
          console.log('Syncing data to GitHub:', data);
          
          // Simulate success (90% success rate for demo)
          if (Math.random() > 0.1) {
            resolve({ success: true });
          } else {
            reject(new Error('GitHub API temporarily unavailable'));
          }
        } catch (error) {
          reject(error);
        }
      }, 2000); // 2 second delay to simulate network request
    });
  }

  updateSyncStatus(status, type = 'automatic') {
    try {
      const syncStatus = {
        status: status,
        lastSync: new Date().toISOString(),
        lastSyncType: type
      };
      
      localStorage.setItem(this.syncStatusKey, JSON.stringify(syncStatus));
    } catch (error) {
      console.error('Error updating sync status:', error);
    }
  }

  getSyncStatus() {
    try {
      const syncStatus = JSON.parse(localStorage.getItem(this.syncStatusKey) || '{}');
      
      if (!syncStatus.lastSync) {
        return {
          status: 'never',
          lastSync: new Date(),
          lastSyncType: null
        };
      }
      
      return {
        status: syncStatus.status || 'never',
        lastSync: new Date(syncStatus.lastSync),
        lastSyncType: syncStatus.lastSyncType
      };
    } catch (error) {
      console.error('Error getting sync status:', error);
      return {
        status: 'never',
        lastSync: new Date(),
        lastSyncType: null
      };
    }
  }

  // Export/Import functionality
  exportData() {
    try {
      const news = this.getAllNews();
      const images = JSON.parse(localStorage.getItem(this.imageStorageKey) || '{}');
      
      const exportData = {
        news: news,
        images: images,
        syncStatus: this.getSyncStatus(),
        exportedAt: new Date().toISOString(),
        version: '1.0.0'
      };
      
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      throw new Error('Failed to export data: ' + error.message);
    }
  }

  importData(jsonData) {
    return new Promise((resolve, reject) => {
      try {
        const importData = JSON.parse(jsonData);
        
        if (!importData.news || !Array.isArray(importData.news)) {
          throw new Error('Invalid data format');
        }
        
        // Validate and import news
        localStorage.setItem(this.storageKey, JSON.stringify(importData.news));
        
        // Import images if available
        if (importData.images) {
          localStorage.setItem(this.imageStorageKey, JSON.stringify(importData.images));
        }
        
        // Update sync status
        this.updateSyncStatus('imported', 'manual');
        
        resolve({
          success: true,
          importedNews: importData.news.length,
          importedImages: Object.keys(importData.images || {}).length
        });
        
      } catch (error) {
        reject(new Error('Failed to import data: ' + error.message));
      }
    });
  }

  // Cleanup and maintenance
  cleanupOldImages() {
    try {
      const news = this.getAllNews();
      const images = JSON.parse(localStorage.getItem(this.imageStorageKey) || '{}');
      
      // Find all image IDs used in news
      const usedImageIds = new Set();
      news.forEach(item => {
        if (item.imageId) {
          usedImageIds.add(item.imageId);
        }
      });
      
      // Remove unused images
      let deletedCount = 0;
      Object.keys(images).forEach(imageId => {
        if (!usedImageIds.has(imageId)) {
          delete images[imageId];
          deletedCount++;
        }
      });
      
      if (deletedCount > 0) {
        localStorage.setItem(this.imageStorageKey, JSON.stringify(images));
      }
      
      return deletedCount;
    } catch (error) {
      console.error('Error cleaning up images:', error);
      return 0;
    }
  }

  getStorageUsage() {
    try {
      const newsData = localStorage.getItem(this.storageKey) || '[]';
      const imageData = localStorage.getItem(this.imageStorageKey) || '{}';
      const syncData = localStorage.getItem(this.syncStatusKey) || '{}';
      
      return {
        news: {
          size: newsData.length,
          count: JSON.parse(newsData).length
        },
        images: {
          size: imageData.length,
          count: Object.keys(JSON.parse(imageData)).length
        },
        sync: {
          size: syncData.length
        },
        total: newsData.length + imageData.length + syncData.length
      };
    } catch (error) {
      console.error('Error calculating storage usage:', error);
      return { total: 0, news: { size: 0, count: 0 }, images: { size: 0, count: 0 }, sync: { size: 0 } };
    }
  }
}

// Initialize the API
window.newsAPI = new NewsAPI();

// Auto-sync every 5 minutes if there are pending changes
setInterval(() => {
  const syncStatus = window.newsAPI.getSyncStatus();
  if (syncStatus.status === 'pending') {
    console.log('Auto-syncing pending changes to GitHub...');
    window.newsAPI.syncToGitHub()
      .then(() => console.log('Auto-sync completed'))
      .catch(error => console.error('Auto-sync failed:', error));
  }
}, 5 * 60 * 1000); // 5 minutes

// Cleanup unused images on page load
window.addEventListener('load', () => {
  const deletedCount = window.newsAPI.cleanupOldImages();
  if (deletedCount > 0) {
    console.log(`Cleaned up ${deletedCount} unused images`);
  }
});

console.log('SMPIT DTI News API initialized successfully');