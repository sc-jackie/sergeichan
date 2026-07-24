/* EVE-114 verification: 390px screenshots of the Draw fig loop (incl. the seam),
   the hero→Draw-case transition, other cases' figs, plus console-error and
   interruption checks. Run: node artifacts/verify.js  (server on :8123) */
const { chromium } = require('playwright');
const BASE = 'http://127.0.0.1:8123';
const OUT = __dirname;

(async () => {
  const browser = await chromium.launch();
  const errors = [];
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));

  // ---------- A. Draw fig loop phases (deep link -> fig timer starts on populate) ----------
  await page.goto(BASE + '/#draw', { waitUntil: 'load' });
  await page.waitForTimeout(400);
  const fig = page.locator('.sigfig');
  await fig.scrollIntoViewIfNeeded();
  const t0 = Date.now();
  // fig clock started ~when the case populated; phases of the 9s loop:
  const shots = [
    [2700, 'fig-draw-ph030-round1.png'],       // round 1 resolving
    [7600, 'fig-draw-ph084-champion.png'],     // champion band + glow
    [8700, 'fig-draw-ph096-outro.png'],        // exhale just before the seam
    [9500, 'fig-draw-ph005-after-wrap.png']    // just after the loop wraps
  ];
  for (const [ms, name] of shots) {
    const wait = ms - (Date.now() - t0);
    if (wait > 0) await page.waitForTimeout(wait);
    await fig.screenshot({ path: OUT + '/' + name });
  }

  // ---------- B. hero -> Draw case transition (fresh page, real dive) ----------
  await page.goto(BASE + '/', { waitUntil: 'load' });
  await page.waitForTimeout(600);
  // click on the draw chord (u=0.85): pointer events focus it, click dives
  await page.mouse.click(Math.round(390 * 0.85), 420);
  await page.waitForTimeout(2350);                       // casePrep at ~2.1s; icon mid-flight
  await page.screenshot({ path: OUT + '/transition-midflight.png' });
  await page.waitForTimeout(1800);                       // landed + settled stagger done
  await page.screenshot({ path: OUT + '/transition-settled.png' });
  const settled = await page.evaluate(() =>
    document.getElementById('case').classList.contains('settled'));
  if (!settled) errors.push('case did not settle after dive');

  // ---------- C. interruption: back mid-flight, then rapid reopen ----------
  await page.goto(BASE + '/', { waitUntil: 'load' });
  await page.waitForTimeout(600);
  await page.mouse.click(Math.round(390 * 0.85), 420);
  await page.waitForTimeout(2300);                       // mid-flight
  await page.click('#backBtn');                          // back while the icon is in the air
  await page.waitForTimeout(1350);                       // resurface done; teardown timer still pending
  await page.mouse.click(Math.round(390 * 0.85), 420);   // reopen against pending teardown
  await page.waitForTimeout(3500);
  const st = await page.evaluate(() => ({
    open: document.getElementById('case').classList.contains('open'),
    settled: document.getElementById('case').classList.contains('settled'),
    bg: document.getElementById('hero').classList.contains('bgmode'),
    seatVisible: document.getElementById('cIconCv').style.visibility !== 'hidden'
  }));
  if (!(st.open && st.settled && st.bg && st.seatVisible))
    errors.push('interruption state broken: ' + JSON.stringify(st));
  await page.screenshot({ path: OUT + '/interruption-reopen-settled.png' });

  // ---------- D. other cases: fig / case view unregressed ----------
  for (const id of ['jackieos', 'newfin', 'bunit', 'rodyna']) {
    await page.goto(BASE + '/#' + id, { waitUntil: 'load' });
    await page.waitForTimeout(1600);
    const f = page.locator('#secFig:visible .sigfig');
    if (await f.count()) {
      await f.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1200);
      await f.screenshot({ path: OUT + '/fig-' + id + '.png' });
    } else {
      await page.screenshot({ path: OUT + '/case-' + id + '.png' });
    }
  }

  // ---------- E. reduced motion: meaningful static Draw fig ----------
  const rctx = await browser.newContext({
    viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const rpage = await rctx.newPage();
  rpage.on('pageerror', e => errors.push('reduced pageerror: ' + e.message));
  await rpage.goto(BASE + '/#draw', { waitUntil: 'load' });
  await rpage.waitForTimeout(800);
  const rfig = rpage.locator('.sigfig');
  await rfig.scrollIntoViewIfNeeded();
  await rpage.waitForTimeout(500);
  await rfig.screenshot({ path: OUT + '/fig-draw-reduced-motion.png' });

  await browser.close();
  if (errors.length) { console.error('FAIL\n' + errors.join('\n')); process.exit(1); }
  console.log('PASS — no console errors, transition settled, interruption-safe');
})();
