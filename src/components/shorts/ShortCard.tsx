import Link from "next/link";
import { Poster } from "@/components/ui/Media";
import { CATEGORY_MAP } from "@/data/categories";
import { type Short, shortImage } from "@/data/shorts";
import { compactViews, duration, cx } from "@/lib/format";

/** بطاقة عمودية 9:16 بصورة حقيقية من المقطع الرسمي */
export function ShortCard({ s, className }: { s: Short; className?: string }) {
  const cat = CATEGORY_MAP[s.category];
  return (
    <Link
      href={`/shorts?v=${s.id}`}
      className={cx(
        "focusable group relative block aspect-9/16 w-[152px] shrink-0 overflow-hidden rounded-xl bg-midnight ring-1 ring-white/10 transition duration-300 hover:ring-cyan/60 sm:w-[176px]",
        className,
      )}
    >
      <Poster src={shortImage(s)} alt={s.title} sizes="176px" />
      <span className="scrim absolute inset-0" />

      <span className="absolute inset-0 grid place-items-center">
        <span className="grid size-11 place-items-center rounded-full bg-black/45 ring-1 ring-white/30 backdrop-blur-sm transition duration-300 group-hover:scale-110 group-hover:bg-cyan group-hover:text-midnight">
          <svg width="13" height="13" viewBox="0 0 12 12" fill="currentColor" className="text-white transition group-hover:text-midnight">
            <path d="M3 2l7 4-7 4V2z" />
          </svg>
        </span>
      </span>

      <span className="ltr-num absolute right-2 top-2 rounded bg-black/65 px-1.5 py-[2px] text-[10px] font-medium text-white/90 backdrop-blur-sm">
        {duration(s.duration)}
      </span>

      <span className="absolute inset-x-0 bottom-0 p-2.5">
        <span
          className="mb-1.5 inline-block rounded px-1.5 py-[2px] text-[9.5px] font-extrabold text-white"
          style={{ background: cat.accent }}
        >
          {cat.short}
        </span>
        <span className="clamp-3 block text-[12px] font-bold leading-[1.5] text-white">{s.title}</span>
        <span className="mt-1.5 block text-[10px] text-white/60">
          <span className="num">{compactViews(s.views)}</span> مشاهدة
        </span>
      </span>
    </Link>
  );
}
