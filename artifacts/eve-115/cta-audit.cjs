/*
 * EVE-115 — Mobile floating CTA audit at 390×844 (DPR 3, touch emulation).
 * Verification-only: exercises the real UI flows in site/index.html and captures evidence.
 *
 * Run:   python3 -m http.server 8000 --directory site   (from repo root, in another shell)
 *        node artifacts/eve-115/cta-audit.cjs
 * Playwright is resolved from require() or the npx cache automatically.
 */
'use strict';
const fs = require('fs');
const path = require('path');

function resolvePlaywright() {
  try { return require('playwright'); } catch (e) { /* fall through */ }
  const npx = path.join(process.env.HOME || '', '.npm', '_npx');
  for (const d of fs.existsSync(npx) ? fs.readdirSync(npx) : []) {
    const p = path.join(npx, d, 'node_modules', 'playwright');
    if (fs.existsSync(p)) return require(p);
  }
  throw new Error('playwright not found (npm i playwright, or npx playwright install chromium)');
}
const { chromium } = resolvePlaywright();

const BASE = process.env.BASE_URL || 'http://localhost:8000/';
const OUT = path.join(__dirname);
const VP = { width: 390, height: 844 };
const results = [];   // {check, name, pass, detail}
const consoleLog = []; // {page, type, text}

function record(check, name, pass, detail) {
  results.push({ check, name, pass, detail });
  console.log(`  [${pass ? 'PASS' : 'FAIL'}] ${check} ${name} — ${detail}`);
}
function wireConsole(page, label) {
  page.on('console', m => {
    if (m.type() === 'error' || m.type() === 'warning')
      consoleLog.push({ page: label, type: m.type(), text: m.text() });
  });
  page.on('pageerror', e => consoleLog.push({ page: label, type: 'pageerror', text: String(e) }));
}

const floatState = p => p.evaluate(() => {
  const el = document.getElementById('cVisitFloat');
  const cs = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  return {
    on: el.classList.contains('on'),
    opacity: cs.opacity, pointerEvents: cs.pointerEvents, bottom: cs.bottom,
    transition: cs.transition,
    rect: { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom },
    label: document.getElementById('cVisitFloatTxt').textContent,
    scrollWidth: document.documentElement.scrollWidth,
  };
});

// open a case from home by tapping the hero canvas at the case's u position
// (coarse pointer: first tap focuses, second tap dives) — retry until the case opens
async function openByTaps(page, u) {
  const cv = page.locator('#cv');
  const box = await cv.boundingBox();
  const x = box.x + box.width * u, y = box.y + box.height * 0.5;
  for (let i = 0; i < 6; i++) {
    await page.touchscreen.tap(x, y);
    await page.waitForTimeout(500);
    if (await page.evaluate(() => document.getElementById('case').classList.contains('open'))) break;
  }
  await page.waitForFunction(() => {
    const c = document.getElementById('case');
    return c.classList.contains('open') && c.classList.contains('settled');
  }, null, { timeout: 20000 });
  // let the settled rise-in transitions fully finish (delay .42s + .6s) so any
  // opacity leak onto the float is caught, not masked by mid-transition state
  await page.waitForTimeout(1600);
}

// scroll the #case scroller so the inline CTA passes the top edge
const scrollPastInlineCta = p => p.evaluate(() => {
  const c = document.getElementById('case');
  const v = document.getElementById('cVisit');
  c.scrollTop += v.getBoundingClientRect().bottom + 60;
});

async function waitFloat(page, on, timeout = 5000) {
  await page.waitForFunction(want => {
    const el = document.getElementById('cVisitFloat');
    const o = parseFloat(getComputedStyle(el).opacity);
    return want ? (el.classList.contains('on') && o > 0.99) : (!el.classList.contains('on') && o < 0.01);
  }, on, { timeout });
}

const shot = (page, name) => page.screenshot({ path: path.join(OUT, name) });

(async () => {
  const browser = await chromium.launch();
  const ctxOpts = { viewport: VP, deviceScaleFactor: 3, isMobile: true, hasTouch: true };

  /* ---------- Flow A: full Draw-case journey (checks 1–6, part of 9) ---------- */
  console.log('\nFlow A — Draw case full journey');
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  wireConsole(page, 'flowA');
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  // check 1a: float invisible over the home masthead
  let st = await floatState(page);
  record('1', 'hidden on home masthead', st.opacity === '0' && st.pointerEvents === 'none' && !st.on,
    `opacity=${st.opacity} pointer-events=${st.pointerEvents} on=${st.on}`);
  await shot(page, '01-home-masthead-390.png');

  // open Draw (u=0.85)
  await openByTaps(page, 0.85);
  const inline = await page.evaluate(() => {
    const r = document.getElementById('cVisit').getBoundingClientRect();
    return { top: r.top, bottom: r.bottom };
  });
  st = await floatState(page);
  record('1', 'hidden after case open, inline CTA on/below screen',
    st.opacity === '0' && st.pointerEvents === 'none' && !st.on && inline.top >= 0,
    `opacity=${st.opacity} pe=${st.pointerEvents} on=${st.on} inlineTop=${inline.top.toFixed(1)}`);
  await shot(page, '02-draw-open-pre-threshold.png');

  // check 2: reveal past threshold
  await scrollPastInlineCta(page);
  let ok = true, detail = '';
  try { await waitFloat(page, true); } catch (e) { ok = false; detail = 'never gained .on/opacity 1'; }
  await page.waitForTimeout(800);   // let the transform transition land before measuring the rect
  st = await floatState(page);
  record('2', 'reveals after inline CTA scrolls past top', ok && st.on && st.pointerEvents === 'auto',
    detail || `on=${st.on} opacity=${st.opacity} pe=${st.pointerEvents} label="${st.label}"`);
  await shot(page, '03-draw-post-threshold-cta-visible.png');

  // check 3: centered, not clipped, no horizontal overflow
  const center = st.rect.x + st.rect.width / 2;
  const centered = Math.abs(center - VP.width / 2) <= 2;
  const inside = st.rect.x >= 0 && st.rect.right <= VP.width && st.rect.width <= VP.width - 32;
  const noOverflow = st.scrollWidth <= VP.width;
  record('3', 'centered ±2px, fully inside viewport, no page overflow', centered && inside && noOverflow,
    `center=${center.toFixed(1)} (target 195) rect=[x=${st.rect.x.toFixed(1)}, w=${st.rect.width.toFixed(1)}, right=${st.rect.right.toFixed(1)}] scrollWidth=${st.scrollWidth}`);

  // check 4: safe-area — env() resolves to 0 in headless => bottom: 18px
  record('4', 'bottom resolves to 18px with env(safe-area-inset-bottom)=0', st.bottom === '18px',
    `computed bottom=${st.bottom}, rect.bottom=${st.rect.bottom.toFixed(1)} (viewport 844)`);
  // simulate an iPhone home indicator (34px) — TEST SCAFFOLDING ONLY, never committed to source
  await page.addStyleTag({ content: '#case .visit--float{bottom:calc(18px + 34px) !important}' });
  await page.evaluate(() => {
    const bar = document.createElement('div');
    bar.id = '__simIndicator';
    bar.style.cssText = 'position:fixed;left:0;right:0;bottom:0;height:34px;background:rgba(255,60,60,.35);border-top:1px dashed rgba(255,60,60,.9);z-index:9999;pointer-events:none';
    document.body.appendChild(bar);
  });
  await page.waitForTimeout(450);
  const stSim = await floatState(page);
  record('4', 'simulated 34px inset: CTA fully above indicator', stSim.rect.bottom <= 844 - 34,
    `cta rect.bottom=${stSim.rect.bottom.toFixed(1)} vs indicator top=810`);
  await shot(page, '04-draw-cta-simulated-safe-area.png');
  await page.evaluate(() => {
    document.getElementById('__simIndicator').remove();
    const styles = document.querySelectorAll('style');
    styles[styles.length - 1].remove();   // the injected addStyleTag sheet
  });

  // check 5: scroll back above threshold — CTA exits
  await page.evaluate(() => { document.getElementById('case').scrollTop = 0; });
  ok = true; detail = '';
  try { await waitFloat(page, false); } catch (e) { ok = false; detail = '.on not removed'; }
  st = await floatState(page);
  record('5', 'hides again after scrolling back up', ok && !st.on && st.pointerEvents === 'none',
    detail || `on=${st.on} opacity=${st.opacity} pe=${st.pointerEvents}`);
  await shot(page, '05-draw-cta-hidden-after-scroll-up.png');

  // check 6: browser back returns to site home (case closed), not away from site
  await page.goBack();
  await page.waitForTimeout(2000); // resurface animation + hero unpin (~1.55s)
  const backState = await page.evaluate(() => ({
    url: location.href,
    caseOpen: document.getElementById('case').classList.contains('open'),
  }));
  st = await floatState(page);
  const onSite = backState.url.startsWith(BASE) && !/#/.test(backState.url);
  record('6', 'page.goBack() lands on site home, case closed, float hidden',
    onSite && !backState.caseOpen && st.opacity === '0',
    `url=${backState.url} caseOpen=${backState.caseOpen} floatOpacity=${st.opacity}`);
  await shot(page, '06-after-browser-back-home.png');
  await ctx.close();

  /* ---------- Flow B: reduced motion (check 7) ---------- */
  console.log('\nFlow B — prefers-reduced-motion: reduce');
  const ctxR = await browser.newContext({ ...ctxOpts, reducedMotion: 'reduce' });
  const pageR = await ctxR.newPage();
  wireConsole(pageR, 'flowB-reduced');
  await pageR.goto(BASE, { waitUntil: 'networkidle' });
  await pageR.waitForTimeout(500);
  await openByTaps(pageR, 0.85);
  st = await floatState(pageR);
  const opacityOnly = /opacity/.test(st.transition) && !/transform/.test(st.transition);
  record('7', 'reduced-motion transition is opacity-only', opacityOnly, `transition="${st.transition}"`);
  await scrollPastInlineCta(pageR);
  ok = true; detail = '';
  try { await waitFloat(pageR, true); } catch (e) { ok = false; detail = 'CTA did not reveal'; }
  st = await floatState(pageR);
  record('7', 'CTA still reveals under reduced motion', ok && st.on,
    detail || `on=${st.on} opacity=${st.opacity}`);
  await shot(pageR, '07-draw-reduced-motion-cta.png');
  await ctxR.close();

  /* ---------- Flow C: all five cases via deep links (check 8) ---------- */
  console.log('\nFlow C — per-case labels and no-link case');
  const EXPECT = {
    jackieos: 'Read the full docs',
    newfin: 'Visit the Newfin landing',
    bunit: 'Visit the parents page',
  };
  const ctxC = await browser.newContext(ctxOpts);
  const pageC = await ctxC.newPage();
  wireConsole(pageC, 'flowC-cases');
  let n = 8;
  for (const [id, label] of Object.entries(EXPECT)) {
    await pageC.goto(BASE + '#' + id, { waitUntil: 'networkidle' });
    await pageC.waitForTimeout(1600);   // past the settled rise-in window
    st = await floatState(pageC);
    const hiddenFirst = !st.on && st.opacity === '0';
    await scrollPastInlineCta(pageC);
    ok = true; detail = '';
    try { await waitFloat(pageC, true); } catch (e) { ok = false; detail = 'CTA did not reveal'; }
    await pageC.waitForTimeout(800);
    st = await floatState(pageC);
    const center2 = st.rect.x + st.rect.width / 2;
    record('8', `${id}: hidden first, reveals with correct label`,
      hiddenFirst && ok && st.label === label && Math.abs(center2 - 195) <= 2,
      detail || `label="${st.label}" (want "${label}") hiddenFirst=${hiddenFirst} center=${center2.toFixed(1)}`);
    await shot(pageC, `${String(n).padStart(2, '0')}-${id}-cta-visible.png`);
    n++;
  }
  // rodyna: no product link — float must never appear
  await pageC.goto(BASE + '#rodyna', { waitUntil: 'networkidle' });
  await pageC.waitForTimeout(700);
  const rodyna = await pageC.evaluate(() => ({
    visitRowHidden: document.getElementById('cVisit').parentNode.style.display === 'none',
  }));
  await pageC.evaluate(() => { const c = document.getElementById('case'); c.scrollTop = c.scrollHeight; });
  await pageC.waitForTimeout(1200);
  st = await floatState(pageC);
  record('8', 'rodyna (no product link): float never appears even at page bottom',
    rodyna.visitRowHidden && !st.on && st.opacity === '0',
    `visitRowHidden=${rodyna.visitRowHidden} on=${st.on} opacity=${st.opacity}`);
  await shot(pageC, `11-rodyna-no-cta-at-bottom.png`);

  // stale-label check: draw (float visible) -> in-case "next" link -> newfin: .on cleared + label swapped
  await pageC.goto(BASE + '#draw', { waitUntil: 'networkidle' });
  await pageC.waitForTimeout(700);
  await scrollPastInlineCta(pageC);
  await waitFloat(pageC, true);
  const before = await floatState(pageC);
  await pageC.evaluate(() => document.getElementById('nextLink').click());
  await pageC.waitForTimeout(400);
  st = await floatState(pageC);
  record('8', 'case switch (draw→newfin): .on cleared, label swapped, no stale label',
    before.label === 'Open @drawtennisbot' && !st.on && st.label === 'Visit the Newfin landing',
    `before="${before.label}" after on=${st.on} label="${st.label}"`);
  await ctxC.close();

  /* ---------- check 9: console ---------- */
  const errors = consoleLog.filter(c => c.type === 'error' || c.type === 'pageerror');
  record('9', 'zero console errors across all flows', errors.length === 0,
    errors.length ? errors.map(e => `[${e.page}] ${e.text}`).join(' | ') : `0 errors, ${consoleLog.length} total warnings/errors captured`);

  await browser.close();
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify({ results, consoleLog }, null, 2));
  const fails = results.filter(r => !r.pass);
  console.log(`\n==== ${results.length - fails.length}/${results.length} assertions passed, ${fails.length} failed ====`);
  process.exit(fails.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
