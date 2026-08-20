"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Poster, ImageOverlay } from "@/components/ui/Media";
import { CatTag, Meta, Dot } from "@/components/ui/Bits";
import { CATEGORY_MAP } from "@/data/categories";
import {
  type Article, articleImage, articleSource, articleSourceLabel,
} from "@/data/news";
import { publishedLabel } from "@/data/media";
import { relativeTime, compactViews, cx } from "@/lib/format";

const SIZES = [
  { key: "s", label: "ص", body: "text-[15px] leading-[1.95]" },
  { key: "m", label: "م", body: "text-[17px] leading-[2.0]" },
  { key: "l", label: "ك", body: "text-[19.5px] leading-[2.05]" },
] as const;

const SHARE = [
  { key: "x", label: "إكس", url: (u: string, t: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}`,
    path: "M13.9 3.5h2.2l-4.8 5.5 5.6 7.5h-4.4l-3.4-4.5-3.9 4.5H3l5.1-5.9L2.7 3.5h4.5l3.1 4.1 3.6-4.1z" },
  { key: "fb", label: "فيسبوك", url: (u: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`,
    path: "M11.2 17v-6.3h2.1l.32-2.45h-2.42V6.68c0-.71.2-1.19 1.21-1.19h1.29V3.3c-.22-.03-.99-.1-1.88-.1-1.86 0-3.14 1.14-3.14 3.22v1.83H6.6v2.45h2.08V17h2.52z" },
  { key: "wa", label: "واتساب", url: (u: string, t: string) => `https://wa.me/?text=${encodeURIComponent(t + " " + u)}`,
    path: "M10 2.6a7.35 7.35 0 00-6.3 11.1L2.6 17.4l3.8-1a7.35 7.35 0 103.6-13.8zm0 1.5a5.85 5.85 0 014.9 9 5.85 5.85 0 01-7.6 1.9l-.3-.2-2.2.6.6-2.2-.2-.3A5.85 5.85 0 0110 4.1zm-2.6 3c-.15 0-.4.06-.6.3-.2.24-.78.76-.78 1.85s.8 2.15.9 2.3c.12.15 1.55 2.5 3.8 3.4 1.9.75 2.28.6 2.7.56.4-.04 1.3-.53 1.5-1.05.18-.5.18-.95.13-1.05-.06-.1-.2-.15-.42-.26-.22-.11-1.3-.65-1.5-.72-.2-.08-.35-.11-.5.11-.15.22-.57.72-.7.87-.13.15-.26.17-.48.06-.22-.11-.93-.34-1.77-1.1a6.6 6.6 0 01-1.22-1.52c-.13-.22-.01-.34.1-.45l.33-.39c.1-.13.14-.22.21-.37.08-.15.04-.28-.02-.39-.06-.11-.5-1.2-.68-1.65-.18-.43-.36-.37-.5-.38h-.42z" },
  { key: "tg", label: "تلغرام", url: (u: string, t: string) => `https://t.me/share/url?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`,
    path: "M17.3 4.1L2.9 9.6c-.7.3-.7 1.2 0 1.4l3.6 1.1 1.4 4.3c.2.5.8.6 1.2.3l2-1.6 3.6 2.6c.5.4 1.2.1 1.3-.5l2.3-11.9c.1-.7-.5-1.2-1-1.2z" },
];

export function ArticleReader({
  a, related, next,
}: { a: Article; related: Article[]; next: Article }) {
  const cat = CATEGORY_MAP[a.category];
  const [progress, setProgress] = useState(0);
  const [size, setSize] = useState<(typeof SIZES)[number]["key"]>("m");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [url, setUrl] = useState("");

  useEffect(() => {
    const t = window.setTimeout(() => setUrl(window.location.href), 0);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = bodyRef.current;
      if (!el) return;
      const start = el.offsetTop - 140;
      const total = el.offsetHeight - window.innerHeight + 260;
      const p = (window.scrollY - start) / Math.max(total, 1);
      setProgress(Math.min(1, Math.max(0, p)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const copy = async () => {
    try { await navigator.clipboard.writeText(url || window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  };

  const body = SIZES.find((s) => s.key === size)!.body;
  const src = articleSource(a);

  return (
    <article className="zone-light">
      {/* شريط تقدّم القراءة — خطّ رفيع مثبّت أعلى النافذة فوق الهيدر */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[150] h-[3px]"
      >
        <div
          className="h-full bg-gradient-to-l from-broadcast to-cyan shadow-[0_0_10px_rgba(0,215,255,.6)] transition-[width] duration-150"
          style={{ width: `${(progress * 100).toFixed(1)}%`, opacity: progress > 0.001 ? 1 : 0 }}
        />
      </div>

      <div className="shell py-7 md:py-10">
        {/* فتات الخبز */}
        <nav className="mb-5 flex flex-wrap items-center gap-2 text-[12.5px] text-[color:var(--fg-3)]" aria-label="مسار التصفح">
          <Link href="/" className="focusable hover:text-[color:var(--accent)]">الرئيسية</Link>
          <span className="opacity-40">/</span>
          <Link href={`/news/${cat.key}`} className="focusable font-bold" style={{ color: cat.accent }}>{cat.name}</Link>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10">
          {/* المتن */}
          <div className="min-w-0">
            {/* العنوان أعلى الصورة — لا تراكب إطلاقاً */}
            <header className="mb-5">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <CatTag cat={cat} />
                {a.kicker && (
                  <span className="rounded-full bg-[color:var(--accent)]/12 px-2.5 py-[3px] text-[11px] font-extrabold text-[color:var(--accent)]">
                    {a.kicker}
                  </span>
                )}
                {a.bulletin && (
                  <span className="rounded-full border border-[color:var(--line-2)] px-2.5 py-[3px] text-[11px] font-bold text-[color:var(--fg-2)]">
                    {a.bulletin}
                  </span>
                )}
              </div>
              <h1 className="text-[25px] font-extrabold leading-[1.4] text-[color:var(--fg)] md:text-[36px]">
                {a.title}
              </h1>
              {a.lede && (
                <p className="mt-4 border-r-[3px] pr-4 text-[15.5px] leading-[1.9] text-[color:var(--fg-2)] md:text-[17px]"
                   style={{ borderColor: cat.accent }}>
                  {a.lede}
                </p>
              )}

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-y border-[color:var(--line)] py-3">
                <Meta>
                  <span className="font-bold text-[color:var(--fg-2)]">{a.desk}</span>
                  <Dot />
                  {publishedLabel(a.agoMin)}
                  <Dot />
                  {relativeTime(a.agoMin)}
                  <Dot />
                  <span className="num">{compactViews(a.views)}</span> مشاهدة
                  {a.read > 0 && <><Dot /><span className="num">{a.read}</span> د قراءة</>}
                </Meta>

                {/* حجم الخط */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-[color:var(--fg-3)]">حجم الخط</span>
                  <div className="flex overflow-hidden rounded-lg border border-[color:var(--line-2)]">
                    {SIZES.map((s) => (
                      <button
                        key={s.key}
                        onClick={() => setSize(s.key)}
                        aria-label={`حجم الخط ${s.label}`}
                        aria-pressed={size === s.key}
                        className={cx(
                          "focusable px-2.5 py-1 text-[12px] font-bold transition",
                          size === s.key
                            ? "bg-[color:var(--accent)] text-white"
                            : "text-[color:var(--fg-2)] hover:bg-[color:var(--surface-2)]",
                        )}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </header>

            {/* الصورة الرسمية */}
            <figure className="mb-6">
              <div className="relative aspect-16/9 overflow-hidden rounded-2xl bg-midnight">
                <Poster src={articleImage(a)} alt={a.title} priority sizes="(max-width:1024px) 100vw, 62vw" zoom={false} />
                <ImageOverlay cat={cat} agoMin={a.agoMin} badge={a.hasVideo ? "فيديو" : undefined} />
              </div>
              {src && (
                <figcaption className="mt-2 flex flex-wrap items-center gap-1.5 text-[11.5px] text-[color:var(--fg-3)]">
                  <a href={src} target="_blank" rel="noopener noreferrer"
                     className="focusable font-bold text-[color:var(--accent)] hover:underline">
                    {articleSourceLabel(a)}
                  </a>
                </figcaption>
              )}
            </figure>

            {/* النصّ */}
            <div ref={bodyRef}>
              {a.archiveOnly ? (
                <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-2)] p-5 md:p-7">
                  <p className="text-[15px] leading-[1.9] text-[color:var(--fg-2)]">
                    يتوفّر النصّ الكامل لهذا الخبر على <b>الفرات نيوز</b>.
                  </p>
                  <a
                    href={src ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focusable mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-broadcast to-cyan px-5 py-2.5 text-[13px] font-extrabold text-midnight transition hover:brightness-110"
                  >
                    اقرأ الخبر كاملاً على الفرات نيوز
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <path d="M5.5 8.5L12 2M12 2H8.2M12 2v3.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
              ) : (
                <div className={cx("space-y-5 text-[color:var(--fg)]", body)}>
                  {a.body.map((para, i) => <p key={i}>{para}</p>)}
                </div>
              )}
            </div>

            {/* الوسوم */}
            {a.tags.length > 0 && (
              <div className="mt-7 flex flex-wrap items-center gap-2 border-t border-[color:var(--line)] pt-5">
                <span className="text-[12px] font-bold text-[color:var(--fg-3)]">وسوم:</span>
                {a.tags.map((t) => (
                  <Link
                    key={t}
                    href={`/search?q=${encodeURIComponent(t)}`}
                    className="focusable rounded-full border border-[color:var(--line-2)] px-3 py-1 text-[12px] font-medium text-[color:var(--fg-2)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            )}

            {/* المشاركة */}
            <div className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-2)] p-3.5">
              <span className="ml-1 text-[12.5px] font-bold text-[color:var(--fg-2)]">شارك الخبر</span>
              {SHARE.map((s) => (
                <a
                  key={s.key}
                  href={s.url(url, a.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`مشاركة عبر ${s.label}`}
                  className="focusable grid size-9 place-items-center rounded-full border border-[color:var(--line-2)] text-[color:var(--fg-2)] transition hover:border-[color:var(--accent)] hover:bg-[color:var(--accent)] hover:text-white"
                >
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d={s.path} /></svg>
                </a>
              ))}
              <button
                onClick={copy}
                aria-label="نسخ الرابط"
                className="focusable flex items-center gap-1.5 rounded-full border border-[color:var(--line-2)] px-3 py-2 text-[12px] font-bold text-[color:var(--fg-2)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
              >
                {copied ? "نُسخ الرابط ✓" : "نسخ الرابط"}
              </button>
              <button
                onClick={() => setSaved((v) => !v)}
                aria-pressed={saved}
                aria-label={saved ? "إزالة من المحفوظات" : "حفظ الخبر"}
                className={cx(
                  "focusable mr-auto flex items-center gap-1.5 rounded-full border px-3 py-2 text-[12px] font-bold transition",
                  saved
                    ? "border-[color:var(--accent)] bg-[color:var(--accent)] text-white"
                    : "border-[color:var(--line-2)] text-[color:var(--fg-2)] hover:border-[color:var(--accent)]",
                )}
              >
                <svg width="13" height="13" viewBox="0 0 16 16" fill={saved ? "currentColor" : "none"}>
                  <path d="M4 2.5h8v11l-4-2.8-4 2.8v-11z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
                {saved ? "محفوظ" : "حفظ"}
              </button>
            </div>


            {/* الخبر التالي */}
            <Link
              href={`/article/${next.slug}`}
              className="focusable card group mt-8 flex items-center gap-4 overflow-hidden rounded-2xl p-3 transition hover:shadow-[var(--shadow-hover)]"
            >
              <div className="relative aspect-16/9 w-32 shrink-0 overflow-hidden rounded-lg bg-midnight sm:w-44">
                <Poster src={articleImage(next)} alt={next.title} sizes="176px" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-extrabold text-[color:var(--accent)]">الخبر التالي</span>
                <p className="clamp-2 mt-1 text-[14.5px] font-extrabold leading-[1.45] text-[color:var(--fg)] transition group-hover:text-[color:var(--accent)] sm:text-[16px]">
                  {next.title}
                </p>
                <Meta className="mt-1.5">{relativeTime(next.agoMin)}</Meta>
              </div>
            </Link>
          </div>

          {/* العمود الجانبي */}
          <aside className="space-y-5 lg:sticky lg:top-[100px] lg:self-start">
            <div className="card rounded-2xl p-4">
              <h2 className="mb-3 text-[14.5px] font-extrabold text-[color:var(--fg)]">أخبار ذات صلة</h2>
              <div className="space-y-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/article/${r.slug}`}
                    className="focusable group grid grid-cols-[84px_1fr] gap-3"
                  >
                    <div className="relative aspect-16/9 overflow-hidden rounded-lg bg-midnight">
                      <Poster src={articleImage(r)} alt={r.title} sizes="84px" />
                    </div>
                    <div className="min-w-0">
                      <p className="clamp-3 text-[12.5px] font-bold leading-[1.5] text-[color:var(--fg)] transition group-hover:text-[color:var(--accent)]">
                        {r.title}
                      </p>
                      <Meta className="mt-1">{relativeTime(r.agoMin)}</Meta>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href={`/news/${cat.key}`}
              className="focusable block rounded-2xl border p-4 transition hover:shadow-[var(--shadow-hover)]"
              style={{ borderColor: `${cat.accent}40`, background: `${cat.accent}0d` }}
            >
              <p className="text-[13.5px] font-extrabold" style={{ color: cat.accent }}>
                كل أخبار {cat.name} ←
              </p>
              <p className="mt-1 text-[12px] text-[color:var(--fg-3)]">{cat.blurb}</p>
            </Link>
          </aside>
        </div>
      </div>
    </article>
  );
}
