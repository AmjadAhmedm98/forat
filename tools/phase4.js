/** فحص Phase 4: معاينة التطبيق + الجدول الثابت */
const { chromium } = require('playwright-core');
const exePath = `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
const ok = [], fail = [];
const t = async (n, fn) => { try { await fn(); ok.push(n); } catch (e) { fail.push(`${n}: ${e.message.split('\n')[0].slice(0,120)}`); } };
const B = 'http://localhost:3000';
const nav = async (p, u) => { await p.goto(B + u, { waitUntil: 'domcontentloaded', timeout: 60000 }); await p.waitForTimeout(2200); };

(async () => {
  const b = await chromium.launch({ executablePath: exePath });
  const p = await (await b.newContext({ viewport: { width: 1440, height: 950 }, locale: 'ar-IQ' })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));

  await nav(p, '/apps');

  await t('التطبيق: تبديل الجهاز يغيّر الإطار والتفاصيل', async () => {
    const frameOf = () => p.$eval('[style*="border-radius"]', el => getComputedStyle(el).borderRadius);
    await p.click('button[aria-pressed]:has-text("iPhone")'); await p.waitForTimeout(500);
    const iosR = await frameOf(); const iosTxt = await p.textContent('body');
    await p.click('button[aria-pressed]:has-text("Android")'); await p.waitForTimeout(500);
    const andR = await frameOf(); const andTxt = await p.textContent('body');
    if (iosR === andR) throw new Error('الإطار لم يتغيّر: ' + iosR);
    if (!iosTxt.includes('App Store') || !andTxt.includes('Google Play')) throw new Error('المتجر لم يتغيّر');
  });

  await t('التطبيق: هواوي بلا رابط تنزيل ومعروضة كخيار مستقبلي', async () => {
    await p.click('button[aria-pressed]:has-text("Huawei")'); await p.waitForTimeout(500);
    const txt = await p.textContent('body');
    if (!txt.includes('غير منشور')) throw new Error('لا تصريح بعدم النشر');
    const hasLink = await p.$$eval('a[href*="appgallery"], a[href*="huawei"]', a => a.length);
    if (hasLink) throw new Error('رابط AppGallery موجود');
    await p.click('button[aria-pressed]:has-text("iPhone")'); await p.waitForTimeout(400);
  });

  await t('التطبيق: كل تبويب سفلي يعمل', async () => {
    for (const lbl of ['مباشر', 'Shorts', 'الإذاعة', 'محفوظة', 'الرئيسية']) {
      await p.click(`nav button[aria-label="${lbl}"]`); await p.waitForTimeout(450);
      const pressed = await p.getAttribute(`nav button[aria-label="${lbl}"]`, 'aria-pressed');
      if (pressed !== 'true') throw new Error(lbl + ' لم يُفعّل');
    }
  });

  await t('التطبيق: فتح خبر ثم الرجوع', async () => {
    await p.click('nav button[aria-label="الرئيسية"]'); await p.waitForTimeout(400);
    const cards = p.locator('div[style*="border-radius"] button').filter({ hasText: /.{12,}/ });
    await cards.nth(3).click(); await p.waitForTimeout(600);
    const backBtn = p.locator('button[aria-label="رجوع"]').first();
    if (!(await backBtn.count())) throw new Error('لا زرّ رجوع');
    await backBtn.click(); await p.waitForTimeout(500);
  });

  await t('التطبيق: الحفظ ينعكس في شاشة المحفوظة', async () => {
    await p.click('nav button[aria-label="الرئيسية"]'); await p.waitForTimeout(400);
    const save = p.locator('button[aria-label="حفظ"]').first();
    await save.click(); await p.waitForTimeout(400);
    await p.click('nav button[aria-label="محفوظة"]'); await p.waitForTimeout(500);
    const txt = await p.textContent('body');
    if (txt.includes('لا مواد محفوظة')) throw new Error('لم يُحفظ');
  });

  await t('التطبيق: التنبيهات تفتح المادة المرتبطة', async () => {
    await p.click('nav button[aria-label="الرئيسية"]'); await p.waitForTimeout(400);
    await p.click('button[aria-label="التنبيهات"]'); await p.waitForTimeout(500);
    const before = await p.textContent('body');
    if (!before.includes('تعليم الكل كمقروء')) throw new Error('لم تفتح التنبيهات');
    await p.locator('button:has-text("مرصد الخامسة على الهواء")').first().click();
    await p.waitForTimeout(600);
    const after = await p.textContent('body');
    if (!after.includes('NILESAT')) throw new Error('لم تفتح شاشة البثّ');
  });

  await t('التطبيق: Shorts تتنقّل داخل الهاتف', async () => {
    await p.click('nav button[aria-label="Shorts"]'); await p.waitForTimeout(500);
    const first = await p.$eval('div[style*="border-radius"]', el => el.textContent);
    await p.locator('button[aria-label="التالي"]').first().click(); await p.waitForTimeout(500);
    const second = await p.$eval('div[style*="border-radius"]', el => el.textContent);
    if (first === second) throw new Error('لم يتغيّر المقطع');
  });

  await t('التطبيق: الإذاعة لا تدّعي بثّاً ولها CTA رسمي', async () => {
    await p.click('nav button[aria-label="الإذاعة"]'); await p.waitForTimeout(500);
    const txt = await p.textContent('body');
    if (!txt.includes('لا يوجد بثّ صوتي متاح داخل التطبيق')) throw new Error('لا تصريح');
    if (!txt.includes('107.1') || !txt.includes('101.7')) throw new Error('تردد ناقص');
    if (await p.$('audio')) throw new Error('عنصر audio موجود');
  });

  // ─── الجدول ───
  await nav(p, '/apps');
  await t('الجدول: الشبكة اليومية الثابتة بلا تبويب أيام', async () => {
    const txt = await p.textContent('body');
    if (!txt.includes('الشبكة اليومية الثابتة')) throw new Error('التسمية مفقودة');
    for (const d of ['السبت', 'الأحد', 'الاثنين', 'الخميس']) {
      const n = await p.locator(`button:has-text("${d}")`).count();
      if (n) throw new Error('ما زال هناك تبويب أيام: ' + d);
    }
  });
  await t('الجدول: وسم التوثيق دقيق', async () => {
    const txt = await p.textContent('body');
    if (!txt.includes('موثّق من عنوان')) throw new Error('وسم التوثيق مفقود');
  });

  // ─── أداء الصور ───
  await nav(p, '/');
  await t('الصور: البطل eager والبقية lazy مع sizes', async () => {
    await p.waitForTimeout(1500);
    const r = await p.$$eval('img', imgs => {
      const eager = imgs.filter(i => i.loading !== 'lazy');
      // sizes مطلوب فقط حين يكون srcset بواصفات العرض (w)، لا بواصفات الكثافة (x)
      const noSizes = imgs.filter(i => {
        const ss = i.getAttribute('srcset') || '';
        return /\d+w(,|$|\s)/.test(ss) && !i.getAttribute('sizes');
      });
      return { total: imgs.length, eager: eager.length, noSizes: noSizes.length };
    });
    if (r.eager > 4) throw new Error(`${r.eager} صورة eager (الحدّ 4)`);
    if (r.noSizes > 0) throw new Error(`${r.noSizes} صورة بلا sizes`);
  });

  // ─── موبايل ───
  const m = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
  for (const u of ['/apps', '/radio']) {
    await nav(m, u);
    await t(`موبايل ${u}: لا تمرير أفقي`, async () => {
      const over = await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (over > 2) throw new Error(`تجاوز ${over}px`);
    });
  }

  console.log('نجح:', ok.length); ok.forEach(x => console.log('  ✓', x));
  if (fail.length) { console.log('فشل:', fail.length); fail.forEach(x => console.log('  ✗', x)); }
  if (errs.length) console.log('أخطاء JS:', errs.slice(0,3).join(' | '));
  await b.close();
  process.exit(fail.length ? 1 : 0);
})();
