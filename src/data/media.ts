import { BROADCAST, liveWatchUrl, liveEmbedUrl, liveFallbackUrl } from "@/config/broadcast.config";

/**
 * سجل الوسائط الحقيقية — مصدران رسميان فقط:
 *
 * 1) `yt`    → thumbnail رسمي لمادة على قناة الفرات (youtube.com/@alforat_tv)
 *              مخزّن في public/media/yt/{id}.jpg — إطار 16:9 كامل بلا قصّ.
 * 2) `photo` → صورة الخبر الرسمية من «الفرات نيوز» (alforatnews.iq)
 *              مخزّنة في public/media/news/{hash}.jpg.
 *
 * لا صور مولّدة، ولا صور وكالات، ولا Placeholders.
 * `FALLBACK_IMAGE` مكوّن تقني للاحتياط فقط — اختبار آلي يمنع استخدامه فعلياً.
 */

export const SNAPSHOT = new Date("2026-08-19T10:00:00+03:00");

export const YT_CHANNEL = BROADCAST.channelUrl;
export const YT_LIVE_ID = BROADCAST.liveVideoId;
export const YT_LIVE_URL = liveWatchUrl();
export const YT_LIVE_EMBED = liveEmbedUrl();
/** رابط البثّ الدائم للقناة — يُستخدم حين يتعذّر التشغيل داخل الصفحة */
export const YT_LIVE_FALLBACK = liveFallbackUrl();

export const NEWS_SITE = "https://alforatnews.iq";

export const ytImage = (id: string) => `/media/yt/${id}.jpg`;
export const ytUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
export const ytShortUrl = (id: string) => `https://www.youtube.com/shorts/${id}`;

export const photoImage = (hash: string) => `/media/news/${hash}.jpg`;

export const FALLBACK_IMAGE = "/media/fallback.jpg";

export const publishedAt = (agoMin: number) =>
  new Date(SNAPSHOT.getTime() - agoMin * 60_000).toISOString();

/** تنسيق تاريخ عربي كامل من إزاحة بالدقائق */
export function publishedLabel(agoMin: number): string {
  return new Intl.DateTimeFormat("ar-IQ-u-nu-latn", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(new Date(SNAPSHOT.getTime() - agoMin * 60_000));
}
