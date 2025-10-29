/**
 * SMPIT Daarut Tarbiyah - Main JavaScript
 * High-Tech & High-Touch Interactive Experience
 */

class SMPITWebsite {
  constructor() {
    this.isMobile = window.innerWidth <= 768;
    this.init();
  }

  init() {
    this.setupHeader();
    this.setupNavigation();
    this.setupScrollAnimations();
    this.setupIntersectionObserver();
    this.setupMobileMenu();
    this.setupSmoothScrolling();
  }

  // ===================================
  // Header & Navigation Setup
  // ===================================
  
  setupHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    // Header scroll effect
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      lastScrollY = currentScrollY;
    });
  }

  setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      link.addEventListener('mouseenter', this.handleNavHover);
      link.addEventListener('mouseleave', this.handleNavLeave);
      link.addEventListener('click', this.handleNavClick);
    });
  }

  handleNavHover(e) {
    const link = e.currentTarget;
    const underline = link.querySelector('::before');
    
    // Add subtle upward movement
    link.style.transform = 'translateY(-2px)';
    
    // Enhanced hover effect for desktop
    if (!window.isMobile) {
      link.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }
  }

  handleNavLeave(e) {
    const link = e.currentTarget;
    link.style.transform = 'translateY(0)';
  }

  handleNavClick(e) {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    
    // Update active state
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    e.currentTarget.classList.add('active');
    
    // Smooth scroll to section
    if (href.startsWith('#')) {
      const target = document.querySelector(href);
      if (target) {
        this.smoothScrollTo(target);
      }
    } else {
      // Navigate to page
      window.location.href = href;
    }
  }

  // ===================================
  // Mobile Menu Setup
  // ===================================
  
  setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!menuToggle || !navMenu) return;
    
    menuToggle.addEventListener('click', () => {
      const isActive = navMenu.classList.contains('active');
      
      navMenu.classList.toggle('active');
      menuToggle.classList.toggle('active');
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = isActive ? 'auto' : 'hidden';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  }

  // ===================================
  // Scroll Animations Setup
  // ===================================
  
  setupScrollAnimations() {
    // Staggered animation for elements
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    animateElements.forEach((element, index) => {
      // Add stagger delay
      element.style.transitionDelay = `${index * 0.1}s`;
    });
  }

  setupIntersectionObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, options);

    // Observe all animatable elements
    const elements = document.querySelectorAll('.animate-on-scroll, .animate-slide-left, .animate-slide-right, .animate-stagger');
    elements.forEach(element => {
      observer.observe(element);
    });
  }

  animateElement(element) {
    element.classList.add('animated');
    
    // Special animations for different element types
    if (element.classList.contains('animate-slide-left')) {
      this.animateSlideIn(element, 'left');
    } else if (element.classList.contains('animate-slide-right')) {
      this.animateSlideIn(element, 'right');
    } else if (element.classList.contains('animate-stagger')) {
      this.animateStagger(element);
    }
  }

  animateSlideIn(element, direction) {
    const distance = this.isMobile ? 30 : 50;
    const startX = direction === 'left' ? -distance : distance;
    
    // Reset and animate
    element.style.transform = `translateX(${startX}px)`;
    element.style.opacity = '0';
    
    setTimeout(() => {
      element.style.transform = 'translateX(0)';
      element.style.opacity = '1';
    }, 100);
  }

  animateStagger(element) {
    const children = element.children;
    Array.from(children).forEach((child, index) => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        child.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        child.style.opacity = '1';
        child.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }

  // ===================================
  // Smooth Scrolling
  // ===================================
  
  setupSmoothScrolling() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          this.smoothScrollTo(target);
        }
      });
    });
  }

  smoothScrollTo(target) {
    const headerHeight = document.querySelector('.header')?.offsetHeight || 70;
    const targetPosition = target.offsetTop - headerHeight;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }

  // ===================================
  // Utility Methods
  // ===================================
  
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // ===================================
  // Performance Optimization
  // ===================================
  
  optimizeForMobile() {
    if (this.isMobile) {
      // Disable heavy animations on mobile
      document.querySelectorAll('.animate-on-scroll').forEach(element => {
        element.style.transition = 'all 0.3s ease';
      });
      
      // Reduce motion for better performance
      document.documentElement.style.setProperty('--transition-base', 'all 0.2s ease');
    }
  }

  // ===================================
  // Initialize Everything
  // ===================================
  
  ready() {
    // Optimize for mobile if needed
    this.optimizeForMobile();
    
    // Add loading complete class
    document.body.classList.add('loaded');
    
    // Trigger initial animations
    setTimeout(() => {
      this.setupScrollAnimations();
    }, 100);
  }
}

// ===================================
// Initialize when DOM is ready
// ===================================

document.addEventListener('DOMContentLoaded', () => {
  const website = new SMPITWebsite();
  website.ready();
});

// Handle resize events
window.addEventListener('resize', () => {
  // Debounce resize handler
  const handleResize = () => {
    const wasMobile = window.isMobile;
    window.isMobile = window.innerWidth <= 768;
    
    if (wasMobile !== window.isMobile) {
      // Re-initialize if mobile state changed
      location.reload();
    }
  };
  
  if (window.resizeTimeout) {
    clearTimeout(window.resizeTimeout);
  }
  
  window.resizeTimeout = setTimeout(handleResize, 250);
});

// ===================================
// Page Load Optimizations
// ===================================

window.addEventListener('load', () => {
  // Remove loading states
  document.querySelectorAll('.loading').forEach(element => {
    element.classList.remove('loading');
  });
  
  // Preload critical resources
  const criticalImages = document.querySelectorAll('[data-critical="true"]');
  criticalImages.forEach(img => {
    if (img.dataset.src) {
      img.src = img.dataset.src;
    }
  });
});

// ===================================
// Error Handling
// ===================================

window.addEventListener('error', (e) => {
  console.error('SMPIT Website Error:', e.error);
});

// ===================================
// Service Worker Registration (Optional)
// ===================================

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/smpit-dti-web/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}