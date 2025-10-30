/**
 * SMPIT Daarut Tarbiyah - Gallery & Interactive Components
 * Swiper.js initialization and enhanced interactions
 */

class SMPITGallery {
  constructor() {
    this.swiper = null;
    this.init();
  }

  init() {
    this.setupSwiper();
    this.setupGalleryInteractions();
    this.setupNewsInteractions();
    this.setupFacilityAnimations();
  }

  // ===================================
  // Swiper Gallery Initialization
  // ===================================
  
  setupSwiper() {
    if (typeof Swiper === 'undefined') {
      console.warn('Swiper.js not loaded');
      return;
    }

    // Check if gallery element exists
    const galleryElement = document.querySelector('.gallerySwiper');
    if (!galleryElement) {
      console.warn('Gallery element not found');
      return;
    }

    // Initialize Swiper with advanced effects
    this.swiper = new Swiper('.gallerySwiper', {
      // Effect configuration
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 'auto',
      coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      },
      
      // Navigation
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      
      // Pagination
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
      },
      
      // Autoplay
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      
      // Loop and transitions
      loop: true,
      speed: 800,
      
      // Responsive breakpoints
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 20,
          effect: 'slide',
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 30,
          effect: 'coverflow',
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 40,
          effect: 'coverflow',
        },
      },
      
      // Events
      on: {
        init: () => {
          this.onSwiperInit();
        },
        slideChange: () => {
          this.onSlideChange();
        },
        reachEnd: () => {
          this.onReachEnd();
        },
      },
    });
  }

  // ===================================
  // Swiper Event Handlers
  // ===================================
  
  onSwiperInit() {
    if (!this.swiper || !this.swiper.slides) {
      console.warn('Swiper or slides not available during init');
      return;
    }
    // Add initial animations
    const activeSlide = this.swiper.slides[this.swiper.activeIndex];
    if (activeSlide) {
      this.animateSlideContent(activeSlide);
    }
  }

  onSlideChange() {
    if (!this.swiper || !this.swiper.slides) {
      console.warn('Swiper or slides not available');
      return;
    }
    const activeSlide = this.swiper.slides[this.swiper.activeIndex];
    if (activeSlide) {
      this.animateSlideContent(activeSlide);
    }
  }

  onReachEnd() {
    // Optional: Add special effect when reaching the end
    console.log('Reached end of gallery');
  }

  // ===================================
  // Slide Content Animations
  // ===================================
  
  animateSlideContent(slide) {
    const overlay = slide.querySelector('.gallery-overlay');
    const title = slide.querySelector('.gallery-overlay h3');
    const description = slide.querySelector('.gallery-overlay p');
    
    if (overlay) {
      // Check if GSAP is available
      if (typeof gsap !== 'undefined') {
        // Reset animation
        gsap.set(overlay, { y: 100, opacity: 0 });
        
        // Animate in
        gsap.to(overlay, {
          duration: 0.8,
          y: 0,
          opacity: 1,
          ease: "power3.out",
          delay: 0.2,
        });
        
        if (title) {
          gsap.from(title, {
            duration: 0.6,
            y: 20,
            opacity: 0,
            ease: "power2.out",
            delay: 0.4,
          });
        }
        
        if (description) {
          gsap.from(description, {
            duration: 0.6,
            y: 20,
            opacity: 0,
            ease: "power2.out",
            delay: 0.6,
          });
        }
      } else {
        // Fallback CSS animation
        overlay.style.transform = 'translateY(100%)';
        overlay.style.opacity = '0';
        overlay.style.transition = 'all 0.8s ease';
        
        if (title) {
          title.style.transform = 'translateY(20px)';
          title.style.opacity = '0';
          title.style.transition = 'all 0.6s ease 0.4s';
        }
        
        if (description) {
          description.style.transform = 'translateY(20px)';
          description.style.opacity = '0';
          description.style.transition = 'all 0.6s ease 0.6s';
        }
        
        // Trigger animations
        setTimeout(() => {
          overlay.style.transform = 'translateY(0)';
          overlay.style.opacity = '1';
          
          if (title) {
            title.style.transform = 'translateY(0)';
            title.style.opacity = '1';
          }
          
          if (description) {
            description.style.transform = 'translateY(0)';
            description.style.opacity = '1';
          }
        }, 200);
      }
    }
  }

  // ===================================
  // Gallery Interactions
  // ===================================
  
  setupGalleryInteractions() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
      // Mouse enter effect
      item.addEventListener('mouseenter', (e) => {
        this.handleGalleryHover(e.currentTarget, true);
      });
      
      // Mouse leave effect
      item.addEventListener('mouseleave', (e) => {
        this.handleGalleryHover(e.currentTarget, false);
      });
      
      // Click to open fullscreen (optional)
      item.addEventListener('click', (e) => {
        this.handleGalleryClick(e.currentTarget);
      });
    });
  }

  handleGalleryHover(item, isEntering) {
    const img = item.querySelector('img');
    const overlay = item.querySelector('.gallery-overlay');
    
    if (isEntering) {
      // Enhanced hover effect
      if (img && typeof gsap !== 'undefined') {
        gsap.to(img, {
          duration: 0.6,
          scale: 1.1,
          ease: "power2.out",
        });
      }
      
      if (overlay && typeof gsap !== 'undefined') {
        gsap.to(overlay, {
          duration: 0.4,
          y: 0,
          ease: "power2.out",
        });
      }
    } else {
      // Reset effect
      if (img && typeof gsap !== 'undefined') {
        gsap.to(img, {
          duration: 0.6,
          scale: 1,
          ease: "power2.out",
        });
      }
      
      if (overlay && typeof gsap !== 'undefined') {
        gsap.to(overlay, {
          duration: 0.4,
          y: '100%',
          ease: "power2.out",
        });
      }
    }
  }

  handleGalleryClick(item) {
    // Optional: Open image in fullscreen or modal
    const img = item.querySelector('img');
    if (img) {
      // Create fullscreen view
      this.openFullscreenImage(img.src, img.alt);
    }
  }

  // ===================================
  // Fullscreen Image Viewer
  // ===================================
  
  openFullscreenImage(src, alt) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <img src="${src}" alt="${alt}" class="modal-image">
      </div>
    `;
    
    // Add styles
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    `;
    
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.cssText = `
      position: relative;
      max-width: 90%;
      max-height: 90%;
    `;
    
    const modalClose = modal.querySelector('.modal-close');
    modalClose.style.cssText = `
      position: absolute;
      top: -40px;
      right: 0;
      background: none;
      border: none;
      color: white;
      font-size: 2rem;
      cursor: pointer;
      padding: 10px;
    `;
    
    const modalImage = modal.querySelector('.modal-image');
    modalImage.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 8px;
    `;
    
    // Add to DOM
    document.body.appendChild(modal);
    
    // Animate in
    if (typeof gsap !== 'undefined') {
      gsap.from(modal, {
        duration: 0.3,
        opacity: 0,
        ease: "power2.out",
      });
      
      gsap.from(modalImage, {
        duration: 0.4,
        scale: 0.8,
        opacity: 0,
        ease: "back.out(1.7)",
        delay: 0.1,
      });
    }
    
    // Close handlers
    const closeModal = () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(modal, {
          duration: 0.3,
          opacity: 0,
          ease: "power2.in",
          onComplete: () => {
            document.body.removeChild(modal);
          },
        });
      } else {
        document.body.removeChild(modal);
      }
    };
    
    modal.addEventListener('click', closeModal);
    modalClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal();
    });
    
    // ESC key to close
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);
  }

  // ===================================
  // News Interactions
  // ===================================
  
  setupNewsInteractions() {
    const newsCards = document.querySelectorAll('.news-card');
    
    newsCards.forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        this.handleNewsHover(e.currentTarget, true);
      });
      
      card.addEventListener('mouseleave', (e) => {
        this.handleNewsHover(e.currentTarget, false);
      });
    });
  }

  handleNewsHover(card, isEntering) {
    const img = card.querySelector('.news-image img');
    const link = card.querySelector('.news-link');
    
    if (isEntering) {
      if (img && typeof gsap !== 'undefined') {
        gsap.to(img, {
          duration: 0.6,
          scale: 1.05,
          ease: "power2.out",
        });
      }
      
      if (link && typeof gsap !== 'undefined') {
        gsap.to(link, {
          duration: 0.3,
          x: 5,
          ease: "power2.out",
        });
      }
    } else {
      if (img && typeof gsap !== 'undefined') {
        gsap.to(img, {
          duration: 0.6,
          scale: 1,
          ease: "power2.out",
        });
      }
      
      if (link && typeof gsap !== 'undefined') {
        gsap.to(link, {
          duration: 0.3,
          x: 0,
          ease: "power2.out",
        });
      }
    }
  }

  // ===================================
  // Facility Animations
  // ===================================
  
  setupFacilityAnimations() {
    const facilityCards = document.querySelectorAll('.facility-card');
    
    facilityCards.forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        this.handleFacilityHover(e.currentTarget, true);
      });
      
      card.addEventListener('mouseleave', (e) => {
        this.handleFacilityHover(e.currentTarget, false);
      });
    });
  }

  handleFacilityHover(card, isEntering) {
    const icon = card.querySelector('.facility-icon');
    
    if (isEntering) {
      if (icon && typeof gsap !== 'undefined') {
        gsap.to(icon, {
          duration: 0.3,
          scale: 1.1,
          rotation: 5,
          ease: "power2.out",
        });
      }
    } else {
      if (icon && typeof gsap !== 'undefined') {
        gsap.to(icon, {
          duration: 0.3,
          scale: 1,
          rotation: 0,
          ease: "power2.out",
        });
      }
    }
  }

  // ===================================
  // Utility Methods
  // ===================================
  
  destroy() {
    if (this.swiper) {
      this.swiper.destroy(true, true);
      this.swiper = null;
    }
  }

  update() {
    if (this.swiper) {
      this.swiper.update();
    }
  }
}

// ===================================
// Initialize Gallery System
// ===================================

document.addEventListener('DOMContentLoaded', () => {
  // Wait for Swiper to load and DOM to be ready
  const initGallery = () => {
    if (typeof Swiper !== 'undefined') {
      // Add a small delay to ensure DOM is fully ready
      setTimeout(() => {
        window.smpitGallery = new SMPITGallery();
      }, 100);
    } else {
      setTimeout(initGallery, 100);
    }
  };
  
  initGallery();
});

// ===================================
// Handle Window Resize
// ===================================

window.addEventListener('resize', () => {
  if (window.smpitGallery) {
    window.smpitGallery.update();
  }
});

// ===================================
// Keyboard Navigation for Gallery
// ===================================

document.addEventListener('keydown', (e) => {
  if (!window.smpitGallery || !window.smpitGallery.swiper) return;
  
  const swiper = window.smpitGallery.swiper;
  
  switch(e.key) {
    case 'ArrowLeft':
      e.preventDefault();
      swiper.slidePrev();
      break;
    case 'ArrowRight':
      e.preventDefault();
      swiper.slideNext();
      break;
    case 'Home':
      e.preventDefault();
      swiper.slideTo(0);
      break;
    case 'End':
      e.preventDefault();
      swiper.slideTo(swiper.slides.length - 1);
      break;
  }
});

// ===================================
// Touch Gestures for Mobile
// ===================================

let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;
  
  if (Math.abs(diff) > swipeThreshold && window.smpitGallery && window.smpitGallery.swiper) {
    if (diff > 0) {
      // Swipe left - next slide
      window.smpitGallery.swiper.slideNext();
    } else {
      // Swipe right - previous slide
      window.smpitGallery.swiper.slidePrev();
    }
  }
}