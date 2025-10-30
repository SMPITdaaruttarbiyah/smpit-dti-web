// Dynamic News Loader for SMPIT DTI
class NewsLoader {
    constructor() {
        this.newsContainer = document.querySelector('.news-grid');
        this.loadingIndicator = this.createLoadingIndicator();
        this.errorIndicator = this.createErrorIndicator();
        this.init();
    }

    init() {
        this.loadNews();
        // Auto refresh every 5 minutes
        setInterval(() => this.loadNews(), 5 * 60 * 1000);
    }

    createLoadingIndicator() {
        const loader = document.createElement('div');
        loader.className = 'news-loading';
        loader.innerHTML = `
            <div style="text-align: center; padding: 40px; grid-column: 1 / -1;">
                <div style="display: inline-block; width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #10b981; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <p style="margin-top: 16px; color: #6b7280;">Memuat berita terbaru...</p>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        return loader;
    }

    createErrorIndicator() {
        const error = document.createElement('div');
        error.className = 'news-error';
        error.innerHTML = `
            <div style="text-align: center; padding: 40px; grid-column: 1 / -1;">
                <div style="color: #ef4444; font-size: 48px; margin-bottom: 16px;">⚠️</div>
                <h3 style="color: #dc2626; margin-bottom: 8px;">Gagal Memuat Berita</h3>
                <p style="color: #6b7280; margin-bottom: 16px;">Terjadi kesalahan saat mengambil data berita.</p>
                <button onclick="location.reload()" style="background: #10b981; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">Coba Lagi</button>
            </div>
        `;
        return error;
    }

    async loadNews() {
        if (!this.newsContainer) return;

        // Show loading
        this.newsContainer.innerHTML = '';
        this.newsContainer.appendChild(this.loadingIndicator);

        try {
            const response = await fetch('https://raw.githubusercontent.com/SMPITdaaruttarbiyah/smpit-dti-web/main/assets/data/news.json');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            
            if (data.news && data.news.length > 0) {
                this.displayNews(data.news);
            } else {
                this.displayEmpty();
            }
        } catch (error) {
            console.error('Error loading news:', error);
            this.newsContainer.innerHTML = '';
            this.newsContainer.appendChild(this.errorIndicator);
        }
    }

    displayNews(newsItems) {
        this.newsContainer.innerHTML = '';
        
        newsItems.slice(0, 6).forEach((item, index) => {
            const newsCard = this.createNewsCard(item, index);
            this.newsContainer.appendChild(newsCard);
        });
    }

    displayEmpty() {
        this.newsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; grid-column: 1 / -1;">
                <div style="color: #9ca3af; font-size: 48px; margin-bottom: 16px;">📰</div>
                <h3 style="color: #6b7280; margin-bottom: 8px;">Belum Ada Berita</h3>
                <p style="color: #9ca3af;">Belum ada berita tersedia saat ini.</p>
            </div>
        `;
    }

    createNewsCard(item, index) {
        const article = document.createElement('article');
        article.className = 'news-card';
        article.setAttribute('data-aos', 'fade-up');
        article.setAttribute('data-aos-delay', (index + 1) * 100);

        const formattedDate = this.formatDate(item.date);
        const tags = item.tags ? this.createTags(item.tags) : '';

        article.innerHTML = `
            <div class="news-image">
                ${item.image ? 
                    `<img src="${item.image}" alt="${item.title}" loading="lazy" onerror="this.src='https://picsum.photos/seed/smpitdti${item.id}/400/250'">` :
                    `<img src="https://picsum.photos/seed/smpitdti${item.id}/400/250" alt="${item.title}" loading="lazy">`
                }
                <div class="news-date">${formattedDate}</div>
                ${item.category ? `<div class="news-category">${item.category}</div>` : ''}
            </div>
            <div class="news-content">
                <h3>${item.title}</h3>
                <p>${item.content}</p>
                ${tags}
                <a href="#" class="news-link" onclick="event.preventDefault(); alert('Berita: ${item.title.replace(/'/g, "\\'")}');">Baca Selengkapnya →</a>
            </div>
        `;

        return article;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('id-ID', options);
    }

    createTags(tagsString) {
        if (!tagsString) return '';
        
        const tags = tagsString.split(',').slice(0, 3); // Max 3 tags
        return `
            <div class="news-tags">
                ${tags.map(tag => `<span class="news-tag">${tag.trim()}</span>`).join('')}
            </div>
        `;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the news section
    if (document.querySelector('#news')) {
        new NewsLoader();
    }
});

// Also initialize when AOS is ready (for dynamic content)
if (window.AOS) {
    AOS.refresh();
}