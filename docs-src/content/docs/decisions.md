---
title: Decisions Log
description: Shipped plans, architectural decisions, and lasting outcomes.
---

# Decisions Log

This ledger captures durable decisions made across Jackie-OS and related projects: shipped plans, architectural changes, and lessons that inform future work. Each row documents a decision, when it landed, and why it matters.

The **source of truth** is git history in the relevant repo; this file is the executive summary. After each ship, the dated plan file is deleted (`git rm`) and a one-line entry is added here.

See also: [Roadmap](/jackie-os/docs/roadmap) (active plans) · [Ideas Backlog](/jackie-os/docs/ideas-backlog) (speculative work)

## Decisions (by date)

| Date | Decision | Outcome / Impact |
|------|----------|------------------|
| 2026-08-17 | Cursor + Tailscale + Hermes + Grokbot | Interactive desk is Cursor. bb not in active use. [Desk](/jackie-os/docs/desk) · [Journey](/jackie-os/docs/desk-journey) |
| 2026-08-07 | bb desk (superseded) | One remote UI. Custom plugins. Replaced the Buzz office. Sergei stopped using it. |
| 2026-08-05 | Buzz Mode B (superseded) | Cockpit + factory. Two desks. Cut in two days. |
| 2026-07-23 | Cyrus + Linear farm (superseded) | Named agents + Delegate. RAM and Inbox load on a 4 GB VPS. |

---

**What goes here:** Every shipped plan, architectural milestone, or decision that shaped Jackie-OS. Speculative ideas stay in the backlog until they ship.
