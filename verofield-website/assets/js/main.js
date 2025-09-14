/* VeroField Website - Main JavaScript */
/* Core functionality extracted from inline scripts for optimization */

// Define reCAPTCHA callback function immediately to prevent loading errors
window.onRecaptchaLoad = function() {
  console.log('reCAPTCHA script loaded');
  // Hide the reCAPTCHA badge
  const badge = document.querySelector('.grecaptcha-badge');
  if (badge) {
    badge.style.display = 'none';
  }
  
  // Add error handling for reCAPTCHA global errors
  try {
    if (typeof grecaptcha !== 'undefined') {
      // Wrap grecaptcha.ready to catch any internal promise rejections
      const originalReady = grecaptcha.ready;
      grecaptcha.ready = function(callback) {
        try {
          return originalReady.call(this, callback);
        } catch (error) {
          console.error('reCAPTCHA ready error:', error);
          // Still call the callback to prevent hanging
          if (typeof callback === 'function') {
            setTimeout(callback, 0);
          }
        }
      };
    }
  } catch (error) {
    console.error('Error setting up reCAPTCHA error handling:', error);
  }
};

document.addEventListener('DOMContentLoaded', () => {

   // ===== Helpers =====
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

  // Mark decorative Font Awesome icons as aria-hidden if no label present
  document.querySelectorAll('i.fas, i.far, i.fab, i.fa').forEach(icon => {
    if (!icon.hasAttribute('aria-label') && !icon.hasAttribute('role')) {
      icon.setAttribute('aria-hidden', 'true');
    }
  });

  // ===== Sections =====
  const sections = $$('section[id].page-section');

  // Smooth scrolling for anchor links
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href.length <= 1) return;
      const target = document.getElementById(href.slice(1));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  // ===== Progress Bar =====
  const progressBar = document.getElementById('progressBar');
  const onScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    const max = (document.documentElement.scrollHeight - window.innerHeight);
    const pct = max > 0 ? (scrollTop / max) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ===== Parallax (guarded) =====
  const parallaxEl = $('.hero-gradient');
  let ticking = false;
  const updateParallax = () => {
    if (!parallaxEl) return;
    const y = (window.pageYOffset || 0) * 0.2;
    parallaxEl.style.transform = `translateY(${y}px)`;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });

  // ===== Hover micro-interactions =====
  $$('.feature-card, .bg-white\\/5').forEach(card => {
    card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-4px) scale(1.02)');
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });

  // ===== Accessibility =====
  // Ensure sections have scroll margin so content isn't hidden under sticky headers (if any)
  sections.forEach(sec => sec.style.scrollMarginTop = '80px');

  // ===== Video Handling =====
  const video = document.getElementById('demoVideo');
  if (video) {
    // Force load the first frame
    video.addEventListener('loadedmetadata', function() {
        video.currentTime = 0.1; // Go to 0.1 seconds to get a frame
    });
    
    // Ensure video loads
    video.load();
  }

  // ===== Lazy Loading for Images =====
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.add('loaded');
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      }
    });
  });

  // Observe all images with data-src attribute
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });

  // ===== Error Handling for Missing Images =====
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      this.style.display = 'none';
      // Create fallback placeholder
      const placeholder = document.createElement('div');
      placeholder.className = 'bg-slate-700 rounded-lg flex items-center justify-center text-slate-400';
      placeholder.style.width = this.style.width || '100%';
      placeholder.style.height = this.style.height || '200px';
      placeholder.innerHTML = '<i class="fas fa-image text-2xl"></i>';
      this.parentNode.insertBefore(placeholder, this);
    });
  });

  // Ensure visibility immediately to avoid hidden content
  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => el.classList.add('visible'));

  // ===== Lazy load video when in viewport =====
  if (video) {
    const vio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !video.querySelector('source')) {
          const source = document.createElement('source');
          source.src = 'assets/videos/demo_1_optimized.mp4';
          source.type = 'video/mp4';
          video.appendChild(source);
          video.load();
          vio.disconnect();
        }
      });
    }, { threshold: 0.1 });
    vio.observe(video);
  }

  // ===== Learn More Modal =====
  window.openLearnMoreModal = function() {
    const modal = document.getElementById('learnMoreModal');
    if (!modal) return;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    const focusable = modal.querySelector('.modal-content');
    if (focusable) focusable.focus();
  };
  
  window.closeLearnMoreModal = function() {
    const modal = document.getElementById('learnMoreModal');
    if (!modal) return;
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  };

  // ===== Waitlist Modal =====
  window.openWaitlistModal = function() {
    const modal = document.getElementById('waitlistModal');
    if (!modal) return;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Hide floating button when modal is open
    const floatingButton = document.getElementById('floatingWaitlistButton');
    if (floatingButton) {
      floatingButton.style.display = 'none';
    }
    
    // Set form start time for bot protection
    const form = document.getElementById('waitlistForm');
    if (form) {
      form.dataset.startTime = Date.now();
    }
    
    const focusable = modal.querySelector('.modal-content');
    if (focusable) focusable.focus();
  };
  
  window.closeWaitlistModal = function() {
    const modal = document.getElementById('waitlistModal');
    if (!modal) return;
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Show floating button when modal is closed
    const floatingButton = document.getElementById('floatingWaitlistButton');
    if (floatingButton) {
      floatingButton.style.display = 'block';
    }
  };

  // ===== Getting Started Modal =====
  window.openGettingStartedModal = function() {
    const modal = document.getElementById('gettingStartedModal');
    if (!modal) return;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    const focusable = modal.querySelector('.modal-content');
    if (focusable) focusable.focus();
  };
  
  window.closeGettingStartedModal = function() {
    const modal = document.getElementById('gettingStartedModal');
    if (!modal) return;
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  };
  
  // Close modals when clicking outside and handle Escape/focus trap
  window.addEventListener('click', function(event) {
    const learnMoreModal = document.getElementById('learnMoreModal');
    const waitlistModal = document.getElementById('waitlistModal');
    const gettingStartedModal = document.getElementById('gettingStartedModal');
    
    if (learnMoreModal && event.target === learnMoreModal) closeLearnMoreModal();
    if (waitlistModal && event.target === waitlistModal) closeWaitlistModal();
    if (gettingStartedModal && event.target === gettingStartedModal) closeGettingStartedModal();
  });
  
  document.addEventListener('keydown', function(event) {
    const learnMoreModal = document.getElementById('learnMoreModal');
    const waitlistModal = document.getElementById('waitlistModal');
    const gettingStartedModal = document.getElementById('gettingStartedModal');
    
    if (event.key === 'Escape') {
      if (learnMoreModal && learnMoreModal.style.display === 'block') closeLearnMoreModal();
      if (waitlistModal && waitlistModal.style.display === 'block') closeWaitlistModal();
      if (gettingStartedModal && gettingStartedModal.style.display === 'block') closeGettingStartedModal();
    }
    
    // Focus trap for active modal
    const activeModal = learnMoreModal?.style.display === 'block' ? learnMoreModal :
                       waitlistModal?.style.display === 'block' ? waitlistModal :
                       gettingStartedModal?.style.display === 'block' ? gettingStartedModal : null;
    
    if (activeModal && event.key === 'Tab') {
      const focusableSelectors = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
      const nodes = Array.from(activeModal.querySelectorAll(focusableSelectors));
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        last.focus();
        event.preventDefault();
      } else if (!event.shiftKey && document.activeElement === last) {
        first.focus();
        event.preventDefault();
      }
    }
  });
});
