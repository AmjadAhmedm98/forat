const { chromium } = require('playwright-core');
const exePath = `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
const ok = [], fail = [];
const t = async (name, fn) => { try { await fn(); ok.push(name); } catch (e) { fail.push(`${name}: ${e.message.split('\n')[0]}`); } };

(async () => {
  const b = await chromium.launch({ executablePath: exePath });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 950 }, locale: 'ar-IQ' });
  const p = await ctx.newPage();
  const errs = [], imgErrors = [];
  p.on('pageerror', e => errs.push(e.message));
  const imgTypes = new Set();
  p.on('response', r => {
    const u = r.url();
    if (/\/_next\/image|\/media\//.test(u)) {
      if (r.status() >= 400) imgErrors.push(r.status() + ' ' + u);
      else { const ct = r.headers()['content-type']; if (ct) imgTypes.add(ct); }
    }
  });
  await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

  await t('⌘K يفتح البحث', async () => { await p.keyboard.press('Meta+k'); await p.waitForSelector('input[placeholder*="ابحث"]', { timeout: 3000 }); });
  await t('البحث يعيد نتائج حقيقية', async () => {
    await p.fill('input[placeholder*="ابحث"]', 'الكهرباء'); await p.waitForTimeout(500);
    if (!(await p.textContent('body')).includes('الكهرباء أمام فجوة')) throw new Error('لا نتائج');
  });
  await t('ESC يغلق البحث', async () => { await p.keyboard.press('Escape'); await p.waitForTimeout(300); if (await p.$('input[placeholder*="ابحث"]')) throw new Error('ما زال مفتوحاً'); });

  await t('إيقاف/استئناف شريط العاجل', async () => {
    await p.click('button[aria-label="إيقاف الشريط"]'); await p.waitForTimeout(300);
    await p.waitForSelector('button[aria-label="استئناف الشريط"]', { timeout: 2000 });
  });
  await t('«استمع الآن» في الرئيسية يفتح صفحة الإذاعة', async () => {
    const href = await p.getAttribute('a:has-text("استمع الآن")', 'href');
    if (href !== '/radio') throw new Error('الوجهة: ' + href);
  });
  await t('قسم تطبيق الفرات ظاهر في الرئيسية', async () => {
    const body = await p.textContent('body');
    if (!body.includes('الفرات معك أينما كنت')) throw new Error('القسم غائب');
    for (const store of ['App Store', 'Google Play']) {
      if (!body.includes(store)) throw new Error('زر متجر ناقص: ' + store);
    }
  });
  await t('لا رابط جدول بثّ في الترويسة أو التذييل', async () => {
    const hrefs = await p.$$eval('header a[href], footer a[href]', as => as.map(a => a.getAttribute('href')));
    if (hrefs.some(h => h && h.startsWith('/schedule'))) throw new Error('ما زال هناك رابط /schedule');
    const labels = await p.$$eval('header a, footer a', as => as.map(a => (a.textContent || '').trim()));
    if (labels.some(l => l.includes('جدول البث'))) throw new Error('نصّ «جدول البث» ما زال ظاهراً');
  });
  await t('«تطبيق الفرات» ضمن التنقّل الرئيسي', async () => {
    const nav = await p.$$eval('header nav a', as => as.map(a => (a.textContent || '').trim()));
    if (!nav.some(l => l.includes('تطبيق الفرات'))) throw new Error('عنصر التنقّل غائب: ' + nav.join('|'));
  });
  await t('أسهم Shorts تمرّر الشريط', async () => {
    const overflowing = await p.$eval('.rail', el => el.scrollWidth - el.clientWidth > 8);
    if (!overflowing) return; // الشريط لا يتجاوز العرض ⇒ الأسهم مخفيّة بالتصميم
    const before = await p.$eval('.rail', el => el.scrollLeft);
    await p.click('button[aria-label="التالي"]'); await p.waitForTimeout(800);
    if (before === await p.$eval('.rail', el => el.scrollLeft)) throw new Error('لم يتحرك');
  });
  await t('كل بطاقة تحمل صورة حقيقية', async () => {
    // مرّر الصفحة كاملة حتى تُحمَّل الصور الكسولة
    await p.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y); await new Promise(r => setTimeout(r, 110));
      }
      window.scrollTo(0, 0);
    });
    await p.waitForTimeout(9000);

    // 1) لا طلب صورة فشل
    if (imgErrors.length) throw new Error(`طلبات صور فاشلة: ${imgErrors.slice(0, 3).join(' | ')}`);

    // 2) كل بطاقة في الصفحة كلّها تعرض صورة محمّلة فعلاً
    //    (تُجبَر الصور الكسولة على التحميل حتى تُفحَص البطاقات أسفل الطيّة أيضاً)
    await p.evaluate(() => {
      document.querySelectorAll('img').forEach(i => { i.loading = 'eager'; i.decoding = 'sync'; });
    });
    await p.waitForFunction(
      () => [...document.querySelectorAll('a[href^="/article/"], a[href^="/programs/"]')]
        .every(l => { const i = l.querySelector('img'); return !i || i.complete; }),
      { timeout: 45000 },
    ).catch(() => {});

    const bad = await p.$$eval('a[href^="/article/"], a[href^="/programs/"]', links =>
      links.map((l) => {
        const img = l.querySelector('img');
        if (!img) return null;                        // بطاقات نصّية مقصودة (رياضة/قوائم)
        return img.naturalWidth > 0 ? null : (img.getAttribute('src') || 'no-src');
      }).filter(Boolean));
    if (bad.length) throw new Error(`${bad.length} صورة لم تُحمَّل → ${bad.slice(0, 3).join(' | ')}`);
  });

  await t('لا صورة احتياطية مستخدمة (كل الصور أصلية)', async () => {
    const fb = await p.$$eval('img', imgs =>
      imgs.filter(i => (i.currentSrc || '').includes('fallback') || i.dataset.fallback === '1').length);
    if (fb > 0) throw new Error(`${fb} بطاقة تستخدم الصورة الاحتياطية`);
  });

  await t('لا عنوان فوق أي صورة (قاعدة الطبقات)', async () => {
    const clashes = await p.$$eval('a[href^="/article/"], a[href^="/programs/"], a[href^="/shorts"]', links => {
      const bad = [];
      for (const l of links) {
        const img = l.querySelector('img');
        if (!img) continue;
        const ir = img.getBoundingClientRect();
        if (!ir.width) continue;
        for (const h of l.querySelectorAll('h1,h2,h3,h4,p')) {
          const hr = h.getBoundingClientRect();
          if (!hr.width) continue;
          const overlapX = Math.min(ir.right, hr.right) - Math.max(ir.left, hr.left);
          const overlapY = Math.min(ir.bottom, hr.bottom) - Math.max(ir.top, hr.top);
          // تجاهل التداخل المجهري الناتج عن التقريب
          if (overlapX > 6 && overlapY > 6) bad.push((h.textContent || '').trim().slice(0, 45));
        }
      }
      return bad;
    });
    if (clashes.length) throw new Error(`${clashes.length} عنوان فوق صورة → ${clashes.slice(0, 2).join(' | ')}`);
  });

  // thumbnails الفرات تحمل عنواناً مطبوعاً داخل الصورة → قصّها ممنوع تماماً.
  // صور الصحافة (media/news) بلا نصّ مطبوع → يُسمح بقصّ تحريري محدود (3:2 → 16:9).
  await t('لا قصّ في تأطير صور القناة (نصّ مطبوع)', async () => {
    const cropped = await p.$$eval('img', imgs => imgs.map(i => {
      const src = i.getAttribute('src') || '';
      if (!/media(%2F|\/)yt/.test(src)) return null;
      if (!i.naturalWidth || !i.complete) return null;
      if (i.offsetWidth < 60) return null;
      if (getComputedStyle(i).objectFit !== 'cover') return null;
      const srcAR = i.naturalWidth / i.naturalHeight;
      const boxAR = i.offsetWidth / i.offsetHeight;
      return Math.abs(srcAR - boxAR) / srcAR > 0.06
        ? `${src.slice(-38)} src=${srcAR.toFixed(2)} box=${boxAR.toFixed(2)}` : null;
    }).filter(Boolean));
    if (cropped.length) throw new Error(`${cropped.length} صورة قناة مقصوصة → ${cropped.slice(0, 2).join(' | ')}`);
  });

  await t('قصّ صور الصحافة ضمن الحدّ التحريري', async () => {
    const bad = await p.$$eval('img', imgs => imgs.map(i => {
      const src = i.getAttribute('src') || '';
      if (!/media(%2F|\/)news/.test(src)) return null;
      if (!i.naturalWidth || !i.complete) return null;
      if (i.offsetWidth < 60) return null;
      const srcAR = i.naturalWidth / i.naturalHeight;
      const boxAR = i.offsetWidth / i.offsetHeight;
      // 3:2 → 16:9 انحراف ≈ 19٪ وهو قصّ تحريري مقبول؛ ما فوق 25٪ مرفوض
      return Math.abs(srcAR - boxAR) / srcAR > 0.25
        ? `${src.slice(-34)} src=${srcAR.toFixed(2)} box=${boxAR.toFixed(2)}` : null;
    }).filter(Boolean));
    if (bad.length) throw new Error(`${bad.length} صورة قصّها مفرط → ${bad.slice(0, 2).join(' | ')}`);
  });

  await t('الصور تُخدَّم بصيغة AVIF/WebP', async () => {
    if (!imgTypes.size) throw new Error('لم تُرصد أي استجابة صورة');
    const modern = [...imgTypes].filter(t => /avif|webp/.test(t));
    if (!modern.length) throw new Error(`الصيغ المرصودة: ${[...imgTypes].join(', ')}`);
  });

  await t('الهيدر يبقى ملتصقاً عند التمرير', async () => {
    for (const url of ['/', '/news/iraq', '/article/ajz-almawazana-21-trilion']) {
      await p.goto('http://localhost:3000' + url, { waitUntil: 'networkidle' });
      await p.evaluate(() => window.scrollTo(0, 2200));
      await p.waitForTimeout(600);
      const top = await p.evaluate(() => Math.round(document.querySelector('header').getBoundingClientRect().top));
      if (top < -2 || top > 4) throw new Error(`${url} → header.top=${top}`);
    }
    await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  });

  await t('لا خطوط سائبة عائمة وسط الصفحة', async () => {
    await p.evaluate(() => window.scrollTo(0, 1800));
    await p.waitForTimeout(500);
    const stray = await p.evaluate(() => [...document.querySelectorAll('div')].filter(d => {
      const s = getComputedStyle(d);
      const b = d.getBoundingClientRect();
      return (s.position === 'sticky' || s.position === 'fixed') &&
             b.height > 0 && b.height <= 6 && b.top > 8 && b.width > 400;
    }).length);
    if (stray) throw new Error(`${stray} خطّ ملتصق يطفو وسط الصفحة`);
    await p.evaluate(() => window.scrollTo(0, 0));
  });

  await t('بطاقة خبر تفتح صفحة الخبر', async () => {
    await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    const link = p.locator('[data-slot="hero"] a[href^="/article/"]').first();
    await link.scrollIntoViewIfNeeded();
    await link.click({ timeout: 8000 });
    await p.waitForURL(/\/article\//, { timeout: 8000 });
  });

  await p.goto('http://localhost:3000/live', { waitUntil: 'networkidle' });
  await t('البثّ الحقيقي يُشغَّل داخل الصفحة', async () => {
    await p.click('button[aria-label="شاهد البثّ المباشر"]');
    await p.waitForSelector('iframe[src*="youtube-nocookie.com/embed"]', { timeout: 8000 });
    await p.waitForTimeout(5000);

    const fr = p.frames().find(f => f.url().includes('youtube'));
    if (!fr) throw new Error('لم يُحمَّل إطار YouTube');

    // فيديو محذوف أو ممنوع التضمين يعرض لوحة خطأ بدل أن يشتغل
    const err = await fr.evaluate(() => {
      const e = document.querySelector('.ytp-error, .ytp-error-content-wrap-reason');
      return e ? (e.textContent || '').trim().slice(0, 90) : null;
    }).catch(() => null);
    if (err) throw new Error('لوحة خطأ داخل المشغّل: ' + err);

    // التشغيل الفعلي: زمن الفيديو يتقدّم
    const read = () => fr.evaluate(() => {
      const v = document.querySelector('video');
      return v ? v.currentTime : -1;
    }).catch(() => -1);
    const t1 = await read();
    await p.waitForTimeout(3500);
    const t2 = await read();
    if (!(t2 > 0 && t2 > t1)) throw new Error(`الفيديو لا يتقدّم (${t1} → ${t2})`);
  });
  await t('رابط المشاهدة يطابق البثّ المضمَّن', async () => {
    const embed = await p.getAttribute('iframe[src*="youtube-nocookie.com/embed"]', 'src');
    const embedId = (embed.match(/embed\/([A-Za-z0-9_-]{11})/) || [])[1];
    const href = await p.getAttribute('a[href*="youtube.com/watch"]', 'href');
    if (!embedId || !href.includes(embedId)) throw new Error(`تضمين ${embedId} ≠ رابط ${href}`);
  });

  const m = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
  await m.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await t('قائمة الموبايل تفتح', async () => {
    await m.click('button[aria-label="القائمة"]'); await m.waitForTimeout(400);
    if (!(await m.textContent('body')).includes('تطبيق الفرات')) throw new Error('لم تفتح');
  });
  await t('لا تمرير أفقي على الموبايل', async () => {
    const over = await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (over > 2) throw new Error(`تجاوز ${over}px`);
  });

  console.log('نجح:', ok.length); ok.forEach(x => console.log('  ✓', x));
  if (fail.length) { console.log('فشل:', fail.length); fail.forEach(x => console.log('  ✗', x)); }
  if (errs.length) console.log('أخطاء JS:', errs.join(' | '));
  await b.close();
  process.exit(fail.length ? 1 : 0);
})();
