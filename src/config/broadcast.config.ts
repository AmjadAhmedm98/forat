/**
 * ════════════════════════════════════════════════════════════════
 * إعدادات البثّ المركزية — المصدر الوحيد لكل ما يخص البثّ الحيّ.
 * أي تغيير في رابط البثّ أو معرّفه يتم هنا فقط.
 *
 * ملاحظة تشغيلية: يوتيوب يحذف بثوث الفرات السابقة بعد انتهائها، فمعرّف
 * البثّ متغيّر بطبيعته. لذلك:
 *  • `liveVideoId` يُحدَّث من صفحة البثّ الرسمية: youtube.com/@alforat_tv/live
 *  • `liveChannelUrl` رابط دائم لا يتعطّل مهما تغيّر المعرّف، ويُستخدم
 *    في البديل المهذّب حين يتعذّر التشغيل داخل الصفحة.
 *  • `node tools/live-check.js` يتحقّق أن المعرّف المضبوط ما زال حياً.
 * ════════════════════════════════════════════════════════════════
 */

export const BROADCAST = {
  /** معرّف بثّ قناة الفرات الرسمي على YouTube — يُتحقَّق منه قبل كل إصدار */
  liveVideoId: "yQoSQKyC-uE",
  /** القناة الرسمية */
  channelUrl: "https://youtube.com/@alforat_tv",
  channelId: "UC6nVplZaI0ScP3aM-b7VuNQ",
  /** صفحة البثّ الحيّ للقناة — دائمة ولا تعتمد على معرّف بعينه */
  liveChannelUrl: "https://www.youtube.com/@alforat_tv/live",
  /** معاملات التضمين */
  embedHost: "https://www.youtube-nocookie.com",
  embedParams: "rel=0&modestbranding=1&autoplay=1",
} as const;

export const liveWatchUrl = () =>
  `https://www.youtube.com/watch?v=${BROADCAST.liveVideoId}`;

export const liveEmbedUrl = () =>
  `${BROADCAST.embedHost}/embed/${BROADCAST.liveVideoId}?${BROADCAST.embedParams}`;

/** رابط لا يتعطّل حين يُحذف البثّ المنتهي من يوتيوب */
export const liveFallbackUrl = () => BROADCAST.liveChannelUrl;

/** صورة البثّ الرسمية المخزّنة محلياً */
export const livePoster = () => `/media/yt/${BROADCAST.liveVideoId}.jpg`;
