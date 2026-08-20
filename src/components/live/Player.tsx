"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { onAir, KIND_LABEL, type OnAir } from "@/lib/onair";
import { fmtSlot } from "@/data/schedule";
import { YT_LIVE_ID, YT_LIVE_URL, YT_LIVE_EMBED, ytImage } from "@/data/media";
import { clock, minutesLabel, cx } from "@/lib/format";

/**
 * مشغّل البثّ المباشر — نمط facade:
 * يُعرض أولاً thumbnail حقيقي للبثّ الرسمي، وعند النقر يُحمَّل iframe من
 * youtube-nocookie داخل الصفحة (لا انتقال خارج الموقع، ولا تحميل مسبق).
 * لا توجد أي أزرار تحاكي جودة أو مصادر غير حقيقية.
 */
export function Player({
  className,
  compact = false,
  /** الصورة البطل للصفحة — تُفعَّل في /live فقط */
  priority = false,
}: {
  className?: string;
  compact?: boolean;
  priority?: boolean;
}) {
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [air, setAir] = useState<OnAir | null>(null);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => { const d = new Date(); setNow(d); setAir(onAir(d)); };
    const first = window.setTimeout(tick, 0);
    const t = window.setInterval(tick, 15_000);
    return () => { window.clearTimeout(first); window.clearInterval(t); };
  }, []);

  // إن لم يُحمّل الإطار خلال 8 ثوانٍ نعرض البديل المهذّب
  useEffect(() => {
    if (!started) return;
    const t = setTimeout(() => setFailed((f) => f), 8000);
    return () => clearTimeout(t);
  }, [started]);

  return (
    <div className={cx("space-y-3", className)}>
      <div className="relative aspect-16/9 overflow-hidden rounded-2xl border border-[color:var(--line-2)] bg-midnight shadow-[0_20px_60px_-24px_rgba(0,0,0,.9)]">
        {!started ? (
          <>
            <Image
              src={ytImage(YT_LIVE_ID)}
              alt="بثّ قناة الفرات الفضائية المباشر"
              fill
              priority={priority}
              loading={priority ? undefined : "lazy"}
              sizes="(max-width:1024px) 100vw, 62vw"
              className="object-cover"
            />
            <div className="scrim-soft absolute inset-0" />

            {/* شارة مباشر + الساعة */}
            <div className="absolute left-3 top-3 flex items-center gap-2 md:left-4 md:top-4">
              <span className="flex items-center gap-1.5 rounded-md bg-onair px-2 py-[3px] shadow-[0_0_16px_-2px_rgba(255,45,70,.8)]">
                <span className="size-[5px] rounded-full bg-white" style={{ animation: "pulse-dot 1.8s infinite" }} />
                <span className="text-[10.5px] font-bold text-white">مباشر</span>
              </span>
              {now && (
                <span className="ltr-num rounded-md bg-black/55 px-2 py-[3px] text-[10.5px] text-white/90 backdrop-blur-sm">
                  {clock(now, false)}
                </span>
              )}
            </div>

            <div className="absolute right-3 top-3 flex items-center gap-2 md:right-4 md:top-4">
              <LogoMark size="sm" glow={false} />
              <span className="ltr-num text-[10px] font-bold tracking-widest text-white/80">ALFORAT HD</span>
            </div>

            {/* زر التشغيل */}
            <button
              onClick={() => setStarted(true)}
              aria-label="شاهد البثّ المباشر"
              className="focusable group absolute inset-0 grid place-items-center"
            >
              <span className="flex flex-col items-center gap-3">
                <span className="grid size-16 place-items-center rounded-full bg-onair text-white shadow-[0_0_60px_-8px_rgba(255,45,70,.9)] transition group-hover:scale-110 md:size-20">
                  <svg width="26" height="26" viewBox="0 0 20 20" fill="currentColor"><path d="M5.5 3.4l11 6.6-11 6.6V3.4z" /></svg>
                </span>
                <span className="rounded-full bg-black/55 px-4 py-1.5 text-[13px] font-extrabold text-white backdrop-blur-sm">
                  شاهد البثّ المباشر
                </span>
              </span>
            </button>

            {/* الآن على الهواء */}
            {air && !compact && (
              <div className="absolute inset-x-0 bottom-0 hidden items-end justify-between gap-3 p-3 sm:flex md:p-4">
                <div className="min-w-0">
                  <p className="text-[10.5px] font-bold tracking-wide text-cyan">الآن على الهواء</p>
                  <p className="clamp-1 mt-0.5 text-[15px] font-extrabold text-white md:text-[18px]">{air.current.title}</p>
                  {air.current.host && <p className="clamp-1 text-[11.5px] text-white/70">تقديم: {air.current.host}</p>}
                </div>
                <div className="hidden shrink-0 text-left sm:block">
                  <p className="text-[10px] text-white/60">التالي</p>
                  <p className="text-[11.5px] text-white/85">
                    <span className="ltr-num">{fmtSlot(air.next.start)}</span> — {air.next.title}
                  </p>
                </div>
              </div>
            )}
          </>
        ) : failed ? (
          <div className="grid h-full place-items-center p-6 text-center">
            <div>
              <LogoMark size="lg" />
              <p className="mt-4 text-[15px] font-extrabold text-white">تعذّر تشغيل البثّ داخل الصفحة</p>
              <p className="mt-2 text-[12.5px] text-white/70">
                قد يكون البثّ قد انتهى أو أن التضمين غير متاح حالياً.
              </p>
              <a
                href={YT_LIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="focusable mt-5 inline-flex items-center gap-2 rounded-full bg-onair px-5 py-2.5 text-[12.5px] font-extrabold text-white transition hover:brightness-110"
              >
                فتح البثّ على YouTube
              </a>
            </div>
          </div>
        ) : (
          <iframe
            src={YT_LIVE_EMBED}
            title="البثّ المباشر لقناة الفرات الفضائية"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            onError={() => setFailed(true)}
            className="absolute inset-0 h-full w-full border-0"
          />
        )}
      </div>

      {/* شريط معلومات البثّ — معلومات حقيقية فقط */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-2)] px-3.5 py-2.5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <span className="flex items-center gap-1.5 text-[11.5px] font-bold text-onair">
            <span className="size-[5px] rounded-full bg-onair" style={{ animation: "pulse-dot 2s infinite" }} />
            بثّ رسمي
          </span>
          <span className="ltr-num text-[11px] text-[color:var(--fg-3)]">NILESAT 201 · 11746 V · 27500 3/4</span>
          {air && (
            <span className="text-[11.5px] text-[color:var(--fg-2)]">
              <span className="sm:hidden">الآن: {air.current.title} · </span>
              {KIND_LABEL[air.current.kind]} · يتبقّى {minutesLabel(air.remaining)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!compact && (
            <Link
              href="/live"
              className="focusable rounded-full border border-[color:var(--line-2)] px-3.5 py-1.5 text-[12px] font-bold text-[color:var(--fg-2)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
            >
              صفحة البثّ
            </Link>
          )}
          <a
            href={YT_LIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="focusable inline-flex items-center gap-1.5 rounded-full bg-onair/90 px-3.5 py-1.5 text-[12px] font-bold text-white transition hover:bg-onair"
          >
            <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path d="M9.5 5.5l4.2 2.4-4.2 2.4V5.5z M2 8c0-2.1.2-3 .6-3.5.4-.5 1-.7 1.8-.8C5.6 3.6 7.6 3.5 10 3.5s4.4.1 5.6.2c.8.1 1.4.3 1.8.8.4.5.6 1.4.6 3.5s-.2 3-.6 3.5c-.4.5-1 .7-1.8.8-1.2.1-3.2.2-5.6.2s-4.4-.1-5.6-.2c-.8-.1-1.4-.3-1.8-.8C2.2 11 2 10.1 2 8z" />
            </svg>
            المشاهدة على YouTube
          </a>
        </div>
      </div>
    </div>
  );
}
