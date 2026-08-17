# Operator desk (/docs/desk)



Sergei's live stack is **Cursor** (interactive coding / vault) + **Tailscale** (host mesh) + **Hermes VPS** (always-on briefs/ops) + **Grokbot** (Grok chat for thinking / drafting).

**bb is not in active use.** Live map: [System match](/jackie-os/docs/fleet). History of the desks that came before: [Desk journey](/jackie-os/docs/desk-journey).

## Core stack [#core-stack]

| Piece          | Job                                                                    | Not                                      |
| -------------- | ---------------------------------------------------------------------- | ---------------------------------------- |
| **Cursor**     | Primary interactive desk — Jackie-OS and `~/dev/*`                     | Always-on cron brain                     |
| **Tailscale**  | Mesh: MacBook · Home PC · Hermes · Cloud Agents                        | Public SSH as the default path           |
| **Hermes VPS** | Always-on briefs, journal, merge-poll, Telegram (`@persik_hermes_bot`) | Coding worker farm                       |
| **Grokbot**    | Thinking, drafting, parallel work                                      | Source of truth for git / vault / Linear |

Linear (team EVE) tracks work. Execute in **Cursor**.

## Hosts [#hosts]

| Host                          | Role                                        | Always-on |
| ----------------------------- | ------------------------------------------- | --------- |
| **MacBook** (M1, 2020)        | Operator laptop — Cursor, Tailscale         | No        |
| **Home PC**                   | Secondary desk — Cursor / WSL, local Ollama | No        |
| **Hermes VPS** (Hetzner cx23) | Hermes gateway + crons                      | Yes       |

Open **one Cursor window per repo**. Do not stack every checkout in one window.

## Session close [#session-close]

**`/wrap-up`**. Tag Status/Log `(cursor/sergei)` or `(hermes)` or `(grokbot/sergei)`.

## Do not [#do-not]

* Route new work through bb, Buzz, or the Cyrus fleet
* Treat Grokbot replies as vault or git truth
* Park coding agents on the 4 GB VPS
