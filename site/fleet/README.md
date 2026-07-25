# Fleet Atlas data contract

`data.json` is the frozen, public-safe snapshot shared by the three Fleet Atlas
concepts at `/fleet-v1`, `/fleet`, and `/fleet-v3`. Public pages must read this
relative static file only. They must not call the private Jackie-OS dashboard or
any `/api/*` route.

## Contract

The top-level keys are fixed:

- `capturedAt` — ISO `YYYY-MM-DD` date shown by every concept.
- `generatedBy` — generator path.
- `agents` — the five public agent records. Every record contains `id`, `name`,
  `role`, one-word `lane`, `model`, public-safe `blurb`, sampled `accent`,
  `accentRgb`, relative portrait paths, and integer `stats.sessions` /
  `stats.activity`.
- `loops.delegation` and `loops.compound` — ordered public-safe process steps.
- `issues` — scrubbed Linear identifiers, titles, states, state types, agent,
  repository key, and date-only update timestamps.
- `repos` — repository keys and public labels referenced by issues.
- `totals` — agent, session, and issue counts plus issue counts by state type.

Do not rename fields or add a concept-specific shape. Derive view state inside
each concept.

## Refresh

From the repository root, deterministically rebuild the committed snapshot and
re-sample every accent:

```bash
node scripts/build-fleet-snapshot.mjs
```

To intentionally capture fresh control-plane values, the private Jackie-OS
dashboard must be running locally:

```bash
node scripts/build-fleet-snapshot.mjs --refresh
```

The script uses Node built-ins only. Refresh mode reads `/api/fleet` and
`/api/linear` at build time, whitelists the public fields, maps approved projects
to repository keys, removes third-party client work by project and title, and
rejects known secret/path/network terms before writing. Plain mode rebuilds from
the committed frozen values, making repeat concept builds byte-identical.

Override the local dashboard origin or capture date during a refresh when
needed:

```bash
JACKIE_OS_DASHBOARD_URL=http://127.0.0.1:9120 \
FLEET_CAPTURED_AT=2026-07-24 \
node scripts/build-fleet-snapshot.mjs --refresh
```

Review the diff by hand after every refresh. Never add spend/cost data, private
persona or memory text, prompts, rules, host details, or absolute paths.

## Accent sampling

Each accent is computed from that agent's committed 512px PNG. The generator
implements PNG inflation and scanline filters with Node's standard library,
then builds a histogram of opaque, saturated, mid-luminance pixels. The most
frequent qualifying RGB value is written as both `accent` and `accentRgb`.
This intentionally selects the portrait's own dominant field colour and is
deterministic.

## Portrait sources

The five display portraits and their high-resolution originals come from
Jackie-OS `System/agents/dashboard/assets/`. Original filenames are normalized
to the agent ID. Hermes' JPEG reference is losslessly decoded and re-encoded as
PNG so all concept consumers share the same path and file type.
