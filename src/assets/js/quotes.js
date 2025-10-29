// ===================================
// Islamic Quotes System with API
// ===================================

class IslamicQuotesManager {
    constructor() {
        this.quotes = [];
        this.currentIndex = 0;
        this.quoteText = document.getElementById('quote-text');
        this.quoteAuthor = document.getElementById('quote-author');
        this.prevBtn = document.getElementById('prev-quote');
        this.nextBtn = document.getElementById('next-quote');
        this.dotsContainer = document.getElementById('quote-dots');
        
        // Fallback quotes jika API gagal
        this.fallbackQuotes = [
            {
                content: "Carilah ilmu dari buaian hingga liang lahat.",
                author: "Nabi Muhammad SAW"
            },
            {
                content: "Sesungguhnya sesudah kesulitan itu ada kemudahan.",
                author: "QS. Al-Insyirah: 6"
            },
            {
                content: "Barangsiapa yang menempuh jalan untuk mencari ilmu, maka Allah akan mudahkan baginya jalan menuju surga.",
                author: "HR. Muslim"
            },
            {
                content: "Ilmu itu lebih baik daripada harta. Ilmu menjaga engkau dan engkau menjaga harta.",
                author: "Ali bin Abi Thalib"
            },
            {
                content: "Didiklah anak-anakmu sesuai dengan zamannya, karena mereka hidup bukan di zamanmu.",
                author: "Ali bin Abi Thalib"
            }
        ];
        
        this.init();
    }
    
    async init() {
        await this.fetchQuotes();
        this.setupEventListeners();
        this.createDots();
        this.displayQuote();
        this.startAutoRotate();
    }
    
    async fetchQuotes() {
        try {
            // Fetch quotes from multiple sources
            const responses = await Promise.allSettled([
                this.fetchFromQuotable(),
                this.fetchFromQuotesAPI()
            ]);
            
            // Combine successful responses
            responses.forEach(response => {
                if (response.status === 'fulfilled' && response.value) {
                    this.quotes = [...this.quotes, ...response.value];
                }
            });
            
            // If no quotes fetched, use fallback
            if (this.quotes.length === 0) {
                this.quotes = this.fallbackQuotes;
            }
            
        } catch (error) {
            console.error('Error fetching quotes:', error);
            this.quotes = this.fallbackQuotes;
        }
    }
    
    async fetchFromQuotable() {
        try {
            const tags = ['education', 'wisdom', 'inspirational'];
            const tag = tags[Math.floor(Math.random() * tags.length)];
            const response = await fetch(`https://api.quotable.io/quotes?tags=${tag}&limit=5`);
            
            if (!response.ok) throw new Error('Quotable API failed');
            
            const data = await response.json();
            return data.results.map(quote => ({
                content: quote.content,
                author: quote.author
            }));
        } catch (error) {
            console.error('Quotable API error:', error);
            return null;
        }
    }
    
    async fetchFromQuotesAPI() {
        try {
            const categories = ['education', 'success', 'inspirational'];
            const category = categories[Math.floor(Math.random() * categories.length)];
            const response = await fetch(`https://quotes.rest/qod?category=${category}`, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) throw new Error('Quotes API failed');
            
            const data = await response.json();
            if (data.contents && data.contents.quotes) {
                return data.contents.quotes.map(quote => ({
                    content: quote.quote,
                    author: quote.author
                }));
            }
            return null;
        } catch (error) {
            console.error('Quotes API error:', error);
            return null;
        }
    }
    
    setupEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.previousQuote());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextQuote());
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousQuote();
            if (e.key === 'ArrowRight') this.nextQuote();
        });
        
        // Touch swipe for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        const quoteBox = document.querySelector('.quote-box');
        if (quoteBox) {
            quoteBox.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });
            
            quoteBox.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe();
            });
        }
        
        this.handleSwipe = () => {
            if (touchEndX < touchStartX - 50) this.nextQuote();
            if (touchEndX > touchStartX + 50) this.previousQuote();
        };
    }
    
    createDots() {
        if (!this.dotsContainer) return;
        
        this.dotsContainer.innerHTML = '';
        this.quotes.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = 'quote-dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToQuote(index));
            this.dotsContainer.appendChild(dot);
        });
    }
    
    displayQuote() {
        if (this.quotes.length === 0) return;
        
        const quote = this.quotes[this.currentIndex];
        
        // Fade out
        if (this.quoteText) {
            this.quoteText.style.opacity = '0';
            this.quoteAuthor.style.opacity = '0';
        }
        
        setTimeout(() => {
            if (this.quoteText) {
                this.quoteText.textContent = quote.content;
                this.quoteAuthor.textContent = `- ${quote.author}`;
                
                // Fade in
                this.quoteText.style.opacity = '1';
                this.quoteAuthor.style.opacity = '1';
            }
            
            this.updateDots();
        }, 300);
    }
    
    updateDots() {
        const dots = document.querySelectorAll('.quote-dot');
        dots.forEach((dot, index) => {
            if (index === this.currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    nextQuote() {
        this.currentIndex = (this.currentIndex + 1) % this.quotes.length;
        this.displayQuote();
        this.resetAutoRotate();
    }
    
    previousQuote() {
        this.currentIndex = (this.currentIndex - 1 + this.quotes.length) % this.quotes.length;
        this.displayQuote();
        this.resetAutoRotate();
    }
    
    goToQuote(index) {
        this.currentIndex = index;
        this.displayQuote();
        this.resetAutoRotate();
    }
    
    startAutoRotate() {
        this.autoRotateInterval = setInterval(() => {
            this.nextQuote();
        }, 7000); // Change quote every 7 seconds
    }
    
    resetAutoRotate() {
        clearInterval(this.autoRotateInterval);
        this.startAutoRotate();
    }
}

// Initialize quotes when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new IslamicQuotesManager();
});
