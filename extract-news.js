const fs = require('fs');
const path = require('path');

class NewsDataExtractor {
  constructor() {
    this.adminHtmlPath = 'src/admin/index.html';
    this.outputPath = 'assets/data/news.json';
  }

  extractNewsFromHtml() {
    try {
      // Read the admin HTML file
      const adminHtml = fs.readFileSync(this.adminHtmlPath, 'utf8');
      
      // Look for localStorage data in the HTML
      // This is a simplified approach - in production, you'd connect to a real database
      const localStorageMatch = adminHtml.match(/localStorage\.setItem\('smpitNews',\s*'([^']+)'\)/);
      
      let newsData = {
        lastUpdated: new Date().toISOString(),
        syncType: process.env.SYNC_TYPE || 'automatic',
        version: '1.0.0',
        news: [],
        statistics: {
          totalNews: 0,
          categories: {},
          lastSync: new Date().toISOString()
        }
      };

      if (localStorageMatch) {
        try {
          // Decode the localStorage data
          const encodedNews = localStorageMatch[1];
          const decodedNews = decodeURIComponent(encodedNews);
          newsData.news = JSON.parse(decodedNews);
          
          // Calculate statistics
          newsData.statistics.totalNews = newsData.news.length;
          newsData.news.forEach(article => {
            const category = article.category || 'Uncategorized';
            newsData.statistics.categories[category] = (newsData.statistics.categories[category] || 0) + 1;
          });
          
        } catch (parseError) {
          console.warn('Could not parse news data from HTML, using empty array');
        }
      }

      return newsData;
    } catch (error) {
      console.error('Error reading admin HTML:', error.message);
      return this.getDefaultNewsData();
    }
  }

  getDefaultNewsData() {
    return {
      lastUpdated: new Date().toISOString(),
      syncType: process.env.SYNC_TYPE || 'automatic',
      version: '1.0.0',
      news: [],
      statistics: {
        totalNews: 0,
        categories: {},
        lastSync: new Date().toISOString()
      }
    };
  }

  saveNewsData(newsData) {
    try {
      // Ensure directory exists
      const dir = path.dirname(this.outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Write the data
      fs.writeFileSync(this.outputPath, JSON.stringify(newsData, null, 2));
      
      console.log(`✅ News data saved to ${this.outputPath}`);
      console.log(`📊 Total news items: ${newsData.statistics.totalNews}`);
      console.log(`📅 Last updated: ${newsData.lastUpdated}`);
      
      return true;
    } catch (error) {
      console.error('Error saving news data:', error.message);
      return false;
    }
  }

  async extractAndSave() {
    console.log('🚀 Starting news data extraction...');
    
    const newsData = this.extractNewsFromHtml();
    const success = this.saveNewsData(newsData);
    
    if (success) {
      console.log('✨ News data extraction completed successfully!');
      return newsData;
    } else {
      console.error('❌ News data extraction failed!');
      process.exit(1);
    }
  }
}

// Run the extractor
const extractor = new NewsDataExtractor();
extractor.extractAndSave().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});