// Main entry point: six-act cinematic scroll site
// Lenis + GSAP ScrollTrigger + all six act scenes

import { OriginScene } from './scenes/origin.js';
import { WorkScene } from './scenes/work.js';
import { PathScene } from './scenes/path.js';
import { CapitalScene } from './scenes/capital.js';
import { VoiceScene } from './scenes/voice.js';
import { SignalScene } from './scenes/signal.js';

(function() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DPR = Math.min(devicePixelRatio || 1, 2);

  // Get references
  const canvas = document.getElementById('cv');
  const ctx = canvas.getContext('2d', { alpha: false });
  const navLinks = document.querySelectorAll('nav.scrollnav a');
  const sections = Array.from(document.querySelectorAll('section[id]'));

  // Init Lenis: autoRaf:false so GSAP controls the tick
  const lenis = new Lenis({ autoRaf: false });

  // Register GSAP plugin and sync Lenis with ticker
  gsap.registerPlugin(ScrollTrigger);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000); // Convert seconds to ms
    ScrollTrigger.update();
  });

  // Nav state: update active link based on scroll position
  const sectionMap = Object.fromEntries(sections.map(s => [s.id, s]));

  function updateNavState() {
    let current = sections[0].id;
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top < window.innerHeight / 2) {
        current = sec.id;
      }
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href').slice(1);
      link.classList.toggle('active', href === current);
    });
  }

  if (!reduced) {
    gsap.ticker.add(updateNavState);
  }

  // Nav click handlers: scroll to section
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.getAttribute('href').slice(1);
      if (sectionMap[id]) {
        lenis.scrollTo(sectionMap[id], { duration: 1.2 });
      }
    });
  });

  // Hash navigation (browser back/forward)
  window.addEventListener('hashchange', () => {
    const id = window.location.hash.slice(1);
    if (sectionMap[id]) {
      lenis.scrollTo(sectionMap[id], { duration: 0.5 });
    }
  });

  // Scenes: create all six
  const scenes = {
    origin: new OriginScene(),
    work: new WorkScene(),
    path: new PathScene(),
    capital: new CapitalScene(),
    voice: new VoiceScene(),
    signal: new SignalScene()
  };

  function setupActTriggers() {
    if (!reduced) {
      // Detect case open/close and pause scroll
      const caseEl = document.getElementById('case');

      const caseObserver = new MutationObserver(() => {
        const isOpen = caseEl.classList.contains('open');
        if (isOpen) {
          lenis.stop(); // Pause smooth scroll
          ScrollTrigger.getAll().forEach(t => t.disable());
        } else {
          lenis.start(); // Resume smooth scroll
          ScrollTrigger.getAll().forEach(t => t.enable());
          ScrollTrigger.refresh();
        }
      });

      caseObserver.observe(caseEl, { attributes: true, attributeFilter: ['class'] });

      // Create triggers for each scene
      const sceneNames = ['origin', 'work', 'path', 'capital', 'voice', 'signal'];
      sceneNames.forEach(name => {
        const el = document.getElementById(name);
        ScrollTrigger.create({
          trigger: el,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => scenes[name].mount(),
          onLeave: () => scenes[name].unmount(),
          onEnterBack: () => scenes[name].mount(),
          onLeaveBack: () => scenes[name].unmount(),
          markers: false
        });
      });
    } else {
      // Reduced motion: just mount all scenes immediately
      Object.values(scenes).forEach(s => s.mount());
    }
  }

  // Wait for DOM ready, then set up scenes
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupActTriggers);
  } else {
    setupActTriggers();
  }

  // Expose global state for inline script + scenes
  window.siteState = {
    lenis,
    canvas,
    ctx,
    reduced,
    DPR,
    sections: sectionMap,
    workScene
  };

  console.log('Six-act site ready: Lenis + ScrollTrigger');
})();
