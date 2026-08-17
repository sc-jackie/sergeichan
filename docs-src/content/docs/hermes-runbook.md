---
type: Skill
title: hermes-ops
timestamp: 2026-06-29T14:46:47Z
---

> **Script source of truth (2026-06-30):** all `~/.hermes/scripts/&#60;name>` paths below are symlinks into the Jackie-OS repo under `System/{coo,capture,ops,periodic,work,lib}/`. The paths still work on the VPS, but **edit the repo copy** (then `git push`; the 2-min autodeploy `git pull` propagates). The farm is rebuilt by `System/scripts/hermes-vps-link-scripts.sh`.

**Purpose:** VPS ops backend for the **Hermes agent** — scripts, crons, exec allowlist, and the Hermes gateway.

**Two-bot model (current):** **[@Persik_finbot](https://t.me/Persik_finbot)** = Newfin finance product + Sergei's owner finance/ops surface (Vercel-hosted). **[@persik_hermes_bot](https://t.me/persik_hermes_bot)** = the **full** Telegram channel for the Hermes VPS agent — COO, CTO, journal, crons, ops, everything. Both are live.

**Owner surface:** DM `@persik_hermes_bot` for all Hermes work. The old relay path (`@Persik_finbot` proxying `/work` → SSH → `hermes-code-ask.py`) is retired.

## Commands (natural language OK)

| Intent | Do |
|--------|-----|
| **status** | Summarize last line of `~/journal-capture.log`, `~/telegram-sweep.log`, `~/healthcheck.log`, `~/nastusha-brief-push.log`; `df -h ~` disk % |
| **logs** `&#123;journal\|health\|nastusha\|clips\|cbm&#125;` | `tail -30` of named log |
| **flush journal** | `bash ~/.hermes/scripts/journal-capture.py` (or `.sh`) |
| **sweep clips** | `bash ~/.hermes/scripts/telegram-sweep.sh` — drain `kind=clip` inbox → `Vault/Clippings/` |
| **sync** | `bash ~/.hermes/scripts/hermes-wrap-up-lite.sh` — git pull + refresh `hot.md` from vault Status |
| **merges** `&#123;all\|newfin\|rodyna&#125;` | `bash ~/.hermes/scripts/hermes-merge-explain.sh` — latest merge-poll + optional `~/repos` git log |
| **index code** | `bash ~/.hermes/scripts/hermes-cbm-index.sh` — pull `~/repos` + re-index for CC bridge |
| **health** | `bash ~/.hermes/scripts/hermes-healthcheck.sh` |
| **hot** | Read `~/jackie-os/Vault/hot.md` (git pull first if stale) |

## Rules

- **Owner only** — `TELEGRAM_ALLOWED_USERS` on VPS.
- **Read before write** — `status`/`logs`/`hot` never mutate vault.
- **Vault writes** — `sync` runs wrap-up lite (hot refresh only); no full project-sync on VPS. No ad-hoc commits without explicit ask.
- **Secrets** — never print `CRON_SECRET`, bot tokens, or `.secrets/*` contents.
- **Persik product** — redirect money/life COO to main Persik bot.

## VPS crons (Phase 1 + 2 + explore)

| Time (Warsaw) | Script | Log |
|---------------|--------|-----|
| 07:00 | `telegram-sweep.sh` | `~/telegram-sweep.log` |
| 07:05 | `nastusha-brief-refresh-vps.sh` | `~/nastusha-brief-refresh.log` |
| 07:10 | `trade-digest-capture.sh` | `~/trade-digest.log` |
| 07:15 | `nastusha-brief-push.sh` | `~/nastusha-brief-push.log` |
| **07:30** | `morning-brief-vps.sh` | `~/morning-brief-vps.log` — full brief + Gmail/Calendar; **sole runner** (skips only if deliverable brief exists — `## Today` or TL;DR) |
| hourly | `journal-capture.sh` | `~/journal-capture.log` |
| 08:00 | `hermes-healthcheck.sh` | `~/healthcheck.log` |
| 08:35 | `degraded-brief.sh` | `~/degraded-brief.log` |
| Sun 06:30 | `hermes-cbm-index.sh` | `~/cbm-index.log` |
| Sun 19:00 | `hermes-intel-weekly.sh` | `~/intel-weekly.log` |
| Quarterly 09:00 (1 Jan/Apr/Jul/Oct) | `hermes-janitor-skills-audit.sh` | `~/janitor-skills-audit.log` |

Canonical file: `System/scripts/hermes-vps-crontab.txt` (deployed on VPS, scripts in `~/.hermes/scripts/`) · install: `hermes-vps-crontab-install.sh` · **full deploy:** `hermes-vps-deploy.sh` (pull + crontab + cbm index + smoke).

Degraded brief @ 08:35 — backup when 07:30 failed or produced a stub only. Skips if a **deliverable** brief exists. Delivers via `coo-push notify:true` (Persik DM).

**Research bridge:** Exa gap-fill **auto-on** when `EXA_API_KEY` in `.secrets/agent-reach.env`; set `RESEARCH_BRIDGE_EXA=0` to disable.

**Nastusha VPS refresh (B6):** if Mac did not stage today's brief, Hermes writes Ukrainian fallback from `Vault/Nastusha.md` before 07:15 push.

**CC bridge v2:** `code` command — `codebase-memory-mcp cli` (`trace_path`, `search_graph`, `get_architecture`, `get_code_snippet`) on indexed `~/repos`; ripgrep fallback if graph empty. One-time VPS: `hermes-cbm-setup.sh` · weekly re-index Sun 06:30 · on-demand `index code`.

**Intel weekly (C5):** themes from research log + `GET /api/cron/intel-summary` (`intel_items` themes/assets/one-liners) + intel-brief ping; ops DM Sun 19:00. Requires Newfin deploy with `/intel-summary` route.

**Clip sweep:** VPS 07:00 + ops `sweep clips` — same as Mac morning-brief step 0; uses `journal-inbox?kind=clip` only (no Persik token on VPS).

**Mac only:** `nastusha-vault-mirror.sh` runs inside `nastusha-brief-stage.sh` (iCloud STATUS → `Vault/Nastusha.md`).

**GHA merge-poll:** optional `CRON_SECRET` + `NEWFIN_API_BASE` repo secrets → owner DM on new merges (`merge-poll-notify.sh`). When `HERMES_VPS_SSH_KEY` is set, each poll also runs `hermes-repos-pull.sh` on VPS (`~/repos` read clones).

**Google Gmail + Calendar (Phase 15c):** readonly OAuth for VPS morning brief.

1. Google Cloud → enable Gmail API + Calendar API → OAuth desktop client → copy ID/secret to `.secrets/google-oauth.env`
2. Mac: `python3 System/coo/google-oauth-setup.py` (browser consent → `.secrets/google-oauth-token.json`)
3. `bash System/scripts/hermes-sync-google-oauth.sh` (token + env → VPS)
4. Re-run after token refresh if Google revokes access

Smoke: `python3 ~/.hermes/scripts/google-life-fetch.py` · cron log `~/morning-brief-vps.log`

**Mac auto-pull:** LaunchAgent `com.jackie.dev-repos-pull` (30m + login) — `~/Jackie-OS` + `~/dev/*`; `System/scripts/dev-repos-pull-install.sh install`.

## Web dashboard (Hermes Agent admin UI)

Localhost only on VPS `:9119`. **Not** in Persik — use SSH tunnel from Mac:

```bash
ssh -i ~/.ssh/hermes_vps_deploy -L 9119:127.0.0.1:9119 hermes@your-vps-host
open http://127.0.0.1:9119
```

Service: `systemctl --user status hermes-dashboard`. Docs: [Hermes web dashboard](https://hermes-agent.nousresearch.com/docs/user-guide/features/web-dashboard).

**Mac always-on tunnel (recommended):**

```bash
bash ~/Jackie-OS/System/scripts/hermes-dashboard-tunnel-install.sh install  # login + auto-restart
bash ~/Jackie-OS/System/scripts/hermes-dashboard-tunnel-install.sh open   # browser only
bash ~/Jackie-OS/System/scripts/hermes-dashboard-tunnel-install.sh status
bash ~/Jackie-OS/System/scripts/hermes-dashboard-tunnel-install.sh uninstall
```

LaunchAgent: `com.jackie.hermes-dashboard-tunnel` — `KeepAlive` restarts SSH if VPS/network drops.

**Manual / one-off:**

```bash
bash ~/Jackie-OS/System/scripts/hermes-dashboard-tunnel.sh open   # foreground-style start + browser
bash ~/Jackie-OS/System/scripts/hermes-dashboard-tunnel.sh start  # nohup background
bash ~/Jackie-OS/System/scripts/hermes-dashboard-tunnel.sh stop   # manual tunnel only
```

## Host

- VPS `hermes@your-vps-host` · `JACKIE_OS_ROOT=~/jackie-os`
- Skills symlink: `~/.hermes/skills/jackie-os` → `System/skills/`
- **Deploy:** `bash System/scripts/hermes-vps-deploy.sh` (Mac) · GHA `hermes-vps-deploy.yml` when `HERMES_VPS_SSH_KEY` repo secret is set

## Persik ops bridge (no inbound firewall)

**Production (2026-06-25):** Persik on Vercel SSHes **outbound** to `hermes@your-vps-host` using `HERMES_VPS_SSH_KEY` (same key as GHA deploy) and runs `hermes-ops-exec.sh` — **no public `:8787` required**.

**Local on VPS:** `hermes-ops-server` @ `:8787` still serves `POST /internal/ops/exec` for VPS crons / debugging on localhost.

**Script:** `~/.hermes/scripts/hermes-ops-exec.sh`. Verbs:
- `status` — health check + last line of cron logs
- `sync` — git pull + refresh `hot.md`
- `scout &#60;topic>` — Exa search
- `code &#60;question> &#60;repo>` — codebase-memory query
- `hot` — cat `Vault/hot.md`
- `merges` — latest merge-poll
- `flush research|journal` — drain inboxes
- `sweep clips` — drain clips inbox

**Security:** Owner `chat_id` checked on Persik + in exec path. Each call wrapped with 25s timeout. Verbs only logged (never args). No arbitrary shell passthrough.

**Vercel env:** `HERMES_VPS_SSH_KEY` + `HERMES_OPS_PROXY_SECRET` + `TELEGRAM_ALLOWED_CHAT_ID`. Optional legacy: `HERMES_VPS_BASE_URL` (requires inbound `:8787`).

**Related:** Concepts § ops-proxy.

## Model setup (subscriptions — no Nous Portal)

Gateway runs without this; Telegram replies need a model. **Do not use Nous Portal** — use existing subs + one Gemini API key.

### Stack (2026-08-17, live VPS)

| Profile | Chain (primary → fallbacks) | Role |
|---------|------------------------------|--------|
| **`default`** | `openai-codex/gpt-5.6-sol` → Cursor Grok 4.6 High Fast → GPT-OSS 120B → 4× OpenRouter free | Gateway, briefs, Telegram, `/intel` |
| **`kawai-coo`** | `openai-codex/gpt-5.6-sol` → GPT-OSS → 4× OpenRouter free | Manual COO |
| **`persiknewfin`** | matches `default` (`gpt-5.6-sol` → Grok 4.6 → GPT-OSS → 4× OpenRouter free); no delegation | Holding / trade / research one-shots |
| **Delegation** | `anthropic/claude-opus-5` | `delegate_task` on `default` |

Auxiliary roles run OpenRouter nano models. `cursor-bridge` is retired. Live configs are authoritative — Jackie-OS `hermes-ops` § Model setup.

Hermes **auto-failover**: primary → fallback chain on rate limits, quota, auth errors.

**Not used:** Nous Portal. OpenRouter **is** used for GPT-OSS and free fallbacks.

### One-time Mac auth

```bash
# ChatGPT — import from Codex CLI (preferred) or device OAuth
codex login status                    # must say "Logged in using ChatGPT"
hermes auth add openai-codex --type oauth   # only if import below fails

# Import Codex CLI tokens into Hermes auth store
~/.hermes/hermes-agent/venv/bin/python -c "
import sys; sys.path.insert(0,'$HOME/.hermes/hermes-agent')
from hermes_cli.auth import _recover_codex_tokens_from_cli
print('ok' if _recover_codex_tokens_from_cli('manual') else 'run: codex login')
"

# Claude Max — already logged in via Claude Code on Mac (keychain)
# Hermes reads ~/.claude/.credentials.json at runtime

# Gemini — copy key into ~/.hermes/.env (sources, pick one that has a value):
#   ~/dev/rodyna/.env          GEMINI_API_KEY
#   ~/dev/newfin/.env          GOOGLE_API_KEY  (same alias)
#   Jackie-OS/.secrets/vault-index.env
grep -h '^GEMINI_API_KEY=\|^GOOGLE_API_KEY=' ~/dev/rodyna/.env ~/dev/newfin/.env 2>/dev/null \
  | head -1 >> ~/.hermes/.env
```

### Config (VPS `~/.hermes/config.yaml`, `default` profile)

Do **not** paste an old Fable/Terra fragment. The live `default` primary is `openai-codex/gpt-5.6-sol` (operator-swappable). Fallbacks and the `persiknewfin` / `kawai-coo` profiles live in `~/.hermes/config.yaml` and `~/.hermes/profiles/*/config.yaml`. Change them only with Jackie-OS `hermes-ops` § Model setup, then update `CONCEPTS.md` in the same session.

### Credentials on the VPS

**No Mac→VPS OAuth sync** — the `hermes-sync-auth` family was retired 2026-07-01 (superseded 2026-06-29). The Mac keychain kept losing its refresh token, so the sync pushed dead tokens. The VPS now authenticates independently:

- **Anthropic (main provider):** long-lived `claude setup-token` → `CLAUDE_CODE_OAUTH_TOKEN` in VPS `~/.hermes/.env` (~1yr, no keychain/sync dependency). Re-run `claude setup-token` on the VPS when it expires. (Nous Portal retired 2026-07-06 — credits exhausted.)
- **openai-codex:** Codex CLI OAuth on the VPS (`~/.codex/auth.json`) — live `default` / `kawai-coo` primary (`gpt-5.6-sol`).
- **Gemini / OpenRouter:** `GEMINI_API_KEY` + `OPENROUTER_API_KEY` in VPS `~/.hermes/.env`.

### Verify

```bash
hermes auth list
hermes -z 'reply exactly: ok'                    # Mac
ssh hermes@your-vps-host 'hermes -z "reply exactly: ok"'
# Persik DM → "status" (proxied to VPS via SSH)
```

### Token refresh

| Provider | When stale | Fix |
|----------|------------|-----|
| Nous Portal | 401 / provider down | re-auth Nous OAuth on the VPS; setup-token is the fallback |
| Claude Max | setup-token expired (~1yr) | re-run `claude setup-token` on the VPS → update `~/.hermes/.env` |
| Gemini | 401 / invalid key | Update key in VPS `~/.hermes/.env` |
