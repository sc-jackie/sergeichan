# Jackie OS — operator cheat sheet (/docs/cheat-sheet)



*One page. Everything else is agent-facing (`System/skills/`, `CLAUDE.md`). Read this when you forget how the system works.*

**Last refreshed:** 2026-07-10

***

## Review rhythm (day / week / month / year) [#review-rhythm-day--week--month--year]

| Horizon   | You write                         | AI writes               | When             | Say                |
| --------- | --------------------------------- | ----------------------- | ---------------- | ------------------ |
| **Day**   | `YYYY-MM-DD.md`                   | `Briefs/… brief`        | 07:30            | —                  |
| **Week**  | `YYYY-Www.md` after reading brief | `Briefs/YYYY-Www brief` | Sun 18:00 auto   | **weekly review**  |
| **Month** | `YYYY-Mmm.md` (e.g. `2026-M06`)   | `Briefs/YYYY-Mmm brief` | `monthly review` | **monthly review** |
| **Year**  | `YYYY.md`                         | `Briefs/YYYY brief`     | Jan nudge        | **yearly review**  |

Index: `Vault/Reviews.md`. Planning: `System/plans/roadmap-index.md`.

***

## Code→vault sync (how merges reach the vault) [#codevault-sync-how-merges-reach-the-vault]

| Layer                   | When                         | What                                                                                                                                                        |
| ----------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **07:30 morning-brief** | Daily (Mac / VPS)            | **Authoritative.** Full project-sync from `git log` → rich `## Status` + `hot.md`                                                                           |
| **Merge-poll Action**   | \~every 2h + manual dispatch | **Intraday.** One read-only PAT in jackie-os polls owned repos from `project-registry.md` → thin Status entry; morning-brief supersedes with the full story |
| **Manual**              | On demand                    | `**/wrap-up`\*\* (full) or **sync projects** (sync only)                                                                                                    |

Draw (shared repo) is read-only — poll skips it; 07:30 brief still syncs from your local clone.

***

## What you do (three things) [#what-you-do-three-things]

1. **Journal & reviews** — daily: `Vault/YYYY-MM-DD.md` (+ Persik). Week/month/year: read AI **brief** in `Briefs/`, then `weekly review` / `monthly review` / `yearly review` for your note.
2. **Build** — code in `~/dev/{newfin,rodyna,draw}` via **Cursor** (default CTO), **Claude Code**, or **Codex** — each opens the folder and becomes the same Jackie OS agent. The Hermes VPS agent also writes/ships code on its own.
3. **Close vault sessions** — say **wrap up** when you edited Jackie-OS or `Projects/` and did **not** just merge a PR (see below).

You do **not** need to remember registry paths, skill names, automation numbers, or where Status gets written.

***

## Scheduling deep-work blocks (agents) [#scheduling-deep-work-blocks-agents]

When proposing or adding something to Sergei's calendar:

1. **Check all calendars** — macOS Calendar.app (Google-synced): Life, Work, Family, Сім'я, `operator@example.com`, Work Unaligned, Work Flow, etc. Skip holiday/birthday/Siri-only calendars for conflict checks.
2. **Propose 2–3 free slots** with duration — don't assume 10:00 is free because the user said "morning."
3. **Call out conflicts** explicitly (e.g. meetings on `operator@example.com` or family blocks on Сім'я).
4. **Default calendar for deep work:** **Work**. Family events stay on Family/Сім'я — don't create those without ask.
5. **After Sergei picks a slot** — create the event (Calendar.app) with title, link to plan doc in description, then update `hot.md` + relevant plan file times.

*Example (2026-06-23): Hermes Phase 0a — 10:00–12:00 blocked by Viet 11:00–12:00 → booked **12:00–15:00** on Work.*

***

## What runs without you [#what-runs-without-you]

| When            | Runner                          | Covers                                                                                  |
| --------------- | ------------------------------- | --------------------------------------------------------------------------------------- |
| **07:00–07:30** | VPS Hermes cron                 | telegram sweep · trade digest · Nastusha refresh/push · **morning brief** → Telegram DM |
| **Hourly**      | VPS Hermes cron                 | Persik journal DMs → daily note                                                         |
| **Sun 18:00**   | Mac Cowork weekly-review        | compound + **weekly brief** in `Briefs/` (not your weekly note)                         |
| **08:35**       | VPS system crontab              | degraded brief fallback if morning brief missing                                        |
| **\~every 2h**  | VPS merge-poll (+ optional GHA) | thin intraday `## Status`; **07:30 brief** is the rich sync regardless                  |

**Truth surfaces (only two to care about):**

| Surface                            | What it is                                                    |
| ---------------------------------- | ------------------------------------------------------------- |
| `Vault/{Project}.md` → `## Status` | Full project history (agents write)                           |
| `Vault/hot.md`                     | \~500 words — current focus (agents write at wrap up / merge) |

Morning brief is **read-only for you** — one DM: short caption + tap the HTML file for the full brief. Vault `.md` is canonical for Obsidian.

***

## Scheduled tasks [#scheduled-tasks]

| Surface                | Live jobs                                                                                                 |
| ---------------------- | --------------------------------------------------------------------------------------------------------- |
| **Mac Cowork**         | `jackie-os-weekly-review` — Sun 18:00 only                                                                |
| **VPS Hermes cron**    | research · sweep · trade digest · Nastusha · morning-brief · journal (hourly) — `hermes cron list` on VPS |
| **VPS system crontab** | autodeploy · merge-poll · health · degraded brief · intel weekly · janitor — `hermes-vps-crontab.txt`     |

Full inventory + parity gaps: [Vault Rhythm](/jackie-os/docs/vault-rhythm).

***

## Five commands (everything else is automatic) [#five-commands-everything-else-is-automatic]

Agents should run **wrap up / post-implementation sync** themselves after shipping — you shouldn't have to ask. Spec: [Wrap up](/jackie-os/docs/wrap-up) § After implementation (includes roadmap index updates when a tracked plan ships).

| Say                            | When                                                                                                          |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| **grill me**                   | Stress-test a plan or design before building anything significant (global `grill-for-unknowns` skill)         |
| **teach me topic**             | Personal learning session — bridge → `Learning/&#60;slug>/` + `Vault/Learn {Topic}.md` (global `teach` skill) |
| **learning wrap-up**           | End a teach session — promote records to hub, brief log                                                       |
| **weekly review**              | After reading Sun brief → coach session → your `YYYY-Www` note                                                |
| **monthly review**             | Month close (alias: monthly coaching review)                                                                  |
| **yearly review**              | Year close (Jan window)                                                                                       |
| **wrap up** / `**/wrap-up`\*\* | End this session                                                                                              |
| `**/wrap-up all*`\*            | Multi-session catch-up — every repo, full ops audit, always refresh hot                                       |
| **research topic**             | Community / CRO dig                                                                                           |
| **vault index**                | After large vault changes                                                                                     |
| **janitor status-archive**     | Trim project Status to 5 newest blocks (older history = git)                                                  |

***

## Where to work (tool pick) [#where-to-work-tool-pick]

| You're working on…                                | Open                                                                                                | Tool                                          | Close with                                                             |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------- | ---------------------------------------------------------------------- |
| **App code** (Newfin, Rodyna)                     | `~/dev/&#60;repo>/` (own GitHub repo)                                                               | **Cursor** / Claude Code / Claude Code mobile | Merge PR → auto `~/dev` pull (LaunchAgent) + merge-poll + 07:30 brief  |
| **Draw** (shared repo)                            | `~/dev/draw/`                                                                                       | Cursor or Claude Code                         | `git pull` → 07:30 brief syncs vault (read-only repo; no agent pushes) |
| **Vault, skills, briefs**                         | `~/Jackie-OS/`                                                                                      | **Cowork** or **Cursor** — same files         | **wrap up** (commit is the sync)                                       |
| **Non-code deliverables** (Peaches, `Projects/…`) | `~/Jackie-OS/Projects/&#60;name>/` + `Vault/&#60;name>.md` — **inside jackie-os, no separate repo** | Cowork or Cursor on Jackie-OS                 | **wrap up** (commit is the sync)                                       |
| **Journal**                                       | Obsidian `Vault/YYYY-MM-DD.md`                                                                      | You (+ Persik DM)                             | Nothing                                                                |

***

## Related [#related]

* New project wiring: [Add a project](/jackie-os/docs/add-a-project)
* Agents read: `CLAUDE.md` → `Vault/hot.md` → skills
* Friends: [Install](/jackie-os/docs/install) · [What Jackie-OS does](/jackie-os/docs/what-it-does)
* Improvements: [Ideas backlog](/jackie-os/docs/ideas-backlog) · board: [Roadmap](/jackie-os/docs/roadmap)
