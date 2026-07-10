# Claude Code for Personal Website

## Vault sync

This repo is registered in Jackie-OS. See [docs/JACKIE-OS.md](docs/JACKIE-OS.md) for vault sync details. tl;dr: work on `main` → 07:30 morning-brief syncs to `~/Jackie-OS/Vault/Personal Website.md`.

## Planning

Forward work lives in [`plans/roadmap-index.md`](plans/roadmap-index.md) (audited against code) and
[`plans/future-improvements.md`](plans/future-improvements.md) (idea catalog). Workflow:
[`plans/README.md`](plans/README.md).

**After every ship:** agents run [catalog cleanup](~/Jackie-OS/System/skills/wrap-up/SKILL.md#catalog-cleanup) —
prune the catalog, bump the roadmap audit stamp, archive dated plans — in the **same commit** as the code.
