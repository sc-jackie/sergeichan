// Capital scene (Act IV): investing overview
// Placeholder: capital data display

export class CapitalScene {
  constructor() {
    this.section = document.getElementById('capital');
  }

  mount() {
    import('../data/capital.js').then(m => {
      const capital = m.capital;
      this.section.innerHTML = `
        <div style="max-width:900px;width:100%;padding:40px">
          <h2 style="font-size:32px;margin-bottom:40px;text-align:center">Capital</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:30px">
            ${capital.map(stream => `
              <div style="border:1px solid rgba(229,231,239,.2);border-radius:10px;padding:24px">
                <h3 style="font-size:18px;color:${stream.color||'#E5E7EF'};margin:0 0 16px">${stream.type}</h3>
                <div style="font-size:32px;font-weight:300;color:#E5E7EF;margin-bottom:8px">${stream.count || '—'}</div>
                <div style="font-size:13px;color:#9AA0B0;line-height:1.6">${stream.thesis}</div>
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

export default CapitalScene;
