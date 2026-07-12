---
title: Skills Registry
description: Complete inventory of all skills — triggers, install paths, and naming convention.
---

# Skills Registry

**Complete inventory of every skill in Jackie-OS** — what triggers each, where it lives, and how to install or reference it. Use this to navigate the skills ecosystem.

**Cross-reference:** [Catalog](/jackie-os/docs/catalog) (organized by job type) · [Vault Rhythm](/jackie-os/docs/vault-rhythm) (what-runs-when).

## Skill naming

| Prefix | Meaning | Scope | Example |
|--------|---------|-------|---------|
| `jos-` | owned + battle-tested | global `~/.agents/skills/` | jos-plan, jos-compound, jos-design-ui |
| (none) | upstream global | global `~/.agents/skills/` | grill-for-unknowns, last30days, teach |
| (none) | repo skills | `System/skills/` | morning-brief, wrap-up, project-sync |

**Key rule:** `jos-` prefix signals "stable, reusable across projects." All `System/skills/` entries are owned by definition.

## Skills Registry

| Skill | Type | Trigger | Install | Location |
|-------|------|---------|---------|----------|
| morning-brief | agent | 07:30 daily (scheduled) | (shipped in Jackie-OS) | System/skills/ |
| project-sync | agent | wrap-up, session-end | (shipped in Jackie-OS) | System/skills/ |
| wrap-up | agent | `/wrap-up`, merge, session-end | (shipped in Jackie-OS) | System/skills/ |
| weekly-review | agent | Sun 18:00, `weekly review` | (shipped in Jackie-OS) | System/skills/ |
| journal-capture | agent | hourly, `DM` | (shipped in Jackie-OS) | System/skills/ |
| jos-plan | agent | `plan <topic>` | `bash System/skills/install-global-skills.sh` | `~/.agents/skills/` |
| jos-compound | agent | `/jos-compound` after ship | `bash System/skills/install-global-skills.sh` | `~/.agents/skills/` |
| jos-design-ui | agent | design, ui, Polish | `bash System/skills/install-global-skills.sh` | `~/.agents/skills/` |
| grill-for-unknowns | agent | `grill me` before big build | installed globally | `~/.agents/skills/` |
| last30days | agent | research <topic> | installed globally | `~/.agents/skills/` |

---

**To add a skill:** follow the [Catalog](/jackie-os/docs/catalog) ownership rules and update this registry in the same commit.
