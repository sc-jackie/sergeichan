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
- **Hermes** — The always-on VPS agent that runs the scheduled tasks and sync loop while your Mac is off.
- **Persik** — Two Telegram bots: `@Persik_finbot` (the Newfin-hosted product bot) and `@persik_hermes_bot` (the full Hermes VPS channel).
- **workers (retired 2026-08-07)** — The Cyrus/Buzz named fleet (Fablio / Cursorio / Codexio / Cyrusio / Marketio / Scriptio) is off. Interactive coding is **Cursor**. Linear is tracking only. History: [Desk journey](/jackie-os/docs/desk-journey).
- **desk** — Live stack: Cursor + Tailscale + Hermes VPS + Grokbot. Contract: [Operator desk](/jackie-os/docs/desk). bb is not in active use.
- **registry** — The `System/project-registry.md` file that maps each project to its code repo and/or STATUS file, serving as the single source of truth for sync.

## Occasional

- **janitor** — An OKF linter and maintenance tool that audits frontmatter compliance and keeps the vault structure clean (quarterly cron).
- **docs-first** — Before building anything new, check the master index for prior art; on ship, update the owning doc in the same commit.

## Deprecated / winding down

- **Cowork** — The Claude desktop app's scheduled-tasks harness on Sergei's Mac. **Effectively retired** — a single leftover schedule remains (Sunday 18:00 weekly-review); everything else runs on the VPS.
- **Bases/Ops board** — Obsidian Bases kanban for task tracking. **Being replaced by Linear** (migration in progress: B-Unit, Newfin, Rodyna already on Linear; Jackie-OS itself deliberately stays on Bases/markdown).

## Automation &#38; infra

### Jackie OS agent (any editor; Hermes optional)

Jackie OS is portable files — the vault, the skills, the rules. **Primary interactive desk is Cursor** ([Operator desk](/jackie-os/docs/desk)). Hosts talk over **Tailscale**. Opening `~/Jackie-OS` (or a `~/dev/*` project) in Cursor — or Claude Code / Codex — auto-reads `CLAUDE.md`/`AGENTS.md` and runs the skills that live inside it. `wrap up` from any session syncs the vault, `## Status`, and `hot.md`, then commits. **Hermes** (below) is the always-on automation instance on the VPS. **Grokbot** is a parallel chat surface, not the desk of record. bb is not in active use.

### OKF (Open Knowledge Format) bundle

Jackie-OS adopts **Open Knowledge Format** *frontmatter* — every skill, solution, concept, project note, daily, and brief carries structured YAML (`type`, `title`, `timestamp`, …). This makes the vault a **portable, vendor-neutral knowledge bundle**: anyone can fork the structure and wire a different automation layer, and any agent can orient and retrieve by metadata instead of inferring from prose. **Frontmatter only** — internal links stay as Obsidian wikilinks (OKF's relative-link convention is *not* adopted). Backfilled by `System/tools/add-okf-frontmatter.py`; enforced by `janitor` OKF lint mode. Headline goal = portability; faster agent orientation/retrieval is the day-to-day payoff.

### Hermes VPS

The VPS worker layer — runs the Hermes agent, crons, and the ops exec allowlist. **Models run on subscription OAuth CLIs plus OpenRouter**, not Nous Portal. Three Hermes profiles (verified live 2026-08-17):

| Profile | Primary | Fallbacks | Used for |
|---|---|---|---|
| **`default`** | `openai-codex/gpt-5.6-sol` (swappable) | Cursor Grok 4.6 High Fast → GPT-OSS 120B → 4× OpenRouter free | Briefs, Telegram, planning, Newfin `/intel`. `delegate_task` → `anthropic/claude-opus-5` |
| **`kawai-coo`** | `openai-codex/gpt-5.6-sol` | GPT-OSS 120B → 4× OpenRouter free | Manual COO sessions |
| **`persiknewfin`** | matches `default` (currently `openai-codex/gpt-5.6-sol`) | Cursor Grok 4.6 High Fast → GPT-OSS 120B → 4× OpenRouter free | Holding / trade / research one-shots (`hermes -p persiknewfin -z`) |

Auxiliary roles (vision, compression, titles) run OpenRouter nano models. `cursor-bridge` is retired. Detail: Jackie-OS `hermes-ops` § Model setup.

Newfin's `/ask` + `/research` shell the **subscription OAuth CLIs directly** (Claude Code / Codex), not a Hermes profile. Voice/photo STT stays direct-Gemini with Newfin's own key×model failover (`gemini-media-chain`, fallback `gemini-3.5-flash`). Source: newfin `plans/decisions-log.md` 2026-07-06 + 2026-07-04.

### Two-bot model

Two live Telegram bots, split by audience:

- **[@Persik_finbot](https://t.me/Persik_finbot)** — **Newfin bot**: household finance + owner trading co-pilot. Spouse/group stay scoped. Trading brief and `/intel` land here. Credentials stay on Vercel; never on the Hermes VPS. No Jackie-OS vault read/write. Journal, clips, and the morning COO brief do **not** live here. `/ask` + `/research` use Claude Code / Codex OAuth CLIs. `/intel` uses Hermes `default` (`gpt-5.6-sol`).
- **[@persik_hermes_bot](https://t.me/persik_hermes_bot)** — **Hermes COO**: journal, clips, morning brief, vault, ops. Owner only. Uses the Hermes `default` chain.

## Hermes VPS

**Host:** `hermes@your-vps-host` — runs the `hermes` Linux user.

**What it is:** A full Claude Agent SDK instance — not just a cron host. Has a web dashboard (tunnel: `127.0.0.1:9119`) and a Headroom LLM proxy (`127.0.0.1:8787`).

### Three-cron system (must not overlap)

| Layer | Owner | Jobs |
|---|---|---|
| Hermes Agent cron (dashboard → Cron tab) | Hermes SDK | morning-brief, journal-capture, telegram-sweep, trade-digest |
| OS crontab (`crontab -l`) | `hermes` user | autodeploy, merge-poll, healthcheck, degraded-brief, intel-weekly, cbm-index, janitor-skills-audit |
| Mac weekly-review schedule (Cowork, otherwise retired) | macOS | weekly-review (Sun 18:00 — the only remaining Mac-scheduled task) |

Adding a job to multiple layers causes double-runs — always check all three before adding a scheduled task. *(Research auto-run fully retired 2026-06-30; Persik `/research` is now agentic in Newfin.)*

### Sync modes — vault writeback

| When | Trigger | What syncs | Authoritative? |
|---|---|---|---|
| **Daily 07:30 Warsaw** | Scheduled daily or "morning brief" / "daily brief" | Project notes `## Status` (rolling 24h window), `hot.md` active lines, Ops board (if exists), brief `## Log` | Vault project notes (Status is source of truth) |
| **:25 every 2h, VPS crontab** | Scheduled system crontab | External code repos (via API), thin `## Status` prepend | GitHub/git repos (merge-poll reads via API; not a rich sync) |
| **Session-end + step 0 of morning-brief** | `/wrap-up` command OR wrap-up OR "sync projects" OR after `~/dev` PR merge/push | Registry: git repos, `STATUS.md` files, vault notes, `hot.md`, ops-board lanes; Linear task state (if `tracker: linear`) | Each source type: git log, status-file hash, vault note, Linear API — code wins |
| **End of working session** | `/wrap-up` / `/wrap-up all` / `/wrap-up merge` OR wrap-up OR after code-repo merge/push | Status prepend (shipped/next/blocked), brief `## Log`, `hot.md` full overwrite, plans/catalog | Latest work in session (code repo or changed vault notes); plans only if realized |

### Single LLM gateway: Hermes CLI

Jackie-OS skills and Hermes Telegram route through the **`hermes` CLI** on the VPS. Newfin `/ask` + `/research` use first-party CLIs. Newfin `/intel` and deep research use named Hermes operations. Speech-to-text calls Gemini directly.

### Linear integration + autonomous agents

**Project tracking:** Linear (workspace `evegelin`, team EVE) is the backlog for Jackie-OS and the product repos. Execute in Cursor. Task state syncs on ship.

**Autonomous agents (retired Cyrus farm):** Coding execution is **Cursor**. Do not wake Cyrus, Buzz, or bb. File a Linear issue, then execute `here`. History: [Desk journey](/jackie-os/docs/desk-journey).

### How Newfin uses Hermes

Newfin backend → named Hermes operation (`hermes-ops-exec.sh`) → `hermes` CLI on the VPS (`default` = `gpt-5.6-sol`, or `persiknewfin` for one-shots).

`@persik_hermes_bot` is the direct channel to the Hermes VPS agent for all work (COO, CTO, ops). What's retired is the old relay: `@Persik_finbot` proxying `/work` commands over SSH to Hermes — that path no longer exists.

### What lives where (post-2026-06-29 restructure)

| Path | Contents |
|---|---|
| `~/jackie-os/` | Jackie-OS repo — vault, skills, plans (git-synced every 2 min via autodeploy) |
| `~/.hermes/` | Hermes agent config: dashboard, sessions, kanban, skills packs |
| `~/.hermes/scripts/` | Symlink farm → `~/jackie-os/System/{coo,capture,ops,periodic,work,lib}/` (the repo is the source of truth; edit there, never here). Rebuilt by `System/scripts/hermes-vps-link-scripts.sh` |
| `~/.hermes/skills/jackie-os` | Symlink → `~/jackie-os/System/skills/` (always current) |
| `~/repos/` | Read-only code clones for Hermes reference |
| `~/jackie-os/.secrets/` | Credentials (gitignored) — sourced by scripts via `JACKIE_OS_ROOT` |
