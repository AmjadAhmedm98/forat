import Link from "next/link";
import { Player } from "@/components/live/Player";
import { HeroCard, StoryCard, WideCard, StoryRow } from "@/components/news/Cards";
import { SectionHead, ZoneEdge } from "@/components/ui/Bits";
import { Poster } from "@/components/ui/Media";
import { ShortsRail } from "@/components/home/ShortsRail";
import { LiveStrip } from "@/components/home/LiveStrip";
import { RadioTeaser } from "@/components/home/RadioTeaser";
import { AppPromo } from "@/components/home/AppPromo";
import { ProgramPicks } from "@/components/home/ProgramPicks";
import { SignalRings } from "@/components/brand/SignalRings";
import { HOME_SLOTS } from "@/config/home.config";
import { buildHomeFeed } from "@/lib/homefeed";
import { latest, countIn, articleImage } from "@/data/news";
import { CATEGORIES, CATEGORY_MAP } from "@/data/categories";
import { relativeTime, compactViews } from "@/lib/format";

/** قسم قياسي — لا يُعرض إطلاقاً إن كان فارغاً، ولا يُملأ من تصنيف آخر */
function Module({
  slot, items, children,
}: {
  slot: (typeof HOME_SLOTS)[keyof typeof HOME_SLOTS];
  items: unknown[];
  children: React.ReactNode;
}) {
  if (!items.length) return null;
  const cat = slot.from?.length === 1 ? CATEGORY_MAP[slot.from[0]] : undefined;
  return (
    <section data-slot={slot.id} className="zone-light shell pb-11">
      <SectionHead
        title={slot.title!}
        sub={slot.sub ?? cat?.blurb}
        href={slot.href}
        hrefLabel={slot.hrefLabel}
        accent={cat?.accent}
      />
      {children}
    </section>
  );
}

export default function HomePage() {
  const f = buildHomeFeed();
  const newest = latest(6);

  return (
    <>
      {/* ══════════ نطاق البثّ ══════════ */}
      <section className="zone-dark relative overflow-hidden">
        <SignalRings className="left-1/2 top-0 size-[900px] -translate-x-1/2 -translate-y-1/2 opacity-35" rings={7} />
        <div className="shell relative grid gap-6 py-7 lg:grid-cols-[1.6fr_1fr] lg:gap-7 lg:py-9">
          <div>
            <h1 className="mb-3 text-[13px] font-bold tracking-wide text-[color:var(--fg-2)]">
              <span className="text-cyan">تلفزيون الفرات</span> — البثّ الرسمي المباشر
            </h1>
            <Player />
          </div>

          <aside className="flex flex-col rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-4 md:p-5">
            <p className="mb-1 flex items-center gap-2 text-[12px] font-bold tracking-wide text-[color:var(--fg-2)]">
              <span className="size-[5px] rounded-full bg-cyan" style={{ animation: "pulse-dot 2.4s infinite" }} />
              آخر الأخبار
            </p>
            <div className="flex-1">
              {newest.slice(0, 5).map((a) => <StoryRow key={a.slug} a={a} />)}
            </div>
            <Link href="/breaking" className="focusable mt-3 inline-block text-[12.5px] font-bold text-cyan hover:underline">
              كل العاجل ←
            </Link>
          </aside>
        </div>
      </section>
      <ZoneEdge />

      {/* ══════════ الهيرو + أبرز الأخبار + الأكثر قراءة ══════════ */}
      <section data-slot="topStories" className="zone-light shell py-9 md:py-11">
        <SectionHead
          title={HOME_SLOTS.topStories.title!}
          sub={HOME_SLOTS.topStories.sub}
          href={HOME_SLOTS.topStories.href}
        />
        <div className="grid gap-5 lg:grid-cols-[1.55fr_1fr]">
          <div className="space-y-4">
            <div data-slot="hero">{f.hero && <HeroCard a={f.hero} priority />}</div>
            {f.topStories.length > 0 && (
              <div data-slot="topStoriesGrid" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {f.topStories.map((a) => <StoryCard key={a.slug} a={a} compact />)}
              </div>
            )}
          </div>

          {/* الأكثر قراءة — قائمة مضغوطة بحدّ أقصى 5 */}
          <aside data-slot="mostRead" className="card h-fit rounded-2xl p-4 md:p-5 lg:sticky lg:top-[100px]">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-[15.5px] font-extrabold text-[color:var(--fg)]">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="text-fuchsia">
                  <path d="M2 11.5l3.6-4 2.8 2.6L14 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10.6 4H14v3.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {HOME_SLOTS.mostRead.title}
              </h2>
              <span className="text-[10.5px] text-[color:var(--fg-3)]">آخر <span className="num">24</span> ساعة</span>
            </div>
            {f.mostRead.map((a, i) => <StoryRow key={a.slug} a={a} index={i} />)}
          </aside>
        </div>
      </section>

      {/* ══════════ العراق ══════════ */}
      <Module slot={HOME_SLOTS.iraq} items={f.iraq}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {f.iraq.map((a) => <StoryCard key={a.slug} a={a} />)}
        </div>
      </Module>

      {/* ══════════ Shorts — داكن ══════════ */}
      <ZoneEdge />
      <section className="zone-dark py-10 md:py-12">
        <div className="shell"><ShortsRail max={HOME_SLOTS.shorts.max} /></div>
      </section>
      <ZoneEdge dir="up" />

      {/* ══════════ اقتصاد ══════════ */}
      <Module slot={HOME_SLOTS.economy} items={f.economy}>
        <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
          {f.economy[0] && <HeroCard a={f.economy[0]} />}
          {f.economy.length > 1 && (
            <div className="flex flex-col gap-3">
              {f.economy.slice(1).map((a) => <WideCard key={a.slug} a={a} />)}
            </div>
          )}
        </div>
      </Module>

      {/* ══════════ على الهواء + تطبيق الفرات — داكن ══════════ */}
      <ZoneEdge />
      <section className="zone-dark py-10 md:py-12">
        <div className="shell space-y-12">
          <LiveStrip />
          <AppPromo />
        </div>
      </section>
      <ZoneEdge dir="up" />

      {/* ══════════ العالم ══════════ */}
      <Module slot={HOME_SLOTS.world} items={f.world}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {f.world.map((a) => <StoryCard key={a.slug} a={a} />)}
        </div>
      </Module>

      {/* ══════════ تقارير ══════════ */}
      <Module slot={HOME_SLOTS.reports} items={f.reports}>
        <div className="grid gap-4 md:grid-cols-3">
          {f.reports.map((a) => (
            <Link
              key={a.slug}
              href={`/article/${a.slug}`}
              className="focusable card group flex flex-col overflow-hidden rounded-2xl transition hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]"
            >
              <div className="relative aspect-16/9 overflow-hidden bg-midnight">
                <Poster src={articleImage(a)} alt={a.title} sizes="(max-width:768px) 100vw, 33vw" />
                <span className="absolute right-3 top-3 rounded-md bg-champagne px-2 py-[3px] text-[10.5px] font-extrabold text-midnight">
                  تقرير
                </span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="clamp-3 text-[16px] font-extrabold leading-[1.45] text-[color:var(--fg)] transition group-hover:text-[color:var(--accent)]">
                  {a.title}
                </h3>
                {a.lede && <p className="clamp-3 mt-2 text-[12.5px] leading-relaxed text-[color:var(--fg-2)]">{a.lede}</p>}
                <p className="mt-auto pt-3 text-[11.5px] text-[color:var(--fg-3)]">
                  {relativeTime(a.agoMin)} · <span className="num">{compactViews(a.views)}</span> مشاهدة
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Module>

      {/* ══════════ منوعات + فيديو ══════════ */}
      {(f.variety.length > 0 || f.video.length > 0) && (
        <section className="zone-light shell pb-11">
          <div className="grid gap-10 lg:grid-cols-2">
            {f.variety.length > 0 && (
              <div data-slot="variety">
                <SectionHead title={HOME_SLOTS.variety.title!} href={HOME_SLOTS.variety.href} accent={CATEGORY_MAP.miscellaneous.accent} tight />
                <div className="space-y-3">
                  {f.variety.map((a, i) => i === 0
                    ? <StoryCard key={a.slug} a={a} />
                    : <WideCard key={a.slug} a={a} />)}
                </div>
              </div>
            )}
            {f.video.length > 0 && (
              <div data-slot="video">
                <SectionHead title={HOME_SLOTS.video.title!} href={HOME_SLOTS.video.href} accent={CATEGORY_MAP.video.accent} tight />
                <div className="space-y-3">
                  {f.video.map((a) => <WideCard key={a.slug} a={a} />)}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══════════ رياضة — وحدة واحدة أسفل الصفحة ══════════ */}
      <Module slot={HOME_SLOTS.sports} items={f.sports}>
        <div className="grid gap-3 sm:grid-cols-2">
          {f.sports.map((a) => <WideCard key={a.slug} a={a} />)}
        </div>
      </Module>

      {/* ══════════ البرامج والإذاعة — داكن ══════════ */}
      <ZoneEdge />
      <section className="zone-dark py-11">
        <div className="shell space-y-11">
          <ProgramPicks />
          <RadioTeaser />
        </div>
      </section>
      <ZoneEdge dir="up" />

      {/* ══════════ الأقسام ══════════ */}
      <section className="zone-light shell py-11">
        <SectionHead title="تصفّح الأقسام" sub="الأرشيف الكامل داخل صفحة كل قسم" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.key}
              href={`/news/${c.key}`}
              className="focusable card group relative overflow-hidden rounded-xl p-4 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]"
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-[3px] origin-right scale-x-0 transition-transform duration-400 group-hover:scale-x-100"
                style={{ background: c.accent }}
              />
              <span className="flex items-center justify-between">
                <span className="text-[15px] font-extrabold text-[color:var(--fg)] transition group-hover:text-[color:var(--accent)]">
                  {c.name}
                </span>
                <span className="ltr-num rounded-md border border-[color:var(--line)] px-1.5 py-[2px] text-[10.5px] text-[color:var(--fg-3)]">
                  {countIn(c.key)}
                </span>
              </span>
              <span className="clamp-2 mt-2 block text-[12px] leading-relaxed text-[color:var(--fg-3)]">{c.blurb}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
