---
type: Skill
title: Vault rhythm
timestamp: 2026-06-29T14:46:47Z
name: vault-rhythm
description: Hub for Jackie-OS vault automation — morning stack, brief pipeline, vault indexes, sync, and parity between Mac skills and VPS scripts.
---

**Purpose:** single map of everything that touches the vault on a schedule — skills (agent contract), scripts (dumb runners), and where each runs (Mac Cowork · VPS Hermes cron · VPS system crontab).

**When to read:** debugging missed brief steps, adding a morning cron, closing Mac↔VPS parity gaps, or onboarding an agent to vault automation.

**Related hubs:** [Skills Registry](/jackie-os/docs/skills-registry) · [Cheat Sheet](/jackie-os/docs/cheat-sheet) · [Hermes Runbook](/jackie-os/docs/hermes-runbook)

---

## Two schedulers on VPS (don't conflate)

| Scheduler | TZ | Jobs |
|-----------|-----|------|
| **Hermes cron** (`hermes cron list`) | **UTC today** — `30 7 * * *` = 09:30 Warsaw (CEST) | 07:00–07:30 morning stack + hourly journal |
| **System crontab** (`hermes-vps-crontab.txt`) | `CRON_TZ=Europe/Warsaw` | autodeploy, merge-poll, health, degraded brief, intel weekly, janitor |

Morning wall-clock jobs live in **Hermes cron**, not `crontab -l`. That is why `crontab` looks empty for 07:xx work.

**Known bug:** Hermes cron schedules are UTC; system crontab is Warsaw. Fix: reschedule Hermes jobs with Warsaw offset (e.g. `30 5 * * *` for 07:30 CEST) or add TZ support in Hermes cron config.

---

## Inventory — morning &#38; vault automation

### A · Pre-brief stack (07:00–07:15 Warsaw target)

| Step | Skill (contract) | Script | Runner | Commits vault? |
|------|------------------|--------|--------|----------------|
| 07:00 clips | telegram-sweep | `telegram-sweep.sh` → `telegram-sweep.py` | VPS Hermes | Yes, if clips |
| 07:05 Nastusha refresh | — | `nastusha-brief-refresh-vps.sh` | VPS Hermes | Mirror only |
| 07:10 trade digest | folded in morning-brief §0b | `trade-digest-capture.sh` → `trade-digest-capture.py` | VPS Hermes | Yes, if rows |
| 07:15 Nastusha push | — | `nastusha-brief-push.sh` | VPS Hermes | No |

Mac Cowork **06:45 research** and **07:00 sweep** are **retired**; VPS owns sweep. **The research-bridge + watchlist auto-research were fully retired (2026-06-30)** — research is **on-demand only**: the vault `research &#60;topic>` skill (last30days → Clippings) and the agentic Persik `/research` (Newfin counsel lane + persiknewfin web search) are the two surfaces.

### B · Morning brief (07:30 Warsaw target)

| Step | Skill | Script | Mac (Cowork) | VPS |
|------|-------|--------|--------------|-----|
| Git settle + pull | morning-brief § wake-race | `jackie-os-git-native.sh` | native osascript | `git pull` in each script |
| **project-sync** | project-sync step 0 | *agent only* — no Python port | **yes** (step 0) | **no** — merge-poll is thin substitute |
| Ops board scan | morning-brief § Ops | *agent* | yes | partial (vault context in prompt) |
| LLM brief | morning-brief | `morning-brief-vps.py` + `hermes -z` | Cowork agent | VPS Hermes |
| Google life | — | `google-life-fetch.py` | Cowork connector / script | VPS |
| Telegram + coo-cache | morning-brief § delivery | `brief-deliver-via-cron.py` | `brief-to-telegram.py` | VPS |
| **Briefs.md + Daily.md** | morning-brief § Rules | `brief-vault-index.py` | agent manual | **wired** in `morning-brief-vps.py` (ship pending) |
| **daily linking** | daily-linking | *agent only* | yes (before commit) | **missing** |
| Single commit | morning-brief | `git commit` in script | one native commit | brief commit only |

**Fallback:** `degraded-brief.sh` @ **08:35 Warsaw** (system crontab) — vault+hot only if no deliverable brief exists.

### C · Intraday vault

| Job | Skill | Script | Schedule | Runner |
|-----|-------|--------|----------|--------|
| Journal capture | journal-capture | `journal-capture.sh` | hourly `:00` | VPS Hermes |
| Meeting index | meeting-capture | folded in journal-capture | hourly | VPS |
| Merge poll | — | `hermes-vps-merge-poll.sh` → `merge_poll.py` | `:25` every 2h | VPS crontab |
| Autodeploy | — | `hermes-vps-autodeploy.sh` | `*/2` | VPS crontab |
| Health | vps-service-operations | `hermes-healthcheck.sh` | 08:00 Warsaw | VPS crontab |

### D · Session / on-demand (not scheduled)

| Skill | Does | Typical trigger |
|-------|------|-----------------|
| [wrap-up](/jackie-os/docs/wrap-up) | Status prepend, brief `## Log`, hot.md | after ship · `/wrap-up` |
| project-sync | full repo → vault sync | wrap-up · "sync projects" |
| daily-linking | `Briefs/… links.md` | on demand |
| vault-index | vector RAG ingest → Newfin | on demand · Mac today |
| janitor | link-gardening, orphans | on demand · quarterly VPS audit |

### E · Period rhythm (week / month / year)

| Skill | Output | Runner |
|-------|--------|--------|
| weekly-review | `Briefs/YYYY-Www brief.md` | **Mac Cowork Sun 18:00** (only live Cowork cron besides optional morning ghost) |
| period-review § Monthly | `Briefs/YYYY-Mmm brief.md` | on demand + morning 📋 nudge |
| period-review § Yearly | `Briefs/YYYY brief.md` | on demand + Jan nudge |
| — | `hermes-intel-weekly.sh` | VPS Sun 19:00 |

---

## Mac vs VPS — parity matrix (2026-06-29)

| Capability | Mac skill contract | VPS today | Gap |
|------------|-------------------|-----------|-----|
| Telegram sweep | morning-brief §0 | separate 07:00 cron | OK (split commit) |
| Trade digest | morning-brief §0b | separate 07:10 cron | OK (split commit) |
| project-sync | morning-brief §0 | merge-poll only (thin) | **GAP — no rich Status** |
| Ops board in brief | morning-brief §0c | partial prompt context | **GAP** |
| Brief body + delivery | morning-brief | morning-brief-vps.py | OK |
| Briefs.md / Daily.md | morning-brief § Rules | brief-vault-index.py | **local only — push Jackie-OS** |
| daily linking | morning-brief last step | none | **GAP** |
| One end-of-brief commit | yes (brief+indexes+links) | brief only | **GAP** |
| Obsidian sync settle | yes (~5 min wait) | N/A | OK (VPS is source) |
| vault-index (RAG) | on demand Mac | not scheduled | optional later |

---

## Target architecture (consistent everywhere)

**Principle:** skills stay the **contract** (what + why); scripts are **runners** (how). Mac Cowork and VPS should call the **same script chain** where possible — agents only for steps that need judgment and have no script yet.

```text
07:00  telegram-sweep.py           → commit if clips
07:10  trade-digest-capture.py     → commit if rows
07:25  morning-rhythm-vps.sh       → NEW orchestrator (single writer 07:25–07:45)
         1. git pull --ff-only
         2. project-sync-vps.py    → NEW (git fetch ~/repos + ~/code, rich Status)
         3. morning-brief-vps.py    → --no-commit flag
         4. daily-linking-vps.py   → NEW (Hermes Haiku → links.md)
         5. brief-vault-index.py  → indexes
         6. one git commit + push
08:35  degraded-brief.py           → fallback unchanged
```

Until orchestrator ships, **Hermes cron stays split** — document order, don't assume one commit.

---

## Parity roadmap (implementation order)

| P | Work | Files | Status |
|---|------|-------|--------|
| **P1** | Index updates after brief | `brief-vault-index.py`, wire in `morning-brief-vps.py` + `degraded-brief.py` | **done locally — push + autodeploy** |
| **P2** | Hermes cron TZ → Europe/Warsaw | Hermes cron reschedule on VPS | todo |
| **P3** | `morning-rhythm-vps.sh` orchestrator + `--no-commit` on sub-scripts | new shell + flags on sweep/trade/brief | todo |
| **P4** | `daily-linking-vps.py` (Hermes subprocess, cap 5 links) | new script + skill cross-ref | todo |
| **P5** | `project-sync-vps.py` (registry git rows, `~/repos/*` fetch, Status prepend) | new script; skill stays canonical | todo |
| **P6** | Doc drift cleanup | `SKILLS.md`, `OPERATOR.md`, root `CLAUDE.md` | **done 2026-06-29** |
| **P7** | Optional: `vault-index.py` on VPS after large vault pushes | extend vault-index | backlog |

---

## Skill groups (navigation)

| Group | Skills |
|-------|--------|
| **Morning stack** | morning-brief · jackie-os-morning-brief · telegram-sweep |
| **Vault writes** | journal-capture · meeting-capture · daily-linking · **vault-rhythm** (this file) |
| **Vault sync** | project-sync · [wrap-up](/jackie-os/docs/wrap-up) · ops-board |
| **Vault search** | vault-index |
| **Period reviews** | weekly-review · period-review (weekly Phase B + monthly + yearly) |
| **VPS ops** | vps-service-operations · [hermes-ops](/jackie-os/docs/hermes-runbook) |

---

## Verify on VPS

```bash
export PATH="$HOME/.local/bin:$HOME/.hermes/hermes-agent/venv/bin:$PATH"
hermes cron list
crontab -l
tail -30 ~/morning-brief-vps.log
tail -10 ~/telegram-sweep.log ~/trade-digest.log ~/journal-capture.log
```

Canonical crontab source: `hermes-vps-crontab.txt` — install via `hermes-vps-crontab-install.sh` (system jobs only).
