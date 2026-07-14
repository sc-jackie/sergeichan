// Dispatcher: routes scroll progress to scene renderers
// Scenes: origin, work, path, capital, voice, signal
// Each scene: mount() / unmount() / tick(progress)
// ponytail: minimal scaffold; full scene logic wires in U2–U6

export class Dispatcher {
  constructor(canvas) {
    this.canvas = canvas;
    this.scenes = {};
    this.activeScene = null;
  }

  registerScene(name, scene) {
    this.scenes[name] = scene;
  }

  activateScene(name, progress) {
    if (this.activeScene !== name) {
      if (this.activeScene && this.scenes[this.activeScene]) {
        this.scenes[this.activeScene].unmount?.();
      }
      if (this.scenes[name]) {
        this.scenes[name].mount?.();
        this.activeScene = name;
      }
    }
    if (this.scenes[name]) {
      this.scenes[name].tick?.(progress);
    }
  }

  unmountAll() {
    Object.values(this.scenes).forEach(s => s.unmount?.());
    this.activeScene = null;
  }
}
