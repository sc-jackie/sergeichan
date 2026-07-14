// Signal scene (Act VI): contact finale
// Placeholder: contact info + social links

export class SignalScene {
  constructor() {
    this.section = document.getElementById('signal');
  }

  mount() {
    import('../data/about.js').then(m => {
      const about = m.about;
      this.section.innerHTML = `
        <div style="text-align:center;max-width:600px;padding:60px 40px">
          <h2 style="font-size:32px;margin-bottom:40px">Signal</h2>
          ${about.publicEmail ? `
            <a href="mailto:${about.publicEmail}" style="display:inline-block;font-size:18px;padding:12px 24px;border:1px solid #C9A45C;color:#C9A45C;text-decoration:none;border-radius:6px;margin-bottom:30px;transition:all .2s">
              Get in touch
            </a>
          ` : ''}
          <div style="display:flex;justify-content:center;gap:20px;margin-top:30px;font-size:14px">
            <a href="https://github.com/sc-jackie" target="_blank" rel="noopener" style="color:#9AA0B0;text-decoration:none">GitHub</a>
            <span style="color:#6A7080">·</span>
            <a href="https://twitter.com/" target="_blank" rel="noopener" style="color:#9AA0B0;text-decoration:none">Twitter</a>
          </div>
          <p style="margin-top:60px;font-size:12px;color:#6A7080">One thread, many vibrations.</p>
        </div>
      `;
    });
  }

  unmount() {}
  tick(progress) {}
}

export default SignalScene;
