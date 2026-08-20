"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Poster } from "@/components/ui/Media";
import { SHORTS, shortImage, shortSource } from "@/data/shorts";
import { CATEGORY_MAP } from "@/data/categories";
import { PROGRAMS } from "@/data/programs";
import { compactViews, duration, relativeTime, cx } from "@/lib/format";

const I = {
  like: "M10 17.2l-1.1-1C4.9 12.6 2.4 10.3 2.4 7.5c0-2.3 1.8-4.1 4.1-4.1 1.3 0 2.5.6 3.5 1.6 1-1 2.2-1.6 3.5-1.6 2.3 0 4.1 1.8 4.1 4.1 0 2.8-2.5 5.1-6.5 8.7l-1.1 1z",
  save: "M5 2.6h10v14.8l-5-3.5-5 3.5V2.6z",
  share: "M14.5 6.6a2.4 2.4 0 10-2.3-3l-5 2.9a2.4 2.4 0 100 3l5 2.9a2.4 2.4 0 10.5-.9l-5-2.9a2.4 2.4 0 000-1.2l5-2.9c.4.7 1.1 1.1 1.8 1.1z",
  mute: "M4 7.6h2.7L10.4 4v12L6.7 12.4H4V7.6zm9.3.4l1.1-1.1 1.6 1.6 1.6-1.6 1.1 1.1L17.1 9.6l1.6 1.6-1.1 1.1-1.6-1.6-1.6 1.6-1.1-1.1 1.6-1.6-1.6-1.6z",
  vol: "M4 7.6h2.7L10.4 4v12L6.7 12.4H4V7.6zm9.1.3a3.4 3.4 0 010 4.2l1.2 1a5 5 0 000-6.2l-1.2 1z",
  play: "M5.5 3.4l11 6.6-11 6.6V3.4z",
  pause: "M5.4 3.2h3.1v13.6H5.4V3.2zm6.1 0h3.1v13.6h-3.1V3.2z",
};

function Icon({ d, size = 20 }: { d: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor" aria-hidden><path d={d} /></svg>;
}

export function ShortsFeed() {
  const sp = useSearchParams();
  const startId = sp.get("v");
  const startIndex = Math.max(0, SHORTS.findIndex((s) => s.id === startId));

  const [i, setI] = useState(startIndex);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  const s = SHORTS[i];
  const cat = CATEGORY_MAP[s.category];
  const program = s.program ? PROGRAMS.find((p) => p.slug === s.program) : undefined;

  const go = useCallback((d: 1 | -1) => {
    setI((v) => Math.min(SHORTS.length - 1, Math.max(0, v + d)));
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("v", s.id);
    window.history.replaceState(null, "", url.toString());
  }, [s.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); go(1); }
      if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); go(-1); }
      if (e.key === " ") { e.preventDefault(); setPlaying((v) => !v); }
      if (e.key.toLowerCase() === "m") setMuted((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let lock = false;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 12 || lock) return;
      e.preventDefault();
      lock = true;
      go(e.deltaY > 0 ? 1 : -1);
      setTimeout(() => { lock = false; }, 420);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [go]);

  const share = async () => {
    const url = `${window.location.origin}/shorts?v=${s.id}`;
    try {
      if (navigator.share) await navigator.share({ title: s.title, url });
      else { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1600); }
    } catch {}
  };

  const progress = useMemo(() => ((i + 1) / SHORTS.length) * 100, [i]);

  return (
    <div className="zone-dark relative min-h-[calc(100vh-108px)] overflow-hidden">
      {/* شريط علوي */}
      <div className="shell flex items-center justify-between gap-3 py-4">
        <div>
          <h1 className="text-[19px] font-extrabold text-[color:var(--fg)] md:text-[23px]">الفرات Shorts</h1>
          <p className="mt-0.5 text-[11.5px] text-[color:var(--fg-3)]">
            <span className="num">{i + 1}</span> من <span className="num">{SHORTS.length}</span> — مقاطع رسمية من قناة الفرات
          </p>
        </div>
        <Link href="/" className="focusable rounded-full border border-[color:var(--line-2)] px-4 py-2 text-[12.5px] font-bold text-[color:var(--fg-2)] transition hover:border-cyan hover:text-cyan">
          إغلاق
        </Link>
      </div>

      <div ref={wrap} className="shell grid gap-6 pb-10 lg:grid-cols-[auto_1fr] lg:items-start">
        {/* المسرح العمودي */}
        <div className="relative mx-auto w-full max-w-[380px]">
          <div className="relative aspect-9/16 overflow-hidden rounded-3xl bg-midnight ring-1 ring-white/12">
            <Poster
              key={s.id}
              src={shortImage(s)}
              alt={s.title}
              priority
              sizes="380px"
              zoom={false}
              className="anim-rise"
            />
            <div className="scrim absolute inset-0" />

            {/* شريط التقدّم */}
            <div className="absolute inset-x-0 top-0 flex gap-1 p-2">
              {SHORTS.map((_, n) => (
                <span key={n} className={cx("h-[2.5px] flex-1 rounded-full", n <= i ? "bg-cyan" : "bg-white/25")} />
              ))}
            </div>

            {/* التصنيف + الوقت (تراكب مسموح) */}
            <div className="absolute right-3 top-5 flex items-center gap-1.5">
              <span className="rounded-md px-2 py-[2px] text-[10px] font-extrabold text-white" style={{ background: cat.accent }}>
                {cat.short}
              </span>
              <span className="rounded-md bg-black/55 px-2 py-[2px] text-[10px] text-white/85 backdrop-blur-sm">
                {relativeTime(s.agoHours * 60)}
              </span>
            </div>

            {/* تشغيل/إيقاف */}
            <button
              onClick={() => setPlaying((v) => !v)}
              aria-label={playing ? "إيقاف" : "تشغيل"}
              className="focusable absolute inset-0 grid place-items-center"
            >
              {!playing && (
                <span className="grid size-16 place-items-center rounded-full bg-black/55 text-white ring-1 ring-white/30 backdrop-blur-sm">
                  <Icon d={I.play} size={26} />
                </span>
              )}
            </button>

            {/* المدة */}
            <span className="ltr-num absolute left-3 top-5 rounded-md bg-black/60 px-1.5 py-[2px] text-[10px] text-white/90 backdrop-blur-sm">
              {duration(s.duration)}
            </span>

            {/* المعلومات أسفل */}
            <div className="absolute inset-x-0 bottom-0 p-4">
              {s.speaker && <p className="mb-1 text-[11.5px] font-bold text-cyan">{s.speaker}</p>}
              <p className="clamp-4 text-[14px] font-extrabold leading-[1.55] text-white">{s.title}</p>
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                {program && (
                  <Link href={`/programs/${program.slug}`}
                    className="focusable rounded-full bg-white/15 px-2.5 py-[3px] text-[10.5px] font-bold text-white backdrop-blur-sm transition hover:bg-cyan hover:text-midnight">
                    {program.title}
                  </Link>
                )}
                <span className="text-[10.5px] text-white/60">
                  <span className="num">{compactViews(s.views)}</span> مشاهدة
                </span>
              </div>
            </div>

            {/* شريط الإجراءات الجانبي */}
            <div className="absolute bottom-24 left-2 flex flex-col items-center gap-3.5">
              <button
                onClick={() => setLiked((v) => ({ ...v, [s.id]: !v[s.id] }))}
                aria-label="إعجاب" aria-pressed={!!liked[s.id]}
                className="focusable flex flex-col items-center gap-1 text-white transition hover:scale-110"
              >
                <span className={cx("grid size-10 place-items-center rounded-full backdrop-blur-sm transition",
                  liked[s.id] ? "bg-onair text-white" : "bg-black/45 ring-1 ring-white/20")}>
                  <Icon d={I.like} size={19} />
                </span>
                <span className="num text-[10px]">{compactViews(s.likes + (liked[s.id] ? 1 : 0))}</span>
              </button>

              <button
                onClick={() => setSaved((v) => ({ ...v, [s.id]: !v[s.id] }))}
                aria-label="حفظ" aria-pressed={!!saved[s.id]}
                className="focusable flex flex-col items-center gap-1 text-white transition hover:scale-110"
              >
                <span className={cx("grid size-10 place-items-center rounded-full backdrop-blur-sm transition",
                  saved[s.id] ? "bg-cyan text-midnight" : "bg-black/45 ring-1 ring-white/20")}>
                  <Icon d={I.save} size={18} />
                </span>
                <span className="text-[10px]">حفظ</span>
              </button>

              <button onClick={share} aria-label="مشاركة"
                className="focusable flex flex-col items-center gap-1 text-white transition hover:scale-110">
                <span className="grid size-10 place-items-center rounded-full bg-black/45 ring-1 ring-white/20 backdrop-blur-sm">
                  <Icon d={I.share} size={18} />
                </span>
                <span className="text-[10px]">{copied ? "نُسخ" : "مشاركة"}</span>
              </button>

              <button onClick={() => setMuted((v) => !v)} aria-label={muted ? "إلغاء الكتم" : "كتم"}
                className="focusable flex flex-col items-center gap-1 text-white transition hover:scale-110">
                <span className="grid size-10 place-items-center rounded-full bg-black/45 ring-1 ring-white/20 backdrop-blur-sm">
                  <Icon d={muted ? I.mute : I.vol} size={18} />
                </span>
                <span className="text-[10px]">{muted ? "صامت" : "صوت"}</span>
              </button>
            </div>
          </div>

          {/* التنقّل */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <button onClick={() => go(-1)} disabled={i === 0} aria-label="السابق"
              className="focusable grid size-11 place-items-center rounded-full border border-[color:var(--line-2)] text-[color:var(--fg-2)] transition hover:border-cyan hover:text-cyan disabled:opacity-30">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 10l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <span className="num text-[12px] text-[color:var(--fg-3)]">{i + 1} / {SHORTS.length}</span>
            <button onClick={() => go(1)} disabled={i === SHORTS.length - 1} aria-label="التالي"
              className="focusable grid size-11 place-items-center rounded-full border border-[color:var(--line-2)] text-[color:var(--fg-2)] transition hover:border-cyan hover:text-cyan disabled:opacity-30">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-[color:var(--fg-3)]">
            استخدم ↑ ↓ أو عجلة الماوس للتنقّل · مسافة للتشغيل · M للكتم
          </p>
          <a
            href={shortSource(s)}
            target="_blank"
            rel="noopener noreferrer"
            className="focusable mx-auto mt-3 flex w-fit items-center gap-1.5 text-[11.5px] font-bold text-[color:var(--fg-3)] transition hover:text-cyan"
          >
            فتح المقطع الأصلي على YouTube
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M5.5 8.5L12 2M12 2H8.2M12 2v3.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
        </div>

        {/* قائمة جانبية */}
        <aside className="hidden lg:block">
          <h2 className="mb-3 text-[14.5px] font-extrabold text-[color:var(--fg)]">التالي في القائمة</h2>
          <div className="grid max-h-[74vh] grid-cols-2 gap-3 overflow-y-auto pl-1 xl:grid-cols-3">
            {SHORTS.map((x, n) => (
              <button
                key={x.id}
                onClick={() => setI(n)}
                className={cx(
                  "focusable group relative block aspect-9/16 overflow-hidden rounded-xl bg-midnight text-right ring-1 transition",
                  n === i ? "ring-2 ring-cyan" : "ring-white/10 hover:ring-cyan/50",
                )}
              >
                <Poster src={shortImage(x)} alt={x.title} sizes="180px" />
                <span className="scrim absolute inset-0" />
                <span className="absolute inset-x-0 bottom-0 p-2">
                  <span className="clamp-2 block text-[11px] font-bold leading-[1.5] text-white">{x.title}</span>
                </span>
                {n === i && (
                  <span className="absolute right-2 top-2 rounded bg-cyan px-1.5 py-[2px] text-[9px] font-extrabold text-midnight">
                    يُعرض الآن
                  </span>
                )}
              </button>
            ))}
          </div>
        </aside>
      </div>

      <div aria-hidden className="pointer-events-none fixed inset-x-0 bottom-0 h-[3px]">
        <div className="h-full bg-gradient-to-l from-violet to-cyan transition-[width] duration-300" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
