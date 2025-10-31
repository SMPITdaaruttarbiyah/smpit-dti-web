// ===================================
// Main JavaScript - SMPIT Daarut Tarbiyah
// ===================================

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ===================================
// Initialize Application
// ===================================
function initializeApp() {
    initLoader();
    initNavigation();
    initScrollEffects();
    initAnimations();
    initStatistics();
    initBackToTop();
    initAOS();
    initDynamicYear();
    initSmoothScroll();
    initImageErrorHandling();
}

// ===================================
// Loading Screen
// ===================================
function initLoader() {
    const loader = document.getElementById('loading-screen');
    
    // Hide loader when page is fully loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 300);
        }, 1000);
    });
    
    // Fallback: Hide loader after max 3 seconds
    setTimeout(() => {
        if (loader.style.display !== 'none') {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 300);
        }
    }, 3000);
}

// ===================================
// Navigation - Enhanced with Body Scroll Lock
// ===================================
function initNavigation() {
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle with body scroll lock
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open'); // Prevent scroll when menu open
            
            // Update aria-expanded for accessibility
            const isExpanded = menuToggle.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });
    }
    
    // Close menu when link clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menuToggle) {
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open'); // Re-enable scroll
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const isClickInsideNav = navMenu.contains(e.target);
        const isClickOnToggle = menuToggle && menuToggle.contains(e.target);
        
        if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            if (menuToggle) {
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });
    
    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    function setActiveLink() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', setActiveLink);
    
    // Initial call to set active link
    setActiveLink();
}

// ===================================
// Scroll Effects - Enhanced
// ===================================
function initScrollEffects() {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    let ticking = false;
    
    function updateHeader() {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll (only on desktop)
        if (window.innerWidth > 768) {
            if (currentScroll > lastScroll && currentScroll > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });
}

// ===================================
// Animations - Intersection Observer
// ===================================
function initAnimations() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Stagger animation for children
                const staggerElements = entry.target.querySelectorAll('.animate-stagger');
                staggerElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('animated');
                    }, index * 100);
                });
                
                // Unobserve after animation (performance optimization)
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animatedElements = document.querySelectorAll('.animate-on-scroll, .animate-slide-left, .animate-slide-right');
    animatedElements.forEach(el => observer.observe(el));
}

// ===================================
// Statistics Counter with Animation
// ===================================
function initStatistics() {
    const counters = document.querySelectorAll('.stat-number');
    let hasAnimated = false;
    
    const animateCounters = () => {
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
    };
    
    // Intersection Observer for statistics
    const statsSection = document.querySelector('#statistics');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }
}

// ===================================
// Back to Top Button - Enhanced Version
// ===================================
function initBackToTop() {
    // Remove existing button if any
    const existingBtn = document.getElementById('back-to-top');
    if (existingBtn) {
        existingBtn.remove();
    }
    
    // Create new button with better icon
    const btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Kembali ke atas');
    btn.setAttribute('title', 'Kembali ke atas');
    btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 15l-6-6-6 6"/>
        </svg>
    `;
    document.body.appendChild(btn);
    
    const button = document.getElementById('back-to-top');
    const footer = document.querySelector('.footer');
    let isScrolling = false;
    
    function checkScroll() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const windowHeight = window.innerHeight;
                const documentHeight = document.documentElement.scrollHeight;
                const footerHeight = footer ? footer.offsetHeight : 0;
                
                // Show button when scrolled 50% of viewport height
                if (scrollTop > windowHeight * 0.5) {
                    button.classList.add('visible');
                    
                    // Adjust position when near footer
                    if ((scrollTop + windowHeight) >= (documentHeight - footerHeight - 100)) {
                        button.classList.add('near-footer');
                    } else {
                        button.classList.remove('near-footer');
                    }
                } else {
                    button.classList.remove('visible');
                    button.classList.remove('near-footer');
                }
                
                isScrolling = false;
            });
            isScrolling = true;
        }
    }
    
    // Throttled scroll event
    window.addEventListener('scroll', checkScroll);
    
    // Smooth scroll to top
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Add click animation
        button.style.transform = 'scale(0.9)';
        setTimeout(() => {
            button.style.transform = '';
        }, 200);
        
        // Focus management for accessibility
        setTimeout(() => {
            const mainContent = document.querySelector('main');
            if (mainContent) {
                mainContent.focus();
            }
        }, 500);
    });
    
    // Keyboard accessibility
    button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            button.click();
        }
    });
    
    // Initial check
    checkScroll();
}

// ===================================
// Initialize AOS (Animate On Scroll)
// ===================================
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
            offset: 100,
            delay: 0,
            anchorPlacement: 'top-bottom'
        });
        
        // Refresh AOS on window resize
        window.addEventListener('resize', () => {
            AOS.refresh();
        });
    }
}

// ===================================
// Dynamic Year in Footer
// ===================================
function initDynamicYear() {
    const yearElement = document.getElementById('current-year');
    const currentYear = new Date().getFullYear();
    
    if (yearElement) {
        yearElement.textContent = currentYear;
    } else {
        // If element doesn't exist, find footer text and update
        const footerBottom = document.querySelector('.footer-bottom p');
        if (footerBottom) {
            footerBottom.innerHTML = footerBottom.innerHTML.replace(/202[0-9]/g, currentYear);
        }
    }
}

// ===================================
// Smooth Scroll for Anchor Links
// ===================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignore if href is just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80; // Account for fixed header
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                if (history.pushState) {
                    history.pushState(null, null, href);
                }
            }
        });
    });
}

// ===================================
// Image Error Handling
// ===================================
function initImageErrorHandling() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Create placeholder if image fails to load
            if (!this.classList.contains('error-handled')) {
                this.classList.add('error-handled');
                
                // Option 1: Use a placeholder image
                // this.src = '/assets/images/placeholder.jpg';
                
                // Option 2: Hide the image
                this.style.display = 'none';
                
                // Option 3: Show alt text in a styled div
                const placeholder = document.createElement('div');
                placeholder.className = 'image-placeholder';
                placeholder.textContent = this.alt || 'Image not available';
                placeholder.style.cssText = `
                    background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 200px;
                    color: #4a5568;
                    font-weight: 500;
                    border-radius: 8px;
                `;
                
                if (this.parentNode) {
                    this.parentNode.insertBefore(placeholder, this);
                }
                
                console.warn('Failed to load image:', this.src);
            }
        });
    });
}

// ===================================
// Utility Functions
// ===================================

// Debounce function for performance
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Throttle function for scroll events
function throttle(func, limit = 100) {
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
// Performance Monitoring (Optional)
// ===================================
if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const connectTime = perfData.responseEnd - perfData.requestStart;
        const renderTime = perfData.domComplete - perfData.domLoading;
        
        console.log('⚡ Performance Metrics:');
        console.log(`Page Load Time: ${pageLoadTime}ms`);
        console.log(`Server Response Time: ${connectTime}ms`);
        console.log(`DOM Render Time: ${renderTime}ms`);
    });
}

// ===================================
// Error Handling
// ===================================
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    // You can send this to an error tracking service
    // Example: sendErrorToTrackingService(e.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    // You can send this to an error tracking service
});

// ===================================
// Visibility Change Handler
// ===================================
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden - pause animations, videos, etc.
        console.log('Page hidden');
    } else {
        // Page is visible - resume animations
        console.log('Page visible');
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }
});

// ===================================
// Resize Handler with Debounce
// ===================================
window.addEventListener('resize', debounce(function() {
    // Refresh AOS
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
    
    // Close mobile menu on resize to desktop
    const navMenu = document.querySelector('.nav-menu');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        if (menuToggle) {
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
        document.body.classList.remove('menu-open');
    }
}, 250));

// ===================================
// Page Unload Handler
// ===================================
window.addEventListener('beforeunload', function() {
    // Clean up if needed
    console.log('Page unloading...');
});

// ===================================
// Export functions for external use (if needed)
// ===================================
window.SMPITApp = {
    initBackToTop,
    initAOS,
    debounce,
    throttle
};

// ===================================
// Console Welcome Message
// ===================================
console.log('%c🎓 SMPIT Daarut Tarbiyah Indonesia', 'color: #0A3D73; font-size: 20px; font-weight: bold;');
console.log('%c✨ Website berhasil dimuat!', 'color: #1E9E44; font-size: 14px;');
console.log('%cDeveloped with ❤️ for better education', 'color: #666; font-size: 12px;');
