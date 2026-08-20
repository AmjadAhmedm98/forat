/** فحص Phase 3: الإذاعة · دليل البرامج · صفحة البرنامج · جدول البثّ */
const { chromium } = require('playwright-core');
const exePath = `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
const ok = [], fail = [];
const t = async (n, fn) => { try { await fn(); ok.push(n); } catch (e) { fail.push(`${n}: ${e.message.split('\n')[0].slice(0,110)}`); } };
const B = 'http://localhost:3000';
const settle = (pg, ms = 1800) => pg.waitForTimeout(ms);

(async () => {
  const b = await chromium.launch({ executablePath: exePath });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 950 }, locale: 'ar-IQ' });
  const p = await ctx.newPage();
  const errs = [], imgErr = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('response', r => { if (/_next\/image|\/media\//.test(r.url()) && r.status() >= 400) imgErr.push(r.status()+' '+r.url()); });

  // ─── الإذاعة ───
  await p.goto(B + '/radio', { waitUntil: 'domcontentloaded', timeout: 45000 }); await settle(p);
  await t('الإذاعة: التردّدان المؤكّدان ظاهران', async () => {
    const txt = await p.textContent('body');
    if (!txt.includes('107.1') || !txt.includes('101.7')) throw new Error('تردد ناقص');
    if (!txt.includes('بغداد') || !txt.includes('النجف الأشرف')) throw new Error('مدينة ناقصة');
  });
  await t('الإذاعة: CTA الأساسي صحيح ويشير للصفحة الرسمية', async () => {
    const el = p.locator('a:has-text("تابع إذاعة الفرات عبر الصفحة الرسمية")').first();
    const href = await el.getAttribute('href');
    if (!href || !href.includes('facebook.com')) throw new Error('رابط غير رسمي: ' + href);
  });
  await t('الإذاعة: لا ادّعاء ببثّ صوتي حيّ', async () => {
    const txt = await p.textContent('body');
    if (!txt.includes('لا يوجد بثّ صوتي متاح داخل الموقع')) throw new Error('لا يوجد تصريح بالحالة');
    if (await p.$('audio')) throw new Error('عنصر audio موجود');
  });
  await t('الإذاعة: معاينة الواجهة تعمل', async () => {
    await p.click('button[aria-label="تشغيل معاينة الواجهة"]');
    await p.waitForSelector('button[aria-label="إيقاف معاينة الواجهة"]', { timeout: 3000 });
  });

  // ─── دليل البرامج ───
  await p.goto(B + '/programs', { waitUntil: 'domcontentloaded', timeout: 45000 }); await settle(p);
  await t('البرامج: كل بطاقة تفتح صفحة داخلية حقيقية', async () => {
    const hrefs = await p.$$eval('a[href^="/programs/"]', a => [...new Set(a.map(x => x.getAttribute('href')))]);
    if (hrefs.length < 8) throw new Error('عدد قليل: ' + hrefs.length);
    for (const h of hrefs) {
      const r = await p.request.get(B + h);
      if (r.status() !== 200) throw new Error(`${h} → ${r.status()}`);
    }
  });
  await t('البرامج: فلترة التصنيف تعمل', async () => {
    const before = await p.$$eval('a[href^="/programs/"]', a => a.length);
    await p.click('button:has-text("إخباري")'); await p.waitForTimeout(400);
    const after = await p.$$eval('a[href^="/programs/"]', a => a.length);
    if (after >= before) throw new Error(`${before} → ${after}`);
    await p.click('button:has-text("الكل")'); await p.waitForTimeout(300);
  });
  await t('البرامج: البحث يعمل', async () => {
    await p.fill('input[aria-label="بحث في البرامج"]', 'وجيه'); await p.waitForTimeout(400);
    const txt = await p.textContent('body');
    if (!txt.includes('النقطة')) throw new Error('لا نتيجة');
    await p.fill('input[aria-label="بحث في البرامج"]', '');
  });
  await t('البرامج: لا موعد مختلق على أي بطاقة', async () => {
    const bad = await p.$$eval('a[href^="/programs/"]', links => {
      const out = [];
      for (const l of links) {
        const txt = l.textContent || '';
        const hasTime = /\b([01]?\d|2[0-3]):[0-5]\d\b/.test(txt);
        const hasUnverified = txt.includes('الموعد غير موثّق');
        if (hasTime && hasUnverified) out.push(txt.slice(0, 30));
      }
      return out;
    });
    if (bad.length) throw new Error('تعارض: ' + bad.join(' | '));
  });

  // ─── صفحة البرنامج ───
  await p.goto(B + '/programs/marsad-aththalitha', { waitUntil: 'domcontentloaded', timeout: 45000 }); await settle(p);
  await t('صفحة البرنامج: غلاف ومقدّم ووصف وحلقات', async () => {
    const txt = await p.textContent('body');
    for (const s of ['مرصد الثالثة', 'فرح الشيخلي', 'أحدث الحلقات']) if (!txt.includes(s)) throw new Error('ناقص: ' + s);
    if (!(await p.$('img'))) throw new Error('لا غلاف');
  });
  await t('صفحة البرنامج: دليل الموعد ظاهر', async () => {
    const txt = await p.textContent('body');
    if (!txt.includes('15:00')) throw new Error('لا موعد');
  });
  await t('صفحة البرنامج: بطاقات الحلقات تشير إلى YouTube', async () => {
    const hrefs = await p.$$eval('a[href*="youtube.com/watch"]', a => a.map(x => x.getAttribute('href')));
    if (hrefs.length < 2) throw new Error('حلقات غير مرتبطة: ' + hrefs.length);
  });
  await t('صفحة البرنامج: لا عنوان فوق أي صورة', async () => {
    const clash = await p.$$eval('a, article, header', els => {
      const bad = [];
      for (const l of els) {
        const img = l.querySelector(':scope > div img, :scope img');
        if (!img) continue;
        const ir = img.getBoundingClientRect(); if (!ir.width) continue;
        for (const h of l.querySelectorAll('h1,h2,h3')) {
          const hr = h.getBoundingClientRect(); if (!hr.width) continue;
          const ox = Math.min(ir.right, hr.right) - Math.max(ir.left, hr.left);
          const oy = Math.min(ir.bottom, hr.bottom) - Math.max(ir.top, hr.top);
          if (ox > 6 && oy > 6) bad.push((h.textContent||'').trim().slice(0,32));
        }
      }
      return [...new Set(bad)];
    });
    if (clash.length) throw new Error(clash.join(' | '));
  });
  await t('صفحة برنامج بلا موعد تصرّح بذلك', async () => {
    await p.goto(B + '/programs/annuqta', { waitUntil: 'domcontentloaded', timeout: 45000 }); await settle(p);
    const txt = await p.textContent('body');
    if (!txt.includes('موعد البثّ غير موثّق')) throw new Error('لا تصريح');
  });

  // ─── جدول البثّ ───
  await p.goto(B + '/apps', { waitUntil: 'domcontentloaded', timeout: 45000 }); await settle(p);
  await t('الجدول: شبكة يومية ثابتة بلا تبويب أيام', async () => {
    const txt = await p.textContent('body');
    if (!txt.includes('الشبكة اليومية الثابتة')) throw new Error('التسمية مفقودة');
    for (const d of ['السبت', 'الأحد', 'الخميس', 'الجمعة']) {
      if (await p.locator(`button:has-text("${d}")`).count()) throw new Error('تبويب أيام باقٍ: ' + d);
    }
  });
  await t('الجدول: كل صفّ يذكر دليل موعده', async () => {
    const rows = await p.$$eval('ol li', ls => ls.length);
    const ev = await p.$$eval('ol li', ls => ls.filter(l =>
      /الاسم الرسمي|توقيت البثّ|بثّ «الآن/.test(l.textContent || '')).length);
    if (ev < rows) throw new Error(`${ev}/${rows} فقط تحمل دليلاً`);
  });
  await t('الجدول: لا يحوي برامج بلا موعد مؤكّد', async () => {
    const rows = await p.$eval('ol', o => o.textContent || '');
    for (const bad of ['النقطة', 'بلا قناع', 'عالمسطرة', 'صندوق الأمنيات', 'المقاربة']) {
      if (rows.includes(bad)) throw new Error('تسرّب: ' + bad);
    }
  });
  await t('الجدول: البرامج غير المجدولة تظهر كدليل', async () => {
    const txt = await p.textContent('body');
    if (!txt.includes('خارج الجدول')) throw new Error('قسم الدليل مفقود');
  });

  // ─── الموبايل ───
  const m = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
  for (const u of ['/radio', '/programs', '/apps', '/programs/marsad-aththamina']) {
    await m.goto(B + u, { waitUntil: 'domcontentloaded', timeout: 45000 }); await settle(m);
    await t(`موبايل ${u}: لا تمرير أفقي`, async () => {
      const over = await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (over > 2) throw new Error(`تجاوز ${over}px`);
    });
  }
  await t('موبايل: القائمة تفتح', async () => {
    await m.click('button[aria-label="القائمة"]'); await m.waitForTimeout(400);
    if (!(await m.textContent('body')).includes('تطبيق الفرات')) throw new Error('لم تفتح');
  });

  if (imgErr.length) fail.push(`طلبات صور فاشلة: ${imgErr.slice(0,2).join(' | ')}`);
  console.log('نجح:', ok.length); ok.forEach(x => console.log('  ✓', x));
  if (fail.length) { console.log('فشل:', fail.length); fail.forEach(x => console.log('  ✗', x)); }
  if (errs.length) console.log('أخطاء JS:', errs.slice(0,3).join(' | '));
  await b.close();
  process.exit(fail.length ? 1 : 0);
})();
