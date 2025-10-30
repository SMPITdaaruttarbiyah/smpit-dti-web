/**
 * SMPIT DAARUT TARBIYAH INDONESIA - News Loader
 * Memuat berita dari API dan menampilkannya di halaman utama
 */

class NewsLoader {
    constructor() {
        this.newsContainer = null;
        this.newsData = [];
        this.init();
    }

    init() {
        // Tunggu DOM siap
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.loadNews());
        } else {
            this.loadNews();
        }
    }

    async loadNews() {
        // Cari container berita
        this.newsContainer = document.querySelector('.news-grid');
        
        if (!this.newsContainer) {
            console.warn('News container not found');
            return;
        }

        try {
            // Tampilkan loading state
            this.showLoadingState();

            // Ambil data berita dari API
            const response = await fetch('/api/news?status=published&limit=6');
            const result = await response.json();

            if (result.success && result.data) {
                this.newsData = result.data;
                this.renderNews();
            } else {
                this.showErrorState();
            }
        } catch (error) {
            console.error('Error loading news:', error);
            this.showErrorState();
        }
    }

    showLoadingState() {
        this.newsContainer.innerHTML = `
            <div class="news-loading" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <div class="loading-spinner" style="margin: 0 auto 20px;"></div>
                <p>Memuat berita terbaru...</p>
            </div>
        `;
    }

    showErrorState() {
        this.newsContainer.innerHTML = `
            <div class="news-error" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <p>Maaf, terjadi kesalahan saat memuat berita.</p>
                <button onclick="location.reload()" class="btn" style="margin-top: 15px;">Coba Lagi</button>
            </div>
        `;
    }

    renderNews() {
        if (this.newsData.length === 0) {
            this.newsContainer.innerHTML = `
                <div class="news-empty" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <p>Belum ada berita tersedia.</p>
                </div>
            `;
            return;
        }

        const newsHTML = this.newsData.map((news, index) => {
            const date = new Date(news.date);
            const formattedDate = date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });

            const categoryColors = {
                'prestasi': '#10b981',
                'kegiatan': '#3b82f6',
                'akademik': '#8b5cf6',
                'pengumuman': '#f59e0b'
            };

            const categoryColor = categoryColors[news.category] || '#6b7280';

            return `
                <article class="news-card" data-aos="fade-up" data-aos-delay="${(index + 1) * 100}">
                    <div class="news-image">
                        ${news.image ? 
                            `<img src="${news.image}" alt="${news.title}" loading="lazy" onerror="this.src='https://picsum.photos/seed/news${news.id}/400/250'">` :
                            `<img src="https://picsum.photos/seed/news${news.id}/400/250" alt="${news.title}" loading="lazy">`
                        }
                        <div class="news-date">${formattedDate}</div>
                        <div class="news-category" style="background-color: ${categoryColor};">
                            ${news.category}
                        </div>
                    </div>
                    <div class="news-content">
                        <h3>${news.title}</h3>
                        <p>${news.content.substring(0, 120)}...</p>
                        <div class="news-meta">
                            <span class="news-author">Oleh ${news.author}</span>
                            <span class="news-status">Published</span>
                        </div>
                        <button class="news-link" onclick="newsLoader.showNewsDetail(${news.id})">
                            Baca Selengkapnya →
                        </button>
                    </div>
                </article>
            `;
        }).join('');

        this.newsContainer.innerHTML = newsHTML;

        // Re-initialize AOS for new elements
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }

    showNewsDetail(newsId) {
        const news = this.newsData.find(n => n.id === newsId);
        if (!news) return;

        // Buat modal untuk detail berita
        const modal = document.createElement('div');
        modal.className = 'news-modal';
        modal.innerHTML = `
            <div class="news-modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="news-modal-content">
                <button class="news-modal-close" onclick="this.closest('.news-modal').remove()">×</button>
                <div class="news-modal-header">
                    <h2>${news.title}</h2>
                    <div class="news-modal-meta">
                        <span class="news-category" style="background-color: ${this.getCategoryColor(news.category)};">
                            ${news.category}
                        </span>
                        <span class="news-date">${new Date(news.date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}</span>
                        <span class="news-author">Oleh ${news.author}</span>
                    </div>
                </div>
                <div class="news-modal-body">
                    ${news.image ? `<img src="${news.image}" alt="${news.title}" style="width: 100%; border-radius: 8px; margin-bottom: 20px;">` : ''}
                    <div class="news-content-full">
                        ${news.content.split('\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
                    </div>
                </div>
                <div class="news-modal-footer">
                    <button class="btn" onclick="this.closest('.news-modal').remove()">Tutup</button>
                </div>
            </div>
        `;

        // Tambahkan style untuk modal
        if (!document.querySelector('#news-modal-styles')) {
            const style = document.createElement('style');
            style.id = 'news-modal-styles';
            style.textContent = `
                .news-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .news-modal-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(4px);
                }
                
                .news-modal-content {
                    position: relative;
                    background: white;
                    border-radius: 12px;
                    max-width: 800px;
                    max-height: 90vh;
                    width: 90%;
                    overflow-y: auto;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                }
                
                .news-modal-close {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: #f3f4f6;
                    border: none;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1;
                }
                
                .news-modal-close:hover {
                    background: #e5e7eb;
                }
                
                .news-modal-header {
                    padding: 30px 30px 20px;
                    border-bottom: 1px solid #e5e7eb;
                }
                
                .news-modal-header h2 {
                    margin: 0 0 15px 0;
                    color: #1f2937;
                }
                
                .news-modal-meta {
                    display: flex;
                    gap: 15px;
                    align-items: center;
                    flex-wrap: wrap;
                }
                
                .news-modal-body {
                    padding: 30px;
                }
                
                .news-content-full p {
                    margin: 0 0 15px 0;
                    line-height: 1.6;
                    color: #374151;
                }
                
                .news-modal-footer {
                    padding: 20px 30px;
                    border-top: 1px solid #e5e7eb;
                    text-align: right;
                }
                
                .news-category {
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 500;
                    color: white;
                    text-transform: uppercase;
                }
                
                @media (max-width: 768px) {
                    .news-modal-content {
                        width: 95%;
                        max-height: 95vh;
                    }
                    
                    .news-modal-header,
                    .news-modal-body,
                    .news-modal-footer {
                        padding: 20px;
                    }
                    
                    .news-modal-meta {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 8px;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(modal);
        
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        
        // Restore body scroll when modal is closed
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('news-modal-overlay')) {
                document.body.style.overflow = '';
            }
        });
    }

    getCategoryColor(category) {
        const categoryColors = {
            'prestasi': '#10b981',
            'kegiatan': '#3b82f6',
            'akademik': '#8b5cf6',
            'pengumuman': '#f59e0b'
        };
        return categoryColors[category] || '#6b7280';
    }

    // Method untuk refresh berita
    async refreshNews() {
        await this.loadNews();
    }
}

// Inisialisasi news loader
document.addEventListener('DOMContentLoaded', () => {
    window.newsLoader = new NewsLoader();
});

// Export untuk penggunaan di modul lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NewsLoader;
}