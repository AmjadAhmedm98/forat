"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Poster } from "@/components/ui/Media";
import { SectionHead } from "@/components/ui/Bits";
import { PROGRAMS, GENRES, programCover, type ProgramGenre } from "@/data/programs";
import { YT_CHANNEL } from "@/data/media";
import { cx } from "@/lib/format";

export function ProgramsDirectory() {
  const [genre, setGenre] = useState<ProgramGenre | "all">("all");
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const nq = q.trim();
    return PROGRAMS.filter((p) => {
      if (genre !== "all" && p.genre !== genre) return false;
      if (!nq) return true;
      return p.title.includes(nq) || (p.host ?? "").includes(nq) || p.blurb.includes(nq);
    });
  }, [genre, q]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: PROGRAMS.length };
    for (const p of PROGRAMS) c[p.genre] = (c[p.genre] ?? 0) + 1;
    return c;
  }, []);

  const confirmed = list.filter((p) => p.airtime);
  const unscheduled = list.filter((p) => !p.airtime);

  return (
    <div className="zone-light">
      <header className="border-b border-[color:var(--line)] bg-[color:var(--surface-2)]">
        <div className="shell py-8 md:py-10">
          <nav className="mb-3 flex items-center gap-2 text-[12.5px] text-[color:var(--fg-3)]">
            <Link href="/" className="focusable hover:text-[color:var(--accent)]">الرئيسية</Link>
            <span className="opacity-40">/</span><span>البرامج</span>
          </nav>
          <h1 className="text-[27px] font-extrabold text-[color:var(--fg)] md:text-[36px]">دليل برامج الفرات</h1>
          <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-[color:var(--fg-2)]">
            برامج ونشرات مؤكّدة من قناة الفرات الرسمية على YouTube — الأغلفة والحلقات مواد رسمية منشورة.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="flex min-w-[240px] flex-1 items-center gap-2.5 rounded-xl border border-[color:var(--line-2)] bg-[color:var(--surface)] px-3.5 py-2.5 focus-within:border-[color:var(--accent)] md:max-w-sm">
              <svg width="17" height="17" viewBox="0 0 20 20" fill="none" className="shrink-0 text-[color:var(--accent)]">
                <circle cx="9" cy="9" r="6.3" stroke="currentColor" strokeWidth="1.7" />
                <path d="M13.6 13.6L17.5 17.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
              <input
                value={q} onChange={(e) => setQ(e.target.value)}
                placeholder="ابحث ببرنامج أو مقدّم…"
                aria-label="بحث في البرامج"
                className="min-w-0 flex-1 bg-transparent text-[14px] text-[color:var(--fg)] outline-none placeholder:text-[color:var(--fg-3)]"
              />
            </div>
            <a href={YT_CHANNEL} target="_blank" rel="noopener noreferrer"
              className="focusable rounded-full border border-[color:var(--line-2)] px-4 py-2.5 text-[12.5px] font-bold text-[color:var(--fg-2)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]">
              قناة الفرات على YouTube
            </a>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {GENRES.map((g) => (
              <button
                key={g.key}
                onClick={() => setGenre(g.key)}
                className={cx(
                  "focusable flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px] font-bold transition",
                  genre === g.key
                    ? "bg-[color:var(--accent)] text-white"
                    : "border border-[color:var(--line-2)] text-[color:var(--fg-2)] hover:border-[color:var(--accent)]",
                )}
              >
                {g.label}
                <span className={cx("num text-[10.5px]", genre === g.key ? "opacity-80" : "opacity-55")}>
                  {counts[g.key] ?? 0}
                </span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="shell py-8 md:py-10">
        {list.length === 0 && (
          <div className="card rounded-2xl px-6 py-14 text-center">
            <p className="text-[15px] font-bold text-[color:var(--fg)]">لا برامج مطابقة</p>
          </div>
        )}

        {confirmed.length > 0 && (
          <section className="mb-11">
            <SectionHead title="نشرات الفرات اليومية" sub="مواعيد النشرات على شاشة الفرات" href="/live" hrefLabel="البثّ المباشر" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {confirmed.map((p) => <ProgramCard key={p.slug} p={p} />)}
            </div>
          </section>
        )}

        {unscheduled.length > 0 && (
          <section>
            <SectionHead
              title="برامج الفرات"
              sub="برامج الفرات الحوارية والخدمية والثقافية"
              accent="#c9bfa3"
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {unscheduled.map((p) => <ProgramCard key={p.slug} p={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function ProgramCard({ p }: { p: (typeof PROGRAMS)[number] }) {
  return (
    <Link
      href={`/programs/${p.slug}`}
      className="focusable card group flex flex-col overflow-hidden rounded-2xl transition hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]"
    >
      <div className="relative aspect-16/9 overflow-hidden bg-midnight">
        <Poster src={programCover(p)} alt={p.title} sizes="(max-width:640px) 100vw, 33vw" />
        <span
          className="absolute right-3 top-3 rounded-md px-2 py-[3px] text-[10px] font-extrabold text-white"
          style={{ background: p.accent }}
        >
          {GENRES.find((g) => g.key === p.genre)?.label}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h2 className="text-[17px] font-extrabold text-[color:var(--fg)] transition group-hover:text-[color:var(--accent)]">
          {p.title}
        </h2>
        {p.host && <p className="clamp-1 mt-1 text-[12.5px] font-bold text-[color:var(--fg-2)]">{p.host}</p>}
        <p className="clamp-2 mt-2 text-[12.5px] leading-relaxed text-[color:var(--fg-3)]">{p.blurb}</p>
        <div className="mt-auto flex items-center gap-2 pt-3">
          {p.airtime && (
            <span className="flex items-center gap-1.5 rounded-full bg-[color:var(--accent)]/10 px-2.5 py-1 text-[11px] font-bold text-[color:var(--accent)]">
              <span className="num">{p.airtime.time}</span> · {p.airtime.days.join(" · ")}
            </span>
          )}
          <span className="num mr-auto text-[11px] text-[color:var(--fg-3)]">
            {p.episodes.length} حلقة
          </span>
        </div>
      </div>
    </Link>
  );
}
