// News Loader - Auto Cache Clear Version
(function() {
    'use strict';
    
    function detectGitHubConfig() {
        const url = window.location.href;
        
        if (url.includes('.github.io')) {
            const matches = url.match(/https:\/\/([^.]+)\.github\.io\/([^\/]+)/);
            if (matches) {
                return {
                    owner: matches[1],
                    repo: matches[2] || 'smpit-dti-web'
                };
            }
        }
        
        const savedConfig = localStorage.getItem('github_config');
        if (savedConfig) {
            try {
                return JSON.parse(savedConfig);
            } catch (e) {}
        }
        
        return {
            owner: 'smpitdaaruttarbiyah',
            repo: 'smpit-dti-web'
        };
    }
    
    const autoConfig = detectGitHubConfig();
    const CONFIG = {
        owner: autoConfig.owner,
        repo: autoConfig.repo,
        branch: 'main',
        newsPath: 'data/news.json',
        maxNews: 6,
        cacheTime: 2 * 60 * 1000,
        version: '2.1'
    };
    
    console.log('📋 News Loader v' + CONFIG.version, CONFIG);
    
    const cache = {
        data: null,
        timestamp: null,
        
        isValid() {
            const storedVersion = sessionStorage.getItem('news_version');
            if (storedVersion !== CONFIG.version) {
                console.log('🔄 Version changed, clearing cache');
                this.clear();
                return false;
            }
            
            return this.data && this.timestamp && 
                   (Date.now() - this.timestamp < CONFIG.cacheTime);
        },
        
        set(data) {
            this.data = data;
            this.timestamp = Date.now();
            try {
                sessionStorage.setItem('news_cache', JSON.stringify({
                    data: data,
                    timestamp: this.timestamp
                }));
                sessionStorage.setItem('news_version', CONFIG.version);
            } catch (e) {}
        },
        
        get() {
            if (this.isValid()) {
                return this.data;
            }
            
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
            } catch (e) {}
            
            return null;
        },
        
        clear() {
            this.data = null;
            this.timestamp = null;
            sessionStorage.removeItem('news_cache');
            sessionStorage.removeItem('news_version');
            localStorage.removeItem('news_fallback');
            console.log('🗑️ Cache cleared');
        }
    };
    
    async function fetchNews() {
        try {
            const cached = cache.get();
            if (cached) {
                console.log('📦 Using cache');
                return cached;
            }
            
            console.log('🔄 Fetching from GitHub...');
            
            const timestamp = Date.now();
            const urls = [
                `https://raw.githubusercontent.com/${CONFIG.owner}/${CONFIG.repo}/${CONFIG.branch}/${CONFIG.newsPath}?t=${timestamp}`,
                `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${CONFIG.newsPath}?ref=${CONFIG.branch}`
            ];
            
            for (const url of urls) {
                try {
                    console.log(`📡 Trying: ${url.substring(0, 60)}...`);
                    
                    const response = await fetch(url, {
                        cache: 'no-store',
                        headers: {
                            'Accept': 'application/json',
                            'Cache-Control': 'no-cache'
                        }
                    });
                    
                    if (response.ok) {
                        let data;
                        const contentType = response.headers.get('content-type');
                        
                        if (contentType && contentType.includes('application/json')) {
                            const jsonData = await response.json();
                            
                            if (jsonData.content && jsonData.encoding === 'base64') {
                                const decoded = atob(jsonData.content.replace(/\s/g, ''));
                                data = JSON.parse(decoded);
                            } else if (jsonData.news) {
                                data = jsonData;
                            } else {
                                continue;
                            }
                        } else {
                            data = await response.json();
                        }
                        
                        if (data && Array.isArray(data.news)) {
                            data.news = data.news.map(news => {
                                if (news.image) {
                                    if (!news.image.startsWith('http://') && 
                                        !news.image.startsWith('https://') && 
                                        !news.image.startsWith('data:')) {
                                        console.warn('⚠️ Invalid image:', news.title);
                                        news.image = '';
                                    }
                                }
                                return news;
                            });
                            
                            cache.set(data);
                            console.log(`✅ Loaded ${data.news.length} news`);
                            
                            localStorage.setItem('news_fallback', JSON.stringify(data));
                            
                            return data;
                        }
                    }
                } catch (error) {
                    console.warn('Failed:', error.message);
                }
            }
            
            throw new Error('All attempts failed');
            
        } catch (error) {
            console.error('❌ Error:', error);
            
            const fallback = localStorage.getItem('news_fallback');
            if (fallback) {
                console.log('📱 Using fallback');
                try {
                    return JSON.parse(fallback);
                } catch (e) {}
            }
            
            return { news: [], totalNews: 0 };
        }
    }
    
    function formatDate(dateString) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return new Date().toLocaleDateString('id-ID', options);
            }
            return date.toLocaleDateString('id-ID', options);
        } catch (error) {
            return new Date().toLocaleDateString('id-ID', options);
        }
    }
    
    function truncateText(text, maxLength = 150) {
        if (!text) return '';
        text = text.trim();
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    }
    
    function isValidImageUrl(url) {
        if (!url || typeof url !== 'string') return false;
        return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:');
    }
    
    function createNewsCard(news) {
        const categoryColors = {
            'Pengumuman': 'badge-primary',
            'Kegiatan': 'badge-success', 
            'Prestasi': 'badge-warning',
            'Umum': 'badge-info'
        };
        
        const badgeClass = categoryColors[news.category] || 'badge-secondary';
        
        let imageHTML;
        
        if (news.image && isValidImageUrl(news.image)) {
            imageHTML = `
                <img 
                    src="${news.image}" 
                    alt="${escapeHtml(news.title)}" 
                    class="news-image" 
                    loading="lazy" 
                    onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'news-placeholder-image\\'><span>📰</span></div>';">
            `;
        } else {
            imageHTML = `<div class="news-placeholder-image"><span>📰</span></div>`;
        }
        
        return `
            <div class="news-card" data-aos="fade-up">
                <div class="news-card-image">
                    ${imageHTML}
                    <span class="news-category ${badgeClass}">${escapeHtml(news.category || 'Umum')}</span>
                </div>
                <div class="news-card-content">
                    <div class="news-date">
                        <i>📅</i> ${formatDate(news.date)}
                    </div>
                    <h3 class="news-title">${escapeHtml(news.title)}</h3>
                    <p class="news-excerpt">${escapeHtml(truncateText(news.content))}</p>
                    <a href="#" class="news-read-more" onclick="window.viewNewsDetail('${news.id}'); return false;">
                        Baca Selengkapnya →
                    </a>
                </div>
            </div>
        `;
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    function renderNews(data) {
        const container = document.querySelector('#news .news-grid');
        
        if (!container) {
            console.error('❌ Container not found');
            return;
        }
        
        if (!data || !data.news || data.news.length === 0) {
            container.innerHTML = `
                <div class="no-news">
                    <div>📰</div>
                    <p>Belum ada berita tersedia.</p>
                </div>
            `;
            return;
        }
        
        const validNews = data.news
            .filter(news => news.title && news.content)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, CONFIG.maxNews);
        
        if (validNews.length === 0) {
            container.innerHTML = `
                <div class="no-news">
                    <div>📭</div>
                    <p>Tidak ada berita.</p>
                </div>
            `;
            return;
        }
        
        console.log('📰 Rendering', validNews.length, 'news');
        const newsHTML = validNews.map(news => createNewsCard(news)).join('');
        container.innerHTML = newsHTML;
        
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
        
        console.log('✅ Rendered');
    }
    
    function createModal() {
        if (document.getElementById('newsModal')) return;
        
        const modal = document.createElement('div');
        modal.id = 'newsModal';
        modal.className = 'news-modal';
        modal.innerHTML = `
            <div class="news-modal-content">
                <div class="news-modal-header">
                    <img id="newsModalImage" class="news-modal-image" src="" alt="" style="display:none;">
                    <button class="news-modal-close" onclick="window.closeNewsDetail()">×</button>
                </div>
                <div class="news-modal-body">
                    <span id="newsModalCategory" class="news-modal-category"></span>
                    <h2 id="newsModalTitle" class="news-modal-title"></h2>
                    <div id="newsModalDate" class="news-modal-date"></div>
                    <div id="newsModalContent" class="news-modal-content-text"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                window.closeNewsDetail();
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                window.closeNewsDetail();
            }
        });
    }
    
    window.viewNewsDetail = function(newsId) {
        const cached = cache.get();
        if (!cached || !cached.news) return;
        
        const news = cached.news.find(n => n.id === newsId);
        if (!news) return;
        
        createModal();
        
        const modal = document.getElementById('newsModal');
        const categoryColors = {
            'Pengumuman': 'badge-primary',
            'Kegiatan': 'badge-success', 
            'Prestasi': 'badge-warning',
            'Umum': 'badge-info'
        };
        
        const badgeClass = categoryColors[news.category] || 'badge-secondary';
        
        document.getElementById('newsModalTitle').textContent = news.title;
        document.getElementById('newsModalCategory').textContent = news.category || 'Umum';
        document.getElementById('newsModalCategory').className = `news-modal-category ${badgeClass}`;
        document.getElementById('newsModalDate').innerHTML = `📅 ${formatDate(news.date)}`;
        document.getElementById('newsModalContent').textContent = news.content;
        
        const modalImage = document.getElementById('newsModalImage');
        if (news.image && isValidImageUrl(news.image)) {
            modalImage.src = news.image;
            modalImage.style.display = 'block';
            modalImage.onerror = function() {
                this.style.display = 'none';
            };
        } else {
            modalImage.style.display = 'none';
        }
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    
    window.closeNewsDetail = function() {
        const modal = document.getElementById('newsModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };
    
    async function init() {
        console.log('🚀 Init news loader v' + CONFIG.version);
        
        try {
            const newsData = await fetchNews();
            renderNews(newsData);
        } catch (error) {
            console.error('❌ Init failed:', error);
            
            const container = document.querySelector('#news .news-grid');
            if (container) {
                container.innerHTML = `
                    <div class="no-news">
                        <div>⚠️</div>
                        <p>Gagal memuat berita.</p>
                    </div>
                `;
            }
        }
    }
    
    setInterval(async () => {
        console.log('🔄 Auto-refresh');
        try {
            cache.clear();
            const newsData = await fetchNews();
            if (newsData && newsData.news) {
                renderNews(newsData);
            }
        } catch (error) {
            console.warn('Refresh failed:', error);
        }
    }, CONFIG.cacheTime);
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    window.newsLoader = {
        CONFIG,
        cache,
        reload: async function() {
            console.log('🔄 Manual reload');
            cache.clear();
            const data = await fetchNews();
            renderNews(data);
            return data;
        },
        clearCache: function() {
            cache.clear();
            console.log('✅ Cache cleared');
        }
    };
})();
