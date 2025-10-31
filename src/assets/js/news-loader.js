// News Loader v2.5 – same-origin fallback, multi-proxy image, eager load
(function () {
  'use strict';

  function detectGitHubConfig() {
    const url = window.location.href;
    if (url.includes('.github.io')) {
      const m = url.match(/https:\/\/([^.]+)\.github\.io\/([^\/]+)/);
      if (m) return { owner: m[1], repo: m[2] || 'smpit-dti-web' };
    }
    try {
      const saved = localStorage.getItem('github_config');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { owner: 'smpitdaaruttarbiyah', repo: 'smpit-dti-web' };
  }

  function detectBasePath() {
    try {
      const parts = location.pathname.split('/').filter(Boolean);
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
    cacheTime: 2 * 60 * 1000,
    version: '2.5',
    basePath: detectBasePath()
  };

  console.log('📋 News Loader v' + CONFIG.version, CONFIG);

  const cache = {
    data: null,
    timestamp: null,
    isValid() {
      const ver = sessionStorage.getItem('news_version');
      if (ver !== CONFIG.version) {
        this.clear();
        return false;
      }
      return this.data && this.timestamp && (Date.now() - this.timestamp < CONFIG.cacheTime);
    },
    set(data) {
      this.data = data;
      this.timestamp = Date.now();
      try {
        sessionStorage.setItem('news_cache', JSON.stringify({ data, timestamp: this.timestamp }));
        sessionStorage.setItem('news_version', CONFIG.version);
      } catch {}
    },
    get() {
      if (this.isValid()) return this.data;
      try {
        const s = sessionStorage.getItem('news_cache');
        if (s) {
          const p = JSON.parse(s);
          if (Date.now() - p.timestamp < CONFIG.cacheTime) {
            this.data = p.data;
            this.timestamp = p.timestamp;
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

  function isHttpUrl(u) {
    if (!u || typeof u !== 'string') return false;
    try { const x = new URL(u); return x.protocol === 'http:' || x.protocol === 'https:'; } catch { return false; }
  }
  function getHost(u) {
    try { return new URL(u).host.toLowerCase(); } catch { return ''; }
  }

  // Proxies
  function getProxyUrl(url) {
    try {
      const u = new URL(url);
      const path = u.host + u.pathname + (u.search || '');
      return 'https://images.weserv.nl/?url=ssl:' + path;
    } catch { return url; }
  }
  function getProxyUrl2(url) {
    try {
      const u = new URL(url);
      const path = u.host + u.pathname + (u.search || '');
      return 'https://wsrv.nl/?url=ssl:' + path;
    } catch { return url; }
  }
  function getProxyUrl3(url) {
    try {
      const u = new URL(url);
      const path = u.host + u.pathname; // abaikan query untuk statically
      return 'https://cdn.statically.io/img/' + path.replace(/^https?:\/\//, '');
    } catch { return url; }
  }

  // onerror fallback berjenjang + log
  window.newsImgError = function (img) {
    const orig = img.getAttribute('data-original') || img.src;
    const step = img.getAttribute('data-step') || '0';
    console.warn('[img] error step', step, 'url:', img.src);

    if (step === '0') {
      img.setAttribute('data-step', '1');
      img.src = getProxyUrl(orig);
      return;
    }
    if (step === '1') {
      img.setAttribute('data-step', '2');
      img.src = getProxyUrl2(orig);
      return;
    }
    if (step === '2') {
      img.setAttribute('data-step', '3');
      img.src = getProxyUrl3(orig);
      return;
    }
    // Gagal semua -> placeholder
    const wrap = img.parentElement;
    if (wrap) {
      wrap.innerHTML = `<div class="news-placeholder-image"><span>📰</span></div>`;
    }
  };

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text == null ? '' : String(text);
    return div.innerHTML;
  }

  function formatDate(d) {
    const opt = { year: 'numeric', month: 'long', day: 'numeric' };
    try {
      const dt = new Date(d);
      return isNaN(dt.getTime()) ? new Date().toLocaleDateString('id-ID', opt) : dt.toLocaleDateString('id-ID', opt);
    } catch { return new Date().toLocaleDateString('id-ID', opt); }
  }

  function truncateText(s, max = 150) {
    if (!s) return '';
    s = String(s).trim();
    return s.length <= max ? s : s.substring(0, max).trim() + '...';
  }

  async function fetchJson(url) {
    const res = await fetch(url, { cache: 'no-store' }); // tanpa header tambahan
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
  }

  async function fetchSameOrigin() {
    // Catatan: di GitHub Pages, folder "data" tidak di-serve (Jekyll data), jadi 404 itu normal.
    const url = new URL(`${CONFIG.basePath}/${CONFIG.newsPath}?t=${Date.now()}`, location.origin).href;
    console.log('📡 Trying (same-origin):', url);
    return fetchJson(url);
  }
  async function fetchRaw() {
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
    const b64 = (meta.content || '').replace(/\s/g, '');
    let str = '';
    try { str = atob(b64); } catch {}
    if (!str) throw new Error('Empty content from API');
    return JSON.parse(str);
  }

  function normalizeData(json) {
    if (Array.isArray(json)) return { news: json, totalNews: json.length };
    if (json && Array.isArray(json.news)) return { news: json.news, totalNews: json.totalNews || json.news.length };
    return { news: [], totalNews: 0 };
  }

  async function fetchNews() {
    const tries = [fetchSameOrigin, fetchRaw, fetchJsDelivr, fetchGitHubAPI];
    let lastErr;
    for (const fn of tries) {
      try {
        const json = await fn();
        const data = normalizeData(json);
        data.news = data.news.map(n => {
          if (n && n.image && !isHttpUrl(n.image) && !String(n.image).startsWith('data:')) n.image = '';
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

  function createNewsCard(n) {
    const catColors = { Pengumuman: 'badge-primary', Kegiatan: 'badge-success', Prestasi: 'badge-warning', Umum: 'badge-info' };
    const badgeClass = catColors[n.category] || 'badge-secondary';
    const title = escapeHtml(n.title);
    const date = formatDate(n.date || n.createdAt);
    const excerpt = escapeHtml(truncateText(n.content));
    const imgUrl = n.image && isHttpUrl(n.image) ? n.image : '';

    // Jika host i.ibb.co/ibb.co, langsung mulai dari proxy1 (bypass blokir)
    const host = getHost(imgUrl);
    const startWithProxy = host === 'i.ibb.co' || host === 'ibb.co';
    const initialSrc = startWithProxy ? getProxyUrl(imgUrl) : imgUrl;
    const initialStep = startWithProxy ? '1' : '0';

    const imageHTML = imgUrl
      ? `<img 
           src="${initialSrc}"
           data-original="${imgUrl}"
           data-step="${initialStep}"
           alt="${title}"
           class="news-image"
           loading="eager"
           fetchpriority="high"
           decoding="async"
           referrerpolicy="no-referrer"
           onerror="window.newsImgError(this)"
           style="width:100%;height:100%;object-fit:cover;display:block;"
         >`
      : `<div class="news-placeholder-image"><span>📰</span></div>`;

    return `
      <div class="news-card" data-aos="fade-up">
        <div class="news-card-image" style="width:100%;aspect-ratio:16/9;overflow:hidden;position:relative;">
          ${imageHTML}
          <span class="news-category ${badgeClass}">${escapeHtml(n.category || 'Umum')}</span>
        </div>
        <div class="news-card-content">
          <div class="news-date"><i>📅</i> ${date}</div>
          <h3 class="news-title">${title}</h3>
          <p class="news-excerpt">${excerpt}</p>
          <a href="#" class="news-read-more" onclick="window.viewNewsDetail('${n.id}'); return false;">Baca Selengkapnya →</a>
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
    const valid = list
      .filter(n => n && n.title && n.content && (n.published !== false))
      .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
      .slice(0, CONFIG.maxNews);

    if (!valid.length) {
      container.innerHTML = `
        <div class="no-news">
          <div>📰</div>
          <p>Belum ada berita tersedia.</p>
        </div>`;
      return;
    }

    container.innerHTML = valid.map(createNewsCard).join('');

    if (typeof AOS !== 'undefined' && AOS.refresh) AOS.refresh();
  }

  function createModal() {
    if (document.getElementById('newsModal')) return;
    const modal = document.createElement('div');
    modal.id = 'newsModal';
    modal.className = 'news-modal';
    modal.innerHTML = `
      <div class="news-modal-content">
        <div class="news-modal-header">
          <img id="newsModalImage" class="news-modal-image" src="" alt="" style="display:none;max-height:50vh;object-fit:contain;" referrerpolicy="no-referrer">
          <button class="news-modal-close" onclick="window.closeNewsDetail()">×</button>
        </div>
        <div class="news-modal-body">
          <span id="newsModalCategory" class="news-modal-category"></span>
          <h2 id="newsModalTitle" class="news-modal-title"></h2>
          <div id="newsModalDate" class="news-modal-date"></div>
          <div id="newsModalContent" class="news-modal-content-text"></div>
        </div>
      </div>`;
    document.body.appendChild(modal);

    modal.addEventListener('click', e => { if (e.target === modal) window.closeNewsDetail(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('active')) window.closeNewsDetail();
    });
  }

  window.viewNewsDetail = function (id) {
    const cached = cache.get();
    if (!cached || !cached.news) return;
    const n = cached.news.find(x => x.id === id);
    if (!n) return;

    createModal();

    const catColors = { Pengumuman: 'badge-primary', Kegiatan: 'badge-success', Prestasi: 'badge-warning', Umum: 'badge-info' };
    const badgeClass = catColors[n.category] || 'badge-secondary';

    document.getElementById('newsModalTitle').textContent = n.title;
    const catEl = document.getElementById('newsModalCategory');
    catEl.textContent = n.category || 'Umum';
    catEl.className = `news-modal-category ${badgeClass}`;
    document.getElementById('newsModalDate').innerHTML = `📅 ${formatDate(n.date || n.createdAt)}`;
    document.getElementById('newsModalContent').textContent = n.content;

    const img = document.getElementById('newsModalImage');
    if (n.image && isHttpUrl(n.image)) {
      const host = getHost(n.image);
      const startWithProxy = host === 'i.ibb.co' || host === 'ibb.co';
      img.style.display = 'block';
      img.setAttribute('data-original', n.image);
      img.setAttribute('data-step', startWithProxy ? '1' : '0');
      img.onerror = function () {
        window.newsImgError(img);
        // Jika sudah 3x fallback masih gagal, sembunyikan
        if (img.getAttribute('data-step') === '3') {
          img.style.display = 'none';
        }
      };
      img.src = startWithProxy ? getProxyUrl(n.image) : n.image;
    } else {
      img.style.display = 'none';
    }

    const modal = document.getElementById('newsModal');
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
      const data = await fetchNews();
      renderNews(data);
    } catch (e) {
      console.error('❌ Init failed:', e);
      const container = document.querySelector('#news .news-grid');
      if (container) {
        container.innerHTML = `
          <div class="no-news">
            <div>⚠️</div>
            <p>Gagal memuat berita.</p>
          </div>`;
      }
      const fb = localStorage.getItem('news_fallback');
      if (fb) {
        try { renderNews(JSON.parse(fb)); } catch {}
      }
    }
  }

  setInterval(async () => {
    console.log('🔄 Auto-refresh');
    try {
      cache.clear();
      const data = await fetchNews();
      if (data && data.news) renderNews(data);
    } catch (e) {
      console.warn('Refresh failed:', e);
    }
  }, CONFIG.cacheTime);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.newsLoader = {
    CONFIG, cache,
    reload: async function () { cache.clear(); const d = await fetchNews(); renderNews(d); return d; },
    clearCache: function () { cache.clear(); }
  };
})();
