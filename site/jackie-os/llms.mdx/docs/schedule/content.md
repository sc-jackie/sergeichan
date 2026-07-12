# The day, hour by hour (/docs/schedule)



Weekday in Europe/Warsaw — every job runs in exactly one of three scheduler layers; double-runs are prevented by design. Hermes VPS is always-on; Mac weekly-review is the only surviving Cowork schedule.

## Weekday timeline (Monday–Friday) [#weekday-timeline-mondayfriday]

| Time                | Layer          | Job                    | What it does                                                                                   |
| ------------------- | -------------- | ---------------------- | ---------------------------------------------------------------------------------------------- |
| 07:00               | agent-cron     | telegram-sweep         | Ingests Telegram Clippings (if any) and commits to vault                                       |
| 07:05               | agent-cron     | nastusha-brief-refresh | Mirrors Sergei's Obsidian brief to VPS work directory                                          |
| 07:10               | agent-cron     | trade-digest-capture   | Ingests financial trades and crypto spot prices (if rows exist)                                |
| 07:15               | agent-cron     | nastusha-brief-push    | Syncs briefing context back to Obsidian                                                        |
| **07:30**           | **agent-cron** | **morning-brief**      | **Full pipeline: git pull → project-sync → LLM brief → calendar + inbox → Telegram DM + HTML** |
| 07:45               | agent-cron     | daily-linking          | Generates semantic links for today's brief into `Briefs/… links.md`                            |
| 08:00               | os-crontab     | healthcheck            | Verifies Hermes VPS services are running; reports to ops                                       |
| 08:35 (conditional) | os-crontab     | degraded-brief         | Fires only if no deliverable 07:30 brief exists — vault + hot.md fallback                      |
| every hour (:00)    | agent-cron     | journal-capture        | Indexes Google Calendar meetings into daily note; also ingests `Inbox.md`                      |
| every 2 min (\*/2)  | os-crontab     | autodeploy             | Pulls repo changes and rebuilds symlink farm (`~/.../scripts` ← `System/{coo,capture,ops,…}/`) |
| every 2h (:25)      | os-crontab     | merge-poll             | Polls `~/dev/*` repos for merges; thin substitute for `project-sync`                           |

## Weekly & rare events [#weekly--rare-events]

| Time      | Layer      | Job           | What it does                                                                                  |
| --------- | ---------- | ------------- | --------------------------------------------------------------------------------------------- |
| Sun 06:30 | os-crontab | cbm-index     | Codebase semantic indexing (Hermes) — vector ingest for RAG                                   |
| Sun 18:00 | Mac Cowork | weekly-review | Generates `Briefs/YYYY-Www brief.md` — last surviving Cowork schedule (Compound + reflection) |
| Sun 19:00 | os-crontab | intel-weekly  | Strategic intelligence summary to Telegram                                                    |
| Quarterly | os-crontab | janitor       | Link gardening, orphan sweeps, vault maintenance                                              |

## Three scheduler layers — exactly one per job [#three-scheduler-layers--exactly-one-per-job]

A job runs in exactly one place. Double-runs break idempotency; if unsure which layer a new job belongs in, check scheduler inventory.

<Cards>
  <Card title="Hermes Agent cron" description="morning-brief · telegram-sweep · trade-digest · journal-capture — anything needing LLM judgment or agent state" />

  <Card title="OS crontab" description="autodeploy · merge-poll · healthcheck · degraded-brief · intel-weekly · cbm-index · janitor — dumb runners (bash/Python, no LLM)" />

  <Card title="Mac weekly-review" description="weekly-review (Sun 18:00) — reflection + briefing only, Cowork retiring" />
</Cards>

**Note:** Times in `crontab -l` use `CRON_TZ=Europe/Warsaw`. Hermes cron times are UTC (add +2h/+1h for CEST/CET).

## Verify on VPS [#verify-on-vps]

```bash
# Hermes agent cron jobs
export PATH="$HOME/.local/bin:$HOME/.hermes/hermes-agent/venv/bin:$PATH"
hermes cron list

# OS crontab (Warsaw TZ)
crontab -l

# Recent logs
tail -30 ~/morning-brief-vps.log
tail -10 ~/telegram-sweep.log ~/trade-digest.log ~/journal-capture.log ~/autodeploy.log
```

***

## Want more? [#want-more]

* **[Every cron with job details →](/jackie-os/docs/vault-rhythm)** — inventory, Mac↔VPS parity matrix, target architecture
* **[What each skill does →](/jackie-os/docs/catalog)** — morning-brief, project-sync, wrap-up, weekly-review, etc.
* **[Operator cheat-sheet →](/jackie-os/docs/cheat-sheet)** — quick reference for common tasks
