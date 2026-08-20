"use client";

import Link from "next/link";
import { useState } from "react";
import { BREAKING } from "@/data/news";
import { relativeTime, cx } from "@/lib/format";

export function BreakingTicker() {
  const [paused, setPaused] = useState(false);
  const items = [...BREAKING, ...BREAKING]; // تكرار لاستمرارية الشريط

  return (
    <div className="zone-dark relative z-[90] border-b border-[color:var(--line)] bg-gradient-to-l from-navy/85 via-midnight-2/90 to-navy/85">
      <div className="shell flex h-[46px] items-center gap-0">
        {/* شارة عاجل */}
        <Link
          href="/breaking"
          className="focusable group relative flex h-full shrink-0 items-center gap-2 pl-4 pr-0 md:pl-5"
        >
          <span className="relative flex items-center gap-2 rounded-md bg-gradient-to-l from-onair to-[#ff5c6e] px-2.5 py-1 shadow-[0_0_18px_-3px_rgba(255,45,70,.7)]">
            <span className="size-[5px] rounded-full bg-white" style={{ animation: "pulse-dot 1.6s infinite" }} />
            <span className="text-[12px] font-bold tracking-wide text-white">عاجل</span>
          </span>
          <span className="hidden text-[11px] text-[color:var(--fg-3)] transition group-hover:text-cyan md:inline">
            كل العاجل ←
          </span>
        </Link>

        <span className="mx-3 h-5 w-px shrink-0 bg-[var(--line-2)] md:mx-4" />

        {/* الشريط المتحرك */}
        <div
          className="relative min-w-0 flex-1 overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          style={{
            maskImage: "linear-gradient(to left, transparent, #000 5%, #000 95%, transparent)",
            WebkitMaskImage: "linear-gradient(to left, transparent, #000 5%, #000 95%, transparent)",
          }}
        >
          <div
            className={cx("flex w-max items-center gap-8 whitespace-nowrap")}
            style={{
              animation: "ticker-rtl 58s linear infinite",
              animationPlayState: paused ? "paused" : "running",
            }}
          >
            {items.map((b, i) => (
              <Link
                key={`${b.id}-${i}`}
                href={b.slug ? `/article/${b.slug}` : "/breaking"}
                className="group flex items-center gap-2.5 text-[13px]"
              >
                <span className="size-[5px] shrink-0 rotate-45 bg-cyan/70 transition group-hover:bg-cyan" />
                <span className="text-[color:var(--fg)]/90 transition group-hover:text-cyan">{b.text}</span>
                <span className="text-[10.5px] text-[color:var(--fg-3)]">{relativeTime(b.agoMin)}</span>
              </Link>
            ))}
          </div>
        </div>

        <button
          onClick={() => setPaused((v) => !v)}
          aria-label={paused ? "استئناف الشريط" : "إيقاف الشريط"}
          className="focusable mr-3 hidden shrink-0 rounded-md border border-[color:var(--line)] p-1.5 text-[color:var(--fg-3)] transition hover:text-cyan md:block"
        >
          {paused ? (
            <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor"><path d="M3 2l7 4-7 4V2z" /></svg>
          ) : (
            <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor"><rect x="3" y="2" width="2.4" height="8" rx="1" /><rect x="6.8" y="2" width="2.4" height="8" rx="1" /></svg>
          )}
        </button>
      </div>
    </div>
  );
}
