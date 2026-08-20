/**
 * فحص مشغّل الإذاعة الحقيقي: تشغيل، إيقاف، كتم، مستوى الصوت،
 * التقديم داخل المادة، تبديل مادة القائمة، ثم الخروج من الصفحة والعودة إليها
 * للتأكد من عدم ظهور أخطاء console.
 */
const { chromium } = require('playwright-core');
const fs = require('fs');

const EXE = fs.readdirSync(process.env.HOME + '/Library/Caches/ms-playwright')
  .filter(d => d.startsWith('chromium-'))[0];
const exePath = `${process.env.HOME}/Library/Caches/ms-playwright/${EXE}/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
const B = 'http://localhost:3000';

const ok = [], fail = [];
const t = async (name, fn) => {
  try { await fn(); ok.push(name); }
  catch (e) { fail.push(`${name}: ${String(e.message).split('\n')[0]}`); }
};

// حالة المشغّل تُقرأ من واجهة YouTube داخل الإطار
const ytState = (p) => p.evaluate(() => {
  const f = document.querySelector('iframe[src*="youtube"]');
  return f ? 'iframe' : 'none';
});

(async () => {
  const b = await chromium.launch({ executablePath: exePath, args: ['--autoplay-policy=no-user-gesture-required'] });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 950 }, locale: 'ar-IQ' });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  p.on('console', m => {
    if (m.type() !== 'error') return;
    const txt = m.text();
    // ضجيج خارجي من نطاق YouTube نفسه لا يخص كودنا
    if (/youtube|googleads|doubleclick|gstatic|ERR_BLOCKED_BY_CLIENT|Failed to load resource/i.test(txt)) return;
    errs.push('CONSOLE ' + txt);
  });

  await p.goto(B + '/radio', { waitUntil: 'networkidle' });

  await t('العنوان نظيف: إذاعة الفرات', async () => {
    const h1 = await p.textContent('h1');
    if (!h1.includes('إذاعة الفرات')) throw new Error('العنوان مفقود');
  });

  await t('لا عبارات تنويه عامة على الصفحة', async () => {
    const body = await p.textContent('body');
    for (const bad of ['واجهة عرض', 'ليست تشغيلاً', 'لا يوجد بثّ صوتي', 'النموذج', 'بث مباشر FM']) {
      if (body.includes(bad)) throw new Error('ظهرت عبارة: ' + bad);
    }
  });

  await t('التردّدان ظاهران', async () => {
    const body = await p.textContent('body');
    if (!body.includes('107.1') || !body.includes('101.7')) throw new Error('تردد ناقص');
  });

  await t('لا صوت قبل نقر المستخدم', async () => {
    if ((await ytState(p)) !== 'none') throw new Error('الإطار حُمّل قبل النقر');
  });

  await t('«استمع الآن» يبدأ التشغيل', async () => {
    await p.click('button:has-text("استمع الآن")');
    await p.waitForSelector('iframe[src*="youtube"]', { timeout: 15000 });
    await p.waitForSelector('button[aria-label="إيقاف مؤقت"]', { timeout: 20000 });
  });

  await t('الزمن المنقضي يتقدّم', async () => {
    const read = async () => (await p.textContent('.radio-range ~ div span:first-child')) || '';
    const a = await read();
    await p.waitForTimeout(2500);
    const c = await read();
    if (a === c) throw new Error(`الزمن ثابت عند ${a}`);
  });

  await t('إيقاف مؤقت ثم استئناف', async () => {
    await p.click('button[aria-label="إيقاف مؤقت"]');
    await p.waitForSelector('button[aria-label="استمع الآن"]', { timeout: 8000 });
    await p.click('button[aria-label="استمع الآن"]');
    await p.waitForSelector('button[aria-label="إيقاف مؤقت"]', { timeout: 8000 });
  });

  await t('الكتم وإلغاء الكتم', async () => {
    await p.click('button[aria-label="كتم الصوت"]');
    await p.waitForSelector('button[aria-label="إلغاء الكتم"]', { timeout: 5000 });
    await p.click('button[aria-label="إلغاء الكتم"]');
    await p.waitForSelector('button[aria-label="كتم الصوت"]', { timeout: 5000 });
  });

  await t('مستوى الصوت يتغيّر', async () => {
    const slider = p.locator('input[aria-label="مستوى الصوت"]');
    await slider.fill('0.35');
    await p.waitForTimeout(400);
    const shown = await p.textContent('input[aria-label="مستوى الصوت"] ~ span');
    if (!shown.includes('35')) throw new Error('النسبة لم تتغيّر: ' + shown);
  });

  await t('التقديم داخل المادة', async () => {
    const before = await p.textContent('.radio-range ~ div span:first-child');
    await p.locator('input[aria-label="موضع التشغيل"]').fill('400');
    await p.waitForTimeout(1500);
    const after = await p.textContent('.radio-range ~ div span:first-child');
    if (before === after) throw new Error('الموضع لم يتغيّر');
  });

  await t('تبديل مادة من قائمة التشغيل', async () => {
    const before = await p.textContent('h1 ~ * >> nth=-1').catch(() => '');
    const items = p.locator('ol li button');
    await items.nth(2).click();
    await p.waitForTimeout(2500);
    const current = await items.nth(2).getAttribute('aria-current');
    if (current !== 'true') throw new Error('المادة الجديدة ليست الجارية');
    void before;
  });

  await t('الخروج من الصفحة والعودة بلا أخطاء', async () => {
    await p.click('a[href="/live"]');
    await p.waitForURL('**/live', { timeout: 15000 });
    await p.waitForTimeout(1200);
    await p.goBack();
    await p.waitForURL('**/radio', { timeout: 15000 });
    await p.waitForTimeout(1500);
    await p.click('button:has-text("استمع الآن")').catch(() => {});
    await p.waitForTimeout(1500);
  });

  console.log('\n✓ ناجح:'); ok.forEach(o => console.log('   ' + o));
  if (fail.length) { console.log('\n✗ فاشل:'); fail.forEach(f => console.log('   ' + f)); }
  console.log('\nأخطاء console/page:', errs.length ? '\n  ' + errs.join('\n  ') : 'لا شيء');
  await b.close();
  process.exit(fail.length || errs.length ? 1 : 0);
})();
