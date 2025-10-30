/**
 * ========================================
 * SMPIT DAARUT TARBIYAH - QUOTES SYSTEM
 * ========================================
 */

class IslamicQuotes {
  constructor(config = {}) {
    // Configuration
    this.config = {
      apiUrl: 'https://islamic-quotes-api.vercel.app/api/quotes',
      corsProxy: 'https://api.allorigins.win/raw?url=',
      autoPlayDuration: 8000,
      transitionDuration: 400,
      maxIndicators: 5,
      showInitialHint: true, // NEW: Show hint on first load
      filterKeywords: [
        'ilmu', 'ilm', 'علم', 'عالم', 'تعلم',
        'belajar', 'mengajar', 'pelajaran', 'pendidikan',
        'knowledge', 'learn', 'teach', 'education',
        'wisdom', 'hikmah', 'اقرأ', 'read'
      ],
      ...config
    };

    // State
    this.quotes = [];
    this.currentQuoteIndex = 0;
    this.isLoading = false;
    this.isAutoPlaying = false;
    this.autoPlayInterval = null;
    this.hasShownHint = sessionStorage.getItem('quotesHintShown') === 'true';
    
    // DOM Elements
    this.quoteContainer = null;
    this.quoteContent = null;
    
    // Initialize
    this.init();
  }

  async init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  async setup() {
    try {
      this.quoteContainer = document.querySelector('.quote-container');
      
      if (!this.quoteContainer) {
        console.warn('⚠️ Quote container not found');
        return;
      }

      console.log('🚀 Initializing Islamic Quotes System...');
      this.showLoadingState();
      
      await this.fetchQuotes();
      this.filterQuotes();

      if (this.quotes.length > 0) {
        console.log(`✅ Loaded ${this.quotes.length} quotes`);
        
        this.renderStructure();
        this.displayQuote();
        this.setupControls();
        this.renderIndicators();
        
        // Show initial hint for first-time visitors
        if (this.config.showInitialHint && !this.hasShownHint) {
          this.showInitialHint();
        }
        
        console.log('✨ Islamic Quotes System ready!');
      } else {
        this.showNoQuotesMessage();
      }
    } catch (error) {
      console.error('❌ Error in setup:', error);
      this.showErrorMessage();
    }
  }

  async fetchQuotes() {
    try {
      this.isLoading = true;
      
      const url = this.config.corsProxy + encodeURIComponent(this.config.apiUrl);
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      this.quotes = Array.isArray(data) ? data : [];
      this.isLoading = false;
      
      console.log(`📡 Fetched ${this.quotes.length} quotes from API`);
    } catch (error) {
      console.error('❌ Error fetching quotes:', error);
      this.isLoading = false;
      this.useFallbackQuotes();
    }
  }

  filterQuotes() {
    const originalLength = this.quotes.length;
    
    this.quotes = this.quotes.filter(quote => {
      const searchText = [
        quote.text || '',
        quote.arabic || '',
        quote.explanation || '',
        quote.category || ''
      ].join(' ').toLowerCase();

      return this.config.filterKeywords.some(keyword =>
        searchText.includes(keyword.toLowerCase())
      );
    });

    if (this.quotes.length === 0) {
      console.warn('⚠️ No filtered quotes found, using fallback');
      this.useFallbackQuotes();
    } else {
      console.log(`🔍 Filtered ${originalLength} → ${this.quotes.length} quotes`);
    }
  }

  useFallbackQuotes() {
    console.log('📚 Using fallback quotes...');
    
    this.quotes = [
      {
        arabic: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ',
        text: 'Menuntut ilmu adalah kewajiban bagi setiap muslim.',
        source: 'HR. Ibnu Majah'
      },
      {
        arabic: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ',
        text: 'Barangsiapa menempuh jalan untuk menuntut ilmu, maka Allah akan memudahkan baginya jalan menuju surga.',
        source: 'HR. Muslim'
      },
      {
        arabic: 'الْعُلَمَاءُ وَرَثَةُ الْأَنْبِيَاءِ',
        text: 'Para ulama adalah pewaris para nabi.',
        source: 'HR. Abu Dawud & Tirmidzi'
      },
      {
        arabic: 'مَنْ يُرِدِ اللَّهُ بِهِ خَيْرًا يُفَقِّهْهُ فِي الدِّينِ',
        text: 'Barangsiapa yang dikehendaki Allah mendapat kebaikan, maka Dia akan memahamkannya dalam agama.',
        source: 'HR. Bukhari & Muslim'
      },
      {
        arabic: 'اطْلُبُوا الْعِلْمَ مِنَ الْمَهْدِ إِلَى اللَّحْدِ',
        text: 'Tuntutlah ilmu sejak dari buaian hingga liang lahat.',
        source: 'Hadist Nabi ﷺ'
      },
      {
        arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
        text: 'Sebaik-baik kalian adalah yang mempelajari Al-Quran dan mengajarkannya.',
        source: 'HR. Bukhari'
      },
      {
        arabic: 'إِنَّمَا الْعِلْمُ بِالتَّعَلُّمِ وَالْحِلْمُ بِالتَّحَلُّمِ',
        text: 'Sesungguhnya ilmu itu dengan belajar dan kesabaran itu dengan berlatih.',
        source: 'HR. Thabrani'
      },
      {
        arabic: 'مَنْ خَرَجَ فِي طَلَبِ الْعِلْمِ فَهُوَ فِي سَبِيلِ اللَّهِ حَتَّى يَرْجِعَ',
        text: 'Barangsiapa keluar untuk menuntut ilmu, maka dia berada di jalan Allah hingga ia kembali.',
        source: 'HR. Tirmidzi'
      }
    ];
  }

  renderStructure() {
    this.quoteContainer.innerHTML = `
      <!-- Islamic Ornaments -->
      <div class="islamic-ornament ornament-top-left"></div>
      <div class="islamic-ornament ornament-top-right"></div>
      <div class="islamic-ornament ornament-bottom-left"></div>
      <div class="islamic-ornament ornament-bottom-right"></div>
      
      <!-- Bismillah Header -->
      <div class="bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
      
      <!-- Quote Content -->
      <div class="quote-content">
        <div class="quote-text-arabic">
          <div class="quote-mark quote-mark-start">﴿</div>
          <p class="arabic-text" dir="rtl"></p>
          <div class="quote-mark quote-mark-end">﴾</div>
        </div>
        
        <div class="quote-text-indonesia">
          <p></p>
        </div>
        
        <div class="quote-source">
          <div class="source-divider"></div>
          <p class="source-text"></p>
        </div>
      </div>
      
      <!-- Navigation -->
      <div class="quote-navigation">
        <button class="quote-nav-btn quote-prev" aria-label="Hadist Sebelumnya" title="Sebelumnya (←)">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 16L6 10L12 4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        
        <div class="quote-indicators"></div>
        
        <button class="quote-nav-btn quote-next" aria-label="Hadist Selanjutnya" title="Selanjutnya (→)">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M8 16L14 10L8 4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      
      <!-- Auto Play Toggle -->
      <button class="auto-play-btn" aria-label="Toggle Auto Play" title="Putar Otomatis">
        <svg class="play-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M3 2v12l10-6L3 2z"/>
        </svg>
        <svg class="pause-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="display: none;">
          <path d="M5 3h2v10H5V3zm4 0h2v10H9V3z"/>
        </svg>
      </button>
    `;
    
    this.quoteContent = this.quoteContainer.querySelector('.quote-content');
  }

  displayQuote() {
    if (this.quotes.length === 0 || !this.quoteContent) return;

    const quote = this.quotes[this.currentQuoteIndex];
    
    const arabicText = this.quoteContainer.querySelector('.arabic-text');
    const indonesiaText = this.quoteContainer.querySelector('.quote-text-indonesia p');
    const sourceText = this.quoteContainer.querySelector('.source-text');
    
    if (!arabicText || !indonesiaText || !sourceText) return;
    
    this.quoteContent.classList.add('fade-out');
    
    setTimeout(() => {
      arabicText.textContent = quote.arabic || 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ مُحَمَّدٌ رَسُولُ ٱللَّٰهِ';
      indonesiaText.textContent = quote.text || 'Tidak ada tuhan selain Allah, Muhammad adalah utusan Allah';
      sourceText.textContent = quote.source || quote.category || 'Hadist Nabi ﷺ';
      
      this.updateIndicators();
      
      setTimeout(() => {
        this.quoteContent.classList.remove('fade-out');
        this.quoteContent.classList.add('fade-in');
        
        setTimeout(() => {
          this.quoteContent.classList.remove('fade-in');
        }, this.config.transitionDuration);
      }, 50);
    }, this.config.transitionDuration);
  }

  renderIndicators() {
    const indicatorsContainer = this.quoteContainer.querySelector('.quote-indicators');
    if (!indicatorsContainer) return;
    
    const maxIndicators = Math.min(this.quotes.length, this.config.maxIndicators);
    indicatorsContainer.innerHTML = '';
    
    for (let i = 0; i < maxIndicators; i++) {
      const indicator = document.createElement('span');
      indicator.className = 'quote-indicator';
      indicator.setAttribute('data-index', i);
      indicator.setAttribute('role', 'button');
      indicator.setAttribute('tabindex', '0');
      indicator.setAttribute('aria-label', `Hadist ${i + 1}`);
      
      indicator.addEventListener('click', () => this.goToQuote(i));
      indicator.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.goToQuote(i);
        }
      });
      
      indicatorsContainer.appendChild(indicator);
    }
    
    this.updateIndicators();
  }

  updateIndicators() {
    const indicators = this.quoteContainer.querySelectorAll('.quote-indicator');
    indicators.forEach((indicator, index) => {
      if (index === this.currentQuoteIndex) {
        indicator.classList.add('active');
        indicator.setAttribute('aria-current', 'true');
      } else {
        indicator.classList.remove('active');
        indicator.removeAttribute('aria-current');
      }
    });
  }

  setupControls() {
    const prevBtn = this.quoteContainer.querySelector('.quote-prev');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.previousQuote());
    }
    
    const nextBtn = this.quoteContainer.querySelector('.quote-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextQuote());
    }
    
    const autoPlayBtn = this.quoteContainer.querySelector('.auto-play-btn');
    if (autoPlayBtn) {
      autoPlayBtn.addEventListener('click', () => this.toggleAutoPlay());
    }
    
    document.addEventListener('keydown', (e) => {
      if (!this.quoteContainer || this.isLoading) return;
      
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.previousQuote();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.nextQuote();
          break;
        case ' ':
          if (e.target === document.body) {
            e.preventDefault();
            this.toggleAutoPlay();
          }
          break;
      }
    });
    
    this.setupTouchControls();
  }

  setupTouchControls() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    this.quoteContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    this.quoteContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    }, { passive: true });
    
    const handleSwipe = () => {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          this.nextQuote();
        } else {
          this.previousQuote();
        }
      }
    };
    
    this.handleSwipe = handleSwipe;
  }

  nextQuote() {
    if (this.quotes.length === 0 || this.isLoading) return;
    this.currentQuoteIndex = (this.currentQuoteIndex + 1) % this.quotes.length;
    this.displayQuote();
  }

  previousQuote() {
    if (this.quotes.length === 0 || this.isLoading) return;
    this.currentQuoteIndex = (this.currentQuoteIndex - 1 + this.quotes.length) % this.quotes.length;
    this.displayQuote();
  }

  goToQuote(index) {
    if (index < 0 || index >= this.quotes.length || this.isLoading) return;
    this.currentQuoteIndex = index;
    this.displayQuote();
  }

  toggleAutoPlay() {
    const autoPlayBtn = this.quoteContainer.querySelector('.auto-play-btn');
    const playIcon = autoPlayBtn?.querySelector('.play-icon');
    const pauseIcon = autoPlayBtn?.querySelector('.pause-icon');
    
    if (!autoPlayBtn) return;
    
    if (this.isAutoPlaying) {
      this.stopAutoPlay();
      
      autoPlayBtn.classList.remove('playing');
      if (playIcon) playIcon.style.display = 'block';
      if (pauseIcon) pauseIcon.style.display = 'none';
      autoPlayBtn.setAttribute('title', 'Putar Otomatis');
      
      console.log('⏸️ Auto-play stopped');
    } else {
      this.startAutoPlay();
      
      autoPlayBtn.classList.add('playing');
      if (playIcon) playIcon.style.display = 'none';
      if (pauseIcon) pauseIcon.style.display = 'block';
      autoPlayBtn.setAttribute('title', 'Hentikan Otomatis');
      
      console.log('▶️ Auto-play started');
    }
  }

  startAutoPlay() {
    this.stopAutoPlay();
    
    this.autoPlayInterval = setInterval(() => {
      this.nextQuote();
    }, this.config.autoPlayDuration);
    
    this.isAutoPlaying = true;
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
    this.isAutoPlaying = false;
  }

  /**
   * NEW: Show initial hint for first-time visitors
   */
  showInitialHint() {
    const autoPlayBtn = this.quoteContainer?.querySelector('.auto-play-btn');
    if (!autoPlayBtn) return;
    
    setTimeout(() => {
      // Temporarily show the button
      autoPlayBtn.style.opacity = '1';
      autoPlayBtn.style.visibility = 'visible';
      autoPlayBtn.style.transform = 'scale(1) translateY(0)';
      
      // Add pulse animation
      autoPlayBtn.style.animation = 'hintPulse 0.6s ease-in-out 3';
      
      setTimeout(() => {
        // Reset to CSS-controlled state
        autoPlayBtn.style.opacity = '';
        autoPlayBtn.style.visibility = '';
        autoPlayBtn.style.transform = '';
        autoPlayBtn.style.animation = '';
        
        // Mark as shown
        sessionStorage.setItem('quotesHintShown', 'true');
        this.hasShownHint = true;
      }, 2500);
    }, 1500);
  }

  showLoadingState() {
    this.quoteContainer.innerHTML = `
      <div class="quote-loading">
        <div class="loading-spinner"></div>
        <p class="loading-text">Memuat mutiara hikmah...</p>
      </div>
    `;
  }

  showErrorMessage() {
    this.quoteContainer.innerHTML = `
      <div class="quote-error">
        <p>⚠️ Maaf, terjadi kesalahan</p>
        <p>Tidak dapat memuat quotes saat ini.</p>
        <button onclick="window.islamicQuotes.reload()">
          🔄 Muat Ulang
        </button>
      </div>
    `;
  }

  showNoQuotesMessage() {
    this.quoteContainer.innerHTML = `
      <div class="quote-error">
        <p>📚 Tidak ada quotes tersedia</p>
        <p>Mohon coba lagi nanti.</p>
      </div>
    `;
  }

  async reload() {
    console.log('🔄 Reloading quotes...');
    this.quotes = [];
    this.currentQuoteIndex = 0;
    this.stopAutoPlay();
    await this.setup();
  }

  destroy() {
    console.log('🧹 Cleaning up Islamic Quotes System...');
    this.stopAutoPlay();
    this.quotes = [];
    this.quoteContainer = null;
    this.quoteContent = null;
  }
}

// Auto-initialization
document.addEventListener('DOMContentLoaded', () => {
  console.log('📖 Initializing Islamic Quotes System...');
  
  window.islamicQuotes = new IslamicQuotes({
    autoPlayDuration: 8000,
    maxIndicators: 5,
    showInitialHint: true,
  });
});

window.addEventListener('beforeunload', () => {
  if (window.islamicQuotes) {
    window.islamicQuotes.destroy();
  }
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = IslamicQuotes;
}
