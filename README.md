# sergeichan — personal website

Sergei Tran's personal website. Single-file static site, no build step, no
dependencies: the Tesseract Loom hero (five vertical silk chords with halo
cores, wave-spread dive transition), five case studies (Jackie-OS, Newfin,
B-Unit, Rodyna, Draw) themed per project color, About + Writing panels.

Live target: **https://sergeichan.vercel.app**

## Layout

```
site/               deployable site (index.html — self-contained)
site/newfin/        Newfin marketing landing (Hallmark)
site/newfin-fable/  Newfin landing, Fable version (case-dossier structure)
docs/               design plan + full iteration log
vercel.json         static deploy (outputDirectory: site)
```

**Routes:** `/` · `/newfin` · `/newfin-fable` · `/jackie-os`

## Deploy

**One-off from CLI:**

```bash
npx vercel deploy --prod --yes --name sergeichan   # run from repo root
```

**Better — Vercel Git integration (auto-deploy on push):** import
`sc-jackie/sergeichan` in the Vercel dashboard; `vercel.json` already
sets framework *Other*, no build command, output directory `site`. Every push
to `main` then redeploys automatically from any machine.

## Sync (Mac + VPS dev trees)

```bash
git clone git@github.com:sc-jackie/sergeichan.git ~/dev/sergeichan
```

On the Mac, `~/dev/*` is ff-only pulled once per session by Jackie-OS
`System/scripts/dev-repos-pull.sh`, so it stays current automatically. Run the
same clone on the VPS dev tree.

## Design state (prototype v15 parity)

Flat non-swelling halo through the dive, icon-local color well that fades
before the case page arrives, per-filament independent sway phases (no
synchronous drift on case backgrounds), hero pinned fullscreen as the living
case-page background, arced shared-element icon flight, staggered content
entrance, reduced-motion + keyboard + touch support.

Verified with a headless Chromium smoke test: title, dive → case settles,
Esc resurfaces, About panel opens, zero console errors.

## Privacy boundary (binding for all future content)

Never publish: real financial figures, family identifiers (say "a
14-year-old in the family"), infrastructure identifiers (IPs, tokens, cron
schedules, project IDs), or anything from private-tagged vault notes.
Newfin is shown with demo data only.

## Next iterations

- Three.js 1:1 rebuild (instanced filaments) — spec in `docs/`
- Real screenshots in the case-study frames
- `/writing` essays (first: growing up between two cultures)
- Custom domain
