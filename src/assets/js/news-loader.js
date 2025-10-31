// News Loader v2.3 – CORS-safe, same-origin first, robust fallbacks, image proxy
(function () {
  'use strict';

  // Deteksi owner/repo di GitHub Pages
  function detectGitHubConfig() {
    const url = window.location.href;

    // https://owner.github.io/repo/...
    if (url.includes('.github.io')) {
      const matches = url.match(/https:\/\/([^.]+)\.github\.io\/([^\/]+)/);
      if (matches) {
        return { owner: matches[1], repo: matches[2] || 'smpit-dti-web' };
      }
    }

    // Coba dari localStorage (diset admin panel)
    const savedConfig = localStorage.getItem('github_config');
    if (savedConfig) {
      try { return JSON.parse(savedConfig); } catch {}
    }

    // Default
    return { owner: 'smpitdaaruttarbiyah', repo: 'smpit-dti-web' };
  }

  // Deteksi basePath untuk same-origin fetch (contoh: /smpit-dti-web)
  function detectBasePath() {
    try {
      const parts = location.pathname.split('/').filter(Boolean);
      // Project Pages: /repo/...
      if (parts.length >= 1) return '/' + parts[0];
    } catch {}
    return '';
  }

  const auto = detectGitHubConfig();
  const CONFIG = {
    owner: auto.owner,
    repo: auto.repo,
    branch: 'main',
    newsPath: 'data/news.json',
    maxNews: 6,
    cacheTime: 2 * 60 * 1000, // 2 menit
    version: '2.3',
    basePath: detectBasePath()
  };

  console.log('📋 News Loader v' + CONFIG.version, CONFIG);

  // Cache di sessionStorage
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
      return this.data && this.timestamp && (Date.now() - this.timestamp < CONFIG.cacheTime);
    },

    set(data) {
      this.data = data;
      this.timestamp = Date.now();
      try {
        sessionStorage.setItem('news_cache', JSON.stringify({ data: data, timestamp: this.timestamp }));
        sessionStorage.setItem('news_version', CONFIG.version);
      } catch {}
    },

    get() {
      if (this.isValid()) return this.data;
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
      } catch {}
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

  // Util
  function isHttpUrl(u) {
    if (!u || typeof u !== 'string') return false;
    try { const x = new URL(u); return x.protocol === 'http:' || x.protocol === 'https:'; } catch { return false; }
  }

  // Proxy gambar jika domain sumber diblokir (mis. i.ibb.co)
  function getProxyUrl(url) {
    try {
      const u = new URL(url);
      const path = u.host + u.pathname + (u.search || '');
      return 'https://images.weserv.nl/?url=ssl:' + path;
    } catch {
      return url;
    }
  }
  window.getProxyUrl = getProxyUrl;

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text == null ? '' : String(text);
    return div.innerHTML;
  }

  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return new Date().toLocaleDateString('id-ID', options);
      return d.toLocaleDateString('id-ID', options);
    } catch {
      return new Date().toLocaleDateString('id-ID', options);
    }
  }

  function truncateText(text, maxLength = 150) {
    if (!text) return '';
    const s = String(text).trim();
    if (s.length <= maxLength) return s;
    return s.substring(0, maxLength).trim() + '...';
  }

  // Ambil JSON tanpa header custom (hindari preflight)
  async function fetchJson(url) {
    const res = await fetch(url, { cache: 'no-store' }); // jangan kirim headers apa pun
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
  }

  async function fetchSameOrigin() {
    const url = new URL(`${CONFIG.basePath}/${CONFIG.newsPath}?t=${Date.now()}`, location.origin).href;
    console.log('📡 Trying (same-origin):', url);
    return fetchJson(url);
  }

  async function fetchRawGitHub() {
    const url = `https://raw.githubusercontent.com/${CONFIG.owner}/${CONFIG.repo}/${CONFIG.branch}/${CONFIG.newsPath}?t=${Date.now()}`;
    console.log('📡 Trying (raw.githubusercontent):', url);
    return fetchJson(url);
  }

  async function fetchJsDelivr() {
    const url = `https://cdn.jsdelivr.net/gh/${CONFIG.owner}/${CONFIG.repo}@${CONFIG.branch}/${CONFIG.newsPath}?nocache=${Date.now()}`;
    console.log('📡 Trying (jsDelivr):', url);
    return fetchJson(url);
  }

  async function fetchGitHubAPI() {
    const url = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${CONFIG.newsPath}?ref=${CONFIG.branch}`;
    console.log('📡 Trying (GitHub API):', url);
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const meta = await res.json();
    // Decode base64 content
    const content = (meta.content || '').replace(/\s/g, '');
    let str = '';
    try { str = atob(content); } catch {}
    if (!str) throw new Error('Empty content from API');
    return JSON.parse(str);
  }

  function normalizeData(json) {
    // Admin panel menyimpan { news: [...] } plus metadata lain
    if (Array.isArray(json)) {
      return { news: json, totalNews: json.length };
    }
    if (json && Array.isArray(json.news)) {
      return { news: json.news, totalNews: json.totalNews || json.news.length };
    }
    return { news: [], totalNews: 0 };
  }

  async function fetchNews() {
    // Coba bertahap: same-origin -> raw -> jsDelivr -> GitHub API
    const attempts = [fetchSameOrigin, fetchRawGitHub, fetchJsDelivr, fetchGitHubAPI];
    let lastErr;
    for (const fn of attempts) {
      try {
        const json = await fn();
        const data = normalizeData(json);
        // Validasi images secukupnya
        data.news = data.news.map(n => {
          if (n && n.image && !isHttpUrl(n.image) && !String(n.image).startsWith('data:')) {
            n.image = '';
          }
          return n;
        });
        cache.set(data);
        localStorage.setItem('news_fallback', JSON.stringify(data));
        console.log(`✅ Loaded ${data.news.length} news`);
        return data;
      } catch (e) {
        console.warn('Failed:', e.message || e);
        lastErr = e;
      }
    }
    throw lastErr || new Error('All attempts failed');
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
    if (news.image && isHttpUrl(news.image)) {
      imageHTML = `
        <img 
          src="${news.image}"
          alt="${escapeHtml(news.title)}"
          class="news-image"
          loading="lazy"
          onerror="this.onerror=null; this.src=getProxyUrl(this.src);">
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
          <div class="news-date"><i>📅</i> ${formatDate(news.date || news.createdAt)}</div>
          <h3 class="news-title">${escapeHtml(news.title)}</h3>
          <p class="news-excerpt">${escapeHtml(truncateText(news.content))}</p>
          <a href="#" class="news-read-more" onclick="window.viewNewsDetail('${news.id}'); return false;">
            Baca Selengkapnya →
          </a>
        </div>
      </div>
    `;
  }

  function renderNews(data) {
    const container = document.querySelector('#news .news-grid');
    if (!container) {
      console.error('❌ Container not found');
      return;
    }

    const list = (data && Array.isArray(data.news)) ? data.news : [];
    if (list.length === 0) {
      container.innerHTML = `
        <div class="no-news">
          <div>📰</div>
          <p>Belum ada berita tersedia.</p>
        </div>
      `;
      return;
    }

    const validNews = list
      .filter(n => n && n.title && n.content && (n.published !== false))
      .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
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
    container.innerHTML = validNews.map(createNewsCard).join('');

    if (typeof AOS !== 'undefined' && AOS.refresh) {
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

    modal.addEventListener('click', function (e) {
      if (e.target === modal) window.closeNewsDetail();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        window.closeNewsDetail();
      }
    });
  }

  window.viewNewsDetail = function (newsId) {
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
    const catEl = document.getElementById('newsModalCategory');
    catEl.textContent = news.category || 'Umum';
    catEl.className = `news-modal-category ${badgeClass}`;
    document.getElementById('newsModalDate').innerHTML = `📅 ${formatDate(news.date || news.createdAt)}`;
    document.getElementById('newsModalContent').textContent = news.content;

    const modalImage = document.getElementById('newsModalImage');
    if (news.image && isHttpUrl(news.image)) {
      modalImage.src = news.image;
      modalImage.style.display = 'block';
      modalImage.onerror = function () {
        this.onerror = null;
        this.src = getProxyUrl(news.image); // fallback proxy
        this.style.display = 'block';
      };
    } else {
      modalImage.style.display = 'none';
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeNewsDetail = function () {
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

      // Fallback terakhir dari localStorage
      const fallback = localStorage.getItem('news_fallback');
      if (fallback) {
        try {
          const data = JSON.parse(fallback);
          renderNews(data);
        } catch {}
      }
    }
  }

  // Auto-refresh
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

  // API sederhana
  window.newsLoader = {
    CONFIG,
    cache,
    reload: async function () {
      console.log('🔄 Manual reload');
      cache.clear();
      const data = await fetchNews();
      renderNews(data);
      return data;
    },
    clearCache: function () {
      cache.clear();
      console.log('✅ Cache cleared');
    }
  };
})();
