import Link from "next/link";
import { Poster, ImageOverlay } from "@/components/ui/Media";
import { CatTag, Meta, Dot } from "@/components/ui/Bits";
import { CATEGORY_MAP } from "@/data/categories";
import { type Article, articleImage } from "@/data/news";
import { relativeTime, compactViews, cx } from "@/lib/format";

function VideoPip({ size = "md" }: { size?: "sm" | "md" }) {
  return (
    <span
      className={cx(
        "absolute grid place-items-center rounded-full bg-black/55 text-white ring-1 ring-white/30 backdrop-blur-sm transition group-hover:scale-110 group-hover:bg-[color:var(--color-cyan)] group-hover:text-midnight",
        size === "sm" ? "bottom-2 right-2 size-7" : "bottom-3 right-3 size-10",
      )}
    >
      <svg width={size === "sm" ? 9 : 12} height={size === "sm" ? 9 : 12} viewBox="0 0 12 12" fill="currentColor">
        <path d="M3 2l7 4-7 4V2z" />
      </svg>
    </span>
  );
}

/* ═══════════ بطاقة بطلة — صورة كبيرة والنص تحتها ═══════════
   thumbnails الفرات تحمل عناوين مطبوعة داخل الصورة، لذلك لا نضع عنواننا فوقها.
   الصورة تبقى العنصر البصري الأول، والنص على سطح البطاقة تحتها.                */
export function HeroCard({
  a, priority = false, fill = false,
}: { a: Article; priority?: boolean; fill?: boolean }) {
  const cat = CATEGORY_MAP[a.category];
  return (
    <Link
      href={`/article/${a.slug}`}
      className={cx(
        "focusable card group flex flex-col overflow-hidden rounded-2xl transition duration-300 hover:shadow-[var(--shadow-hover)]",
        fill && "h-full",
      )}
    >
      <div className={cx("relative overflow-hidden bg-midnight", fill ? "min-h-[210px] flex-1" : "aspect-16/9")}>
        <Poster src={articleImage(a)} alt={a.title} priority={priority} sizes="(max-width:1024px) 100vw, 55vw" />
        <ImageOverlay cat={cat} badge={a.bulletin} agoMin={a.agoMin} />
        {a.hasVideo && <VideoPip />}
      </div>

      <div className="p-4 md:p-5">
        <h3 className="clamp-3 text-[19px] font-extrabold leading-[1.4] text-[color:var(--fg)] transition group-hover:text-[color:var(--accent)] md:text-[24px]">
          {a.title}
        </h3>
        <p className="clamp-2 mt-2.5 text-[13.5px] leading-relaxed text-[color:var(--fg-2)]">{a.lede}</p>
        <Meta className="mt-3">
          {relativeTime(a.agoMin)} <Dot /> {a.desk} <Dot /> <span className="num">{compactViews(a.views)}</span> مشاهدة
        </Meta>
      </div>
    </Link>
  );
}

/* ═══════════ بطاقة قياسية — صورة فوق ونص تحت ═══════════ */
export function StoryCard({ a, compact = false }: { a: Article; compact?: boolean }) {
  const cat = CATEGORY_MAP[a.category];
  return (
    <Link
      href={`/article/${a.slug}`}
      className="focusable card group flex flex-col overflow-hidden rounded-xl transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]"
    >
      <div className="relative aspect-16/9 overflow-hidden bg-midnight">
        <Poster src={articleImage(a)} alt={a.title} sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw" />
        {a.hasVideo && <VideoPip size="sm" />}
        <ImageOverlay cat={cat} />
      </div>
      <div className={cx("flex flex-1 flex-col items-start", compact ? "p-3" : "p-3.5")}>
        <h3 className={cx(
          "clamp-3 font-extrabold leading-[1.45] text-[color:var(--fg)] transition group-hover:text-[color:var(--accent)]",
          compact ? "text-[13.5px]" : "text-[15px]",
        )}>
          {a.title}
        </h3>
        {!compact && <p className="clamp-2 mt-2 text-[12.5px] leading-relaxed text-[color:var(--fg-2)]">{a.lede}</p>}
        <Meta className="mt-auto pt-2.5">
          {relativeTime(a.agoMin)} <Dot /> <span className="num">{compactViews(a.views)}</span> مشاهدة
        </Meta>
      </div>
    </Link>
  );
}

/* ═══════════ بطاقة أفقية عريضة ═══════════ */
export function WideCard({ a, big = false }: { a: Article; big?: boolean }) {
  const cat = CATEGORY_MAP[a.category];
  return (
    <Link
      href={`/article/${a.slug}`}
      className={cx(
        "focusable card group grid gap-3.5 overflow-hidden rounded-xl p-2.5 transition hover:shadow-[var(--shadow-hover)]",
        big ? "grid-cols-[130px_1fr] sm:grid-cols-[240px_1fr] sm:gap-5 sm:p-3" : "grid-cols-[110px_1fr] sm:grid-cols-[170px_1fr] sm:gap-4",
      )}
    >
      <div className="relative aspect-16/9 overflow-hidden rounded-lg bg-midnight">
        <Poster src={articleImage(a)} alt={a.title} sizes="(max-width:640px) 40vw, 240px" />
        {a.hasVideo && <VideoPip size="sm" />}
      </div>
      <div className="flex min-w-0 flex-col items-start justify-center py-0.5">
        <CatTag cat={cat} size="xs" />
        <h3 className={cx(
          "clamp-2 mt-1.5 font-extrabold leading-[1.45] text-[color:var(--fg)] transition group-hover:text-[color:var(--accent)]",
          big ? "text-[15px] sm:text-[19px]" : "text-[13.5px] sm:text-[15.5px]",
        )}>
          {a.title}
        </h3>
        <p className={cx("clamp-2 mt-1.5 text-[12.5px] leading-relaxed text-[color:var(--fg-2)]", big ? "block" : "hidden sm:block")}>
          {a.lede}
        </p>
        <Meta className="mt-1.5">{relativeTime(a.agoMin)} <Dot /> {a.desk}</Meta>
      </div>
    </Link>
  );
}

/* ═══════════ سطر تحريري بلا صورة — للقوائم والمواد بلا مادة مصوّرة ═══════════ */
export function StoryRow({ a, index, showCat = true }: { a: Article; index?: number; showCat?: boolean }) {
  const cat = CATEGORY_MAP[a.category];
  return (
    <Link
      href={`/article/${a.slug}`}
      className="focusable group flex gap-3 border-b border-[color:var(--line)] py-3 last:border-0"
    >
      {index !== undefined && (
        <span
          className="num shrink-0 text-[21px] font-extrabold leading-none opacity-50 transition group-hover:opacity-100"
          style={{ color: cat.accent }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      )}
      <span className="min-w-0">
        <span className="clamp-3 block text-[13.5px] font-bold leading-[1.5] text-[color:var(--fg)] transition group-hover:text-[color:var(--accent)]">
          {a.title}
        </span>
        <Meta className="mt-1.5">
          {showCat && <><span style={{ color: cat.accent }} className="font-bold">{cat.short}</span><Dot /></>}
          {relativeTime(a.agoMin)}
        </Meta>
      </span>
    </Link>
  );
}

/* ═══════════ قائمة عناوين تحريرية (بلا صور) — نمط BBC ═══════════ */
export function HeadlineList({ items, accent }: { items: Article[]; accent?: string }) {
  return (
    <ul className="divide-y divide-[color:var(--line)]">
      {items.map((a) => (
        <li key={a.slug}>
          <Link
            href={`/article/${a.slug}`}
            className="focusable group flex items-start gap-3 py-3.5"
          >
            <span
              className="mt-[9px] h-[3px] w-4 shrink-0 rounded-full transition group-hover:w-6"
              style={{ background: accent ?? CATEGORY_MAP[a.category].accent }}
            />
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-extrabold leading-[1.5] text-[color:var(--fg)] transition group-hover:text-[color:var(--accent)]">
                {a.title}
              </span>
              <span className="clamp-2 mt-1 block text-[12.5px] leading-relaxed text-[color:var(--fg-2)]">{a.lede}</span>
              <Meta className="mt-1.5">{relativeTime(a.agoMin)} <Dot /> {a.desk}</Meta>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
