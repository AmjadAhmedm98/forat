/**
 * فحص استجابي شامل + التقاط لقطات للصفحات العامة.
 * لكل صفحة × عرض: تمرير أفقي غير مرغوب، أخطاء console، صور مكسورة.
 */
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const EXE = fs.readdirSync(process.env.HOME + '/Library/Caches/ms-playwright')
  .filter(d => d.startsWith('chromium-'))[0];
const exePath = `${process.env.HOME}/Library/Caches/ms-playwright/${EXE}/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
const B = 'http://localhost:3000';
const OUT = 'qa-screens';

const PAGES = [
  ['01-home', '/'],
  ['02-live', '/live'],
  ['03-radio', '/radio'],
  ['04-programs', '/programs'],
  ['05-apps', '/apps'],
  ['06-shorts', '/shorts'],
  ['07-article', '/article/ajz-almawazana-21-trilion'],
  ['08-news-iraq', '/news/iraq'],
  ['09-breaking', '/breaking'],
  ['10-about', '/about'],
];
const WIDTHS = [[1440, 950], [820, 1100], [390, 844]];

const IGNORE = /youtube|googleads|doubleclick|gstatic|ytimg|ERR_BLOCKED_BY_CLIENT|Failed to load resource/i;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch({ executablePath: exePath });
  const problems = [];

  for (const [w, h] of WIDTHS) {
    const ctx = await b.newContext({
      viewport: { width: w, height: h }, deviceScaleFactor: 2,
      isMobile: w < 500, hasTouch: w < 500, locale: 'ar-IQ',
    });
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', e => errs.push(`PAGEERROR ${e.message}`));
    p.on('console', m => { if (m.type() === 'error' && !IGNORE.test(m.text())) errs.push(`CONSOLE ${m.text()}`); });
    p.on('response', r => {
      if (/_next\/image|\/media\//.test(r.url()) && r.status() >= 400) errs.push(`IMG ${r.status()} ${r.url().slice(-40)}`);
    });

    for (const [name, url] of PAGES) {
      errs.length = 0;
      await p.goto(B + url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await p.waitForLoadState('load').catch(() => {});
      await p.waitForTimeout(1400);

      // تمرير كامل + إجبار الصور على التحميل قبل اللقطة
      await p.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y); await new Promise(r => setTimeout(r, 80));
        }
        window.scrollTo(0, 0);
        document.querySelectorAll('img').forEach(i => { i.loading = 'eager'; i.decoding = 'sync'; });
      });
      await p.waitForFunction(
        () => [...document.querySelectorAll('img')].every(i => i.complete),
        { timeout: 45000 },
      ).catch(() => {});
      await p.waitForTimeout(1200);

      const over = await p.evaluate(() =>
        document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (over > 2) problems.push(`${name}@${w} تمرير أفقي ${over}px`);

      const broken = await p.$$eval('img', imgs =>
        imgs.filter(i => i.complete && i.naturalWidth === 0).map(i => (i.getAttribute('src') || '').slice(-40)));
      if (broken.length) problems.push(`${name}@${w} صور مكسورة: ${broken.slice(0, 2).join(' | ')}`);

      if (errs.length) problems.push(`${name}@${w} أخطاء: ${errs.slice(0, 2).join(' | ')}`);

      await p.screenshot({ path: path.join(OUT, `${name}-${w}.png`), fullPage: w === 1440 });
    }
    await ctx.close();
  }

  // تحميل أولوي: صورة/شعار البطل فقط
  const ctx = await b.newContext({ viewport: { width: 1440, height: 950 }, locale: 'ar-IQ' });
  const p = await ctx.newPage();
  for (const [name, url] of PAGES) {
    await p.goto(B + url, { waitUntil: 'domcontentloaded' });
    await p.waitForTimeout(900);
    const eager = await p.$$eval('img', imgs => imgs
      .filter(i => i.getAttribute('loading') !== 'lazy')
      .map(i => ({ src: (i.getAttribute('src') || '').slice(-34), top: Math.round(i.getBoundingClientRect().top) })));
    if (eager.length > 2) problems.push(`${name} صور أولوية زائدة (${eager.length}): ${eager.map(e => e.src).join(', ')}`);
  }
  await ctx.close();

  console.log(problems.length ? '✗ مشاكل:\n  ' + problems.join('\n  ') : '✓ لا مشاكل استجابية ولا أخطاء console ولا صور مكسورة');
  await b.close();
  process.exit(problems.length ? 1 : 0);
})();
