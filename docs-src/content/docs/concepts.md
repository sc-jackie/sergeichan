---
title: Concepts
description: Shared domain vocabulary — entities, named processes, and status concepts.
---

> Shared domain vocabulary for this project — entities, named processes, and status concepts with project-specific meaning. Seeded with core domain vocabulary, then accretes as learnings; direct edits are fine. Glossary only, not a spec or catch-all.

## Core terms — used daily

- **hot.md** — A ~500-word cache in `Vault/hot.md` of current focus and open loops, refreshed at every session end; fastest orientation for any agent starting a new session.
- **wrap-up** — The wrap-up skill that syncs the vault, updates `## Status` in project notes, refreshes `hot.md`, and commits.
- **brief** — An AI-generated daily or period summary (morning brief, weekly brief) that reads code activity, vault status, and calendar to inform the day.
- **skill** — A repeatable workflow playbook (markdown + optional code) living in `System/skills/`; an AI reads it and executes the defined steps. Global owned skills carry the `jos-` prefix (see Skills Registry).
- **Hermes Agent** — The Nous Research agent that runs the always-on COO loop: briefs, capture, knowledge work, ops, scheduling, and orchestration.
- **Persik** — Two Telegram bots: `@Persik_finbot` (the Newfin-hosted product bot) and `@persik_hermes_bot` (the full Hermes VPS channel).
- **workers** — Temporary Cursor ACP workers used for bounded code, design, or research tasks. The old named Buzz/Cyrus fleet was retired on 2026-08-07.
- **registry** — The `System/project-registry.md` file that maps each project to its code repo and/or STATUS file, serving as the single source of truth for sync.

## Occasional

- **janitor** — An OKF linter and maintenance tool that audits frontmatter compliance and keeps the vault structure clean (quarterly cron).
- **docs-first** — Before building anything new, check the master index for prior art; on ship, update the owning doc in the same commit.

## Deprecated / winding down

- **Cowork** — The Claude desktop app's scheduled-tasks harness on Sergei's Mac. **Effectively retired** — a single leftover schedule remains (Sunday 18:00 weekly-review); everything else runs on the VPS.
- **Bases/Ops board** — Retired Obsidian task board. Active project tracking now lives in Linear.

## Automation &#38; infra

### Jackie OS agent (any editor; Hermes optional)

Jackie OS is portable files — the vault, the skills, the rules. Any AI coding tool that opens the `~/Jackie-OS` folder (**Claude Code**, **Cursor**, **Codex**) auto-reads `CLAUDE.md`/`AGENTS.md` and runs the skills that live inside it, *becoming* a Jackie OS agent; the skills aren't moved or copied — a few cross-project ones (e.g. `wrap up`) are installed once in `~/.agents/skills/`. `wrap up` from any editor syncs the vault, `## Status`, and `hot.md`, then commits. **Hermes** (below) is simply the always-on instance of that same agent on the VPS — it runs the schedule unattended. Hermes is not required to use the system; it only automates the loop.

### OKF (Open Knowledge Format) bundle

Jackie-OS adopts **Open Knowledge Format** *frontmatter* — every skill, solution, concept, project note, daily, and brief carries structured YAML (`type`, `title`, `timestamp`, …). This makes the vault a **portable, vendor-neutral knowledge bundle**: anyone can fork the structure and wire a different automation layer, and any agent can orient and retrieve by metadata instead of inferring from prose. **Frontmatter only** — internal links stay as Obsidian wikilinks (OKF's relative-link convention is *not* adopted). Backfilled by `System/tools/add-okf-frontmatter.py`; enforced by `janitor` OKF lint mode. Headline goal = portability; faster agent orientation/retrieval is the day-to-day payoff.

### Hermes Agent

Hermes Agent runs on the VPS as the always-on COO and orchestrator. The provider and model can change without changing Jackie-OS: the durable layer is the vault, the skills, and the operating rules.

### Two-bot model

Two live Telegram bots, split by audience:

- **[@Persik_finbot](https://t.me/Persik_finbot)** — the Newfin finance product bot.
- **[@persik_hermes_bot](https://t.me/persik_hermes_bot)** — the Jackie-OS COO surface for briefs, capture, knowledge work, and operations.

## Operating model

- **bb** is the primary interactive desk.
- **Hermes Agent** owns the always-on COO loop and orchestration.
- Temporary **Cursor ACP workers** handle bounded delegated work.
- **Linear** is the project tracker.
- The named Buzz/Cyrus fleet is an archive, not a live system.

### Sync modes — vault writeback

| When | Trigger | What syncs | Authoritative? |
|---|---|---|---|
| **Daily 07:30 Warsaw** | Scheduled daily or "morning brief" / "daily brief" | Project notes `## Status` (rolling 24h window), `hot.md` active lines, Ops board (if exists), brief `## Log` | Vault project notes (Status is source of truth) |
| **:25 every 2h, VPS crontab** | Scheduled system crontab | External code repos (via API), thin `## Status` prepend | GitHub/git repos (merge-poll reads via API; not a rich sync) |
| **Session-end + step 0 of morning-brief** | `/wrap-up` command OR wrap-up OR "sync projects" OR after `~/dev` PR merge/push | Registry: git repos, `STATUS.md` files, vault notes, `hot.md`, ops-board lanes; Linear task state (if `tracker: linear`) | Each source type: git log, status-file hash, vault note, Linear API — code wins |
| **End of working session** | `/wrap-up` / `/wrap-up all` / `/wrap-up merge` OR wrap-up OR after code-repo merge/push | Status prepend (shipped/next/blocked), brief `## Log`, `hot.md` full overwrite, plans/catalog | Latest work in session (code repo or changed vault notes); plans only if realized |

### Telegram boundary

`@persik_hermes_bot` is the Jackie-OS COO surface. `@Persik_finbot` is the separate Newfin finance product bot.

### What lives where (post-2026-06-29 restructure)

| Path | Contents |
|---|---|
| `~/jackie-os/` | Jackie-OS repo — vault, skills, plans (git-synced every 2 min via autodeploy) |
| `~/.hermes/` | Hermes agent config: dashboard, sessions, kanban, skills packs |
| `~/.hermes/scripts/` | Symlink farm → `~/jackie-os/System/{coo,capture,ops,periodic,work,lib}/` (the repo is the source of truth; edit there, never here). Rebuilt by `System/scripts/hermes-vps-link-scripts.sh` |
| `~/.hermes/skills/jackie-os` | Symlink → `~/jackie-os/System/skills/` (always current) |
| `~/repos/` | Read-only code clones for Hermes reference |
| `~/jackie-os/.secrets/` | Credentials (gitignored) — sourced by scripts via `JACKIE_OS_ROOT` |
