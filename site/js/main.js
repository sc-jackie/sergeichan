// Main entry point for the six-act site
// Imports: Lenis, GSAP, ScrollTrigger, Dispatcher, data
// ponytail: U1 scaffold — structural wiring only, no scene logic yet

import { Dispatcher } from './dispatcher.js';
import { about } from './data/about.js';
import { path } from './data/path.js';
import { capital } from './data/capital.js';
import { voice } from './data/voice.js';
import { work } from './data/work.js';

// Placeholder: Lenis + ScrollTrigger setup
// (The hero renderer runs independently in site/index.html inline script)
// This main.js wires up the six sections and nav rail for U2–U6

class SceneScaffold {
  constructor(name) {
    this.name = name;
    this.element = document.getElementById(name);
  }

  mount() {
    console.log(`[${this.name}] mounted`);
  }

  unmount() {
    console.log(`[${this.name}] unmounted`);
  }

  tick(progress) {
    // Progress: 0–1 within this section's viewport
    // U2+: render content here
  }
}

// Init: dispatcher + scene registry
function init() {
  const dispatcher = new Dispatcher(null);

  // Register six scenes
  ['origin', 'work', 'path', 'capital', 'voice', 'signal'].forEach(name => {
    dispatcher.registerScene(name, new SceneScaffold(name));
  });

  // Nav rail: active state on scroll (U2: wire to actual scroll progress)
  const navLinks = document.querySelectorAll('nav.scrollnav a');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('href');
      document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  console.log('Six-act scaffold ready. Data loaded:', { about, path, capital, voice, work });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
