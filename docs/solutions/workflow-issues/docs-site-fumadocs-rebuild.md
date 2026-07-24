---
type: Solution
title: Jackie-OS docs site — rebuild Fumadocs export into site/
timestamp: 2026-07-24
tags: [docs, fumadocs, build]
---

# Jackie-OS docs site — rebuild Fumadocs export into site/

**Problem:** Public Jackie-OS docs live as source in `docs-src/content/docs/`, but Vercel serves the committed static export under `site/jackie-os/`. Editing MDX alone is not enough for deploy.

**Fix:** From `docs-src/`:

```bash
npm ci   # if needed
npm run build
rsync -a --delete out/ ../site/jackie-os/
```

`next.config.mjs` uses `output: 'export'` and `basePath: '/jackie-os'`, so `out/` maps 1:1 onto `site/jackie-os/`. Include both source and `site/jackie-os/` in the same PR.
