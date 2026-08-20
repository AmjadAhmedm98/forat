import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { HeroCard, StoryCard, WideCard, HeadlineList } from "@/components/news/Cards";
import { SectionHead } from "@/components/ui/Bits";
import { CATEGORIES, CATEGORY_MAP, type CategoryKey } from "@/data/categories";
import { byCategory, countIn, hasImage, hasFullImage, trending } from "@/data/news";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.key }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ category: string }> },
): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORY_MAP[category as CategoryKey];
  if (!cat) return { title: "قسم غير موجود" };
  return { title: cat.name, description: cat.blurb };
}

export default async function CategoryPage(
  { params }: { params: Promise<{ category: string }> },
) {
  const { category } = await params;
  const key = category as CategoryKey;
  const cat = CATEGORY_MAP[key];
  if (!cat) notFound();

  const all = byCategory(key);
  // البطاقات الكبيرة تتطلّب صوراً عالية الدقّة؛ المتوسطة تذهب للبطاقات المصغّرة
  const full = all.filter(hasFullImage);
  const small = all.filter((a) => hasImage(a) && !hasFullImage(a));
  const textOnly = all.filter((a) => !hasImage(a));
  const lead = full[0];
  const secondary = [...full.slice(1, 3), ...small].slice(0, 3);
  const usedSlugs = new Set([lead?.slug, ...secondary.map((a) => a.slug)]);
  const grid = full.filter((a) => !usedSlugs.has(a.slug)).slice(0, 12);
  const rest = [...full.slice(3 + grid.length), ...small.filter((a) => !usedSlugs.has(a.slug))];
  const withPic = [...full, ...small];
  const popular = trending(5).filter((a) => a.category !== key).slice(0, 4);

  return (
    <div className="zone-light">
      {/* ترويسة القسم */}
      <header
        className="border-b border-[color:var(--line)]"
        style={{ background: `linear-gradient(180deg, ${cat.accent}14, transparent)` }}
      >
        <div className="shell py-7 md:py-9">
          <nav className="mb-3 flex items-center gap-2 text-[12.5px] text-[color:var(--fg-3)]">
            <Link href="/" className="focusable hover:text-[color:var(--accent)]">الرئيسية</Link>
            <span className="opacity-40">/</span>
            <span>الأقسام</span>
          </nav>
          <h1 className="flex items-center gap-3 text-[28px] font-extrabold text-[color:var(--fg)] md:text-[38px]">
            <span className="inline-block h-8 w-[5px] rounded-full md:h-10"
              style={{ background: cat.accent, boxShadow: `0 0 18px ${cat.accent}` }} />
            {cat.name}
          </h1>
          <p className="mt-2.5 pr-[17px] text-[13.5px] text-[color:var(--fg-2)] md:text-[15px]">{cat.blurb}</p>
          <p className="mt-3 pr-[17px] text-[12px] text-[color:var(--fg-3)]">
            <span className="num">{countIn(key)}</span> مادة في هذا القسم
          </p>

          {/* تنقّل بين الأقسام */}
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            {CATEGORIES.map((c) => (
              <Link
                key={c.key}
                href={`/news/${c.key}`}
                className={c.key === key
                  ? "shrink-0 rounded-full px-3.5 py-1.5 text-[12.5px] font-extrabold text-white"
                  : "focusable shrink-0 rounded-full border border-[color:var(--line-2)] px-3.5 py-1.5 text-[12.5px] font-bold text-[color:var(--fg-2)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"}
                style={c.key === key ? { background: c.accent } : undefined}
              >
                {c.short}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <div className="shell py-8 md:py-10">
        {withPic.length === 0 ? (
          <div className="card rounded-2xl p-6">
            <HeadlineList items={all} accent={cat.accent} />
          </div>
        ) : (
          <>
            {/* الصدارة */}
            <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
              {lead && <HeroCard a={lead} priority />}
              <div className="flex flex-col gap-3">
                {secondary.map((a) => <WideCard key={a.slug} a={a} />)}
              </div>
            </div>

            {/* الشبكة */}
            {grid.length > 0 && (
              <section className="mt-11">
                <SectionHead title="المزيد من الأخبار" accent={cat.accent} tight />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {grid.map((a) => <StoryCard key={a.slug} a={a} compact />)}
                </div>
              </section>
            )}

            {/* الأرشيف */}
            {(rest.length > 0 || textOnly.length > 0) && (
              <section className="mt-11 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  <SectionHead title="أرشيف القسم" accent={cat.accent} tight />
                  <div className="space-y-3">
                    {rest.slice(0, 10).map((a) => <WideCard key={a.slug} a={a} />)}
                  </div>
                  {textOnly.length > 0 && (
                    <div className="card mt-4 rounded-2xl p-4 md:p-5">
                      <HeadlineList items={textOnly} accent={cat.accent} />
                    </div>
                  )}
                </div>

                <aside className="lg:sticky lg:top-[100px] lg:self-start">
                  <div className="card rounded-2xl p-4 md:p-5">
                    <h2 className="mb-3 text-[14.5px] font-extrabold text-[color:var(--fg)]">من أقسام أخرى</h2>
                    <div className="space-y-3">
                      {popular.map((a) => <WideCard key={a.slug} a={a} />)}
                    </div>
                  </div>
                </aside>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
