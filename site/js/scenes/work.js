// Work scene (Act II): the existing hero engine, scroll-orchestrated
// The hero canvas + case/glimpse DOM already exist in site/index.html
// This scene controls when they're active within the scroll document

export class WorkScene {
  constructor() {
    this.hero = document.getElementById('hero');
    this.case = document.getElementById('case');
    this.mainApi = null; // populated by the inline hero script
    this.isActive = false;
  }

  mount() {
    // Act 2 is visible: enable interaction
    this.isActive = true;
    if (this.mainApi) {
      this.mainApi.setInteractive(true);
    }
  }

  unmount() {
    // Act 2 left viewport: disable interaction
    this.isActive = false;
    if (this.mainApi) {
      this.mainApi.setInteractive(false);
    }
  }

  tick(progress) {
    // Progress: 0–1 within Act 2 viewport
    // The hero maintains its own animation loop
    // (controlled by IntersectionObserver in the inline script)
  }

  // Called from inline script to inject the mainApi reference
  setMainApi(api) {
    this.mainApi = api;
  }
}

export default WorkScene;
