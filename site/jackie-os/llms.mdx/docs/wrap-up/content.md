# wrap-up (/docs/wrap-up)



**Purpose:** close a working session — capture what changed, keep the vault and git in sync.

**Triggers:** `/wrap-up&#x60; · &#x2A;*`/wrap-up all`*&#x2A; (multi-session catch-up) · &#x2A;*`/wrap-up merge`** (PR ship first) · `wrap up` · `session end` · user marks work **done** · agent finishes implementation (proactive). Also run after a code-repo merge or direct push to `main` (manual — no Cursor automation). Backstops: **07:30 morning-brief** · merge-poll (\~2h) — see [Cheat sheet](/jackie-os/docs/cheat-sheet).

**Not this skill:*&#x2A; &#x2A;*`sync projects`** alone → project-sync only (no ops kanban, no full hot rewrite, **no git push**).

**Agent contract:** when you **finish implementation** (shipped code, merged PR, completed vault/system work, or Sergei reports something done) — **do not stop at the code diff**. Run this checklist in the **same session** unless Sergei explicitly says to skip. Leaving `hot.md`, today's brief, or project `## Status` stale is a failed handoff.

**Tomorrow's brief contract:** anything you'd expect in tomorrow morning's **Since last brief · Work*&#x2A; section must land in a dated **`## Status` prepend tonight*&#x2A; (use &#x2A;*`Shipped:`*&#x2A; / &#x2A;*`Next:`*&#x2A; / &#x2A;*`Blocked:`*&#x2A; sub-lines when the session shipped code). Plus brief &#x2A;*`## Log`**. `hot.md` is current-focus only. Morning-brief synthesizes **Since last brief** from Status prepends, merge-poll, and git delta — not from hot or memory.

## Git ship modes [#git-ship-modes]

Vault sync reads &#x2A;*`origin/&#60;branch>`** — unpushed commits don't exist for project-sync or tomorrow's brief.

| Mode                 | Trigger                            | When to use                                                                      |
| -------------------- | ---------------------------------- | -------------------------------------------------------------------------------- |
| **Direct** (default) | `/wrap-up` · `/wrap-up all`        | Work already on `main`/`master`, or solo-maintainer **direct push** after verify |
| **PR**               | `/wrap-up merge` · `wrap up merge` | Session ended on a **feature branch** — open PR, squash-merge, then vault sync   |
| **Commit only**      | `wrap up no push` (explicit)       | Rare — offline / draft handoff; **flag unpushed** in report                      |

**Default:** every `/wrap-up&#x60; ends with Jackie-OS &#x2A;*`git commit` + `git push`** to `origin/master`. Never force-push.

**Order:** finish all code-repo ships (direct or PR) **before** Jackie-OS project-sync — vault Status must reference merged SHAs on `origin/main`.

## Compound check — gate, before vault sync [#compound-check--gate-before-vault-sync]

After the code ships and **before** project-sync, ask **silently** (no need to call it out): did this session produce a **reusable technique, root-caused bug, or hard-won insight** — something a future agent couldn't reconstruct from the diff? (typo, rename, boilerplate ship, version bump → No. Novel pattern, subtle root cause, non-obvious gotcha → Yes.)

* **Yes →** run `jos-compound` now, while context is hot (`docs/solutions/` + agent-learnings-index row). Don't defer it to a cron/Action — a cold post-merge job can't know what you tried or whether the fix was worth documenting. State the intent once; don't ask permission.
* **No →** skip silently. Most sessions don't warrant it. **Do not offer jos-compound proactively after every ship** — the gate is a private judgment call. If unsure, the answer is No.

## After implementation — checklist [#after-implementation--checklist]

Use this when work is **done**, not only when Sergei says "wrap up".

### A — Code shipped (`~/dev/*` merge or push to `main`) [#a--code-shipped-dev-merge-or-push-to-main]

1. **In the code repo:** verification passed; &#x2A;*commit + push to `main`/`master`** (default) **or*&#x2A; PR merged via &#x2A;*`/wrap-up merge`**. See § Git ship modes.
2. **jos-compound** — run the Compound check above.
3. **Roadmap reconcile gate** — if a **tracked plan / initiative** finished or advanced, or shipped work overlaps the idea catalog: § Roadmap reconcile + § Catalog cleanup in that repo (commit + push **in the code repo**). Includes: **CHANGELOG** § Unreleased for Newfin and the **litmus** (live `plans/` = only active files; `git rm` anything ✅/superseded/deferred-indefinitely). Skip only for drive-by fixes with no plan and no catalog overlap. Draw: skip (vault only).
   3b. **Linear-tracked repo** — if the code repo has `docs/linear-workflow.md` (currently **bunit*&#x2A;), follow its **§ Sync contract** with Linear: move shipped issues → `Done` (verify GitHub sync didn't already), new bugs/ideas → `Backlog` (`AI Refinement`). **Posting a Linear project status update is automated** — the Hermes merge-poll cron does it for any batch of ≥2 merged commits on a `docs/linear-workflow.md` repo. Only post one yourself if the session's merge was a single commit (below the cron's threshold) or you can see the cron's post failed. The catalog for these repos is Linear, not `future-improvements.md`. Skip silently for repos without that file.
4. **From Jackie-OS:** project-sync → prepend `Vault/{Newfin,Rodyna,Draw}.md` `## Status` → rebuild `hot.md` active lines → append today's brief `## Log` → fix any **stale claims** you know are wrong in brief/hot (e.g. "migration pending" when GHA auto-applies; "P1 in progress" when roadmap index says ✅ shipped). On **heavy code days** (≥15 commits or multiple themes in one session), the vault Status prepend should be **thematic*&#x2A; with explicit &#x2A;*`Shipped:`*&#x2A; / &#x2A;*`Next:`*&#x2A; / &#x2A;*`Blocked:`*&#x2A; sub-lines. Add &#x2A;*`## Since sync`** to today's brief when the session contradicts morning **Projects** or **Since last brief · Work** (all active code projects, not Jackie-OS only).
5. **Jackie-OS plans:** if a `System/plans/` item shipped → § Roadmap reconcile (Jackie-OS system plans).
   5b. **Docs sync** — if the ship added/changed a skill, script, worker agent, connector, or architecture-level behavior: update the owning doc per the ownership map (CATALOG for skills/scripts, CONCEPTS for vocabulary, ARCHITECTURE for system shape) **in the same commit**. The docs-first gate only works if docs stay true.

### B — Jackie-OS / vault / `System/` only [#b--jackie-os--vault--system-only]

1. **Status:** if focus, blockers, or next actions shifted → prepend relevant vault note `## Status` (e.g. Jackie OS, project notes).
2. **B-Unit visit (Jul 2–22):** if Sergei reported execution → append today's bullets to matching `Projects/B-Unit/curriculum/week-*/day-NN.md&#x60; **## Done**; run `python3 System/capture/b_unit_day_log_sync.py` if journal used `B-Unit:` prefix.
3. **Brief:** append `## Log&#x60;; clear inbox/carried items Sergei marked done; add &#x2A;*`## Since sync`** if evening session contradicts morning brief **Projects**, **Since last brief**, or **Today** (one short corrective block per affected project — applies after code-repo sprints too). On sprint days, prefer one **themed** Log line over ten sha lines.
4. **hot.md:** full overwrite (\~500 words) when priorities/blockers changed.
5. **Plans/skills:** shipped plan → § Roadmap reconcile (Jackie-OS system plans); retired skill → pointer in Skills Registry. If Jackie-OS surface changed materially (projects, automations, teach tracks) → refresh the shareable explainer.
   5b. &#x2A;*Skill feedback (capture, then offer):** if a **skill** under- or over-performed this session and Sergei corrected its output, append one `open` row to skill-feedback (date · skill · signal · `session` · open). &#x2A;*If you appended a row this session, offer once:** "want me to draft a skill-improve diff for \<skill> now, or leave it for Sunday?" — on yes, draft the diff for approval; on no, it waits for the weekly curator pass. Never edit the skill unprompted. Skip the whole step silently if no skill misbehaved.
6. **Commit + push** Jackie-OS touched files (`origin/master`). Skip push only when Sergei explicitly says so.

### C — Sergei reports admin / life items done (no code) [#c--sergei-reports-admin--life-items-done-no-code]

1. Remove from today's brief inbox/carried lines.
2. Log under `## Log` with timestamp.
3. Commit if brief changed.

### D — Do **not** sync (common mistakes) [#d--do-not-sync-common-mistakes]

| Situation                                             | Action                                                 |
| ----------------------------------------------------- | ------------------------------------------------------ |
| Vault-only doc edit that doesn't change project state | Commit only; skip full project-sync                    |
| Routine typo in a skill                               | Commit; refresh `hot.md` only if priorities shifted    |
| Code merged but you're still in the code repo         | Switch to Jackie-OS and finish § A.3–A.5 before ending |

## Roadmap reconcile [#roadmap-reconcile]

After a **realized plan** ships on `main`, update that project's roadmap index and plan docs **in the same session** — before project-sync. Morning-brief syncs vault, not `plans/`.

### When to run [#when-to-run]

| Shipped                                                                       | Run?                                       |
| ----------------------------------------------------------------------------- | ------------------------------------------ |
| Last task of a dated plan / initiative on `main`                              | **Yes**                                    |
| Partial slice (open phases remain)                                            | **Yes** — mark 🔵 partial + what's next    |
| Bugfix / chore with no plan doc                                               | **No**                                     |
| Shipped slice maps to `future-improvements.md` (with or without a dated plan) | **Yes** — § Catalog cleanup required       |
| Jackie-OS `System/plans/` item                                                | **Yes** — see Jackie-OS system plans below |

**Roadmap paths** — `System/project-registry.md` **Roadmap index** column (not hardcoded in skills).

**Owned code repos** — ground truth is code, migrations, merged PRs — not plan banners or `- [ ]` boxes. Verification depth: Newfin `docs/solutions/workflow-issues/verify-plan-status-against-ground-truth.md` (same rules in any repo).

1. Identify the plan (roadmap-linked initiative or implementation plan you finished).
2. Verify: grep promised artifacts; `git log` since plan date; **code wins** over stale headers/checkboxes.
3. Update roadmap index: `_Last audited against main on YYYY-MM-DD (HEAD …)_`; row → ✅ shipped · 🔵 partial · 📋 idea · ⏸ deferred; refresh "remaining surface" / next-work blurb if present.
4. Update plan doc header (`> Status: ✅ shipped …` or partial). Index is the live board — don't mass-tick body checkboxes unless auditing the whole doc.
5. **Delete-on-ship when fully realized (2026-06-29 policy).** Capture the deliverable in `roadmap-index.md` § Shipped (+ `CHANGELOG` for Newfin) and any durable decision in `decisions-log.md&#x60;, then **`git rm` the dated plan body** — no `archive/` of full bodies; git history is the audit trail. Repoint any links into the deleted file (to the ledgers / live skills / `docs/solutions/&#x60;). Never delete idea catalogs or the two ledgers. &#x2A;(Rodyna's existing `plans/archive/implemented/` predates this policy — sweep it on its next ship.)*
6. **[Catalog cleanup](#catalog-cleanup)** — same commit when the ship touches catalog lines.
7. **Litmus (run before commit, every repo touched).** The live `plans/` folder must contain **only** `roadmap-index.md`, `decisions-log.md`, `future-improvements.md`, `README.md`, and **active** dated plans. Grep each remaining live plan against its roadmap row: anything marked ✅ shipped / ⤴ superseded / ⏸ deferred-indefinitely should be **deleted** (after the two ledgers capture it), not left live. This catches the easy miss where a row gets flipped to ✅ but the file lingers.
8. Commit in the **code repo** — `docs(plans): reconcile &#60;plan> shipped on &#60;sha>` (or `… catalog after &#60;topic>`) — push before Jackie-OS project-sync.

**Jackie-OS system plans:** update [Roadmap](/jackie-os/docs/roadmap) § Shipped + [Decisions log](/jackie-os/docs/decisions) + [Ideas backlog](/jackie-os/docs/ideas-backlog); fold durable rules into skills or root `CLAUDE.md&#x60;; **`git rm` the shipped plan body** (git history keeps it); commit in Jackie-OS.

## Catalog cleanup [#catalog-cleanup]

**Required in the same session** whenever shipped code realizes (fully or partially) a line in `plans/future-improvements.md`, or when a tracked plan that originated from the catalog finishes. Agents must not leave catalog bullets describing behavior already on `main`. **No Cursor automation** — this runs as part of wrap-up after every ship.

**Repos:** Newfin + Rodyna (`plans/future-improvements.md` + `plans/roadmap-index.md`). Jackie-OS: `System/plans/future-improvements.md` + `System/plans/roadmap-index.md`.

| Ship outcome          | `future-improvements.md`                                                                                     | `roadmap-index.md`                                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Fully shipped         | **Remove** the bullet, or one-line **Shipped baseline** footnote in that section if it helps the next reader | Bump `_Last audited…` stamp; add/update **Shipped** table row if major; trim **Genuinely-remaining** / **Near-term ops** |
| Partially shipped     | Keep bullet; prefix **🔵**; text = gap only (not the whole original scope)                                   | 🔵 partial on plan row if tracked; refresh remaining-surface blurb                                                       |
| Won't do / superseded | Remove or move to **Out of scope** with date + reason                                                        | —                                                                                                                        |

### Steps [#steps]

1. Grep `future-improvements.md` for keywords from the ship slice (feature name, route, migration).
2. Verify against code — same discipline as verify-plan doc; **code wins**.
3. Edit catalog: no stale "not started" lines for live behavior; never archive `future-improvements.md`.
4. Update `roadmap-index.md` audit stamp + remaining-surface paragraph in the **same commit**.
5. If the slice was large, make sure `decisions-log.md` captures any durable decision (git history holds the blow-by-blow) — catalog cleanup still required either way.

**Commit in the code repo** with roadmap reconcile (step 8 above). Morning-brief project-sync does **not** edit `plans/` — only agents do.

## Process [#process]

1. **Project sync** — always (even if this session only touched an external code repo or `Projects/` folder). Syncs all registry rows: git repos, `STATUS.md` files, vault notes, `hot.md`, and ops-board project lanes when enabled.
2. **Ops board** — when `Vault/Ops/Bases/Work.base` exists, follow wrap-up (tasks: `doing`→`done`; plans: ship → `status: done` + `done:` date; new catalog rows → plan notes in **backlog**). Move shipped `*-done-*` cards to `Vault/Ops/Archive/Tasks/` or `Archive/Plans/` — never leave done cards in live folders.
   2b. **Status trim** — when any active project note's `## Status` exceeds \~80 lines, run status-archive (keep 5 newest blocks) before commit.
3. **Status (local)** — if this session changed something project-sync didn't capture (judgment, blockers, decisions, smokes, shipped slices), **prepend** the relevant vault note `## Status` (e.g. Jackie OS, Newfin, Rodyna). Date each entry. Litmus: would this belong in tomorrow's brief **Yesterday · Work**? If yes, it belongs here tonight — not only in `hot.md` or `## Log`.
4. **Log** — append a timestamped one-liner to today's brief (`Vault/Briefs/YYYY-MM-DD brief.md`) under `## Log` (create the section if missing). If no brief exists, skip.
5. **Brief freshness** — only for **evening Jackie-OS sessions** (not PR merges — morning-brief regenerates at 07:30). If today's brief exists and its **Open loops** or **Code repos** sections contradict vault `## Status` after step 1, append `## Since sync`: bullet list of what changed since the morning brief was written. Do not rewrite the morning brief body.
6. **Hot cache** — project-sync rebuilds `Vault/hot.md` active-project lines; wrap-up overwrites the full file (\~500 words): focus, one line per active project, open decisions, expected next. Per-project cap: \~80 words; overflow belongs in the project note's `## Status`.
7. **Commit + push*&#x2A; — Jackie-OS: &#x2A;*`jackie-os-git-native.sh commit`*&#x2A; then &#x2A;*`jackie-os-git-native.sh push`** via `osascript` when run from Cowork (never `git commit` / `git push` in Cowork bash). Terminal/Cursor: plain `git commit` + `git push origin master`. Never force-push. `~/dev/` code repos ship per § Git ship modes before vault sync.

## Rules [#rules]

* **Tomorrow's brief:** `## Status` prepend is the handoff for shipped work; brief `## Log` is the audit trail. Don't rely on `hot.md` or chat memory for what tomorrow's **Yesterday** should say.
* Log entries are factual one-liners, not narratives. Never log into journal content.
