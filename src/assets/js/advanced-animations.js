/**
 * SMPIT Daarut Tarbiyah - Advanced Animations & Interactions
 * High-Tech & High-Touch Experience with GSAP
 */

class SMPITAdvancedAnimations {
  constructor() {
    this.isMobile = window.innerWidth <= 768;
    this.quotes = [
      { text: "Carilah ilmu dari buaian hingga liang lahat.", author: "Nabi Muhammad SAW" },
      { text: "Siapa yang menempuh jalan untuk mencari ilmu, maka Allah akan mudahkan baginya jalan menuju surga.", author: "Nabi Muhammad SAW" },
      { text: "Ilmu adalah harta yang selalu bertambah saat dibagikan.", author: "Ali bin Abi Thalib" },
      { text: "Tinta orang alim lebih suci dari darah martir.", author: "Nabi Muhammad SAW" },
      { text: "Menuntut ilmu adalah kewajiban bagi setiap muslim.", author: "Nabi Muhammad SAW" }
    ];
    this.currentQuoteIndex = 0;
    this.init();
  }

  init() {
    this.setupGSAP();
    this.setupScrollTrigger();
    this.setupTypewriterEffect();
    this.setupCounterAnimation();
    this.setupQuoteRotation();
    this.setupParallaxEffects();
    this.setupMagneticButtons();
    this.setupStaggeredAnimations();
  }

  // ===================================
  // GSAP Setup & Configuration
  // ===================================
  
  setupGSAP() {
    // Register GSAP plugins
    if (typeof gsap !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      
      // Set default easing
      gsap.defaults({
        ease: "power3.out"
      });
    }
  }

  // ===================================
  // ScrollTrigger Animations
  // ===================================
  
  setupScrollTrigger() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      this.fallbackAnimations();
      return;
    }

    // Hero section animations
    gsap.from(".hero-title", {
      duration: 1.2,
      y: 50,
      opacity: 0,
      ease: "power3.out",
      delay: 0.3
    });

    gsap.from(".hero-subtitle", {
      duration: 1.2,
      y: 30,
      opacity: 0,
      ease: "power3.out",
      delay: 0.6
    });

    gsap.from(".hero-cta", {
      duration: 1.2,
      y: 30,
      opacity: 0,
      ease: "power3.out",
      delay: 0.9
    });

    // Profile section staggered animations
    gsap.from(".highlight-item", {
      scrollTrigger: {
        trigger: ".profile-highlights",
        start: "top 80%",
        toggleActions: "play none none reverse"
      },
      duration: 0.8,
      y: 40,
      opacity: 0,
      stagger: 0.2,
      ease: "power2.out"
    });

    // Vision & Mission slide-in animations
    gsap.from(".vision-card", {
      scrollTrigger: {
        trigger: ".vision-mission-grid",
        start: "top 80%",
        toggleActions: "play none none reverse"
      },
      duration: 1,
      x: -80,
      opacity: 0,
      ease: "power3.out"
    });

    gsap.from(".mission-card", {
      scrollTrigger: {
        trigger: ".vision-mission-grid",
        start: "top 80%",
        toggleActions: "play none none reverse"
      },
      duration: 1,
      x: 80,
      opacity: 0,
      ease: "power3.out"
    });

    // Mission list items pop-in animation
    gsap.from(".mission-list li", {
      scrollTrigger: {
        trigger: ".mission-card",
        start: "top 70%",
        toggleActions: "play none none reverse"
      },
      duration: 0.6,
      scale: 0.8,
      opacity: 0,
      stagger: 0.15,
      ease: "back.out(1.7)"
    });

    // Quote box animation
    gsap.from(".quote-box", {
      scrollTrigger: {
        trigger: ".quotes-container",
        start: "top 80%",
        toggleActions: "play none none reverse"
      },
      duration: 1.2,
      scale: 0.9,
      opacity: 0,
      ease: "power2.out"
    });

    // Statistics counter animation
    gsap.from(".stat-item", {
      scrollTrigger: {
        trigger: ".stats-grid",
        start: "top 80%",
        toggleActions: "play none none reverse"
      },
      duration: 0.8,
      y: 30,
      opacity: 0,
      stagger: 0.1,
      ease: "power2.out",
      onComplete: () => this.animateCounters()
    });

    // Contact section animations
    gsap.from(".contact-item", {
      scrollTrigger: {
        trigger: ".contact-info",
        start: "top 80%",
        toggleActions: "play none none reverse"
      },
      duration: 0.8,
      x: -30,
      opacity: 0,
      stagger: 0.2,
      ease: "power2.out"
    });

    gsap.from(".map-container", {
      scrollTrigger: {
        trigger: ".contact-map",
        start: "top 80%",
        toggleActions: "play none none reverse"
      },
      duration: 1,
      scale: 0.9,
      opacity: 0,
      ease: "power2.out"
    });
  }

  // ===================================
  // Typewriter Effect for Quotes
  // ===================================
  
  setupTypewriterEffect() {
    this.typeWriter(this.quotes[0].text, 'quote-text', 50);
  }

  typeWriter(text, elementId, speed) {
    const element = document.getElementById(elementId);
    if (!element) return;

    element.style.width = '0';
    element.style.overflow = 'hidden';
    element.style.whiteSpace = 'nowrap';
    element.style.borderRight = '2px solid var(--hijau-pertumbuhan)';
    element.style.animation = 'blink 1s infinite';

    let i = 0;
    const type = () => {
      if (i < text.length) {
        element.textContent = text.substring(0, i + 1);
        i++;
        setTimeout(type, speed);
      } else {
        element.style.borderRight = 'none';
        element.style.animation = 'none';
        element.style.whiteSpace = 'normal';
      }
    };

    type();
  }

  // ===================================
  // Quote Rotation System
  // ===================================
  
  setupQuoteRotation() {
    setInterval(() => {
      this.rotateQuote();
    }, 8000); // Rotate every 8 seconds
  }

  rotateQuote() {
    this.currentQuoteIndex = (this.currentQuoteIndex + 1) % this.quotes.length;
    const quote = this.quotes[this.currentQuoteIndex];
    
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    
    if (quoteText && quoteAuthor) {
      // Fade out current quote
      gsap.to(quoteText, {
        duration: 0.5,
        opacity: 0,
        y: -10,
        ease: "power2.in",
        onComplete: () => {
          // Update content
          quoteText.textContent = quote.text;
          quoteAuthor.textContent = `- ${quote.author}`;
          
          // Fade in new quote
          gsap.to(quoteText, {
            duration: 0.5,
            opacity: 1,
            y: 0,
            ease: "power2.out"
          });
          
          gsap.to(quoteAuthor, {
            duration: 0.5,
            opacity: 1,
            delay: 0.2,
            ease: "power2.out"
          });
        }
      });
      
      // Fade out author
      gsap.to(quoteAuthor, {
        duration: 0.3,
        opacity: 0,
        ease: "power2.in"
      });
    }
  }

  // ===================================
  // Counter Animation for Statistics
  // ===================================
  
  setupCounterAnimation() {
    // Counter animation will be triggered by ScrollTrigger
  }

  animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // 60fps
      let current = 0;
      
      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.ceil(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };
      
      updateCounter();
    });
  }

  // ===================================
  // Parallax Effects
  // ===================================
  
  setupParallaxEffects() {
    if (this.isMobile) return; // Disable parallax on mobile
    
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallax = hero.querySelector('.hero-content');
      
      if (parallax) {
        const speed = 0.5;
        parallax.style.transform = `translateY(${scrolled * speed}px)`;
      }
    });
  }

  // ===================================
  // Magnetic Buttons Effect
  // ===================================
  
  setupMagneticButtons() {
    const buttons = document.querySelectorAll('.hero-cta, .social-link');
    
    buttons.forEach(button => {
      button.addEventListener('mousemove', (e) => {
        if (this.isMobile) return;
        
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(button, {
          duration: 0.3,
          x: x * 0.2,
          y: y * 0.2,
          ease: "power2.out"
        });
      });
      
      button.addEventListener('mouseleave', () => {
        gsap.to(button, {
          duration: 0.5,
          x: 0,
          y: 0,
          ease: "elastic.out(1, 0.3)"
        });
      });
    });
  }

  // ===================================
  // Staggered Animations
  // ===================================
  
  setupStaggeredAnimations() {
    // Add staggered animations to various elements
    const staggerElements = document.querySelectorAll('.animate-stagger');
    
    staggerElements.forEach(container => {
      const children = container.children;
      
      gsap.from(children, {
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
          toggleActions: "play none none reverse"
        },
        duration: 0.6,
        y: 30,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.out"
      });
    });
  }

  // ===================================
  // Fallback Animations (No GSAP)
  // ===================================
  
  fallbackAnimations() {
    // Basic CSS animations as fallback
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll, .animate-slide-left, .animate-slide-right').forEach(el => {
      observer.observe(el);
    });
  }

  // ===================================
  // Performance Optimization
  // ===================================
  
  optimizeForMobile() {
    if (this.isMobile) {
      // Reduce animation complexity on mobile
      gsap.globalTimeline.timeScale(1.5); // Speed up animations
      
      // Disable heavy effects
      document.querySelectorAll('.parallax').forEach(el => {
        el.style.transform = 'none';
      });
    }
  }

  // ===================================
  // Initialize Everything
  // ===================================
  
  ready() {
    this.optimizeForMobile();
    
    // Add loaded class to body
    setTimeout(() => {
      document.body.classList.add('loaded');
    }, 100);
  }
}

// ===================================
// Initialize Advanced Animations
// ===================================

document.addEventListener('DOMContentLoaded', () => {
  // Wait for GSAP to load
  const initAdvancedAnimations = () => {
    if (typeof gsap !== 'undefined') {
      const advancedAnimations = new SMPITAdvancedAnimations();
      advancedAnimations.ready();
    } else {
      // Retry after a short delay
      setTimeout(initAdvancedAnimations, 100);
    }
  };
  
  initAdvancedAnimations();
});

// ===================================
// Enhanced Navigation Interactions
// ===================================

class EnhancedNavigation {
  constructor() {
    this.init();
  }

  init() {
    this.setupSmoothScroll();
    this.setupActiveSectionHighlight();
    this.setupMobileGestures();
  }

  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          const headerHeight = document.querySelector('.header')?.offsetHeight || 70;
          const targetPosition = target.offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  setupActiveSectionHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    const highlightActiveSection = () => {
      const scrollY = window.pageYOffset;
      
      sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    };
    
    window.addEventListener('scroll', highlightActiveSection);
  }

  setupMobileGestures() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    });
    
    this.handleSwipe = () => {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) > swipeThreshold) {
        const navMenu = document.querySelector('.nav-menu');
        const menuToggle = document.querySelector('.menu-toggle');
        
        if (diff > 0 && navMenu.classList.contains('active')) {
          // Swipe left - close menu
          navMenu.classList.remove('active');
          menuToggle.classList.remove('active');
          document.body.style.overflow = 'auto';
        }
      }
    };
  }
}

// ===================================
// Initialize Enhanced Navigation
// ===================================

document.addEventListener('DOMContentLoaded', () => {
  new EnhancedNavigation();
});

// ===================================
// Loading Optimization
// ===================================

window.addEventListener('load', () => {
  // Remove loading states
  document.querySelectorAll('.loading').forEach(el => {
    el.classList.remove('loading');
  });
  
  // Preload critical images
  const criticalImages = document.querySelectorAll('[data-critical="true"]');
  criticalImages.forEach(img => {
    if (img.dataset.src) {
      img.src = img.dataset.src;
    }
  });
});