/**
 * ════════════════════════════════════════════════════════════════
 * إعدادات البثّ المركزية — المصدر الوحيد لكل ما يخص البثّ الحيّ.
 * أي تغيير في رابط البثّ أو معرّفه يتم هنا فقط.
 * ════════════════════════════════════════════════════════════════
 */

export const BROADCAST = {
  /** معرّف بثّ قناة الفرات الرسمي على YouTube */
  liveVideoId: "eN20gbQA6wY",
  /** القناة الرسمية */
  channelUrl: "https://youtube.com/@alforat_tv",
  channelId: "UC6nVplZaI0ScP3aM-b7VuNQ",
  /** معاملات التضمين */
  embedHost: "https://www.youtube-nocookie.com",
  embedParams: "rel=0&modestbranding=1&autoplay=1",
} as const;

export const liveWatchUrl = () =>
  `https://www.youtube.com/watch?v=${BROADCAST.liveVideoId}`;

export const liveEmbedUrl = () =>
  `${BROADCAST.embedHost}/embed/${BROADCAST.liveVideoId}?${BROADCAST.embedParams}`;

/** صورة البثّ الرسمية المخزّنة محلياً */
export const livePoster = () => `/media/yt/${BROADCAST.liveVideoId}.jpg`;
