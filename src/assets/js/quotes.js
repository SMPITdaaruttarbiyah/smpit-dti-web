/**
 * SMPIT Daarut Tarbiyah - Islamic Quotes System
 * Mengambil quotes tentang ilmu dari Islamic Quotes API
 */

class IslamicQuotes {
  constructor() {
    this.quotes = [];
    this.currentQuoteIndex = 0;
    this.quoteElement = null;
    this.isLoading = false;
    this.init();
  }

  async init() {
    // Tunggu DOM siap
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupQuotes());
    } else {
      this.setupQuotes();
    }
  }

  async setupQuotes() {
    // Cari elemen quote di halaman
    this.quoteElement = document.querySelector('.quote-text');
    const quoteAuthor = document.querySelector('.quote-author');
    
    if (!this.quoteElement) {
      console.warn('Quote element not found');
      return;
    }

    // Tampilkan loading state
    this.showLoadingState();

    try {
      // Ambil quotes dari API
      await this.fetchQuotes();
      
      if (this.quotes.length > 0) {
        // Filter quotes yang mengandung kata "ilmu"
        this.filterIlmuQuotes();
        
        if (this.quotes.length > 0) {
          // Tampilkan quote pertama
          this.displayQuote();
          
          // Setup rotasi quotes otomatis
          this.startQuoteRotation();
          
          // Setup navigasi manual
          this.setupManualNavigation();
        } else {
          this.showNoQuotesMessage();
        }
      } else {
        this.showErrorMessage();
      }
    } catch (error) {
      console.error('Error loading quotes:', error);
      this.showErrorMessage();
    }
  }

  async fetchQuotes() {
    try {
      const response = await fetch('https://islamic-quotes-api.vercel.app/api/quotes');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.quotes = data;
    } catch (error) {
      console.error('Error fetching quotes:', error);
      throw error;
    }
  }

  filterIlmuQuotes() {
    // Filter quotes yang mengandung kata "ilmu" atau variasinya
    const ilmuKeywords = ['ilmu', 'ilm', 'علم', 'belajar', 'mengajar', 'pelajaran', 'pendidikan'];
    
    this.quotes = this.quotes.filter(quote => {
      const text = (quote.text || '').toLowerCase();
      const arabic = (quote.arabic || '').toLowerCase();
      const explanation = (quote.explanation || '').toLowerCase();
      
      return ilmuKeywords.some(keyword => 
        text.includes(keyword) || 
        arabic.includes(keyword) || 
        explanation.includes(keyword)
      );
    });

    // Jika tidak ada quotes tentang ilmu, gunakan quotes tentang pendidikan umum
    if (this.quotes.length === 0) {
      const educationKeywords = ['ajaran', 'didik', 'ajar', 'bimbing', 'pandu', 'petunjuk'];
      this.quotes = this.quotes.filter(quote => {
        const text = (quote.text || '').toLowerCase();
        const explanation = (quote.explanation || '').toLowerCase();
        
        return educationKeywords.some(keyword => 
          text.includes(keyword) || 
          explanation.includes(keyword)
        );
      });
    }

    // Jika masih kosong, gunakan 10 quotes pertama sebagai fallback
    if (this.quotes.length === 0) {
      const allQuotes = await this.fetchQuotes();
      this.quotes = allQuotes.slice(0, 10);
    }
  }

  showLoadingState() {
    if (this.quoteElement) {
      this.quoteElement.innerHTML = `
        <div class="quote-loading">
          <div class="loading-spinner"></div>
          <p>Memuat quotes inspiratif...</p>
        </div>
      `;
    }
  }

  showErrorMessage() {
    if (this.quoteElement) {
      this.quoteElement.innerHTML = `
        <div class="quote-error">
          <p>Maaf, terjadi kesalahan saat memuat quotes.</p>
          <p>Mohon refresh halaman untuk mencoba lagi.</p>
        </div>
      `;
    }
  }

  showNoQuotesMessage() {
    if (this.quoteElement) {
      this.quoteElement.innerHTML = `
        <div class="quote-error">
          <p>Tidak ada quotes tersedia saat ini.</p>
        </div>
      `;
    }
  }

  displayQuote() {
    if (!this.quoteElement || this.quotes.length === 0) return;

    const quote = this.quotes[this.currentQuoteIndex];
    const quoteAuthor = document.querySelector('.quote-author');
    
    // Animasi fade out
    this.quoteElement.style.opacity = '0';
    
    setTimeout(() => {
      // Tampilkan quote baru
      this.quoteElement.innerHTML = `
        <div class="quote-content">
          <p class="quote-text-arabic" dir="rtl">${quote.arabic || ''}</p>
          <p class="quote-text-indonesia">${quote.text || ''}</p>
          ${quote.source ? `<p class="quote-source">${quote.source}</p>` : ''}
        </div>
      `;
      
      if (quoteAuthor) {
        quoteAuthor.textContent = quote.category || 'Islamic Quotes';
      }
      
      // Animasi fade in
      this.quoteElement.style.opacity = '1';
    }, 300);
  }

  startQuoteRotation() {
    // Rotasi quote setiap 10 detik
    setInterval(() => {
      this.nextQuote();
    }, 10000);
  }

  setupManualNavigation() {
    // Tambahkan tombol navigasi jika belum ada
    const quoteContainer = document.querySelector('.quote-container');
    if (quoteContainer && !quoteContainer.querySelector('.quote-navigation')) {
      const navigation = document.createElement('div');
      navigation.className = 'quote-navigation';
      navigation.innerHTML = `
        <button class="quote-nav-btn quote-prev" aria-label="Quote sebelumnya">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <button class="quote-nav-btn quote-next" aria-label="Quote berikutnya">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      `;
      
      quoteContainer.appendChild(navigation);
      
      // Event listeners
      navigation.querySelector('.quote-prev').addEventListener('click', () => this.previousQuote());
      navigation.querySelector('.quote-next').addEventListener('click', () => this.nextQuote());
    }
  }

  nextQuote() {
    if (this.quotes.length === 0) return;
    this.currentQuoteIndex = (this.currentQuoteIndex + 1) % this.quotes.length;
    this.displayQuote();
  }

  previousQuote() {
    if (this.quotes.length === 0) return;
    this.currentQuoteIndex = (this.currentQuoteIndex - 1 + this.quotes.length) % this.quotes.length;
    this.displayQuote();
  }
}

// Inisialisasi sistem quotes
document.addEventListener('DOMContentLoaded', () => {
  window.islamicQuotes = new IslamicQuotes();
});

// Export untuk penggunaan di modul lain
if (typeof module !== 'undefined' && module.exports) {
  module.exports = IslamicQuotes;
}