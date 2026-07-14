// Case study data for the five projects
export const caseData = [
  {
    id: 'newfin',
    name: 'Newfin',
    roman: 'I',
    kick: 'Finance + Agents',
    one: 'Smart account. Vault-first personal finance for one person, orchestrated by always-on agents.',
    meta: [
      { label: 'Role', value: 'CTO' },
      { label: 'Stage', value: 'Production' },
      { label: 'Tech', value: 'Supabase, Next.js, AI agents' }
    ],
    what: 'A personal finance system that stores every transaction in a single vault (PostgreSQL), then routes that data through LLM analysis — classification, anomalies, advice — without shipping raw transactions to cloud APIs. Agents reconcile daily, surface anomalies, suggest budgets. No fees, no gatekeeping.',
    why: 'Most finance apps are walled gardens: your data lives on their servers, their models run on their terms. Newfin inverts this: your vault, your rules, your LLM.',
    solves: [
      'Scattered spend tracking across cards + wallets',
      'LLM analysis that respects privacy',
      'No subscription model; one account, one person'
    ],
    state: 'Live in production; three months of transaction history; agent-driven reconciliation daily.',
    arch: [
      { name: 'Vault (Supabase)', type: 'source' },
      { name: 'Hermes (agents)', type: 'compute' },
      { name: 'Frontend (web)', type: 'ui' }
    ]
  },
  {
    id: 'bunit',
    name: 'B-Unit',
    roman: 'II',
    kick: 'Content + Network',
    one: 'Podcast network. Structured interviewing for the AI era.',
    meta: [
      { label: 'Role', value: 'Co-founder' },
      { label: 'Stage', value: 'Early' },
      { label: 'Tech', value: 'Remix, Supabase' }
    ],
    what: 'A podcast series and editing template system designed to surface interesting people working at the intersection of AI, policy, and systems. Guest interviews are structured around a core framework; editing is template-driven.',
    why: 'Most podcasts are reactive; we wanted a system that makes good conversations repeatable.',
    solves: [
      'Podcast production at scale without formula rigidity',
      'Guest research and prep automation',
      'Cross-platform distribution'
    ],
    state: 'Two episodes live; production system under refinement.',
    arch: [
      { name: 'Episode data', type: 'source' },
      { name: 'Distribution', type: 'compute' }
    ]
  },
  {
    id: 'jackieos',
    name: 'Jackie-OS',
    roman: 'III',
    kick: 'Systems + AI',
    one: 'Operating system for one life. Vault-first personal infrastructure, run by LLM agents.',
    meta: [
      { label: 'Role', value: 'Creator' },
      { label: 'Stage', value: 'Production' },
      { label: 'Tech', value: 'Node, Supabase, Hermes' }
    ],
    what: 'A unified personal system that orchestrates every part of one life — finances, projects, time, decisions — via an Obsidian vault and LLM-powered agents (Hermes). Agents handle capture, synthesis, ritual automation, decision support.',
    why: 'Most people use fragments: calendar, email, notes, todo apps, each a silo. Jackie-OS weaves them into one system.',
    solves: [
      'Decision fatigue via structured capture and counsel',
      'Time coordination across projects and life roles',
      'One source of truth for everything'
    ],
    state: 'Core running daily; three agents in production (morning brief, journal, project sync); five projects tracked.',
    arch: [
      { name: 'Vault (Obsidian)', type: 'source' },
      { name: 'Hermes (agents)', type: 'compute' },
      { name: 'APIs (email, calendar, LLM)', type: 'integration' }
    ]
  },
  {
    id: 'rodyna',
    name: 'Rodyna',
    roman: 'IV',
    kick: 'Investing + Data',
    one: 'Investment tracker. Real-time portfolio synthesis via agents and the blockchain.',
    meta: [
      { label: 'Role', value: 'Investor + Advisor' },
      { label: 'Stage', value: 'Early' },
      { label: 'Tech', value: 'React, Supabase' }
    ],
    what: 'A portfolio tracking system that ingests data from exchanges, blockchains, and alternative investments (angel syndicates, real estate), then synthesizes it into one dashboard. Agent-driven reconciliation surfaces discrepancies and opportunities.',
    why: 'Sophisticated investors hold assets across dozens of venues. Most tools only cover one. Rodyna bridges them.',
    solves: [
      'Fragmented investment visibility',
      'Real-time performance synthesis across asset classes',
      'Automated reconciliation'
    ],
    state: 'Core frontend live; data pipeline in development.',
    arch: [
      { name: 'Exchange APIs', type: 'source' },
      { name: 'Blockchain indexers', type: 'source' },
      { name: 'Synthesis engine', type: 'compute' }
    ]
  },
  {
    id: 'draw',
    name: 'Draw',
    roman: 'V',
    kick: 'Development + Tools',
    one: 'Workbench. Internal dev environment for AI-driven system design.',
    meta: [
      { label: 'Role', value: 'Architect' },
      { label: 'Stage', value: 'Experimental' },
      { label: 'Tech', value: 'Node, TypeScript' }
    ],
    what: 'A local development environment where multi-agent workflows run locally first, then push to production. Think: your laptop as an integration testing ground for the five systems above.',
    why: 'Building with agents requires tight feedback loops. Draw is the local-first, agent-first development rig.',
    solves: [
      'Agent workflow testing before deployment',
      'Cross-project integration debugging',
      'Iteration velocity without cloud spin'
    ],
    state: 'Used daily for internal development; not public.',
    arch: [
      { name: 'Local agent runtime', type: 'compute' },
      { name: 'Integration hooks', type: 'integration' }
    ]
  }
];

export function getCaseData(idx) {
  if (idx >= 0 && idx < caseData.length) {
    return caseData[idx];
  }
  return null;
}
