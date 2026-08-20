/**
 * يتحقّق أن معرّف البثّ المضبوط في src/config/broadcast.config.ts ما زال حياً
 * على يوتيوب، وأن صورته مخزّنة محلياً. يوتيوب يحذف البثوث المنتهية، لذا
 * شغّل هذه الأداة قبل كل إصدار.
 *
 * عند الفشل تطبع معرّف البثّ الحالي للقناة لتحديث الإعداد.
 */
const fs = require('fs');
const path = require('path');

const CFG = path.join(__dirname, '..', 'src/config/broadcast.config.ts');
const src = fs.readFileSync(CFG, 'utf8');
const id = (src.match(/liveVideoId:\s*"([A-Za-z0-9_-]{11})"/) || [])[1];
const channel = (src.match(/channelId:\s*"([^"]+)"/) || [])[1];

const get = async (url) => {
  const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' }, redirect: 'follow' });
  return { status: r.status, text: r.status === 200 ? await r.text() : '' };
};

(async () => {
  if (!id) { console.log('✗ تعذّرت قراءة liveVideoId من الإعداد'); process.exit(1); }
  console.log('معرّف البثّ المضبوط:', id);

  let bad = 0;

  const o = await get(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
  if (o.status === 200) {
    console.log('✓ الفيديو حيّ على يوتيوب —', JSON.parse(o.text).title);
  } else {
    console.log(`✗ الفيديو غير متاح (HTTP ${o.status}) — غالباً حُذف بعد انتهاء البثّ`);
    bad++;
  }

  const poster = path.join(__dirname, '..', 'public/media/yt', `${id}.jpg`);
  if (fs.existsSync(poster)) console.log('✓ الصورة الرسمية مخزّنة محلياً');
  else { console.log('✗ الصورة مفقودة:', poster); bad++; }

  if (bad) {
    const live = await get('https://www.youtube.com/@alforat_tv/live');
    const now = (live.text.match(/"videoId":"([A-Za-z0-9_-]{11})"/) || [])[1];
    console.log('\nالبثّ الحالي للقناة:', now || 'لم يُعثر عليه');
    if (now) {
      console.log('لتحديث الإعداد:');
      console.log(`  1) بدّل liveVideoId إلى "${now}" في src/config/broadcast.config.ts`);
      console.log(`  2) curl -s -o public/media/yt/${now}.jpg https://i.ytimg.com/vi/${now}/maxresdefault.jpg`);
    }
    console.log('\nملاحظة: قناة', channel, '— البديل الدائم في الواجهة لا يتعطّل بأي حال.');
  }
  process.exit(bad ? 1 : 0);
})();
