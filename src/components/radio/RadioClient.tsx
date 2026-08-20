"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { SignalRings } from "@/components/brand/SignalRings";
import { SectionHead } from "@/components/ui/Bits";
import { RADIO, RADIO_PLAYLIST, RADIO_KIND_LABEL } from "@/data/radio";
import { ytImage, ytUrl, YT_CHANNEL } from "@/data/media";
import { useRadioEngine, Equalizer, fmtTime } from "./RadioPlayer";
import { cx } from "@/lib/format";

export function RadioClient() {
  const [index, setIndex] = useState(0);
  const track = RADIO_PLAYLIST[index];
  const [r, hostRef] = useRadioEngine(RADIO_PLAYLIST, index, setIndex);

  const started = r.status !== "idle";
  const failed = r.status === "error";
  const progress = r.duration > 0 ? r.time / r.duration : 0;

  return (
    <div>
      {/* ══ المشغّل ══ */}
      <header className="zone-dark relative overflow-hidden">
        {/* طبقة الفيديو — ضبابية ومعتمة خلف الواجهة */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            ref={hostRef}
            className={cx(
              "absolute left-1/2 top-1/2 aspect-16/9 w-[190%] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000 [&_iframe]:h-full [&_iframe]:w-full",
              r.playing ? "opacity-[.22]" : "opacity-0",
            )}
            style={{ filter: "blur(38px) saturate(150%) brightness(.62)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-midnight/70 via-midnight/45 to-midnight/85" />
        </div>

        <SignalRings
          className="left-1/2 top-0 size-[780px] -translate-x-1/2 -translate-y-1/3 opacity-40"
          rings={6}
          animated={r.playing}
        />

        <div className="shell relative py-8 md:py-12">
          <nav className="mb-4 flex items-center gap-2 text-[12.5px] text-[color:var(--fg-3)]">
            <Link href="/" className="focusable hover:text-cyan">الرئيسية</Link>
            <span className="opacity-40">/</span><span>الإذاعة</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-center">
            {/* القرص */}
            <div className="relative mx-auto grid size-36 place-items-center rounded-full border border-[color:var(--line-2)] bg-midnight/60 md:size-44 lg:mx-0">
              <span
                aria-hidden
                className="absolute inset-0 rounded-full border-2 border-cyan/20"
                style={{ animation: r.playing ? "spin-slow 14s linear infinite" : undefined, borderTopColor: "var(--color-cyan)" }}
              />
              <LogoMark size="xl" />
            </div>

            <div className="min-w-0">
              <h1 className="silver-text text-[30px] font-extrabold md:text-[42px]">{RADIO.name}</h1>
              <p className="mt-1.5 text-[14px] text-[color:var(--fg-2)]">{RADIO.fullName}</p>

              {/* التردّدات */}
              <div className="mt-4 flex flex-wrap gap-2.5">
                {RADIO.frequencies.map((f) => (
                  <div key={f.city} className="rounded-xl border border-cyan/35 bg-cyan/10 px-4 py-2.5">
                    <p className="text-[11.5px] font-bold text-[color:var(--fg-2)]">{f.city}</p>
                    <p className="ltr-num mt-0.5 text-[19px] font-extrabold text-cyan">
                      {f.freq} <span className="text-[13px]">{RADIO.band}</span>
                    </p>
                  </div>
                ))}
              </div>

              {!started && (
                <div className="mt-6 flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={r.start}
                    className="focusable inline-flex items-center gap-2.5 rounded-full bg-gradient-to-l from-broadcast to-cyan px-7 py-3.5 text-[14px] font-extrabold text-midnight shadow-[0_0_44px_-10px_var(--color-cyan)] transition hover:brightness-110"
                  >
                    <svg width="17" height="17" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                      <path d="M5.5 3.4l11 6.6-11 6.6V3.4z" />
                    </svg>
                    استمع الآن
                  </button>
                  <Link href="/live"
                    className="focusable rounded-full border border-[color:var(--line-2)] px-5 py-3 text-[12.5px] font-bold text-[color:var(--fg-2)] transition hover:border-cyan hover:text-cyan">
                    تلفزيون الفرات المباشر
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* ══ لوحة المشغّل ══ */}
          <div className="glass mt-9 overflow-hidden rounded-2xl border border-[color:var(--line)] p-5 md:p-6">
            {failed ? (
              <div className="py-4 text-center">
                <p className="text-[15px] font-extrabold text-[color:var(--fg)]">
                  تعذّر تشغيل الصوت داخل الصفحة
                </p>
                <p className="mt-2 text-[12.5px] text-[color:var(--fg-2)]">
                  يمكنك متابعة الاستماع من قناة الفرات الرسمية أو من صفحة الإذاعة.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2.5">
                  <a
                    href={ytUrl(track.yt)}
                    target="_blank" rel="noopener noreferrer"
                    className="focusable inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-broadcast to-cyan px-5 py-2.5 text-[12.5px] font-extrabold text-midnight transition hover:brightness-110"
                  >
                    فتح «{track.show}» على قناة الفرات
                  </a>
                  <a
                    href={RADIO.official}
                    target="_blank" rel="noopener noreferrer"
                    className="focusable rounded-full border border-[color:var(--line-2)] px-5 py-2.5 text-[12.5px] font-bold text-[color:var(--fg-2)] transition hover:border-cyan hover:text-cyan"
                  >
                    صفحة إذاعة الفرات
                  </a>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-4 md:gap-5">
                  {/* غلاف المقطع الجاري */}
                  <div className="relative aspect-16/9 w-32 shrink-0 overflow-hidden rounded-xl bg-midnight ring-1 ring-white/10 sm:w-40">
                    <Image
                      src={ytImage(track.yt)}
                      alt={track.title}
                      fill
                      priority
                      sizes="160px"
                      className="object-cover"
                    />
                    {r.playing && <span aria-hidden className="absolute inset-0 bg-cyan/10" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 text-[11px] font-bold text-cyan">
                      <span
                        className="size-[6px] rounded-full bg-cyan"
                        style={{ animation: r.playing ? "pulse-dot 1.8s infinite" : undefined }}
                      />
                      {track.show}
                      <span className="rounded bg-white/8 px-1.5 py-[2px] text-[10px] font-bold text-[color:var(--fg-2)]">
                        {RADIO_KIND_LABEL[track.kind]}
                      </span>
                    </p>
                    <p className="clamp-2 mt-1.5 text-[16px] font-extrabold leading-[1.5] text-[color:var(--fg)] md:text-[18px]">
                      {track.title}
                    </p>
                    {track.host && (
                      <p className="mt-1 text-[12px] text-[color:var(--fg-2)]">{track.host}</p>
                    )}
                  </div>

                  <Equalizer active={r.playing} bars={44} className="hidden h-12 w-40 lg:flex" />
                </div>

                {/* شريط التقدّم */}
                <div className="mt-5">
                  <input
                    type="range"
                    min={0} max={1000} step={1}
                    value={Math.round(progress * 1000)}
                    onChange={(e) => r.seek(+e.target.value / 1000)}
                    disabled={!r.duration}
                    aria-label="موضع التشغيل"
                    className="radio-range h-1.5 w-full cursor-pointer appearance-none rounded-full disabled:cursor-default"
                    style={{
                      background: `linear-gradient(to left, var(--color-cyan) ${progress * 100}%, rgba(255,255,255,.14) ${progress * 100}%)`,
                    }}
                  />
                  <div className="mt-2 flex items-center justify-between text-[11px] text-[color:var(--fg-3)]">
                    <span className="ltr-num">{fmtTime(r.time)}</span>
                    <span className="ltr-num">{r.duration ? fmtTime(r.duration) : "--:--"}</span>
                  </div>
                </div>

                {/* الأزرار */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[color:var(--line)] pt-4">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={r.prev}
                      aria-label="المقطع السابق"
                      className="focusable grid size-10 place-items-center rounded-full border border-[color:var(--line-2)] text-[color:var(--fg-2)] transition hover:border-cyan hover:text-cyan"
                    >
                      <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor"><path d="M15 4v12L7 10l8-6zM6 4h2v12H6V4z" /></svg>
                    </button>

                    <button
                      onClick={r.toggle}
                      aria-label={r.playing ? "إيقاف مؤقت" : "استمع الآن"}
                      className="focusable grid size-14 shrink-0 place-items-center rounded-full bg-gradient-to-l from-broadcast to-cyan text-midnight shadow-[0_0_34px_-10px_var(--color-cyan)] transition hover:brightness-110"
                    >
                      {r.status === "loading" ? (
                        <span
                          aria-hidden
                          className="size-5 rounded-full border-2 border-midnight/30 border-t-midnight"
                          style={{ animation: "spin-slow .8s linear infinite" }}
                        />
                      ) : r.playing ? (
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><rect x="5.4" y="3.2" width="3.2" height="13.6" rx="1.2" /><rect x="11.4" y="3.2" width="3.2" height="13.6" rx="1.2" /></svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path d="M5.5 3.4l11 6.6-11 6.6V3.4z" /></svg>
                      )}
                    </button>

                    <button
                      onClick={r.next}
                      aria-label="المقطع التالي"
                      className="focusable grid size-10 place-items-center rounded-full border border-[color:var(--line-2)] text-[color:var(--fg-2)] transition hover:border-cyan hover:text-cyan"
                    >
                      <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4l8 6-8 6V4zM12 4h2v12h-2V4z" /></svg>
                    </button>
                  </div>

                  <Equalizer active={r.playing} bars={28} className="h-9 min-w-[120px] flex-1 lg:hidden" />

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={r.toggleMute}
                      aria-label={r.muted ? "إلغاء الكتم" : "كتم الصوت"}
                      className="focusable grid size-9 place-items-center rounded-full text-[color:var(--fg-2)] transition hover:text-cyan"
                    >
                      {r.muted ? (
                        <svg width="17" height="17" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M4 7.6h2.7L10.4 4v12L6.7 12.4H4V7.6z" />
                          <path d="M13.2 8.2l3.6 3.6M16.8 8.2l-3.6 3.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                        </svg>
                      ) : (
                        <svg width="17" height="17" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M4 7.6h2.7L10.4 4v12L6.7 12.4H4V7.6zm9.1.3a3.4 3.4 0 010 4.2l1.2 1a5 5 0 000-6.2l-1.2 1z" />
                        </svg>
                      )}
                    </button>
                    <input
                      type="range" min={0} max={1} step={0.01}
                      value={r.muted ? 0 : r.volume}
                      onChange={(e) => r.setVolume(+e.target.value)}
                      aria-label="مستوى الصوت"
                      className="radio-range h-1 w-24 cursor-pointer appearance-none rounded-full sm:w-28"
                      style={{
                        background: `linear-gradient(to left, var(--color-cyan) ${(r.muted ? 0 : r.volume) * 100}%, rgba(255,255,255,.14) ${(r.muted ? 0 : r.volume) * 100}%)`,
                      }}
                    />
                    <span className="num w-9 text-[11px] text-[color:var(--fg-3)]">
                      {Math.round((r.muted ? 0 : r.volume) * 100)}%
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ══ قائمة التشغيل ══ */}
      <section className="zone-light shell py-9 md:py-11">
        <SectionHead
          title="قائمة الاستماع"
          sub="حلقات وبرامج من قناة الفرات الرسمية"
          href="/programs"
          hrefLabel="دليل البرامج"
        />

        <ol className="card overflow-hidden rounded-2xl">
          {RADIO_PLAYLIST.map((t, i) => {
            const active = i === index;
            return (
              <li key={t.yt}>
                <button
                  onClick={() => r.select(i)}
                  aria-current={active}
                  className={cx(
                    "focusable flex w-full items-center gap-3.5 border-b border-[color:var(--line)] px-3.5 py-3 text-right transition last:border-0",
                    active ? "bg-[color:var(--accent)]/[.07]" : "hover:bg-[color:var(--surface-2)]",
                  )}
                >
                  <span className="relative aspect-16/9 w-24 shrink-0 overflow-hidden rounded-lg bg-midnight sm:w-28">
                    <Image
                      src={ytImage(t.yt)}
                      alt=""
                      fill
                      loading="lazy"
                      sizes="112px"
                      className="object-cover"
                    />
                    {active && r.playing && (
                      <span className="absolute inset-0 grid place-items-center bg-black/45">
                        <Equalizer active bars={7} className="h-5 w-8" />
                      </span>
                    )}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className={cx("text-[11.5px] font-extrabold", active ? "text-[color:var(--accent)]" : "text-[color:var(--fg-3)]")}>
                        {t.show}
                      </span>
                      <span className="rounded bg-[color:var(--surface-2)] px-1.5 py-[2px] text-[10px] font-bold text-[color:var(--fg-3)]">
                        {RADIO_KIND_LABEL[t.kind]}
                      </span>
                    </span>
                    <span className="clamp-2 mt-1 block text-[13.5px] font-bold leading-[1.55] text-[color:var(--fg)]">
                      {t.title}
                    </span>
                    {t.host && (
                      <span className="mt-0.5 block text-[11.5px] text-[color:var(--fg-3)]">{t.host}</span>
                    )}
                  </span>

                  <span className={cx(
                    "grid size-9 shrink-0 place-items-center rounded-full border transition",
                    active
                      ? "border-[color:var(--accent)] bg-[color:var(--accent)] text-white"
                      : "border-[color:var(--line-2)] text-[color:var(--fg-3)]",
                  )}>
                    {active && r.playing
                      ? <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor"><rect x="5.4" y="3.2" width="3.2" height="13.6" rx="1.2" /><rect x="11.4" y="3.2" width="3.2" height="13.6" rx="1.2" /></svg>
                      : <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor"><path d="M5.5 3.4l11 6.6-11 6.6V3.4z" /></svg>}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="mt-6 flex flex-wrap gap-2.5">
          <a
            href={RADIO.official}
            target="_blank" rel="noopener noreferrer"
            className="focusable inline-flex items-center gap-2 rounded-full border border-[color:var(--line-2)] px-5 py-2.5 text-[12.5px] font-bold text-[color:var(--fg-2)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
          >
            صفحة إذاعة الفرات
          </a>
          <a
            href={YT_CHANNEL}
            target="_blank" rel="noopener noreferrer"
            className="focusable inline-flex items-center gap-2 rounded-full border border-[color:var(--line-2)] px-5 py-2.5 text-[12.5px] font-bold text-[color:var(--fg-2)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
          >
            قناة الفرات على YouTube
          </a>
        </div>
      </section>
    </div>
  );
}
