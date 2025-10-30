const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// News data storage
const NEWS_DATA_PATH = path.join(__dirname, 'assets', 'data', 'news.json');

// Ensure data directory exists
const dataDir = path.dirname(NEWS_DATA_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// GET /api/news - Retrieve news data
app.get('/api/news', (req, res) => {
  try {
    if (fs.existsSync(NEWS_DATA_PATH)) {
      const newsData = JSON.parse(fs.readFileSync(NEWS_DATA_PATH, 'utf8'));
      res.json(newsData);
    } else {
      res.json({
        lastUpdated: new Date().toISOString(),
        syncType: 'automatic',
        version: '1.0.0',
        news: [],
        statistics: {
          totalNews: 0,
          categories: {},
          lastSync: new Date().toISOString()
        }
      });
    }
  } catch (error) {
    console.error('Error reading news data:', error);
    res.status(500).json({ error: 'Failed to read news data' });
  }
});

// POST /api/news - Update news data
app.post('/api/news', (req, res) => {
  try {
    const newsData = {
      lastUpdated: new Date().toISOString(),
      syncType: 'automatic',
      version: '1.0.0',
      news: req.body.news || [],
      statistics: {
        totalNews: req.body.news ? req.body.news.length : 0,
        categories: req.body.news ? [...new Set(req.body.news.map(item => item.category || 'Uncategorized'))] : [],
        lastSync: new Date().toISOString()
      }
    };

    // Save to file
    fs.writeFileSync(NEWS_DATA_PATH, JSON.stringify(newsData, null, 2));
    
    console.log(`✅ News data updated: ${newsData.statistics.totalNews} items`);
    
    res.json({
      success: true,
      message: 'News data updated successfully',
      data: newsData
    });
  } catch (error) {
    console.error('Error saving news data:', error);
    res.status(500).json({ error: 'Failed to save news data' });
  }
});

// POST /api/sync - Trigger GitHub sync
app.post('/api/sync', (req, res) => {
  try {
    // This would trigger GitHub Actions or similar
    console.log('🔄 Sync triggered');
    
    res.json({
      success: true,
      message: 'Sync triggered successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error triggering sync:', error);
    res.status(500).json({ error: 'Failed to trigger sync' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 News API server running on port ${PORT}`);
    console.log(`📁 News data path: ${NEWS_DATA_PATH}`);
  });
}

module.exports = app;