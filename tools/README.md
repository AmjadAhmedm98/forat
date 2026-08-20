# أدوات فحص المشروع

تعمل مقابل خادم محلي على المنفذ 3000 وتستخدم Chromium المثبّت عبر Playwright.
يُفضَّل تشغيلها على بناء الإنتاج (`npm run build && npm start`) لا على `npm run dev`،
لأن تحسين الصور في وضع التطوير بطيء ويُنتج نتائج فحص غير دقيقة.

```bash
npm i -D playwright-core        # مرة واحدة
npx playwright install chromium # مرة واحدة

npm run build && npm start      # خادم الإنتاج

node tools/links.js      # زحف على الروابط الداخلية: لا 404، لا مراسٍ ميتة،
                         # ويتحقّق أن /schedule يحوّل إلى /apps وأنه خارج sitemap
node tools/interact.js   # سيناريوهات التفاعل: البحث، الشريط، البثّ، الصور، الهيدر، الموبايل
node tools/radio.js      # مشغّل الإذاعة: تشغيل/إيقاف/كتم/صوت/تقديم/تبديل مادة + أخطاء console
node tools/qa.js         # فحص استجابي 1440/820/390 + لقطات إلى qa-screens/

node tools/shot.js '[{"name":"home","url":"/","w":1440,"h":950}]' ./shots
```

`phase3.js` و`phase4.js` أدوات من مراحل سابقة تُحتفظ للمرجع.
