import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Poster } from "@/components/ui/Media";
import { ShortCard } from "@/components/shorts/ShortCard";
import { SectionHead } from "@/components/ui/Bits";
import {
  PROGRAMS, GENRES, programBySlug, programCover, programSource,
  episodeImage, episodeSource,
} from "@/data/programs";
import { shortsByProgram } from "@/data/shorts";
import { relativeDays, minutesLabel, compactViews } from "@/lib/format";

export function generateStaticParams() {
  return PROGRAMS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const p = programBySlug(decodeURIComponent(slug));
  if (!p) return { title: "برنامج غير موجود" };
  return { title: p.title, description: p.blurb };
}

export default async function ProgramPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const p = programBySlug(decodeURIComponent(slug));
  if (!p) notFound();

  const genre = GENRES.find((g) => g.key === p.genre)?.label;
  const shorts = shortsByProgram(p.slug);
  const withVideo = p.episodes.filter((e) => e.yt);
  const listOnly = p.episodes.filter((e) => !e.yt);
  const others = PROGRAMS.filter((x) => x.slug !== p.slug && x.genre === p.genre).slice(0, 3);

  return (
    <div>
      {/* ══ الغلاف — نطاق داكن، والعنوان بجانب الصورة لا فوقها ══ */}
      <header className="zone-dark relative overflow-hidden">
        <div className="shell grid gap-6 py-8 md:py-11 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="relative aspect-16/9 overflow-hidden rounded-2xl bg-midnight ring-1 ring-white/10">
            <Poster src={programCover(p)} alt={p.title} priority sizes="(max-width:1024px) 100vw, 52vw" zoom={false} />
          </div>

          <div className="min-w-0">
            <nav className="mb-3 flex items-center gap-2 text-[12.5px] text-[color:var(--fg-3)]">
              <Link href="/" className="focusable hover:text-cyan">الرئيسية</Link>
              <span className="opacity-40">/</span>
              <Link href="/programs" className="focusable hover:text-cyan">البرامج</Link>
            </nav>

            <span
              className="inline-block rounded-md px-2.5 py-[3px] text-[11px] font-extrabold text-white"
              style={{ background: p.accent }}
            >
              {genre}
            </span>

            <h1 className="mt-3 text-[28px] font-extrabold leading-[1.35] text-[color:var(--fg)] md:text-[40px]">
              {p.title}
            </h1>
            {p.host && (
              <p className="mt-2 text-[14.5px] font-bold text-cyan">تقديم: {p.host}</p>
            )}
            <p className="mt-3.5 max-w-xl text-[13.5px] leading-relaxed text-[color:var(--fg-2)] md:text-[15px]">
              {p.about}
            </p>

            {/* الموعد — يُعرض حين يكون معلناً على شاشة الفرات */}
            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              {p.airtime && (
                <span className="flex items-center gap-2 rounded-xl border border-cyan/35 bg-cyan/10 px-3.5 py-2">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-cyan">
                    <circle cx="8" cy="8" r="6.4" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M8 4.6V8l2.4 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                  <span className="text-[12.5px] font-bold text-cyan">
                    <span className="num">{p.airtime.time}</span> — {p.airtime.days.join(" · ")}
                  </span>
                </span>
              )}
              <span className="rounded-xl border border-[color:var(--line-2)] px-3.5 py-2 text-[12.5px] text-[color:var(--fg-2)]">
                {minutesLabel(p.duration)} تقريباً
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <a
                href={programSource(p)}
                target="_blank" rel="noopener noreferrer"
                className="focusable inline-flex items-center gap-2 rounded-full bg-onair px-5 py-2.5 text-[12.5px] font-extrabold text-white transition hover:brightness-110"
              >
                <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.5 5.5l4.2 2.4-4.2 2.4V5.5z M2 8c0-2.1.2-3 .6-3.5.4-.5 1-.7 1.8-.8C5.6 3.6 7.6 3.5 10 3.5s4.4.1 5.6.2c.8.1 1.4.3 1.8.8.4.5.6 1.4.6 3.5s-.2 3-.6 3.5c-.4.5-1 .7-1.8.8-1.2.1-3.2.2-5.6.2s-4.4-.1-5.6-.2c-.8-.1-1.4-.3-1.8-.8C2.2 11 2 10.1 2 8z" />
                </svg>
                شاهد على YouTube
              </a>
              <Link href="/live"
                className="focusable rounded-full border border-[color:var(--line-2)] px-5 py-2.5 text-[12.5px] font-bold text-[color:var(--fg-2)] transition hover:border-cyan hover:text-cyan">
                البثّ المباشر
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ══ الحلقات ══ */}
      <section className="zone-light shell py-9 md:py-11">
        <SectionHead
          title="أحدث الحلقات"
          sub="حلقات منشورة رسمياً على قناة الفرات"
          accent={p.accent}
        />

        {withVideo.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {withVideo.map((e) => (
              <a
                key={e.id}
                href={episodeSource(e) ?? "#"}
                target="_blank" rel="noopener noreferrer"
                className="focusable card group flex flex-col overflow-hidden rounded-xl transition hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]"
              >
                <div className="relative aspect-16/9 overflow-hidden bg-midnight">
                  <Poster src={episodeImage(e)} alt={e.title} sizes="(max-width:640px) 100vw, 33vw" />
                  <span className="absolute bottom-2 right-2 grid size-9 place-items-center rounded-full bg-black/55 text-white ring-1 ring-white/25 backdrop-blur-sm transition group-hover:bg-onair">
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor"><path d="M3 2l7 4-7 4V2z" /></svg>
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-3.5">
                  <h3 className="clamp-3 text-[14px] font-extrabold leading-[1.5] text-[color:var(--fg)] transition group-hover:text-[color:var(--accent)]">
                    {e.title}
                  </h3>
                  <p className="mt-auto pt-2.5 text-[11.5px] text-[color:var(--fg-3)]">
                    {relativeDays(e.agoDays)} · <span className="num">{compactViews(e.views)}</span> مشاهدة
                  </p>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p className="card rounded-2xl px-6 py-10 text-center text-[13.5px] text-[color:var(--fg-3)]">
            حلقات هذا البرنامج متاحة على قناة الفرات الرسمية.
          </p>
        )}

        {listOnly.length > 0 && (
          <div className="card mt-5 rounded-2xl p-4 md:p-5">
            <p className="mb-2.5 text-[12px] font-bold text-[color:var(--fg-3)]">
              حلقات أخرى من أرشيف البرنامج
            </p>
            <ul className="divide-y divide-[color:var(--line)]">
              {listOnly.map((e) => (
                <li key={e.id} className="flex items-start gap-3 py-3">
                  <span className="mt-[9px] h-[3px] w-4 shrink-0 rounded-full" style={{ background: p.accent }} />
                  <span className="min-w-0">
                    <span className="block text-[13.5px] font-bold leading-[1.5] text-[color:var(--fg)]">{e.title}</span>
                    <span className="mt-1 block text-[11.5px] text-[color:var(--fg-3)]">{relativeDays(e.agoDays)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* ══ Shorts مرتبطة ══ */}
      {shorts.length > 0 && (
        <section className="zone-dark py-9 md:py-11">
          <div className="shell">
            <SectionHead
              title="مقاطع قصيرة من البرنامج"
              sub={`${shorts.length} مقطع منشور رسمياً`}
              href="/shorts"
              hrefLabel="كل المقاطع"
              accent="#783cff"
            />
            <div className="rail -mx-1 px-1 pb-1">
              {shorts.map((s) => <ShortCard key={s.id} s={s} />)}
            </div>
          </div>
        </section>
      )}

      {/* ══ برامج مشابهة ══ */}
      {others.length > 0 && (
        <section className="zone-light shell py-9 md:py-11">
          <SectionHead title="برامج من التصنيف نفسه" href="/programs" hrefLabel="دليل البرامج" />
          <div className="grid gap-4 sm:grid-cols-3">
            {others.map((o) => (
              <Link key={o.slug} href={`/programs/${o.slug}`}
                className="focusable card group flex flex-col overflow-hidden rounded-xl transition hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]">
                <div className="relative aspect-16/9 overflow-hidden bg-midnight">
                  <Poster src={programCover(o)} alt={o.title} sizes="33vw" />
                </div>
                <div className="p-3.5">
                  <h3 className="text-[15px] font-extrabold text-[color:var(--fg)] transition group-hover:text-[color:var(--accent)]">{o.title}</h3>
                  {o.host && <p className="clamp-1 mt-1 text-[12px] text-[color:var(--fg-3)]">{o.host}</p>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
