// Path scene (Act III): past-work timeline
// Placeholder: timeline list from data/path.js

export class PathScene {
  constructor() {
    this.section = document.getElementById('path');
  }

  mount() {
    import('../data/path.js').then(m => {
      const path = m.path;
      this.section.innerHTML = `
        <div style="max-width:800px;width:100%;padding:40px">
          <h2 style="font-size:32px;margin-bottom:30px;text-align:center">Timeline</h2>
          <div style="border-left:2px solid #C9A45C;padding-left:30px">
            ${path.map(entry => `
              <div style="margin-bottom:30px">
                <div style="font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#6A7080">${entry.era}</div>
                <h3 style="font-size:20px;margin:8px 0;color:#E5E7EF">${entry.role}</h3>
                <div style="font-size:14px;color:#9AA0B0">${entry.org}</div>
                <div style="font-size:14px;color:#9AA0B0;margin-top:6px">${entry.industry} · ${entry.years}</div>
                <p style="font-size:15px;line-height:1.6;margin-top:12px;color:#C6CAD6">${entry.line}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });
  }

  unmount() {}
  tick(progress) {}
}

export default PathScene;
