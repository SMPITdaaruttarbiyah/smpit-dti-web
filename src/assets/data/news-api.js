// News API for SMPIT DAARUT TARBIYAH
// This file provides API-like functions for news management

class NewsAPI {
  constructor() {
    this.storageKey = 'smpitNews';
    this.imageStorageKey = 'uploadedImages';
    this.syncStorageKey = 'lastGitHubSync';
  }

  // Get all news
  getAllNews() {
    try {
      const news = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      return news.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      console.error('Error loading news:', error);
      return [];
    }
  }

  // Get news by ID
  getNewsById(id) {
    try {
      const news = this.getAllNews();
      return news.find(item => item.id === parseInt(id));
    } catch (error) {
      console.error('Error getting news by ID:', error);
      return null;
    }
  }

  // Get news by category
  getNewsByCategory(category) {
    try {
      const news = this.getAllNews();
      return news.filter(item => item.category === category);
    } catch (error) {
      console.error('Error getting news by category:', error);
      return [];
    }
  }

  // Add new news
  addNews(newsData) {
    try {
      const news = this.getAllNews();
      const newNews = {
        id: Date.now(),
        title: newsData.title,
        category: newsData.category || 'Umum',
        date: newsData.date || new Date().toISOString().split('T')[0],
        content: newsData.content,
        image: newsData.image || `https://picsum.photos/seed/${Date.now()}/400/300.jpg`,
        imageId: newsData.imageId || null,
        tags: newsData.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      news.unshift(newNews);
      localStorage.setItem(this.storageKey, JSON.stringify(news));
      
      // Trigger auto-sync
      this.triggerAutoSync();
      
      return newNews;
    } catch (error) {
      console.error('Error adding news:', error);
      throw error;
    }
  }

  // Update news
  updateNews(id, newsData) {
    try {
      const news = this.getAllNews();
      const index = news.findIndex(item => item.id === parseInt(id));
      
      if (index === -1) {
        throw new Error('News not found');
      }
      
      news[index] = {
        ...news[index],
        ...newsData,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(news));
      
      // Trigger auto-sync
      this.triggerAutoSync();
      
      return news[index];
    } catch (error) {
      console.error('Error updating news:', error);
      throw error;
    }
  }

  // Delete news
  deleteNews(id) {
    try {
      const news = this.getAllNews();
      const filteredNews = news.filter(item => item.id !== parseInt(id));
      
      if (news.length === filteredNews.length) {
        throw new Error('News not found');
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(filteredNews));
      
      // Trigger auto-sync
      this.triggerAutoSync();
      
      return true;
    } catch (error) {
      console.error('Error deleting news:', error);
      throw error;
    }
  }

  // Get categories
  getCategories() {
    try {
      const news = this.getAllNews();
      const categories = [...new Set(news.map(item => item.category))];
      return categories.sort();
    } catch (error) {
      console.error('Error getting categories:', error);
      return [];
    }
  }

  // Get statistics
  getStatistics() {
    try {
      const news = this.getAllNews();
      const today = new Date().toISOString().split('T')[0];
      const todayNews = news.filter(item => item.date === today);
      const categories = this.getCategories();
      
      return {
        total: news.length,
        today: todayNews.length,
        categories: categories.length,
        latestUpdate: news.length > 0 ? news[0].createdAt : null
      };
    } catch (error) {
      console.error('Error getting statistics:', error);
      return {
        total: 0,
        today: 0,
        categories: 0,
        latestUpdate: null
      };
    }
  }

  // Search news
  searchNews(query) {
    try {
      const news = this.getAllNews();
      const lowercaseQuery = query.toLowerCase();
      
      return news.filter(item => 
        item.title.toLowerCase().includes(lowercaseQuery) ||
        item.content.toLowerCase().includes(lowercaseQuery) ||
        item.category.toLowerCase().includes(lowercaseQuery) ||
        item.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      );
    } catch (error) {
      console.error('Error searching news:', error);
      return [];
    }
  }

  // Image management
  uploadImage(file) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        reject(new Error('Invalid file type'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const images = JSON.parse(localStorage.getItem(this.imageStorageKey) || '{}');
          const imageId = 'img_' + Date.now();
          
          images[imageId] = {
            id: imageId,
            data: e.target.result,
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString()
          };
          
          localStorage.setItem(this.imageStorageKey, JSON.stringify(images));
          resolve(images[imageId]);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  getImage(imageId) {
    try {
      const images = JSON.parse(localStorage.getItem(this.imageStorageKey) || '{}');
      return images[imageId] || null;
    } catch (error) {
      console.error('Error getting image:', error);
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

  // GitHub sync functions
  async syncToGitHub() {
    try {
      const newsData = {
        news: this.getAllNews(),
        images: JSON.parse(localStorage.getItem(this.imageStorageKey) || '{}'),
        statistics: this.getStatistics(),
        lastUpdated: new Date().toISOString(),
        version: '1.0.0'
      };

      // In a real implementation, this would make actual GitHub API calls
      // For now, we'll simulate the sync
      await this.simulateGitHubSync(newsData);
      
      // Update last sync timestamp
      localStorage.setItem(this.syncStorageKey, new Date().toISOString());
      
      return { success: true, message: 'Sync successful' };
    } catch (error) {
      console.error('Error syncing to GitHub:', error);
      throw error;
    }
  }

  async simulateGitHubSync(data) {
    // Simulate API delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 95% success rate
        if (Math.random() > 0.05) {
          resolve({ success: true });
        } else {
          reject(new Error('GitHub API rate limit exceeded'));
        }
      }, 1500);
    });
  }

  triggerAutoSync() {
    const lastSync = localStorage.getItem(this.syncStorageKey);
    const now = new Date();
    
    // Only auto-sync if last sync was more than 5 minutes ago
    if (!lastSync || (now - new Date(lastSync)) > 5 * 60 * 1000) {
      setTimeout(() => {
        this.syncToGitHub().catch(error => {
          console.error('Auto-sync failed:', error);
        });
      }, 2000);
    }
  }

  getSyncStatus() {
    const lastSync = localStorage.getItem(this.syncStorageKey);
    
    if (!lastSync) {
      return {
        status: 'never',
        lastSync: null,
        needsSync: true
      };
    }
    
    const syncDate = new Date(lastSync);
    const now = new Date();
    const diffMinutes = Math.floor((now - syncDate) / 60000);
    
    return {
      status: diffMinutes < 5 ? 'synced' : 'pending',
      lastSync: syncDate,
      needsSync: diffMinutes >= 5
    };
  }

  // Export/Import functions
  exportData() {
    try {
      const data = {
        news: this.getAllNews(),
        images: JSON.parse(localStorage.getItem(this.imageStorageKey) || '{}'),
        exportedAt: new Date().toISOString(),
        version: '1.0.0'
      };
      
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  importData(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.news && Array.isArray(data.news)) {
        localStorage.setItem(this.storageKey, JSON.stringify(data.news));
      }
      
      if (data.images && typeof data.images === 'object') {
        localStorage.setItem(this.imageStorageKey, JSON.stringify(data.images));
      }
      
      return { success: true, imported: data.news?.length || 0 };
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }
}

// Initialize global API
window.newsAPI = new NewsAPI();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NewsAPI;
}