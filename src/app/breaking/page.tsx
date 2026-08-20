import type { Metadata } from "next";
import Link from "next/link";
import { Poster } from "@/components/ui/Media";
import { Meta } from "@/components/ui/Bits";
import { BREAKING, bySlug, latest, articleImage } from "@/data/news";
import { CATEGORY_MAP } from "@/data/categories";
import { relativeTime } from "@/lib/format";

export const metadata: Metadata = { title: "الأخبار العاجلة" };

export default function BreakingPage() {
  const items = [...BREAKING].sort((a, b) => a.agoMin - b.agoMin);
  const more = latest(14).filter((a) => !items.some((b) => b.slug === a.slug));

  return (
    <div className="zone-dark min-h-screen">
      <div className="shell py-8 md:py-11">
        <header className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-md bg-gradient-to-l from-onair to-[#ff5c6e] px-3 py-1.5">
            <span className="size-[6px] rounded-full bg-white" style={{ animation: "pulse-dot 1.6s infinite" }} />
            <span className="text-[12.5px] font-extrabold text-white">عاجل</span>
          </span>
          <h1 className="mt-4 text-[27px] font-extrabold text-[color:var(--fg)] md:text-[36px]">
            الأخبار العاجلة
          </h1>
          <p className="mt-2 text-[13.5px] text-[color:var(--fg-3)]">
            خطّ زمني متسلسل لأحدث ما ورد إلى غرفة أخبار الفرات
          </p>
        </header>

        {/* الخطّ الزمني */}
        <ol className="relative border-r-2 border-[color:var(--line-2)] pr-6 md:pr-8">
          {items.map((b, n) => {
            const cat = CATEGORY_MAP[b.category];
            const a = b.slug ? bySlug(b.slug) : undefined;
            const href = a ? `/article/${a.slug}` : `/news/${b.category}`;
            return (
              <li key={b.id} className="relative pb-7 last:pb-0">
                <span
                  className="absolute right-[-31px] top-1.5 grid size-4 place-items-center rounded-full ring-4 ring-[color:var(--color-midnight)] md:right-[-39px]"
                  style={{ background: n === 0 ? "var(--color-onair)" : cat.accent }}
                >
                  {n === 0 && <span className="size-full rounded-full bg-onair" style={{ animation: "pulse-dot 1.8s infinite" }} />}
                </span>

                <Link
                  href={href}
                  className="focusable group flex flex-col gap-3 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-4 transition hover:border-cyan/45 sm:flex-row sm:items-center"
                >
                  {a && (
                    <div className="relative aspect-16/9 w-full shrink-0 overflow-hidden rounded-lg bg-midnight sm:w-52">
                      <Poster src={articleImage(a)} alt={a.title} sizes="208px" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {n === 0 && (
                        <span className="rounded bg-onair px-2 py-[2px] text-[10px] font-extrabold text-white">الأحدث</span>
                      )}
                      <span className="rounded px-2 py-[2px] text-[10px] font-extrabold text-white" style={{ background: cat.accent }}>
                        {cat.short}
                      </span>
                      <span className="text-[11.5px] text-[color:var(--fg-3)]">{relativeTime(b.agoMin)}</span>
                    </div>
                    <p className="mt-2 text-[15px] font-extrabold leading-[1.5] text-[color:var(--fg)] transition group-hover:text-cyan md:text-[17px]">
                      {b.text}
                    </p>
                    {a?.lede && <p className="clamp-2 mt-1.5 text-[12.5px] text-[color:var(--fg-2)]">{a.lede}</p>}
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>

        {/* المزيد */}
        <section className="mt-12">
          <h2 className="mb-4 flex items-center gap-2.5 text-[19px] font-extrabold text-[color:var(--fg)]">
            <span className="inline-block h-5 w-[4px] rounded-full bg-cyan shadow-[0_0_12px_var(--color-cyan)]" />
            المزيد من التغطية
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {more.slice(0, 9).map((a) => (
              <Link key={a.slug} href={`/article/${a.slug}`}
                className="focusable group grid grid-cols-[104px_1fr] gap-3 rounded-xl border border-[color:var(--line)] bg-[color:var(--surface)] p-2.5 transition hover:border-cyan/40">
                <div className="relative aspect-16/9 overflow-hidden rounded-lg bg-midnight">
                  <Poster src={articleImage(a)} alt={a.title} sizes="104px" />
                </div>
                <div className="min-w-0">
                  <p className="clamp-3 text-[12.5px] font-bold leading-[1.5] text-[color:var(--fg)] transition group-hover:text-cyan">
                    {a.title}
                  </p>
                  <Meta className="mt-1">{relativeTime(a.agoMin)}</Meta>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
