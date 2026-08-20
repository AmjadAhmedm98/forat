/**
 * زحف على كل الروابط الداخلية للتأكد من عدم وجود 404 أو مراسٍ ميتة.
 * /schedule مسار قديم: النجاح هو تحويله (308) إلى /apps.
 */
const { chromium } = require('playwright-core');
const fs = require('fs');

const EXE = fs.readdirSync(process.env.HOME + '/Library/Caches/ms-playwright')
  .filter(d => d.startsWith('chromium-'))[0];
const exePath = `${process.env.HOME}/Library/Caches/ms-playwright/${EXE}/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
const B = 'http://localhost:3000';

const SEEDS = ['/', '/live', '/radio', '/programs', '/shorts', '/apps', '/breaking', '/about', '/search', '/news/iraq'];

(async () => {
  const b = await chromium.launch({ executablePath: exePath });
  const p = await b.newPage();
  const internal = new Set(SEEDS);
  const dead = [];

  for (const u of SEEDS) {
    await p.goto(B + u, { waitUntil: 'networkidle' });
    const hrefs = await p.$$eval('a[href]', as => as.map(a => a.getAttribute('href')));
    hrefs.forEach(h => {
      if (!h || h === '#' || h === '') { dead.push(`${u} → مرساة ميتة`); return; }
      if (h.startsWith('/')) internal.add(h.split('#')[0]);
    });
  }

  console.log('روابط داخلية:', internal.size);
  if (dead.length) console.log('مراسٍ ميتة:', dead.length, dead.slice(0, 5));

  let bad = 0;
  for (const h of [...internal]) {
    const r = await p.goto(B + h, { waitUntil: 'domcontentloaded' });
    if (r.status() >= 400) { console.log('  ✗', r.status(), h); bad++; }
  }

  // المسار القديم يجب أن يحوّل إلى /apps لا أن يعرض جدولاً
  const r = await p.goto(B + '/schedule', { waitUntil: 'domcontentloaded' });
  const landed = new URL(p.url()).pathname;
  const redirectOk = r.status() === 200 && landed === '/apps';
  console.log(redirectOk ? '✓ /schedule يحوّل إلى /apps' : `✗ /schedule انتهى إلى ${landed} (${r.status()})`);
  if (!redirectOk) bad++;

  // لا يجوز أن يظهر /schedule في أي واجهة أو في sitemap
  const sm = await (await p.goto(B + '/sitemap.xml')).text();
  const inSitemap = sm.includes('/schedule');
  console.log(inSitemap ? '✗ /schedule ما زال في sitemap' : '✓ /schedule خارج sitemap');
  if (inSitemap) bad++;

  const linked = [...internal].filter(h => h === '/schedule' || h.startsWith('/schedule/'));
  console.log(linked.length ? `✗ روابط ظاهرة إلى ${linked}` : '✓ لا رابط ظاهر إلى /schedule');
  if (linked.length) bad++;
  if (dead.length) bad++;

  console.log(bad === 0 ? '✓ كل الروابط الداخلية تعمل' : `✗ ${bad} مشكلة`);
  await b.close();
  process.exit(bad === 0 ? 0 : 1);
})();
