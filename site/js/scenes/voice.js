// Voice scene (Act V): writing & appearances
// Placeholder: editorial list

export class VoiceScene {
  constructor() {
    this.section = document.getElementById('voice');
  }

  mount() {
    import('../data/voice.js').then(m => {
      const voice = m.voice;
      if (!voice || voice.length === 0) {
        this.section.innerHTML = `
          <div style="text-align:center;max-width:600px;padding:60px 40px">
            <h2 style="font-size:32px;margin-bottom:20px">Voice</h2>
            <p style="font-size:16px;color:#9AA0B0">Essays, talks, and appearances coming soon.</p>
          </div>
        `;
        return;
      }
      this.section.innerHTML = `
        <div style="max-width:800px;width:100%;padding:40px">
          <h2 style="font-size:32px;margin-bottom:30px">Voice</h2>
          <div style="display:flex;flex-direction:column;gap:20px">
            ${voice.map(entry => `
              <a href="${entry.url}" target="_blank" rel="noopener" style="text-decoration:none;color:inherit;border:1px solid rgba(229,231,239,.1);padding:16px;border-radius:8px;transition:border-color .2s">
                <div style="font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#C9A45C">${entry.type || 'ESSAY'}</div>
                <h3 style="font-size:18px;margin:8px 0;color:#E5E7EF">${entry.title}</h3>
                <div style="font-size:13px;color:#9AA0B0">${entry.source || ''} · ${entry.year || ''}</div>
              </a>
            `).join('')}
          </div>
        </div>
      `;
    });
  }

  unmount() {}
  tick(progress) {}
}

export default VoiceScene;
