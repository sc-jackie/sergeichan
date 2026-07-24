---
module: workflow (design review gate)
tags: [rams, mcp, curl, sse, design-review, raf-throttling, canvas]
problem_type: workflow-issues
date: 2026-07-24
---

# Running the Rams review when the MCP isn't attached to the session

The CLAUDE.md gate requires a Rams review before UI commits, but a session may
not have the `rams` MCP mounted (ToolSearch finds nothing). The server is plain
streamable-HTTP MCP — drive it with curl.

## 1. Endpoint + auth

Config lives in `~/.claude.json` under `mcpServers.rams`:
`https://worker.rams.ai/mcp` with a `Bearer rams_…` token. Stateless — no
session id header needed.

## 2. Protocol

Three POSTs, all with `Accept: application/json, text/event-stream`
(responses are SSE — strip `data: ` lines before JSON-parsing):

1. `initialize` (protocolVersion 2025-03-26) — required once.
2. `tools/list` — tools are `usage` (free) and `review_files`.
3. `tools/call` → `review_files` with
   `{files: [{path, content}], context: "<label>"}` (≤20 files). Allow a long
   curl timeout (`-m 300`); the review takes a couple of minutes.

Check `usage` first — the free plan meters 30 reviews / rolling 30 days,
shared with the GitHub App. **One review per change-set, not per iteration.**

## 3. What to send

Reviews are token- and quota-metered: send the files that carry the real
change. A pattern repeated verbatim elsewhere (e.g. the same footer mark on a
sibling page in another repo) doesn't need its own review — note the coverage
in the commit message.

## 4. Bonus gotcha from the same session: RAF starvation in preview panes

The in-app Browser pane reports `document.hidden === true`, so
`requestAnimationFrame` never fires (frames only pump on screenshots) — canvas
animations look "stuck" when nothing is wrong. Two consequences:

- Verify animation work in the Playwright MCP (real browser, RAF runs),
  not the preview pane.
- Drive canvas animations from the RAF **timestamp** (wall-clock), never
  `t += 1/60` per frame — throttled tabs then complete reveals on the next
  rendered frame instead of crawling. `site/index.html` figViz does this.
