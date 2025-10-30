/**
 * SMPIT Daarut Tarbiyah - Local Islamic Quotes
 * Quotes tentang ilmu dari sumber terpercaya
 */

// Database quotes lokal tentang ilmu
const localQuotes = [
  {
    id: 1,
    text: "Menuntut ilmu itu wajib atas setiap muslim.",
    arabic: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ",
    source: "HR. Ibnu Majah No. 224",
    status: "Shahih",
    category: "Kewajiban Menuntut Ilmu",
    explanation: "Hadits ini menegaskan bahwa menuntut ilmu adalah kewajiban individual bagi setiap muslim."
  },
  {
    id: 2,
    text: "Barangsiapa menempuh jalan untuk mencari ilmu, maka Allah akan memudahkan baginya jalan ke surga.",
    arabic: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    source: "HR. Muslim No. 2699",
    status: "Shahih",
    category: "Keutamaan Menuntut Ilmu",
    explanation: "Allah menjanjikan kemudahan jalan ke surga bagi mereka yang bersungguh-sungguh mencari ilmu."
  },
  {
    id: 3,
    text: "Barangsiapa yang Allah kehendaki kebaikan padanya, maka Allah akan memahamkannya dalam urusan agama.",
    arabic: "مَنْ يُرِدِ اللَّهُ بِهِ خَيْرًا يُفَقِّهْهُ فِي الدِّينِ",
    source: "HR. Bukhari No. 71, Muslim No. 1037",
    status: "Shahih - Muttafaq 'Alaih",
    category: "Tanda Kebaikan",
    explanation: "Pemahaman mendalam tentang agama adalah tanda bahwa Allah menghendaki kebaikan pada seseorang."
  },
  {
    id: 4,
    text: "Sesungguhnya para ulama adalah pewaris para nabi. Para nabi tidak mewariskan dinar atau dirham, namun mereka mewariskan ilmu.",
    arabic: "إِنَّ الْعُلَمَاءَ وَرَثَةُ الْأَنْبِيَاءِ، إِنَّ الْأَنْبِيَاءَ لَمْ يُوَرِّثُوا دِينَارًا وَلَا دِرْهَمًا، إِنَّمَا وَرَّثُوا الْعِلْمَ، فَمَنْ أَخَذَهُ أَخَذَ بِحَظٍّ وَافِرٍ",
    source: "HR. Abu Dawud No. 3641, Tirmidzi No. 2682",
    status: "Shahih",
    category: "Kedudukan Ulama",
    explanation: "Ilmu adalah warisan terbesar dari para nabi, lebih berharga dari harta benda."
  },
  {
    id: 5,
    text: "Barangsiapa keluar untuk mencari ilmu, maka ia berada di jalan Allah hingga ia kembali.",
    arabic: "مَنْ خَرَجَ فِي طَلَبِ الْعِلْمِ فَهُوَ فِي سَبِيلِ اللَّهِ حَتَّى يَرْجِعَ",
    source: "HR. Tirmidzi No. 2647",
    status: "Shahih",
    category: "Jihad Ilmu",
    explanation: "Mencari ilmu dianggap sebagai jihad fi sabilillah, ibadah yang sangat mulia."
  },
  {
    id: 6,
    text: "Sebaik-baik kalian adalah orang yang mempelajari Al-Qur'an dan mengajarkannya.",
    arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    source: "HR. Bukhari No. 5027",
    status: "Shahih",
    category: "Pembelajaran Al-Qur'an",
    explanation: "Mempelajari dan mengajarkan Al-Qur'an adalah amalan terbaik dalam Islam."
  },
  {
    id: 7,
    text: "Keutamaan orang yang berilmu atas orang yang beribadah seperti keutamaan bulan purnama atas seluruh bintang.",
    arabic: "فَضْلُ الْعَالِمِ عَلَى الْعَابِدِ كَفَضْلِ الْقَمَرِ لَيْلَةَ الْبَدْرِ عَلَى سَائِرِ الْكَوَاكِبِ",
    source: "HR. Abu Dawud No. 3641, Tirmidzi No. 2682",
    status: "Shahih",
    category: "Keutamaan Ilmu",
    explanation: "Orang berilmu memiliki kedudukan yang sangat tinggi, bahkan melebihi ahli ibadah."
  },
  {
    id: 8,
    text: "Ilmu itu diperoleh dengan belajar, dan kesabaran itu diperoleh dengan melatih kesabaran.",
    arabic: "إِنَّمَا الْعِلْمُ بِالتَّعَلُّمِ، وَإِنَّمَا الْحِلْمُ بِالتَّحَلُّمِ",
    source: "HR. Bukhari dalam Al-Adab Al-Mufrad No. 594",
    status: "Shahih",
    category: "Proses Belajar",
    explanation: "Ilmu dan karakter sabar keduanya memerlukan proses pembelajaran dan latihan."
  },
  {
    id: 9,
    text: "Barangsiapa meniti suatu jalan untuk mendapatkan ilmu, niscaya Allah akan memudahkan baginya jalan ke surga.",
    arabic: "مَنْ سَلَكَ طَرِيقًا يَبْتَغِي فِيهِ عِلْمًا سَلَكَ اللَّهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    source: "HR. Ibnu Majah No. 225",
    status: "Shahih",
    category: "Jalan ke Surga",
    explanation: "Setiap langkah mencari ilmu adalah langkah menuju surga."
  },
  {
    id: 10,
    text: "Apabila manusia telah mati, maka terputuslah amalannya kecuali tiga hal: sedekah jariyah, ilmu yang bermanfaat, atau anak shalih yang mendoakannya.",
    arabic: "إِذَا مَاتَ الْإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلَّا مِنْ ثَلَاثَةٍ: إِلَّا مِنْ صَدَقَةٍ جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ",
    source: "HR. Muslim No. 1631",
    status: "Shahih",
    category: "Amal Jariyah",
    explanation: "Ilmu yang bermanfaat adalah amal yang pahalanya terus mengalir setelah kematian."
  }
];

/**
 * SMPIT Daarut Tarbiyah - Local Islamic Quotes System
 * Menggunakan quotes lokal tentang ilmu
 */

class LocalIslamicQuotes {
  constructor() {
    this.quotes = [];
    this.currentQuoteIndex = 0;
    this.quoteElement = null;
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
      // Gunakan quotes lokal
      this.quotes = localQuotes;
      
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

  async filterIlmuQuotes() {
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
      this.quotes = localQuotes.filter(quote => {
        const text = (quote.text || '').toLowerCase();
        const explanation = (quote.explanation || '').toLowerCase();
        
        return educationKeywords.some(keyword => 
          text.includes(keyword) || 
          explanation.includes(keyword)
        );
      });
    }

    // Jika masih kosong, gunakan semua quotes
    if (this.quotes.length === 0) {
      this.quotes = localQuotes;
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

// Inisialisasi sistem quotes lokal
document.addEventListener('DOMContentLoaded', () => {
  window.localIslamicQuotes = new LocalIslamicQuotes();
});

// Export untuk penggunaan di modul lain
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LocalIslamicQuotes;
}