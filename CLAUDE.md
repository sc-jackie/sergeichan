# Claude Code for Personal Website

## Vault sync

This repo is registered in Jackie-OS. See [docs/JACKIE-OS.md](docs/JACKIE-OS.md) for vault sync details. tl;dr: work on `main` → 07:30 morning-brief syncs to `~/Jackie-OS/Vault/Personal Website.md`.

## Planning

Forward work lives in [`plans/roadmap-index.md`](plans/roadmap-index.md) (audited against code) and
[`plans/future-improvements.md`](plans/future-improvements.md) (idea catalog). Workflow:
[`plans/README.md`](plans/README.md).

**After every ship:** agents run [catalog cleanup](~/Jackie-OS/System/skills/wrap-up/SKILL.md#catalog-cleanup) —
prune the catalog, bump the roadmap audit stamp, archive dated plans — in the **same commit** as the code.

## Design review gate — Rams (2026-07-23)

Every UI change in this repo goes through the **Rams design review** (MCP server `rams`, already connected user-scope; agents on hermes have it via cyrus config) **before commit/PR**:

1. Run the Rams review on your changed UI code (`mcp__rams__*` tools; if the tools aren't loaded, find them via ToolSearch).
2. Fix every **critical** finding. Apply moderate fixes unless they fight deliberate design intent (say so when you skip one).
3. Include the final **Rams score /100** in the commit message or PR description.
4. One review per change-set, not per iteration — reviews are metered (free plan, 30/month).
