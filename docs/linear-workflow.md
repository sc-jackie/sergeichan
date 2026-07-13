# Linear workflow — Personal Website (sergeichan)

Operating manual for tracking this repo's work in Linear so it survives across
sessions. This is the short, repo-specific version; the **canonical full manual**
(status machine detail, agent Loop A/B prompts, definition of done, migration
deploy) lives in `~/dev/bunit/docs/linear-workflow.md` — read it for anything not
covered here.

## IDs

| Thing | Value |
|-------|-------|
| Workspace | `evegelin` |
| Team | `Evegelin` (key `EVE`) · `48daea3d-b403-4c71-b6c3-984db6b83fc4` |
| Project | `Personal Website` · `38c9ab37-880f-47db-be9c-8fb8c0f71718` |
| Board | https://linear.app/evegelin/project/personal-website-23c3aeec9577 |
| Repo | `sc-jackie/sergeichan` · branch `main` |

## Labels (workspace-shared — nothing to create per repo)

Three single-select groups apply to every project:
- **Pipeline** — `dev` (code → PR) · `content` (writing/media → draft, no PR) · `research` (decision → findings, no PR)
- **Stage** — `needs-refinement` (raw intent) → `needs-approval` (refined, awaiting your OK) → drop on approve
- **Type** — `Bug` · `Feature` · `Improvement`

## Status machine

`Backlog` (needs-refinement) → refine → (needs-approval) → you approve → `Todo`
→ `In Progress` → `In Review` (PR / draft) → `Done`.

## Sync contract (wrap-up)

This repo is **on the Hermes merge-poll auto-sync rail**: a batch of ≥2 merged
commits on `main` auto-posts a mirrored Linear **project status update** *and*
prepends `Vault/Personal Website.md` `## Status` (`System/ops/merge_poll.py`;
project name = the vault-note stem). So merged PRs flow to Linear + the vault on
their own. **Not** auto-synced: new issues, status moves, approvals, and
`content`/`research` work (no PR) — run `/wrap-up` for those.

On `/wrap-up`, after code is on `main`, in order:
1. **Issues → Done** — everything shipped this session (GitHub sync usually did `dev` issues on merge; verify).
2. **New work → Backlog** — bugs/ideas as `needs-refinement` + a Pipeline label.
3. **Post a Linear project status update** — mirror the vault `## Status` prepend (health + Shipped / Next / Blocked).

**Direction of truth:** code/`main` is ground truth; Linear + vault are projections of it.

## Enable full automation (one-time browser step)

**Linear → Settings → Integrations → GitHub** → connect `sc-jackie/sergeichan`,
and in status-automation map **PR opened → In Review** *and* **merged → Done**.
Until that's on, merge→Done won't fire and you'll bump issues by hand.

## Agent delegation (optional)

To let **Cyrus** / **Codex** build delegated issues: `ssh hermes` →
`cyrus self-add-repo https://github.com/sc-jackie/sergeichan evegelin` →
`systemctl --user restart cyrus.service`; put a `Personal Website` routing label
on any delegated issue. Full playbook: canonical manual § Agents + Rollout.
