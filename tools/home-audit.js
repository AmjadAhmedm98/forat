/**
 * تدقيق تركيب الصفحة الرئيسية مقابل HOME_SLOTS:
 * السقوف · إزالة التكرار الشاملة · منع تسرّب الرياضة إلى وحدات أخرى.
 */
const { chromium } = require('playwright-core');
const exePath = `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;

const CAPS = {
  hero: 1, topStoriesGrid: 4, mostRead: 5, iraq: 4, economy: 3, world: 3,
  reports: 3, variety: 4, video: 6, sports: 4, shorts: 6,
};
const LABEL = {
  hero: 'الهيرو', topStoriesGrid: 'أبرز الأخبار', mostRead: 'الأكثر قراءة', iraq: 'العراق',
  economy: 'اقتصاد', world: 'العالم', reports: 'تقارير', variety: 'منوعات',
  video: 'فيديو', sports: 'رياضة', shorts: 'Shorts',
};

(async () => {
  const b = await chromium.launch({ executablePath: exePath });
  const p = await (await b.newContext({ viewport: { width: 1440, height: 950 } })).newPage();
  await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 80)); }
  });
  await p.waitForTimeout(2000);

  const slots = await p.evaluate(() => {
    const out = {};
    for (const el of document.querySelectorAll('[data-slot]')) {
      const id = el.getAttribute('data-slot');
      const links = [...el.querySelectorAll('a[href^="/article/"], a[href^="/shorts?v="]')]
        .filter(a => !a.hasAttribute('data-more'));
      out[id] = [...new Set(links.map(a => a.getAttribute('href')))];
    }
    return out;
  });

  const fail = [];
  const seen = new Map();
  console.log('── تركيب الصفحة الرئيسية ──');
  for (const [id, cap] of Object.entries(CAPS)) {
    const items = slots[id] ?? [];
    const over = items.length > cap;
    if (over) fail.push(`${LABEL[id]}: ${items.length} > ${cap}`);
    console.log(`  ${(LABEL[id] || id).padEnd(14)} ${String(items.length).padStart(2)} / ${cap}${over ? '   ✗ يتجاوز السقف' : ''}`);
    for (const href of items) {
      if (seen.has(href)) fail.push(`تكرار: ${decodeURIComponent(href).slice(0, 46)} → «${seen.get(href)}» و«${LABEL[id]}»`);
      else seen.set(href, LABEL[id]);
    }
  }
  console.log(`  ${'المجموع'.padEnd(14)} ${seen.size} مادة فريدة على الصفحة`);

  // لا وسم «رياضة» خارج الوحدة الرياضية
  const leak = await p.evaluate(() => {
    const bad = [];
    for (const el of document.querySelectorAll('[data-slot]')) {
      const id = el.getAttribute('data-slot');
      if (id === 'sports') continue;
      for (const t of el.querySelectorAll('a span')) {
        if (t.textContent.trim() === 'رياضة') bad.push(id);
      }
    }
    return [...new Set(bad)];
  });
  if (leak.length) fail.push(`تسرّب رياضة إلى: ${leak.join(', ')}`);

  console.log(fail.length
    ? '\n✗ مخالفات:\n  ' + fail.join('\n  ')
    : '\n✓ كل السقوف محترمة · صفر تكرار · لا تسرّب للرياضة');
  await b.close();
  process.exit(fail.length ? 1 : 0);
})();
