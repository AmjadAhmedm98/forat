"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SectionHead } from "@/components/ui/Bits";
import { onAir, KIND_LABEL, type OnAir } from "@/lib/onair";
import { scheduleFor, fmtSlot, DAYS } from "@/data/schedule";
import { minutesLabel } from "@/lib/format";
import { Poster } from "@/components/ui/Media";
import { YT_LIVE_ID, ytImage } from "@/data/media";

export function LiveStrip() {
  const [air, setAir] = useState<OnAir | null>(null);
  useEffect(() => {
    const tick = () => setAir(onAir());
    const first = window.setTimeout(tick, 0);
    const t = window.setInterval(tick, 30_000);
    return () => { window.clearTimeout(first); window.clearInterval(t); };
  }, []);

  const dayLabel = air ? DAYS.find((d) => d.key === air.day)?.label : "";
  const rest = air
    ? scheduleFor().filter((s) => s.start > air.current.start).slice(0, 5)
    : [];

  return (
    <section>
      <SectionHead
        title="على الهواء الآن"
        sub={dayLabel ? `جدول ${dayLabel} — تلفزيون الفرات` : "جدول اليوم"}
        href="/live"
        hrefLabel="صفحة البثّ"
      />

      <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
        {/* الآن + التالي */}
        <div className="glass relative overflow-hidden rounded-2xl p-5 md:p-6">
          <span aria-hidden className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle,rgba(0,215,255,.2),transparent 70%)" }} />

          {!air ? (
            <div className="space-y-3">
              <div className="skeleton h-4 w-24 rounded" />
              <div className="skeleton h-7 w-3/4 rounded" />
              <div className="skeleton h-3 w-1/2 rounded" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-md bg-onair px-2 py-[3px]">
                  <span className="size-[5px] rounded-full bg-white" style={{ animation: "pulse-dot 1.8s infinite" }} />
                  <span className="text-[10.5px] font-bold text-white">الآن</span>
                </span>
                <span className="ltr-num rounded-md border border-[color:var(--line)] px-2 py-[2px] text-[10.5px] text-[color:var(--fg-2)]">
                  {fmtSlot(air.current.start)}
                </span>
                <span className="rounded-md bg-cyan/12 px-2 py-[2px] text-[10.5px] font-semibold text-cyan">
                  {KIND_LABEL[air.current.kind]}
                </span>
              </div>

              <h3 className="mt-3 text-[21px] font-bold leading-tight text-[color:var(--fg)] md:text-[26px]">
                {air.current.title}
              </h3>
              {air.current.host && (
                <p className="mt-1.5 text-[13px] text-[color:var(--fg-2)]">تقديم: {air.current.host}</p>
              )}
              {air.isFiller && (
                <p className="mt-1.5 text-[12.5px] text-[color:var(--fg-3)]">
                  فاصل بين فقرتين مجدولتين — التالي: {air.next.title}
                </p>
              )}

              {/* شريط التقدّم */}
              <div className="mt-5">
                <div className="relative h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="absolute inset-y-0 right-0 rounded-full bg-gradient-to-l from-cyan to-broadcast transition-[width] duration-1000"
                    style={{ width: `${(air.progress * 100).toFixed(1)}%` }} />
                </div>
                <div className="mt-2 flex justify-between text-[11px] text-[color:var(--fg-3)]">
                  <span className="ltr-num">{Math.round(air.progress * 100)}%</span>
                  <span>يتبقى {minutesLabel(air.remaining)}</span>
                </div>
              </div>

              {/* لقطة من البثّ الرسمي */}
              <Link href="/live" className="focusable mt-5 block overflow-hidden rounded-xl border border-[color:var(--line)] bg-midnight">
                <span className="relative block aspect-16/9">
                  <Poster src={ytImage(YT_LIVE_ID)} alt="لقطة من البثّ المباشر لقناة الفرات" sizes="(max-width:1024px) 100vw, 40vw" />
                  <span className="scrim-soft absolute inset-0" />
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid size-12 place-items-center rounded-full bg-onair text-white shadow-[0_0_36px_-6px_rgba(255,45,70,.9)]">
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M5.5 3.4l11 6.6-11 6.6V3.4z" /></svg>
                    </span>
                  </span>
                </span>
              </Link>

              <div className="mt-4 flex flex-wrap items-center gap-2.5 border-t border-[color:var(--line)] pt-4">
                <Link href="/live"
                  className="focusable inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-broadcast to-cyan px-4 py-2 text-[12.5px] font-bold text-midnight transition hover:brightness-110">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor"><path d="M3 2l7 4-7 4V2z" /></svg>
                  شاهد الآن
                </Link>
                {air.current.program && (
                  <Link href={`/programs/${air.current.program}`}
                    className="focusable rounded-full border border-[color:var(--line)] px-4 py-2 text-[12.5px] text-[color:var(--fg-2)] transition hover:border-cyan/40 hover:text-cyan">
                    صفحة البرنامج
                  </Link>
                )}
              </div>
            </>
          )}
        </div>

        {/* لاحقاً اليوم */}
        <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5 md:p-6">
          <p className="mb-3.5 text-[12px] font-semibold tracking-wide text-[color:var(--fg-3)]">لاحقاً اليوم</p>
          {!air ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-11 rounded-lg" />)}
            </div>
          ) : rest.length === 0 ? (
            <p className="py-6 text-center text-[12.5px] text-[color:var(--fg-3)]">انتهت فقرات اليوم — الجدول يتجدّد بعد منتصف الليل.</p>
          ) : (
            <ul>
              {rest.map((s, i) => {
                const body = (
                  <>
                    <span className="ltr-num shrink-0 text-[12.5px] font-semibold text-cyan/85">{fmtSlot(s.start)}</span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="clamp-1 text-[13.5px] font-semibold text-[color:var(--fg)]/95">{s.title}</span>
                        {i === 0 && (
                          <span className="shrink-0 rounded bg-cyan/15 px-1.5 py-[2px] text-[9.5px] font-bold text-cyan">
                            التالي
                          </span>
                        )}
                      </span>
                      <span className="clamp-1 mt-0.5 block text-[11.5px] text-[color:var(--fg-3)]">
                        {KIND_LABEL[s.kind]}{s.host ? ` · ${s.host}` : ""}
                      </span>
                    </span>
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="shrink-0 text-[color:var(--fg-3)]">
                      <path d="M7.5 2.5L4 6l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                );
                return (
                  <li key={`${s.start}-${s.title}`}>
                    {s.program ? (
                      <Link href={`/programs/${s.program}`}
                        className="focusable flex items-center gap-3 border-b border-[color:var(--line)] py-3 transition last:border-0 hover:bg-white/[.03]">
                        {body}
                      </Link>
                    ) : (
                      <Link href="/live"
                        className="focusable flex items-center gap-3 border-b border-[color:var(--line)] py-3 transition last:border-0 hover:bg-white/[.03]">
                        {body}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
