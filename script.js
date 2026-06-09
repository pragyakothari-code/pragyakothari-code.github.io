// ── WORK FILTERS ──────────────────────────────────────────
const filterBtns = document.querySelectorAll('.work-filter');
const workCards  = document.querySelectorAll('[data-category]');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    workCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.display = show ? '' : 'none';
    });
  });
});

// ── NAV: scroll state ─────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── MOBILE NAV ────────────────────────────────────────────
const hamburger = document.querySelector('.nav-hamburger');
const navLinks  = document.querySelector('.nav-links');
hamburger?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('nav-open');
  hamburger.setAttribute('aria-expanded', open);
});
// close on link click
navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('nav-open'));
});

// ── SCROLL ANIMATIONS ─────────────────────────────────────
const fadeEls = document.querySelectorAll(
  '.case-card, .case-card-full, .section-header, .about-inner, .pg-item, .contact-inner, .hero-text, .hero-visual'
);
fadeEls.forEach(el => el.classList.add('fade-up'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // stagger children in a grid
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => observer.observe(el));

// ── LIGHTBOX ──────────────────────────────────────────────
const items     = Array.from(document.querySelectorAll('.pg-item'));
const lightbox  = document.getElementById('lightbox');
const backdrop  = document.getElementById('lightbox-backdrop');
const lbImg     = document.getElementById('lightbox-img');
const lbTitle   = document.getElementById('lightbox-title');
const lbClose   = document.querySelector('.lightbox-close');
const lbPrev    = document.querySelector('.lightbox-prev');
const lbNext    = document.querySelector('.lightbox-next');
let current     = 0;

function openLightbox(index) {
  current = index;
  const item = items[current];
  lbImg.src         = item.dataset.src;
  lbImg.alt         = item.dataset.title || '';
  lbTitle.textContent = item.dataset.title || '';
  lightbox.classList.add('active');
  backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
  lbImg.focus();
}

function closeLightbox() {
  lightbox.classList.remove('active');
  backdrop.classList.remove('active');
  document.body.style.overflow = '';
}

function showPrev() {
  current = (current - 1 + items.length) % items.length;
  openLightbox(current);
}
function showNext() {
  current = (current + 1) % items.length;
  openLightbox(current);
}

items.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
  item.setAttribute('role', 'button');
  item.setAttribute('tabindex', '0');
  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
  });
});

lbClose?.addEventListener('click', closeLightbox);
backdrop?.addEventListener('click', closeLightbox);
lbPrev?.addEventListener('click', showPrev);
lbNext?.addEventListener('click', showNext);

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   showPrev();
  if (e.key === 'ArrowRight')  showNext();
});

// touch swipe in lightbox
let touchStartX = 0;
lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) dx < 0 ? showNext() : showPrev();
}, { passive: true });

// ── SCROLL ABOUT SECTION to top on nav click ─────────────
document.querySelector('a[href="#about"]')?.addEventListener('click', (e) => {
  e.preventDefault();
  const about = document.getElementById('about');
  const navHeight = document.getElementById('nav').offsetHeight;
  const aboutTop = about.getBoundingClientRect().top + window.scrollY - navHeight;
  window.scrollTo({ top: Math.max(0, aboutTop), behavior: 'smooth' });
});

// ── ACTIVE NAV LINK on scroll ─────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAs.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));
