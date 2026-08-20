"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Player } from "./Player";
import { ShortCard } from "@/components/shorts/ShortCard";
import { Poster } from "@/components/ui/Media";
import { onAir, continuousSchedule, KIND_LABEL, type OnAir } from "@/lib/onair";
import { fmtSlot, DAYS } from "@/data/schedule";
import { SHORTS } from "@/data/shorts";
import { PROGRAMS, programCover } from "@/data/programs";
import { YT_CHANNEL } from "@/data/media";
import { minutesLabel, cx } from "@/lib/format";

export function LiveClient() {
  const [air, setAir] = useState<OnAir | null>(null);

  useEffect(() => {
    const tick = () => setAir(onAir());
    const first = window.setTimeout(tick, 0);
    const t = window.setInterval(tick, 20_000);
    return () => { window.clearTimeout(first); window.clearInterval(t); };
  }, []);

  const day = air?.day;
  // نعرض الفقرات المجدولة فقط؛ الفواصل تظهر فقط حين تكون هي الجارية الآن
  const full = day ? continuousSchedule() : [];
  const timeline = full.filter((e) => !e.isFiller || e.slot.start === air?.current.start);
  const dayLabel = DAYS.find((d) => d.key === day)?.label;
  const nextProgram = air?.next.program ? PROGRAMS.find((p) => p.slug === air.next.program) : undefined;

  return (
    <div className="zone-dark min-h-screen">
      <div className="shell py-7 md:py-10">
        {/* العنوان */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2.5 text-[25px] font-extrabold text-[color:var(--fg)] md:text-[32px]">
              <span className="inline-block h-7 w-[4px] rounded-full bg-cyan shadow-[0_0_14px_var(--color-cyan)]" />
              تلفزيون الفرات المباشر
            </h1>
            <p className="mt-2 pr-[14px] text-[13px] text-[color:var(--fg-3)]">
              البثّ الرسمي لقناة الفرات الفضائية — {dayLabel ? `جدول ${dayLabel}` : "جدول اليوم"}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/apps"
              className="focusable rounded-full border border-[color:var(--line-2)] px-4 py-2 text-[12.5px] font-bold text-[color:var(--fg-2)] transition hover:border-cyan hover:text-cyan">
              تطبيق الفرات
            </Link>
            <a href={YT_CHANNEL} target="_blank" rel="noopener noreferrer"
              className="focusable rounded-full border border-[color:var(--line-2)] px-4 py-2 text-[12.5px] font-bold text-[color:var(--fg-2)] transition hover:border-cyan hover:text-cyan">
              قناة الفرات على YouTube
            </a>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
          {/* المشغّل */}
          <div>
            <Player priority />

            {air && (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-cyan/25 bg-cyan/[.07] p-4">
                  <p className="flex items-center gap-1.5 text-[11px] font-extrabold text-cyan">
                    <span className="size-[5px] rounded-full bg-onair" style={{ animation: "pulse-dot 1.8s infinite" }} />
                    الآن على الهواء
                  </p>
                  <p className="mt-2 text-[17px] font-extrabold text-[color:var(--fg)]">{air.current.title}</p>
                  {air.current.host && <p className="mt-1 text-[12px] text-[color:var(--fg-2)]">تقديم: {air.current.host}</p>}
                  <p className="mt-2.5 text-[11.5px] text-[color:var(--fg-3)]">
                    <span className="ltr-num">{fmtSlot(air.current.start)}</span> — يتبقّى {minutesLabel(air.remaining)}
                  </p>
                  {air.current.program && (
                    <Link href={`/programs/${air.current.program}`}
                      className="focusable mt-3 inline-block text-[12px] font-bold text-cyan hover:underline">
                      صفحة البرنامج ←
                    </Link>
                  )}
                </div>

                <div className="flex gap-3 rounded-xl border border-[color:var(--line)] bg-[color:var(--surface)] p-4">
                  {nextProgram && (
                    <div className="relative aspect-16/9 w-24 shrink-0 overflow-hidden rounded-lg bg-midnight">
                      <Poster src={programCover(nextProgram)} alt={nextProgram.title} sizes="96px" zoom={false} />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-[11px] font-extrabold text-[color:var(--fg-3)]">التالي</p>
                    <p className="clamp-2 mt-1.5 text-[15px] font-extrabold text-[color:var(--fg)]">{air.next.title}</p>
                    {air.next.host && <p className="clamp-1 mt-1 text-[12px] text-[color:var(--fg-2)]">تقديم: {air.next.host}</p>}
                    <p className="mt-1.5 text-[11.5px] text-[color:var(--fg-3)]">
                      <span className="ltr-num">{fmtSlot(air.next.start)}</span> — {minutesLabel(air.next.duration)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* جدول اليوم */}
          <aside className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-4 md:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[15px] font-extrabold text-[color:var(--fg)]">جدول اليوم</h2>
              <span className="text-[10.5px] text-[color:var(--fg-3)]">
                <span className="num">{timeline.filter((e) => !e.isFiller).length}</span> فقرة
              </span>
            </div>

            <div className="max-h-[620px] overflow-y-auto pl-1">
              {!air ? (
                <div className="space-y-2">
                  {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-14 rounded-lg" />)}
                </div>
              ) : (
                timeline.map(({ slot: s, isFiller }) => {
                  const isNow = s.start === air.current.start;
                  const isPast = s.start < air.current.start;
                  return (
                    <Link
                      key={`${s.start}-${s.title}`}
                      href={s.program ? `/programs/${s.program}` : "/live"}
                      className={cx(
                        "flex items-center gap-2.5 rounded-lg border-b border-[color:var(--line)] px-2 py-2.5 transition last:border-0",
                        isNow ? "bg-cyan/10" : "hover:bg-white/[.04]",
                        isPast && !isNow && "opacity-55",
                        isFiller && !isNow && "opacity-40",
                      )}
                    >
                      <span className={cx("ltr-num w-12 shrink-0 text-[12px] font-bold", isNow ? "text-cyan" : "text-[color:var(--fg-3)]")}>
                        {fmtSlot(s.start)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className={cx("clamp-1 text-[13.5px] font-bold", isNow ? "text-cyan" : isPast ? "text-[color:var(--fg-3)]" : "text-[color:var(--fg)]")}>
                            {s.title}
                          </span>
                          {isNow && (
                            <span className="flex shrink-0 items-center gap-1 rounded bg-onair/25 px-1.5 py-[2px] text-[9.5px] font-extrabold text-onair">
                              <span className="size-[4px] rounded-full bg-onair" style={{ animation: "pulse-dot 1.8s infinite" }} />
                              الآن
                            </span>
                          )}
                        </span>
                        <span className="clamp-1 mt-0.5 block text-[11px] text-[color:var(--fg-3)]">
                          {KIND_LABEL[s.kind]}{s.host ? ` · ${s.host}` : ""}
                        </span>
                      </span>
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="shrink-0 text-[color:var(--fg-3)]">
                        <path d="M7.5 2.5L4 6l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  );
                })
              )}
            </div>
          </aside>
        </div>

        {/* مقاطع من البثّ */}
        <section className="mt-12">
          <h2 className="mb-4 flex items-center gap-2.5 text-[20px] font-extrabold text-[color:var(--fg)]">
            <span className="inline-block h-5 w-[4px] rounded-full bg-violet shadow-[0_0_12px_var(--color-violet)]" />
            مقاطع من البثّ
          </h2>
          <div className="rail -mx-1 px-1 pb-1">
            {SHORTS.slice(0, 12).map((s) => <ShortCard key={s.id} s={s} />)}
          </div>
        </section>
      </div>
    </div>
  );
}
