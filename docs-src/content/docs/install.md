---
title: Install & Setup
description: How to set up Jackie-OS from scratch.
---

# Install & Setup

This guide walks you through setting up a Jackie-OS instance from scratch. Jackie-OS is a second brain + AI agent system built on Obsidian, markdown, and Claude.

## Prerequisites

- **Mac** (primary platform)
- **Git** installed
- **Obsidian** (free)
- **Claude API access** (via Claude Code or API key)

## Quick start

### 1. Clone the repository

```bash
git clone git@github.com:sc-jackie/jackie-os.git ~/jackie-os
cd ~/jackie-os
```

### 2. Set up the vault

Open `~/jackie-os/Vault/` in Obsidian:
- **File** → **Open folder as vault** → select the `Vault` folder
- Enable core plugins: Daily Notes, Backlinks, Outgoing links
- Enable community plugins as suggested (or defer for later)

### 3. Set up Claude Code / IDE integration

Jackie-OS is tool-agnostic. Open the `~/jackie-os` folder in:
- **Claude Code** (recommended for Hermes work)
- **Cursor** (recommended for code repos in `~/dev/`)
- Any editor that supports Claude integration

The system auto-reads `CLAUDE.md` on folder open and activates all skills.

### 4. Global skills (optional but recommended)

Install reusable global skills:

```bash
bash System/skills/install-global-skills.sh
```

This installs:
- `jos-plan` — structured planning
- `jos-compound` — technical learnings capture
- `jos-design-ui` — UI/design work
- And upstream skills: `grill-for-unknowns`, `last30days`, others

### 5. (Optional) VPS setup for always-on

To run the system 24/7 on a VPS:

```bash
bash System/scripts/hermes-vps-deploy.sh
```

This requires:
- A VPS (e.g. Hetzner, ~€6/mo)
- SSH key + `HERMES_VPS_SSH_KEY` GitHub secret
- Claude API credentials

See `System/skills/hermes-ops.md` for detailed VPS runbook.

## Key folders

| Folder | Purpose |
|--------|---------|
| `Vault/` | Your second brain — journals, projects, briefs (open in Obsidian) |
| `System/` | Skills, scripts, plans — the automation layer |
| `Projects/` | Non-code projects and working files |
| `.secrets/` | Credentials (gitignored, mode 0600) |

## First steps

1. **Create today's journal:** `Vault/YYYY-MM-DD.md` with a brief note
2. **Read:** `CLAUDE.md` (agent rules), `Vault/hot.md` (current state)
3. **Try a skill:** Say `morning brief` or `wrap up` in Claude Code
4. **Review:** [Cheat Sheet](/jackie-os/docs/cheat-sheet) for 5 things you can say

## Documentation

- **Start here:** [Master Index](/jackie-os/docs/master-index) — the complete doc map
- **Architecture:** [System Architecture](/jackie-os/docs/architecture) — how all three systems fit together
- **Concepts:** [Concepts](/jackie-os/docs/concepts) — vocabulary (Hermes, vault, hot.md, etc.)

## Support

- **Questions?** Check [Master Index](/jackie-os/docs/master-index) for docs on that topic
- **Bug?** File an issue on GitHub

## Next: Connect your projects

Once the core system is running, add your code repos and projects via [Add a Project](/jackie-os/docs/add-a-project).
