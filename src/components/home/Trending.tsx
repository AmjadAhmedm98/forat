import Link from "next/link";
import { Poster } from "@/components/ui/Media";
import { StoryRow } from "@/components/news/Cards";
import { trending, articleImage } from "@/data/news";
import { CATEGORY_MAP } from "@/data/categories";
import { compactViews, relativeTime } from "@/lib/format";

export function Trending() {
  const items = trending(6);
  const top = items[0];
  const rest = items.slice(1);
  return (
    <aside className="card flex flex-col rounded-2xl p-4 md:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-[15.5px] font-extrabold text-[color:var(--fg)]">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="text-fuchsia">
            <path d="M2 11.5l3.6-4 2.8 2.6L14 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10.6 4H14v3.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          الأكثر قراءة
        </h2>
        <span className="text-[10.5px] text-[color:var(--fg-3)]">آخر <span className="num">24</span> ساعة</span>
      </div>

      {top && (
        <Link
          href={`/article/${top.slug}`}
          className="focusable group mb-2 block overflow-hidden rounded-xl"
        >
          <div className="relative aspect-16/9 overflow-hidden rounded-xl bg-midnight">
            <Poster src={articleImage(top)} alt={top.title} sizes="(max-width:1024px) 100vw, 30vw" />
            <span
              className="absolute right-2 top-2 rounded px-1.5 py-[2px] text-[9.5px] font-extrabold text-white"
              style={{ background: CATEGORY_MAP[top.category].accent }}
            >
              الأكثر قراءة
            </span>
          </div>
          <div className="px-1 pb-1 pt-2.5">
            <h3 className="clamp-2 text-[14px] font-extrabold leading-[1.45] text-[color:var(--fg)] transition group-hover:text-[color:var(--accent)]">
              {top.title}
            </h3>
            <p className="mt-1 text-[10.5px] text-[color:var(--fg-3)]">
              {relativeTime(top.agoMin)} · <span className="num">{compactViews(top.views)}</span> مشاهدة
            </p>
          </div>
        </Link>
      )}

      <div className="flex-1">
        {rest.map((a, i) => <StoryRow key={a.slug} a={a} index={i + 1} />)}
      </div>
    </aside>
  );
}
