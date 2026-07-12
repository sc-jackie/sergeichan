# new-project (/docs/add-a-project)



**Purpose:** one-shot onboarding for a **new project — code repo OR non-code** — into Jackie OS, so everything (registry, vault note, indexes, learnings, sync coverage) is wired *before* real work starts. The agent does all the wiring; for code repos there is **zero** manual setup if the read PAT is scoped to all your repos (see § One-time prerequisite).

**Trigger:** "new project", "new code project", "new non-code project", "register project", "I created a repo", "set up project X" — or the agent detects an unregistered project Sergei is starting.

**Role:** COO + CTO setup.

**Output:** registry row; `Vault/{Title}.md` note; `Projects.md` / `Home.md` index links; (code) repo bridge + learnings catalog + poller registration; (non-code) `Projects/{Name}/` folder; one commit.

***

## Step 0 — classify [#step-0--classify]

Ask (or infer): **project name / title**, **type** — `code` (its own git repo) or `non-code` (lives inside jackie-os) — &#x2A;*active?**, and for code: **GitHub remote** (`owner/repo`), **local path**, **default branch** (`main`), &#x2A;*owned or shared?**.

Then run the matching path. Both end with a single `git commit` in jackie-os.

***

## Path A — code project (own git repo) [#path-a--code-project-own-git-repo]

> **Ownership gate:** if the remote owner isn't Sergei's account (e.g. `AleannLab/…`) or he says it's shared, mark the registry row 🤝 **read-only**, and **skip steps 4–6** (repo bridge, design system, code-repo commit) — Jackie-OS reads a shared repo into the vault but never writes to it and never polls it with the PAT.

1. **Registry** — add a `git` row to `System/project-registry.md`: paths, branch, GitHub remote, mirror if any, **Roadmap index** (`plans/roadmap-index.md` — required for owned repos; `—` for shared 🤝).
2. **Vault note + indexes** — `Vault/{Title}.md` (frontmatter `[[Projects]]`, stub, empty `## Status`); add wikilink to `Vault/Projects.md`; if Active, add to `Vault/Home.md` Active list.
3. **Learnings** — `Vault/Agent-Learnings/{Title} learnings.md` from the Newfin learnings template; add a row to `Vault/Agent-Learnings/Index.md`.
4. **Repo bridge** (in the **code repo** — owned only): copy `System/templates/JACKIE-OS-bridge.md` → `docs/JACKIE-OS.md` (fill KEY, vault note, branch); scaffold `docs/solutions/README.md` if missing; add the **Vault sync** paragraph to the repo's `CLAUDE.md`/`AGENTS.md` (point to `docs/JACKIE-OS.md`).
5. **Plans scaffold** (owned code repos only — skip 🤝 shared):
   * Create `plans/` from `System/templates/plans/`: `README.md`, `roadmap-index.md`, `future-improvements.md`, `archive/README.md`.
   * Replace placeholders: `{PROJECT}` = display name, `{DATE}` = today `YYYY-MM-DD`, `{INITIAL_SHA}` = `git rev-parse --short HEAD` (or `0000000` before first commit).
   * Append planning section to `CLAUDE.md` (create `## Planning` if missing). Mirror one line in `AGENTS.md` if present.
   * In vault note `## Status` stub, link `plans/roadmap-index.md` as the forward-work surface.
   * **Do not** copy Newfin/Rodyna-specific archives — empty `plans/archive/` except README.
6. **Design system** (owned code repos — skip API-only / CLI-only / shared 🤝):
   * **When:** Step 0 expects a user-facing UI, *or* the repo already has a frontend package (`web/`, `miniapp/`, `frontend/`, `apps/*/web`, or a subdir with `react`/`vue`/`svelte` in `package.json`). If Sergei says "no UI", skip.
   * **Doc path** (first match):
     * `miniapp/` → `miniapp/docs/design-memory.md`
     * `web/` at repo root → `docs/design-system.md` (token source: `web/src/styles/globals.css` or project's token file)
     * other UI package `{pkg}/` → `{pkg}/docs/design-memory.md`
     * UI planned but not scaffolded yet → `docs/design-system.md` at repo root (`{UI_PACKAGE}` = *TBD*, `{TOKEN_SOURCE}` = *TBD*)
   * Copy design system template; replace `{PROJECT}`, `{UI_PACKAGE}`, `{TOKEN_SOURCE}`. Template includes YAML frontmatter (DESIGN.md format) + prose; fill anchor token values from the token CSS file. Do not overwrite an existing design doc — merge or skip if one is already canonical (e.g. Newfin `docs/design-system.md`, Rodyna `miniapp/docs/design-memory.md`).
   * Add &#x2A;*`design:lint`** to the repo root `package.json` (or UI workspace `package.json` if no root scripts): `"design:lint": "npx -p @google/design.md@0.3.0 designmd lint &#60;DESIGN_DOC_REL>"` — path matches the doc from the bullet above.
   * Append the **UI** section from design section template to `AGENTS.md` and/or `CLAUDE.md` (replace `{UI_PACKAGE}`, `{DESIGN_DOC_REL}`). Skip if an equivalent section already points at the design doc.
   * **Page-load benchmark (FF 003):** copy benchmark page-load template into the repo (path per layout — e.g. `docs/performance.md` or `{UI_PACKAGE}/docs/performance.md`). Scaffold benchmark script from Newfin (`server/src/scripts/benchmark-page-load.ts`) or Rodyna (`miniapp/scripts/benchmark-page-load.ts`) pattern. Add `npm run benchmark:pages` + Definition of done line: *new screen → add to benchmark; all routes \<50ms p50 warm*.
   * Optional later (not required at onboarding): `npm run setup:ui` + mock API + deep links — see Rodyna `miniapp/README.md` § Plain-browser design work.
7. **Commit in the code repo** — bridge + solutions + &#x2A;*plans/** + design doc + AGENTS/CLAUDE blurbs in one PR or push.
8. **Poller — nothing to do.** The merge-poll is **registry-driven** (`.github/scripts/merge_poll.py` reads `project-registry.md`), so adding the row in **A1** already puts the repo under the intraday poll (owned `sc-jackie/*`, Active, not shared).
9. **Project-sync** — run project-sync; prepend the vault `## Status` stub; refresh `hot.md` if Active.
10. **Linear + agents** (optional, owned repos) — to put the repo on the Linear board with Cyrus/Codex delegation, run linear-project-rollout next. The 3 label groups (`Pipeline`/`Stage`/`Type`) are workspace-shared, so there's nothing to create — just a project + IDs swap.

## Path B — non-code project (lives inside jackie-os) [#path-b--non-code-project-lives-inside-jackie-os]

No GitHub repo, no bridge, no Action, no secret — the work is *in* the vault, so the commit **is** the sync.

1. **Folder** — create `Projects/{Name}/` for working files; add `Projects/{Name}/STATUS.md` only if you want a `status-file` mirror.
2. **Plans scaffold** — create `Projects/{Name}/plans/` from project plans templates: `README.md`, `roadmap-index.md`, `future-improvements.md`, `archive/README.md`. Replace `{PROJECT}`, `{VAULT_NOTE}`, `{DATE}`. Registry **Roadmap index** → `Projects/{Name}/plans/roadmap-index.md`.
3. **Registry** — add a `vault` row (or `status-file` row if you made a STATUS.md) to `System/project-registry.md` with Roadmap index path from step 2.
4. **Vault note + indexes** — `Vault/{Title}.md` (frontmatter, stub, empty `## Status`); wikilink in `Vault/Projects.md`; Active list in `Home.md` if active. Link `Projects/{Name}/plans/roadmap-index.md` in the stub.
5. **Commit** — `git commit` jackie-os. Done — morning-brief + wrap-up track it from here.

***

## One-time prerequisite (Sergei, once ever — not per project) [#one-time-prerequisite-sergei-once-ever--not-per-project]

For code repos to get **intraday** merge-poll coverage, jackie-os needs one secret:

* Create **one** fine-grained PAT → **Contents: Read**, scoped to **All repositories** under `sc-jackie` (so every future repo is auto-covered — no per-project secret work).
* Add it to jackie-os → Settings → Secrets and variables → Actions → &#x2A;*`JACKIE_OS_READ_PAT`**.

Skip this and code repos still sync **daily** via the 07:30 morning-brief — you just lose the intraday entry. Non-code projects need nothing.

## Verification [#verification]

* [ ] `project-sync` shows the new row without errors (path exists, or flagged skip).
* [ ] Vault note + index links exist; (code) learnings catalog + `Index.md` row present.
* [ ] **Code, owned:** `docs/JACKIE-OS.md` + `docs/solutions/README.md&#x60; + &#x2A;*`plans/`** (roadmap-index, future-improvements, README, archive/) committed in the repo; `CLAUDE.md` **Planning** section; repo in merge poll via registry. &#x2A;*UI repos:** design doc + `AGENTS.md`/`CLAUDE.md` UI section + **page-load benchmark** (`npm run benchmark:pages`, \<50ms p50 DoD) — or documented skip reason. &#x2A;*Shared (🤝):** confirm NOTHING was written/pushed to the repo, Roadmap index = `—`, and it's NOT in `merge_poll.py`.
* [ ] **Non-code:** `Projects/{Name}/&#x60; + &#x2A;*`Projects/{Name}/plans/`** + vault note committed; no repo/bridge/Action created.

***

## Workflows that pick up automatically (after onboarding) [#workflows-that-pick-up-automatically-after-onboarding]

| Workflow                  | How it finds the project                                                                                        |
| ------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **project-sync**          | `System/project-registry.md`                                                                                    |
| **morning-brief (07:30)** | Active registry rows → rich vault Status daily (authoritative sync)                                             |
| **merge-poll (\~3h)**     | `.github/scripts/merge_poll.py` REPOS — code repos only, thin intraday entry                                    |
| **wrap-up**               | project-sync all rows; § Catalog cleanup on `plans/` when code ships                                            |
| **hot.md**                | Active project one-liners from vault Status                                                                     |
| **weekly-review**         | Vault notes + week dailies                                                                                      |
| **jos-compound**          | Run **in-session** after a non-trivial fix (not automated) → repo `docs/solutions/` + agent-learnings-index row |
| **Planning loop**         | `plans/roadmap-index.md` → dated plan → ship → archive + catalog cleanup ([wrap-up](/jackie-os/docs/wrap-up))   |

**Do not auto-wire:** Cursor automations (none exist), Peaches-style Cowork one-offs, Hermes VPS.

***

## Rules [#rules]

* Push the code repo before expecting project-sync to see commits.
* Nested repo inside Jackie-OS (Rodyna pattern): ensure the clone is in jackie-os `.gitignore`; registry path points at the clone.
* Never duplicate full `docs/solutions/` bodies into the vault — index rows only.
* **Shared / external / contribute-only repos (🤝, e.g. `AleannLab/draw`):** registry + vault note + learnings catalog are OK (Jackie-OS side only). **Never** write a bridge/`docs/solutions/`/CLAUDE.md into the repo, never push/PR to it, never add it to `merge_poll.py`. Sync is read-only via morning-brief.
