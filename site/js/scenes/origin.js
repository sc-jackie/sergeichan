// Origin scene (Act I): about + biographical intro
// Placeholder: DOM-based reveal of about content

export class OriginScene {
  constructor() {
    this.section = document.getElementById('origin');
    this.content = null;
  }

  mount() {
    if (!this.content) {
      // Import and render about data
      import('../data/about.js').then(m => {
        const about = m.about;
        this.section.innerHTML = `
          <div style="text-align:center;max-width:600px;padding:40px">
            <h1 style="font-size:48px;margin:20px 0">${about.name}</h1>
            <p style="font-size:18px;color:#9AA0B0;margin:20px 0">${about.background}</p>
            <div style="margin-top:40px">
              ${about.bio.map(line => `<p style="font-size:16px;line-height:1.8;margin:12px 0">${line}</p>`).join('')}
            </div>
          </div>
        `;
      });
    }
  }

  unmount() {
    // Content stays visible
  }

  tick(progress) {
    // No animation for now
  }
}

export default OriginScene;
