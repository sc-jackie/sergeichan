import { ASCIIRenderer } from './ascii-renderer.js';
import { populateProjectSections } from './project-scenes.js';
import { about } from '../../js/data/about.js';
import { caseData } from '../../js/data/work.js';
import { path } from '../../js/data/path.js';
import { capital } from '../../js/data/capital.js';
import { voice } from '../../js/data/voice.js';

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
  document.documentElement.classList.add('reduced-motion-on');
}

// Populate Act II sections with TRUE facts from work.js
populateProjectSections();

// Initialize ASCII renderer
const canvas = document.getElementById('ascii-canvas');
const renderer = new ASCIIRenderer(canvas);

// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
  lerp: 0.1,
  wheelMultiplier: 1,
  touchMultiplier: 1.5,
  duration: 1.2
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Register ScrollTrigger with GSAP
gsap.registerPlugin(ScrollTrigger);

// ============ ACT I: Name resolves from noise ============
gsap.from('#act-1 .glitch', {
  scrollTrigger: {
    trigger: '#act-1',
    start: 'top 70%',
    end: 'top 30%'
  },
  opacity: 0,
  duration: 1,
  ease: 'power2.out'
});

gsap.from('#act-1 .act-subtitle', {
  scrollTrigger: {
    trigger: '#act-1',
    start: 'top 65%',
    end: 'top 30%'
  },
  opacity: 0,
  y: 20,
  duration: 1,
  delay: 0.2,
  ease: 'power2.out'
});

// ============ ACT II: Projects ============
const projectSections = [
  { el: '#act-2-newfin', data: caseData[0] },
  { el: '#act-2-bunit', data: caseData[1] },
  { el: '#act-2-jackieos', data: caseData[2] },
  { el: '#act-2-rodyna', data: caseData[3] },
  { el: '#act-2-draw', data: caseData[4] }
];

projectSections.forEach((section, idx) => {
  const triggerEl = document.querySelector(section.el);

  // Staggered project animations
  gsap.from(triggerEl.querySelector('.act-title'), {
    scrollTrigger: {
      trigger: section.el,
      start: 'top 70%',
      end: 'top 30%'
    },
    opacity: 0,
    y: 30,
    duration: 0.7,
    ease: 'back.out'
  });

  gsap.from(triggerEl.querySelector('.act-subtitle'), {
    scrollTrigger: {
      trigger: section.el,
      start: 'top 68%',
      end: 'top 28%'
    },
    opacity: 0,
    y: 20,
    duration: 0.7,
    delay: 0.15,
    ease: 'power2.out'
  });

  gsap.from(triggerEl.querySelector('.ascii-art'), {
    scrollTrigger: {
      trigger: section.el,
      start: 'top 65%',
      end: 'top 25%'
    },
    opacity: 0,
    y: 15,
    duration: 0.7,
    delay: 0.3,
    ease: 'power2.out'
  });
});

// ============ ACT III: Path (paper terminal) ============
gsap.to('body', {
  scrollTrigger: {
    trigger: '#act-3',
    start: 'top 80%',
    end: 'top 20%',
    scrub: 0.5
  },
  duration: 0.5
});

gsap.from('#act-3 .act-title', {
  scrollTrigger: {
    trigger: '#act-3',
    start: 'top 70%',
    end: 'top 30%'
  },
  opacity: 0,
  y: 30,
  duration: 0.7,
  ease: 'back.out'
});

gsap.from('#act-3 .ascii-art', {
  scrollTrigger: {
    trigger: '#act-3',
    start: 'top 65%',
    end: 'top 25%'
  },
  opacity: 0,
  y: 20,
  duration: 0.7,
  delay: 0.2,
  ease: 'power2.out'
});

// ============ ACT IV: Capital ============
gsap.from('#act-4 .act-title', {
  scrollTrigger: {
    trigger: '#act-4',
    start: 'top 70%',
    end: 'top 30%'
  },
  opacity: 0,
  y: 30,
  duration: 0.7,
  ease: 'back.out'
});

gsap.from('#act-4 .ascii-art', {
  scrollTrigger: {
    trigger: '#act-4',
    start: 'top 65%',
    end: 'top 25%'
  },
  opacity: 0,
  y: 20,
  duration: 0.7,
  delay: 0.2,
  ease: 'power2.out'
});

// ============ ACT V: Voice ============
gsap.from('#act-5 .act-title', {
  scrollTrigger: {
    trigger: '#act-5',
    start: 'top 70%',
    end: 'top 30%'
  },
  opacity: 0,
  y: 30,
  duration: 0.7,
  ease: 'back.out'
});

gsap.from('#act-5 .ascii-art', {
  scrollTrigger: {
    trigger: '#act-5',
    start: 'top 65%',
    end: 'top 25%'
  },
  opacity: 0,
  y: 20,
  duration: 0.7,
  delay: 0.2,
  ease: 'power2.out'
});

// ============ ACT VI: Signal ============
gsap.from('#act-6 .act-title', {
  scrollTrigger: {
    trigger: '#act-6',
    start: 'top 70%',
    end: 'top 30%'
  },
  opacity: 0,
  y: 30,
  duration: 0.7,
  ease: 'back.out'
});

gsap.from('#act-6 .ascii-art', {
  scrollTrigger: {
    trigger: '#act-6',
    start: 'top 65%',
    end: 'top 25%'
  },
  opacity: 0,
  y: 20,
  duration: 0.7,
  delay: 0.2,
  ease: 'power2.out'
});

// ============ Scroll-triggered section visibility ============
let currentMode = 'dark';

ScrollTrigger.create({
  trigger: '#act-3',
  start: 'top 70%',
  onEnter: () => {
    if (currentMode !== 'paper') {
      document.body.classList.add('paper-mode');
      currentMode = 'paper';
    }
  },
  onLeaveBack: () => {
    if (currentMode !== 'dark') {
      document.body.classList.remove('paper-mode');
      currentMode = 'dark';
    }
  }
});

// Refresh on load
window.addEventListener('load', () => {
  ScrollTrigger.refresh();
  lenis.scrollTo(0);
});

// Handle resize
window.addEventListener('resize', () => {
  ScrollTrigger.refresh();
});
