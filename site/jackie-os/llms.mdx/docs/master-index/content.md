# Jackie-OS Documentation Hub (/docs/master-index)



> **The rule this page exists for (docs-first):** before building anything new — a skill, script, worker, connector, automation — check this index for prior art. Something similar probably exists; extend it instead of adding a parallel thing. And when you ship something new, **update the owning doc in the same commit** (ownership map below).

## Read this by intent [#read-this-by-intent]

| You want to…                                                  | Read                                                | Format                                                                   |
| ------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------ |
| Understand the whole system in one screen                     | [Architecture](/jackie-os/docs/architecture)        | systems map (Jackie-OS · Newfin · Rodyna · Draw · B-Unit + shared rails) |
| Learn the vocabulary (Hermes, Persik, hot.md, two-bot model…) | [Concepts](/jackie-os/docs/concepts)                | glossary + infra concepts                                                |
| Find a skill or script, or decide skill-vs-script             | [Catalog](/jackie-os/docs/catalog)                  | full inventory, grouped by job                                           |
| Skill registry with triggers + install                        | [Skills Registry](/jackie-os/docs/skills-registry)  | tables + naming convention                                               |
| Operate the system day-to-day (what to say, what runs itself) | [Cheat Sheet](/jackie-os/docs/cheat-sheet)          | operator cheat-sheet (Sergei)                                            |
| See the live desk                                             | [Operator desk](/jackie-os/docs/desk)               | Cursor + Tailscale + Hermes + Grokbot                                    |
| See the live system map                                       | [System match](/jackie-os/docs/fleet)               | flow, tooling, models, personas, decisions                               |
| See why the desk moved                                        | [Desk journey](/jackie-os/docs/desk-journey)        | Cyrus → Buzz → bb → Cursor                                               |
| Know what runs when (crons, 3 scheduler layers)               | [Vault Rhythm](/jackie-os/docs/vault-rhythm)        | cron map                                                                 |
| See current state fast                                        | `Vault/hot.md`                                      | \~500-word session cache                                                 |
| See forward work / plans                                      | [Roadmap](/jackie-os/docs/roadmap)                  | plan index + [Ideas Backlog](/jackie-os/docs/ideas-backlog)              |
| Find a past technical fix                                     | `docs/solutions/` (per repo)                        | cross-repo learnings index                                               |
| Explain the system to a friend                                | [What Jackie-OS Does](/jackie-os/docs/what-it-does) | narrative                                                                |
| Set it up from scratch                                        | [Install](/jackie-os/docs/install)                  | guide + public template                                                  |
| Agent operating rules                                         | `CLAUDE.md` (local)                                 | read-order, roles, safety                                                |

## Ownership map — who updates what, when [#ownership-map--who-updates-what-when]

| Surface         | Owns                                                               | Update trigger                                                    |
| --------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------- |
| Architecture    | system shape, repos, rails, automation layers                      | architecture-level change (new repo, new rail, cron layer change) |
| Concepts        | vocabulary, infra concepts (gateway, two-bot, three-cron, workers) | new durable concept; `jos-compound` seeds it                      |
| Catalog         | every skill + script row                                           | skill/script added, renamed, retired                              |
| Skills Registry | skill registry, triggers, `jos-` naming convention                 | same                                                              |
| Cheat Sheet     | operator triggers                                                  | new thing Sergei can say                                          |
| Plans           | forward work                                                       | jos-plan output; delete-on-ship                                   |
| Learnings       | technical fixes                                                    | `jos-compound` after non-trivial fixes                            |
| This file       | the index itself                                                   | new doc surface added or retired                                  |

## Workers — who runs what [#workers--who-runs-what]

| Worker                        | Runs on           | Scope                                                               | Dispatch                       |
| ----------------------------- | ----------------- | ------------------------------------------------------------------- | ------------------------------ |
| **Cursor**                    | MacBook / Home PC | Interactive coding, vault, ops                                      | Sergei, per session            |
| **Hermes** (Claude Agent SDK) | VPS               | Morning stack, journal, sync, ops, research. **Not** a coding farm. | Cron + Telegram                |
| **Grokbot**                   | Chat              | Thinking / drafts. Not git or vault truth.                          | Sergei                         |
| **Linear**                    | Cloud             | Backlog only. No Delegate.                                          | File issue → execute in Cursor |
| **Codex** (legacy CI)         | GitHub CI         | Optional PR review lane                                             | Labels / CI                    |

The Cyrus/Buzz/bb factory is retired. History: [Desk journey](/jackie-os/docs/desk-journey). Roster notice: Jackie-OS `Vault/Agent-Team.md`.

## Connectors — external surfaces [#connectors--external-surfaces]

| Connector                           | Type                      | Used by                                           | Config lives                             |
| ----------------------------------- | ------------------------- | ------------------------------------------------- | ---------------------------------------- |
| Telegram `@persik_hermes_bot`       | bot (full Hermes channel) | briefs, journal, ops, COO/CTO                     | VPS + `.secrets/telegram.env`            |
| Telegram `@Persik_finbot`           | bot (Newfin product)      | money COO, advisor, owner ops                     | Vercel env (never on VPS)                |
| **Linear**                          | MCP + API                 | tracking + agent-team dispatch (repo/mode labels) | claude.ai connector                      |
| **Supabase**                        | MCP + CLI                 | Newfin/Rodyna/B-Unit DBs                          | claude.ai connector                      |
| **Gmail / Google Calendar / Drive** | MCP + OAuth scripts       | morning brief, COO                                | claude.ai connectors · `.secrets/` OAuth |
| **Vercel**                          | MCP + auto-deploy         | Newfin/Rodyna/B-Unit hosting                      | claude.ai connector                      |
| **GitHub**                          | `gh` CLI + merge-poll     | all repos, PR flow                                | `gh auth`                                |
| Hermes SSH bridge                   | ssh                       | Newfin advisor turns → VPS LLM gateway            | `hermes-ops-exec.sh` allowlist           |
| **codebase-memory**                 | MCP (local)               | structural code queries                           | `~/.cursor/mcp.json` · cron index        |

## Skill naming [#skill-naming]

`jos-` prefix = owned + battle-tested (jos-plan, jos-compound, jos-design-ui). Unprefixed global = upstream (grill-for-unknowns, last30days, teach). Repo skills carry no prefix — everything in `System/skills/` is owned by definition. Full convention: [Skills Registry](/jackie-os/docs/skills-registry) § Naming.
