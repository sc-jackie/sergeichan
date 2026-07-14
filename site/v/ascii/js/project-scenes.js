// Generate ASCII scenes for Act II projects using TRUE data from work.js
import { caseData } from '../../js/data/work.js';

export function renderProjectScene(projectData, index) {
  const scenes = [
    // Newfin: finance vault table
    (data) => `┌──────────────────────────┐
│ NET WORTH · CASHFLOW     │
│ ┌────────────────────┐   │
│ │ sync     │ hourly  │   │
│ │ reconcile│ daily   │   │
│ │ advisor  │ telegram│   │
│ └────────────────────┘   │
│                          │
│ ${String(data.state || 'in production').substring(0, 24)} │
└──────────────────────────┘`,

    // B-Unit: quest log
    (data) => `╔═══════════════════════════╗
║ QUEST LOG · STREAK ██████ ║
║ [x] morning training  +XP ║
║ [x] read 20 pages     +XP ║
║ [ ] awaiting coach verify ║
║ level up → ceremony       ║
╚═══════════════════════════╝`,

    // Jackie-OS: system architecture
    (data) => `[vault] ↔ [agents] ↔ [output]
        ↓
   capture
   counsel
   automate

Five projects tracked.
${String(data.state || '').substring(0, 40)}...`,

    // Rodyna: family recipe week
    (data) => `phở bà ngoại   │ vi → uk → en
mon..sun menu  │ planned
shopping list  │ auto-built
family library │ growing
originals immutable — translations additive`,

    // Draw: tournament bracket
    (data) => `qf ──┐
     ├── sf ──┐
qf ──┘        ├── FINAL
qf ──┐        │
     ├── sf ──┘
qf ──┘
rankings · payments · club bot`
  ];

  return scenes[index] ? scenes[index](projectData) : '';
}

export function populateProjectSections() {
  // populate Act II with TRUE facts from work.js
  const asciiArts = document.querySelectorAll('[data-project]');

  asciiArts.forEach((el) => {
    const projectIdx = parseInt(el.getAttribute('data-project'), 10);
    if (projectIdx >= 0 && projectIdx < caseData.length) {
      const projectData = caseData[projectIdx];
      el.textContent = renderProjectScene(projectData, projectIdx);
    }
  });
}
