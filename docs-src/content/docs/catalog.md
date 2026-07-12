---
title: System Catalog
description: Every skill and script in Jackie-OS — the map to navigate the system.
---

> **The map.** Every skill (what the AI does) and script (what runs on a schedule or on demand). Start here to navigate the system. Depth links: skills → [Skills Registry](/jackie-os/docs/skills-registry); what-runs-when → Hermes VPS crontab + [Vault Rhythm](/jackie-os/docs/vault-rhythm); operating → [Cheat Sheet](/jackie-os/docs/cheat-sheet).

## Skills vs Scripts — decision

**Skills** are LLM judgment playbooks — markdown decision trees that agents follow when running a task (example: `morning-brief.md` = what a brief contains, how to read vault/email, when to alert, how to publish). Skills are the AI's **thinking layer**; they live in `System/skills/` and the agent reads them whole, then improvises per context.

**Scripts** are the mechanics layer — bash or Python executables that handle scheduling, filesystem operations, subprocess calls, and state management (example: `morning-brief-vps.py` = pull vault, run the skill in the Hermes sandbox, format output, write to file, deliver). Scripts live in `System/{coo,capture,ops,periodic,work,lib,scripts}/` and are the **source of truth** — edits go here, never the VPS copy (symlinked).

**Pattern:** Skills call scripts (or describe the sequence scripts follow). A typical cron job is a thin `&#60;name>.sh` wrapper (cron entry) that execs a `&#60;name>.py` (logic). When the LLM is involved, it's one `hermes -z` call returning text that the script writes.

---

## How it fits together (30-second orientation)

- **Skills** = markdown playbooks the AI (Claude/Hermes) follows. Some are agent-run (judgment), some are implemented mechanically by a script.
- **Scripts** = the executable layer. They live in the repo under `System/{coo,capture,ops,periodic,work,lib,scripts}/` and are the **source of truth**. On the VPS they're symlinked into `~/.hermes/scripts/` by `hermes-vps-link-scripts.sh` (rebuilt on every autodeploy `git pull`). **Edit the repo copy, never the VPS copy.**
- **Two schedulers:** the **Hermes agent-cron** (`~/.hermes/cron/jobs.json`, edited via the dashboard — the morning stack) and the **OS crontab** (`hermes-vps-crontab.txt` — deploy/health/weekly).
- **Pattern:** most cron jobs are a thin `&#60;name>.sh` wrapper (cron entry) that execs a `&#60;name>.py` (the logic). `no_agent` jobs are mechanical; the LLM, when used, is one `hermes -z` call returning text that the Python writes.

---

## Skills — grouped by job

Full registry: [Skills Registry](/jackie-os/docs/skills-registry).

| Skill | Does | Implemented by |
|-------|------|----------------|
| **Capture** | &#160; | &#160; |
| journal-capture | Owner journal queue → append to daily note | `capture/journal-capture.py` (hourly) |
| telegram-sweep | Clip URLs → `Vault/Clippings/` | `capture/telegram-sweep.py` (07:00) |
| daily-linking | Journal mentions of known people/places → inbound links | `capture/daily-linking-vps.py` (07:45) |
| **Brief / COO** | &#160; | &#160; |
| morning-brief | Daily COO brief (yesterday, top 3, projects, calendar, inbox) | `coo/morning-brief-vps.py` (07:30) |
| project-sync | Align all projects / repos / vault Status / hot.md | agent (wrap-up + brief) |
| weekly-review | Weekly COO brief + coach session | agent (Sun) |
| **Ops / infra** | &#160; | &#160; |
| hermes-ops | VPS ops backend — scripts, crons, exec allowlist, gateway | [Hermes Runbook](/jackie-os/docs/hermes-runbook) |
| vault-rhythm | Single map of everything that touches the vault on a schedule | reference |
| janitor | Maintain the vault + AI system | `periodic/hermes-janitor-skills-audit.py` (quarterly) |
| new-code-project | One-shot onboarding of a new project into Jackie-OS | agent |
| **Meta / session** | &#160; | &#160; |
| wrap-up | Close a session: reconcile roadmap, Status, hot.md, brief Log | [Wrap up](/jackie-os/docs/wrap-up) |

---

## What runs when (cron)

**Hermes agent-cron** (`jobs.json`, dashboard): morning-brief 07:30 · telegram-sweep 07:00 · trade-digest 07:10 · daily-linking 07:45 · journal-capture hourly.

**OS crontab** (`hermes-vps-crontab.txt`): autodeploy every 2 min · merge-poll every 2h · healthcheck 08:00 · degraded-brief 08:35 · cbm-index Sun 06:30 · intel-weekly Sun 19:00 · janitor-skills-audit quarterly.
