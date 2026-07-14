// Generate ASCII scenes for Act II projects using TRUE data from work.js
import { caseData } from '../../js/data/work.js';

export function renderProjectScene(projectData, index) {
  const scenes = [
    // Newfin: vault table
    (data) => `┌──────────────────────────┐
│ VAULT                    │
│ ┌────────────────────┐   │
│ │ status  │ count    │   │
│ │─────────┼──────────│   │
│ │ classified   ✓ 3m  │   │
│ │ reconciled   ✓ 24h │   │
│ └────────────────────┘   │
│                          │
│ ${data.state.substring(0, 24)} │
└──────────────────────────┘`,

    // B-Unit: episode tracker
    (data) => `╔═══════════════════════════╗
║ PRODUCTION PIPELINE      ║
║ Episodes: ${String(data.meta[1].value).padEnd(16)}║
║ Guest interviews   ✓     ║
║ Template-driven    ✓     ║
║ Distribution       ✓     ║
╚═══════════════════════════╝`,

    // Jackie-OS: system architecture
    (data) => `[vault] ↔ [agents] ↔ [output]
        ↓
   capture
   counsel
   automate

Five projects tracked.
${data.state.substring(0, 40)}...`,

    // Rodyna: portfolio overview
    (data) => `crypto  │ ▄▄▄ │ portfolio
equity  │ ▂▃▄ │ tracker
angel   │ ▁▂▁ │ live
estate  │ ▀▀▀ │ data
        │     │
Stage: ${String(data.meta[1].value).padEnd(22)}│
Real-time synthesis   ✓`,

    // Draw: dev environment
    (data) => `[local] ←→ [test] ←→ [prod]

agent workflows
integration hooks
system check

Used daily.
Internal dev environment.`
  ];

  return scenes[index] ? scenes[index](projectData) : '';
}

export function populateProjectSections() {
  // ponytail: populate Act II with TRUE facts from work.js
  const asciiArts = document.querySelectorAll('[data-project]');

  asciiArts.forEach((el) => {
    const projectIdx = parseInt(el.getAttribute('data-project'), 10);
    if (projectIdx >= 0 && projectIdx < caseData.length) {
      const projectData = caseData[projectIdx];
      el.textContent = renderProjectScene(projectData, projectIdx);
    }
  });
}
