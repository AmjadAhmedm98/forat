"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ShortCard } from "@/components/shorts/ShortCard";
import { SectionHead } from "@/components/ui/Bits";
import { SHORTS } from "@/data/shorts";

export function ShortsRail({ max = 12 }: { max?: number }) {
  const rail = useRef<HTMLDivElement>(null);
  const [scrollable, setScrollable] = useState(false);

  // الأسهم تظهر فقط حين يتجاوز المحتوى عرض الشريط
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const check = () => setScrollable(el.scrollWidth - el.clientWidth > 8);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  /** في RTL: التقدّم للأمام يعني scrollLeft سالباً */
  const scroll = (dir: "next" | "prev") =>
    rail.current?.scrollBy({ left: dir === "next" ? -352 : 352, behavior: "smooth" });

  return (
    <section data-slot="shorts" className="relative overflow-hidden rounded-2xl border border-[color:var(--line)] bg-gradient-to-l from-violet/[.14] via-navy/30 to-fuchsia/[.10] p-5 md:p-7">
      <span
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle,rgba(120,60,255,.28),transparent 70%)" }}
      />
      <SectionHead
        title="الفرات Shorts"
        sub="مقاطع عمودية قصيرة منشورة رسمياً على قناة الفرات"
        href="/shorts"
        hrefLabel="فتح المشغّل"
        accent="#783cff"
      >
        <div className={scrollable ? "hidden gap-1.5 md:flex" : "hidden"}>
          <button onClick={() => scroll("prev")} aria-label="السابق"
            className="focusable rounded-full border border-[color:var(--line)] p-2 text-[color:var(--fg-2)] transition hover:border-violet/50 hover:text-violet">
            <svg width="13" height="13" viewBox="0 0 12 12" fill="none"><path d="M4.5 2.5L8 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button onClick={() => scroll("next")} aria-label="التالي"
            className="focusable rounded-full border border-[color:var(--line)] p-2 text-[color:var(--fg-2)] transition hover:border-violet/50 hover:text-violet">
            <svg width="13" height="13" viewBox="0 0 12 12" fill="none"><path d="M7.5 2.5L4 6l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </SectionHead>

      <div ref={rail} className="rail relative -mx-1 px-1 pb-1">
        {SHORTS.slice(0, max).map((s) => <ShortCard key={s.id} s={s} />)}
        <Link
          href="/shorts"
          data-more="1" className="focusable group grid aspect-9/16 w-[152px] shrink-0 place-items-center rounded-xl border border-dashed border-violet/35 bg-violet/8 text-center transition hover:bg-violet/15 sm:w-[172px]"
        >
          <span>
            <span className="mx-auto mb-2.5 grid size-11 place-items-center rounded-full border border-violet/40 text-violet transition group-hover:scale-110">
              <svg width="15" height="15" viewBox="0 0 12 12" fill="none"><path d="M7.5 2.5L4 6l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <span className="block text-[12.5px] font-semibold text-violet">كل المقاطع</span>
            <span className="mt-1 block text-[10.5px] text-[color:var(--fg-3)]"><span className="num">{SHORTS.length}</span> مقطع</span>
          </span>
        </Link>
      </div>
    </section>
  );
}
