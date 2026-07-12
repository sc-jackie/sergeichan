# Project registry (/docs/project-registry)



Single source of truth for **project-sync**, **morning-brief**, and **wrap-up**. Every active project maps vault ↔ working files ↔ code (when applicable). Janitor `skills-audit` checks this table against `Vault/Projects.md` and vault project notes.

| Key        | Vault note         | Kind     | Active | Source        | Path                          | Branch | GitHub                                             | Mirror (`STATUS.md`) | Roadmap index                              |
| ---------- | ------------------ | -------- | ------ | ------------- | ----------------------------- | ------ | -------------------------------------------------- | -------------------- | ------------------------------------------ |
| jackie-os  | Jackie OS          | code     | yes    | git           | `~/Jackie-OS/`                | master | `sc-jackie/jackie-os`                              | —                    | `System/plans/roadmap-index.md`            |
| newfin     | Newfin             | code     | yes    | git           | `~/dev/newfin/`               | main   | `sc-jackie/Newfin`                                 | —                    | `plans/roadmap-index.md`                   |
| rodyna     | Rodyna             | code     | yes    | git           | `~/dev/rodyna/`               | main   | `sc-jackie/rodyna-recipe-app`                      | —                    | `plans/roadmap-index.md`                   |
| draw       | Draw               | code     | yes    | git ⚠️ shared | `~/dev/draw/`                 | main   | `AleannLab/draw` 🤝 PR-based agent work authorized | —                    | — (Linear is the task roadmap)             |
| peaches    | Peaches Beauty     | non-code | yes    | status-file   | `Projects/PeachesBeauty/`     | —      | —                                                  | `STATUS.md`          | — (`STATUS.md` only)                       |
| b-unit     | B-Unit             | non-code | yes    | status-file   | `Projects/B-Unit/`            | —      | —                                                  | `STATUS.md`          | `Projects/B-Unit/plans/roadmap-index.md`   |
| bunit      | B-Unit             | code     | yes    | git           | `~/dev/bunit/`                | main   | `sc-jackie/bunit`                                  | —                    | `plans/roadmap-index.md`                   |
| nastusha   | Nastusha           | non-code | yes    | status-file   | `Projects/Nastusha/`          | —      | —                                                  | `STATUS.md`          | `Projects/Nastusha/plans/roadmap-index.md` |
| sergeichan | Personal Website   | code     | yes    | git           | `~/dev/sergeichan/`           | main   | `sc-jackie/sergeichan`                             | —                    | `plans/roadmap-index.md`                   |
| tan        | TAN Property Group | non-code | no     | vault         | `Vault/TAN Property Group.md` | —      | —                                                  | —                    | —                                          |

**Task tracking (Linear)** — team `EVE`, workspace `evegelin`. `bunit` + `b-unit` share the **B-Unit** product project (backlog + agent loop, `Pipeline` = `dev`/`content`/`research`); the TikTok/marketing production pipeline lives in a separate **B-Unit — Content** project (episode-per-issue, milestones = weeks). Labels are one workspace-wide 3-group taxonomy — `Pipeline` · `Stage` (needs-refinement/needs-approval) · `Type` (Bug/Feature/Improvement) — shared by every project, nothing to recreate per repo. The active code portfolio, including **Draw**, is tracked in Linear. Non-code projects remain in Bases.

**Tracker switch (`tracker: linear | bases`)** — the per-project flag that project-sync and morning-brief branch on. Default is `bases` for **every** row (task state from `git`/`status-file` + the Obsidian Ops Bases, exactly as before — no change). A row flips to `linear` once its Linear board exists: its task/plan state is then read from Linear via `System/scripts/linear-fetch.py` (`--project &#60;Linear project name>`) **instead of** the Ops Bases, closing the "Linear-only work invisible until /wrap-up" gap (esp. `content`/`research` issues with no PR). Migrate one row at a time; flip back to `bases` to revert.

* **`tracker: linear`** → `jackie-os` → Jackie OS project; `b-unit`, `bunit` → B-Unit; `rodyna` → Rodyna; `newfin` → Newfin; `sergeichan` → Personal Website; `draw` → Draw (Cyrus-enabled; routing label `Draw`).
* **`tracker: bases`** → every other active row (default; unchanged behavior).

**Source types**

| Source        | Truth                                      | Sync direction                                                        |
| ------------- | ------------------------------------------ | --------------------------------------------------------------------- |
| `git`         | `origin/&#60;branch>` + local clone health | repo → vault `## Status`; optional mirror → `STATUS.md`               |
| `status-file` | `Projects/*/STATUS.md`                     | STATUS → vault `## Status`; vault one-liner → mirror footer           |
| `vault`       | vault note file in Jackie-OS git           | jackie-os git log on that file → vault `## Status` (dormant projects) |

## Write policy — shared / contribute-only repos (🤝) [#write-policy--shared--contribute-only-repos-]

A `git` row whose **GitHub** cell carries 🤝 (or whose Source shows `⚠️ shared`) is a repo Sergei **does not own** — e.g. `AleannLab/draw`, co-owned with a collaborator. For these repos:

* **Default is READ-ONLY.** project-sync may diff `origin/&#60;branch>` → update the vault `## Status` and `STATUS.md` mirror. It must not push, commit, branch, or open a PR on a shared repo unless Sergei explicitly authorizes that repository.
* **Draw exception (authorized 2026-07-12):** `AleannLab/draw` is an active Linear/Cyrus code project. Cyrus may implement a delegated issue in an isolated worktree and open a normal reviewable PR; do not push directly to `main`. This exception applies only to Draw, not other shared rows.
* **No Jackie-OS scaffolding.** Never add `docs/JACKIE-OS.md`, `docs/solutions/`, an Agent-Learnings `## Jackie-OS sync` paragraph in the repo's `CLAUDE.md`/`AGENTS.md`, or any other Jackie-OS bookkeeping file. Bridge/learnings/compound write-ups stay on the Jackie-OS side only (vault note + `Vault/Agent-Learnings/{Title} learnings.md`). Skipped because: any PR there lands in the collaborator's repo.
* **Merge-poll:** owned repos are covered by the central Action in jackie-os (registry-driven). No per-repo sync tokens or Cursor automations.
* Only **actual app changes** Sergei makes himself belong in a shared repo — never agent housekeeping.

**Add a row** when a project gets a vault note — never hardcode paths in skills. &#x2A;*New project (code or non-code):** run skill [Add a Project](/jackie-os/docs/add-a-project) (registry + vault + **plans scaffold** + bridge + learnings + poller registration).

**Plans surface (owned code repos):** every new owned repo gets `plans/roadmap-index.md` + `plans/future-improvements.md` at onboarding. Non-code projects get `Projects/{Name}/plans/`. After each ship: [wrap-up](/jackie-os/docs/wrap-up) § Catalog cleanup.

**Code-repo bridge:** each **owned** `git` row should have `docs/JACKIE-OS.md` in the repo (template: `System/templates/JACKIE-OS-bridge.md`) so Cursor/Claude Code sessions know to run project-sync from Jackie-OS at session end. **Shared repos (🤝) get NO bridge** — see Write policy above.

## Canonical paths [#canonical-paths]

Use these when writing skills, bridge docs, or Agent-Learnings catalogs. Registry **Path** column uses the Mac home form; agents on other machines substitute.

| Context                   | Jackie-OS root                | Example code repo                                        |
| ------------------------- | ----------------------------- | -------------------------------------------------------- |
| **Mac (Sergei)**          | `~/Jackie-OS/`                | `~/dev/newfin/`                                          |
| **Linux / Cursor cloud**  | `/workspace/` (or clone path) | Must exist locally for `git` rows — see cloud note below |
| **Install guide default** | `~/jackie-os/`                | Any path you choose; update registry                     |

**Branch defaults:** jackie-os → `master`; all code repos → `main`.

**Cloud / headless agents:** Cursor cloud and CI clones often contain only Jackie-OS. Code repos live in a sibling tree (`~/dev/`), not checked out in cloud — project-sync skips missing paths and flags them; it does not fail the whole sync. For full sync, clones must exist at registry paths on the machine running sync (typically Sergei's Mac via Cowork or wrap-up).

**Mac auto-pull (`~/Jackie-OS` + `~/dev`):** LaunchAgent `com.jackie.dev-repos-pull` — every 30m + login; registry-driven ff-only pull (Jackie-OS `master` first, then code repos; skips dirty trees). Install: `bash System/scripts/dev-repos-pull-install.sh install`. Log: `~/.hermes/logs/dev-repos-pull.log`. Manual before a long session: `bash System/scripts/dev-repos-pull.sh`.

**Agent-Learnings catalogs:** prefer registry `Path` + relative `docs/solutions/` over hardcoded Mac absolutes.
