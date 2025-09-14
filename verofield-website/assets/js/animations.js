/* VeroField Website - Animations JavaScript */
/* Animation functionality extracted from inline scripts for optimization */

document.addEventListener('DOMContentLoaded', () => {
  // ===== Animations with IntersectionObserver =====
  const animateElems = document.querySelectorAll('.fade-in, .slide-left, .slide-right, .scale-in, .feature-card, .stats-card, .tech-stack-item, .bg-white\\/5');
  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
  animateElems.forEach(el => animObserver.observe(el));

  // ===== IntersectionObserver: reveal on scroll (with stagger) =====
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => io.observe(el));

  // Fallback: if IO unsupported or styles failed, ensure content is visible
  try {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => el.classList.add('visible'));
    }
  } catch (_) {
    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => el.classList.add('visible'));
  }
});


