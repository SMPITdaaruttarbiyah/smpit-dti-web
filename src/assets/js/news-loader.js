// News Loader for SMPIT DTI Website - Auto Configuration
(function() {
    'use strict';
    
    // Auto-detect configuration from current URL
    function detectGitHubConfig() {
        const url = window.location.href;
        
        // Check if running on GitHub Pages
        if (url.includes('.github.io')) {
            // Format: https://username.github.io/repo-name/
            const matches = url.match(/https:\/\/([^.]+)\.github\.io\/([^\/]+)/);
            if (matches) {
                return {
                    owner: matches[1],
                    repo: matches[2] || 'smpit-dti-web'
                };
            }
        }
        
        // Check if running locally with path
        if (url.includes('/smpit-dti-web/')) {
            // Try to get from localStorage (set by admin panel)
            const savedConfig = localStorage.getItem('github_config');
            if (savedConfig) {
                try {
                    return JSON.parse(savedConfig);
                } catch (e) {
                    console.error('Failed to parse saved config');
                }
            }
        }
        
        // Default fallback - YOU NEED TO CHANGE THIS
        return {
            owner: 'SMPITdaaruttarbiyah',
            repo: 'smpit-dti-web'
        };
    }
    
    // Configuration
    const autoConfig = detectGitHubConfig();
    const CONFIG = {
        owner: autoConfig.owner,
        repo: autoConfig.repo,
        branch: 'main',
        newsPath: 'data/news.json',
        maxNews: 6,
        cacheTime: 5 * 60 * 1000,
        fallbackNewsUrl: '/smpit-dti-web/data/news.json' // Fallback for local
    };
    
    console.log('📋 News Loader Config:', CONFIG);
    
    // Cache management
    const cache = {
        data: null,
        timestamp: null,
        
        isValid() {
            return this.data && this.timestamp && 
                   (Date.now() - this.timestamp < CONFIG.cacheTime);
        },
        
        set(data) {
            this.data = data;
            this.timestamp = Date.now();
            // Also save to sessionStorage as backup
            try {
                sessionStorage.setItem('news_cache', JSON.stringify({
                    data: data,
                    timestamp: this.timestamp
                }));
            } catch (e) {
                console.warn('Failed to save to sessionStorage');
            }
        },
        
        get() {
            if (this.isValid()) {
                return this.data;
            }
            
            // Try sessionStorage
            try {
                const stored = sessionStorage.getItem('news_cache');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (Date.now() - parsed.timestamp < CONFIG.cacheTime) {
                        this.data = parsed.data;
                        this.timestamp = parsed.timestamp;
                        return this.data;
                    }
                }
            } catch (e) {
                console.warn('Failed to load from sessionStorage');
            }
            
            return null;
        }
    };
    
    // Fetch news from multiple sources
    async function fetchNews() {
        try {
            // Check cache first
            const cached = cache.get();
            if (cached) {
                console.log('📦 Using cached news data');
                return cached;
            }
            
            console.log('🔄 Fetching news...');
            
            // Try multiple URLs in order
            const urls = [
                // 1. Try raw GitHub content (for GitHub Pages)
                `https://raw.githubusercontent.com/${CONFIG.owner}/${CONFIG.repo}/${CONFIG.branch}/${CONFIG.newsPath}`,
                
                // 2. Try GitHub API (with CORS proxy if needed)
                `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${CONFIG.newsPath}?ref=${CONFIG.branch}`,
                
                // 3. Try local fallback
                CONFIG.fallbackNewsUrl,
                
                // 4. Try relative path
                `/data/news.json`,
                
                // 5. Try with base path
                `./data/news.json`
            ];
            
            let lastError = null;
            
            for (const url of urls) {
                try {
                    console.log(`📡 Trying: ${url}`);
                    
                    const response = await fetch(url, {
                        cache: 'no-cache',
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                    
                    if (response.ok) {
                        let data;
                        
                        // Check if it's GitHub API response
                        const contentType = response.headers.get('content-type');
                        if (contentType && contentType.includes('application/json')) {
                            const jsonData = await response.json();
                            
                            // GitHub API returns base64 encoded content
                            if (jsonData.content && jsonData.encoding === 'base64') {
                                const decoded = atob(jsonData.content.replace(/\s/g, ''));
                                data = JSON.parse(decoded);
                            } else if (jsonData.news) {
                                // Direct JSON response
                                data = jsonData;
                            } else {
                                continue; // Try next URL
                            }
                        } else {
                            data = await response.json();
                        }
                        
                        if (data && data.news) {
                            cache.set(data);
                            console.log(`✅ Successfully loaded ${data.news.length} news items from ${url}`);
                            return data;
                        }
                    }
                } catch (error) {
                    lastError = error;
                    console.warn(`Failed to fetch from ${url}:`, error.message);
                }
            }
            
            throw lastError || new Error('All fetch attempts failed');
            
        } catch (error) {
            console.error('❌ Error fetching news:', error);
            
            // Try localStorage fallback
            const fallback = localStorage.getItem('news_fallback');
            if (fallback) {
                console.log('📱 Using localStorage fallback');
                try {
                    return JSON.parse(fallback);
                } catch (e) {
                    console.error('Failed to parse fallback');
                }
            }
            
            // Return empty structure
            return {
                news: [],
                totalNews: 0
            };
        }
    }
    
    // Format date to Indonesian format
    function formatDate(dateString) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        try {
            const date = new Date(dateString);
            
            // Validate date
            if (isNaN(date.getTime())) {
                return new Date().toLocaleDateString('id-ID', options);
            }
            
            // Fix future dates
            const today = new Date();
            if (date > today) {
                return today.toLocaleDateString('id-ID', options);
            }
            
            return date.toLocaleDateString('id-ID', options);
        } catch (error) {
            return new Date().toLocaleDateString('id-ID', options);
        }
    }
    
    // Truncate text
    function truncateText(text, maxLength = 150) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    }
    
    // Create news card HTML
    function createNewsCard(news) {
        const imageHTML = news.image 
            ? `<img src="${news.image}" alt="${news.title}" class="news-image" loading="lazy" onerror="this.onerror=null; this.src='https://via.placeholder.com/400x200/0A3D73/FFFFFF?text=SMPIT+DTI'">`
            : `<div class="news-placeholder-image">
                 <span>📰</span>
               </div>`;
        
        const categoryColors = {
            'Pengumuman': 'badge-primary',
            'Kegiatan': 'badge-success', 
            'Prestasi': 'badge-warning',
            'Umum': 'badge-info'
        };
        
        const badgeClass = categoryColors[news.category] || 'badge-secondary';
        
        return `
            <div class="news-card" data-aos="fade-up">
                <div class="news-card-image">
                    ${imageHTML}
                    <span class="news-category ${badgeClass}">${news.category || 'Umum'}</span>
                </div>
                <div class="news-card-content">
                    <div class="news-date">
                        <i>📅</i> ${formatDate(news.date)}
                    </div>
                    <h3 class="news-title">${news.title}</h3>
                    <p class="news-excerpt">${truncateText(news.content)}</p>
                    <a href="#" class="news-read-more" onclick="viewNewsDetail('${news.id}'); return false;">
                        Baca Selengkapnya →
                    </a>
                </div>
            </div>
        `;
    }
    
    // Render news to the page
    function renderNews(data) {
        const container = document.querySelector('#news .news-grid');
        
        if (!container) {
            console.error('❌ News container not found');
            return;
        }
        
        if (!data || !data.news || data.news.length === 0) {
            container.innerHTML = `
                <div class="no-news">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📰</div>
                    <p>Belum ada berita tersedia.</p>
                    <p style="font-size: 0.9rem; color: #999; margin-top: 0.5rem;">
                        Berita akan segera ditampilkan setelah dipublikasi.
                    </p>
                </div>
            `;
            return;
        }
        
        // Filter and sort news
        const today = new Date();
        today.setHours(23, 59, 59, 999); // End of today
        
        const validNews = data.news
            .filter(news => {
                if (!news.title || !news.content) return false;
                
                const newsDate = new Date(news.date);
                // Allow today's news and past news
                return newsDate <= today;
            })
            .sort((a, b) => {
                // Sort by date, newest first
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateB - dateA;
            })
            .slice(0, CONFIG.maxNews);
        
        if (validNews.length === 0) {
            container.innerHTML = `
                <div class="no-news">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📭</div>
                    <p>Tidak ada berita untuk ditampilkan.</p>
                </div>
            `;
            return;
        }
        
        // Create news cards
        const newsHTML = validNews.map(news => createNewsCard(news)).join('');
        container.innerHTML = newsHTML;
        
        // Save successful data as fallback
        localStorage.setItem('news_fallback', JSON.stringify(data));
        
        // Re-initialize AOS if available
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
        
        console.log(`📰 Rendered ${validNews.length} news items`);
    }
    
    // View news detail (placeholder function)
    window.viewNewsDetail = function(newsId) {
        console.log('View news detail:', newsId);
        
        // Get news data
        const cached = cache.get();
        if (cached && cached.news) {
            const news = cached.news.find(n => n.id === newsId);
            if (news) {
                // You can implement a modal or redirect here
                alert(`📰 ${news.title}\n\n${news.content}\n\n📅 ${formatDate(news.date)}`);
            }
        }
    };
    
    // Initialize
    async function init() {
        console.log('🚀 Initializing news loader...');
        
        try {
            const newsData = await fetchNews();
            renderNews(newsData);
        } catch (error) {
            console.error('❌ Failed to initialize news:', error);
            
            const container = document.querySelector('#news .news-grid');
            if (container) {
                container.innerHTML = `
                    <div class="no-news">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                        <p>Gagal memuat berita.</p>
                        <p style="font-size: 0.9rem; color: #999; margin-top: 0.5rem;">
                            Silakan refresh halaman atau coba lagi nanti.
                        </p>
                        <button onclick="location.reload()" class="btn btn-primary" style="margin-top: 1rem;">
                            🔄 Refresh
                        </button>
                    </div>
                `;
            }
        }
    }
    
    // Auto-refresh news periodically
    setInterval(async () => {
        console.log('🔄 Auto-refreshing news...');
        try {
            // Clear cache to force fresh fetch
            cache.data = null;
            cache.timestamp = null;
            
            const newsData = await fetchNews();
            if (newsData && newsData.news) {
                renderNews(newsData);
            }
        } catch (error) {
            console.warn('Auto-refresh failed:', error);
        }
    }, CONFIG.cacheTime);
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Export for debugging
    window.newsLoader = {
        CONFIG,
        cache,
        fetchNews,
        renderNews,
        reload: async function() {
            cache.data = null;
            cache.timestamp = null;
            const data = await fetchNews();
            renderNews(data);
        }
    };
})();
