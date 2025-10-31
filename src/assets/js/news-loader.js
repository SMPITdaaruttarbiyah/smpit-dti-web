// News Loader for SMPIT DTI Website
(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        owner: 'YOUR_GITHUB_USERNAME', // Ganti dengan username GitHub Anda
        repo: 'smpit-dti-web',
        branch: 'main',
        newsPath: 'data/news.json',
        maxNews: 6, // Maksimal berita yang ditampilkan
        cacheTime: 5 * 60 * 1000 // Cache 5 menit
    };
    
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
        },
        
        get() {
            return this.isValid() ? this.data : null;
        }
    };
    
    // Fetch news from GitHub
    async function fetchNews() {
        try {
            // Check cache first
            const cached = cache.get();
            if (cached) {
                console.log('📦 Using cached news data');
                return cached;
            }
            
            console.log('🔄 Fetching news from GitHub...');
            
            // Use raw GitHub content URL (no authentication needed for public repos)
            const url = `https://raw.githubusercontent.com/${CONFIG.owner}/${CONFIG.repo}/${CONFIG.branch}/${CONFIG.newsPath}`;
            
            const response = await fetch(url, {
                cache: 'no-cache', // Bypass browser cache
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Cache the data
            cache.set(data);
            
            console.log(`✅ Fetched ${data.news?.length || 0} news items`);
            return data;
            
        } catch (error) {
            console.error('❌ Error fetching news:', error);
            
            // Try to load from localStorage as fallback
            const fallback = localStorage.getItem('news_fallback');
            if (fallback) {
                console.log('📱 Using localStorage fallback');
                return JSON.parse(fallback);
            }
            
            return null;
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
            // Check if date is valid and not in the future
            if (isNaN(date.getTime()) || date > new Date()) {
                return new Date().toLocaleDateString('id-ID', options);
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
            ? `<img src="${news.image}" alt="${news.title}" class="news-image" loading="lazy">`
            : `<div class="news-placeholder-image">
                 <span>📰</span>
               </div>`;
        
        // Category badge colors
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
                    <a href="#" class="news-read-more" onclick="readMore('${news.id}'); return false;">
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
                    <p>📰 Belum ada berita tersedia.</p>
                </div>
            `;
            return;
        }
        
        // Filter out future dates and sort by date (newest first)
        const today = new Date();
        const validNews = data.news
            .filter(news => {
                const newsDate = new Date(news.date);
                return newsDate <= today;
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, CONFIG.maxNews);
        
        if (validNews.length === 0) {
            container.innerHTML = `
                <div class="no-news">
                    <p>📰 Belum ada berita tersedia.</p>
                </div>
            `;
            return;
        }
        
        // Create news cards
        const newsHTML = validNews.map(news => createNewsCard(news)).join('');
        container.innerHTML = newsHTML;
        
        // Store in localStorage as fallback
        localStorage.setItem('news_fallback', JSON.stringify(data));
        
        // Re-initialize AOS for new elements
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }
    
    // Read more function (can be expanded to show modal or navigate)
    window.readMore = function(newsId) {
        console.log('Read more:', newsId);
        // You can implement modal or navigation here
        alert('Fitur baca selengkapnya akan segera tersedia!');
    };
    
    // Initialize
    async function init() {
        console.log('🚀 Initializing news loader...');
        
        const newsData = await fetchNews();
        
        if (newsData) {
            renderNews(newsData);
        } else {
            console.error('❌ Failed to load news');
            const container = document.querySelector('#news .news-grid');
            if (container) {
                container.innerHTML = `
                    <div class="no-news">
                        <p>⚠️ Gagal memuat berita. Silakan coba lagi nanti.</p>
                    </div>
                `;
            }
        }
    }
    
    // Auto-refresh news every 5 minutes
    setInterval(async () => {
        console.log('🔄 Auto-refreshing news...');
        const newsData = await fetchNews();
        if (newsData) {
            renderNews(newsData);
        }
    }, 5 * 60 * 1000);
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
