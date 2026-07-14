// ASCII Machine — Canvas 2D character-grid renderer with noise-to-text transitions
export class ASCIIRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.isActive = true;
    this.time = 0;
    this.setupCanvas();
    this.animate();
  }

  setupCanvas() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    const dpr = window.devicePixelRatio;
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.ctx.scale(dpr, dpr);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  // Generate random noise characters
  randomChar() {
    const chars = '█▓▒░#@*+=-:;,.';
    return chars[Math.floor(Math.random() * chars.length)];
  }

  // Draw animated background noise (CRT effect)
  // ponytail: live character field fills hero; intensity modulates with time
  drawNoise(intensity = 0.3) {
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const cellSize = 16;
    const gridW = Math.ceil(this.width / cellSize);
    const gridH = Math.ceil(this.height / cellSize);

    this.ctx.font = 'bold 13px "JetBrains Mono", monospace';

    for (let i = 0; i < gridW; i++) {
      for (let j = 0; j < gridH; j++) {
        if (Math.random() < intensity) {
          const char = chars[Math.floor(Math.random() * chars.length)];
          const x = i * cellSize + 5;
          const y = j * cellSize + 14;

          // Modulated alpha: brightest in center, dimmer at edges
          const distX = (i / gridW - 0.5) * 2;
          const distY = (j / gridH - 0.5) * 2;
          const dist = Math.sqrt(distX * distX + distY * distY);
          const baseBrightness = Math.max(0.05, 0.3 - dist * 0.1);
          const alpha = baseBrightness * Math.random() * 0.35;

          this.ctx.fillStyle = `rgba(0, 208, 132, ${alpha})`;
          this.ctx.fillText(char, x, y);
        }
      }
    }
  }

  // Draw scanlines
  drawScanlines() {
    const lineHeight = 2;
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.lineWidth = 1;

    for (let y = 0; y < this.height; y += lineHeight) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }
  }

  // Draw vignette effect
  drawVignette() {
    const gradient = this.ctx.createRadialGradient(
      this.width / 2, this.height / 2, 0,
      this.width / 2, this.height / 2, Math.max(this.width, this.height)
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.25)');

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  // Main render loop
  render() {
    // Clear with CRT black
    this.ctx.fillStyle = '#0a0e0a';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw animated noise field (fills hero with churning glyphs)
    // Modulate intensity over time for living effect
    const baseIntensity = 0.35 + Math.sin(this.time * 0.0005) * 0.08;
    this.drawNoise(baseIntensity);

    // Draw scanlines
    this.drawScanlines();

    // Draw vignette
    this.drawVignette();
  }

  update() {
    this.time++;
  }

  animate() {
    if (this.isActive) {
      this.update();
      this.render();
    }
    requestAnimationFrame(() => this.animate());
  }

  toggle(active) {
    this.isActive = active;
  }
}
