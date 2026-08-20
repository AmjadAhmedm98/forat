"use client";

import Link from "next/link";
import { LogoMark } from "@/components/brand/Logo";
import { SignalRings } from "@/components/brand/SignalRings";
import { RADIO, RADIO_PLAYLIST, RADIO_KIND_LABEL } from "@/data/radio";
import { cx } from "@/lib/format";

export function Waveform({ playing, bars = 30, className, color = "var(--color-cyan)" }: {
  playing: boolean; bars?: number; className?: string; color?: string;
}) {
  return (
    <div aria-hidden className={cx("flex items-end gap-[3px]", className)}>
      {Array.from({ length: bars }).map((_, i) => {
        const h = 22 + Math.abs(Math.sin(i * 1.37) * 78);
        return (
          <span
            key={i}
            className="w-[3px] rounded-full"
            style={{
              height: `${h}%`, background: color,
              opacity: playing ? 0.55 + (i % 4) * 0.12 : 0.22,
              transformOrigin: "bottom",
              animation: playing ? `bars ${0.7 + (i % 6) * 0.16}s ease-in-out ${i * 0.045}s infinite` : undefined,
            }}
          />
        );
      })}
    </div>
  );
}

export function RadioTeaser() {
  const featured = RADIO_PLAYLIST[0];

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[color:var(--line)] bg-gradient-to-l from-navy/55 via-midnight-2/70 to-navy/35 p-5 md:p-7">
      <SignalRings className="-left-20 top-1/2 size-[420px] -translate-y-1/2 opacity-40" rings={5} animated />

      <div className="relative grid items-center gap-6 lg:grid-cols-[auto_1fr_auto]">
        {/* القرص */}
        <div className="relative grid size-24 place-items-center rounded-full border border-[color:var(--line-2)] bg-midnight/60 md:size-28">
          <span aria-hidden className="absolute inset-0 rounded-full border border-cyan/25"
            style={{ animation: "spin-slow 18s linear infinite", borderTopColor: "var(--color-cyan)" }} />
          <LogoMark size="lg" />
        </div>

        {/* المعلومات */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="silver-text text-[20px] font-extrabold md:text-[24px]">{RADIO.name}</span>
            {RADIO.frequencies.map((f) => (
              <span key={f.city} className="flex items-center gap-1.5 rounded-full bg-cyan/15 px-2.5 py-[3px] ring-1 ring-cyan/40">
                <span className="text-[11px] font-bold text-cyan">{f.city}</span>
                <span className="ltr-num text-[11px] font-extrabold text-cyan">{f.freq} {RADIO.band}</span>
              </span>
            ))}
          </div>

          <p className="mt-3 text-[12px] font-bold text-cyan">
            {featured.show} · {RADIO_KIND_LABEL[featured.kind]}
          </p>
          <p className="clamp-2 mt-1 text-[15px] font-extrabold leading-[1.5] text-[color:var(--fg)] md:text-[17px]">
            {featured.title}
          </p>

          <Waveform playing className="mt-4 h-8 w-full max-w-md" />
        </div>

        {/* الإجراءات */}
        <div className="flex flex-col items-stretch gap-2.5 sm:items-end">
          <Link
            href="/radio"
            className="focusable inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-l from-broadcast to-cyan px-6 py-3 text-[13px] font-extrabold text-midnight shadow-[0_0_34px_-10px_var(--color-cyan)] transition hover:brightness-110"
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path d="M5.5 3.4l11 6.6-11 6.6V3.4z" />
            </svg>
            استمع الآن
          </Link>
          <Link href="/radio"
            className="focusable rounded-full border border-[color:var(--line-2)] px-5 py-2.5 text-center text-[12.5px] font-bold text-[color:var(--fg-2)] transition hover:border-cyan hover:text-cyan">
            قائمة الاستماع
          </Link>
        </div>
      </div>
    </section>
  );
}
