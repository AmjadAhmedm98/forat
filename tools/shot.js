const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const EXE = fs.readdirSync(process.env.HOME + '/Library/Caches/ms-playwright')
  .filter(d => d.startsWith('chromium-'))[0];
const exePath = `${process.env.HOME}/Library/Caches/ms-playwright/${EXE}/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;

(async () => {
  const targets = JSON.parse(process.argv[2]);
  const outDir = process.argv[3];
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ executablePath: exePath });
  const errors = [];
  for (const t of targets) {
    const ctx = await browser.newContext({
      viewport: { width: t.w, height: t.h },
      deviceScaleFactor: 2,
      isMobile: t.w < 500,
      hasTouch: t.w < 500,
      locale: 'ar-IQ',
    });
    const page = await ctx.newPage();
    page.on('console', m => { if (m.type() === 'error') errors.push(`[${t.name}] ${m.text()}`); });
    page.on('pageerror', e => errors.push(`[${t.name}] PAGEERROR ${e.message}`));
    await page.goto('http://localhost:3000' + t.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState('load').catch(() => {});
    await page.waitForTimeout(t.wait || 1600);
    if (t.scroll) { await page.evaluate(y => window.scrollTo(0, y), t.scroll); await page.waitForTimeout(900); }
    if (t.click) { try { await page.click(t.click, { timeout: 4000 }); await page.waitForTimeout(1100); } catch (e) { errors.push(`[${t.name}] click failed: ${t.click}`); } }
    if (t.full) {
      // لقطة الصفحة الكاملة: مرّر الصفحة ثم أجبر كل الصور على التحميل الفوري
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 500) {
          window.scrollTo(0, y); await new Promise(r => setTimeout(r, 70));
        }
        window.scrollTo(0, 0);
        document.querySelectorAll('img').forEach(i => { i.loading = 'eager'; i.decoding = 'sync'; });
      });
      await page.waitForFunction(
        () => [...document.querySelectorAll('img')].every(i => i.complete && i.naturalWidth > 0),
        { timeout: 45000 },
      ).catch(() => {});
      await page.waitForTimeout(2500);
    }
    await page.screenshot({ path: path.join(outDir, t.name + '.png'), fullPage: !!t.full });
    await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(outDir, 'errors.txt'), errors.join('\n') || 'no console errors');
  console.log(errors.join('\n') || 'no console errors');
})();
