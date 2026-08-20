"use client";

import { useState } from "react";
import { Poster } from "@/components/ui/Media";
import { CATEGORY_MAP } from "@/data/categories";
import { latest, byCategory, bySlug, articleImage, type Article } from "@/data/news";
import { SHORTS, shortImage } from "@/data/shorts";
import { RADIO } from "@/data/radio";
import { PROGRAMS, programCover } from "@/data/programs";
import { YT_LIVE_ID, ytImage } from "@/data/media";
import { APP_ALERTS, ALERT_META, type ScreenKey, type Device } from "@/data/apps";
import { relativeTime, compactViews, duration, cx } from "@/lib/format";

export interface ScreenState {
  screen: ScreenKey;
  articleSlug?: string;
  shortIndex: number;
  saved: string[];
  readAlerts: string[];
}

interface Props {
  device: Device;
  st: ScreenState;
  set: (patch: Partial<ScreenState>) => void;
  go: (screen: ScreenKey, extra?: Partial<ScreenState>) => void;
  back: () => void;
  canBack: boolean;
}

/* ═════════ عناصر مشتركة ═════════ */

function TopBar({ title, back, canBack, accent }: { title: string; back: () => void; canBack: boolean; accent: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5">
      {canBack && (
        <button onClick={back} aria-label="رجوع"
          className="focusable grid size-7 shrink-0 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M4.5 2.5L8 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
      <span className="truncate text-[12.5px] font-extrabold text-white">{title}</span>
      <span className="mr-auto size-1.5 rounded-full" style={{ background: accent }} />
    </div>
  );
}

function Row({ a, onOpen, saved, onSave }: {
  a: Article; onOpen: () => void; saved: boolean; onSave: () => void;
}) {
  const cat = CATEGORY_MAP[a.category];
  return (
    <div className="flex gap-2.5 border-b border-white/8 px-3 py-2.5">
      <button onClick={onOpen} className="focusable flex min-w-0 flex-1 gap-2.5 text-right">
        <span className="relative aspect-16/9 w-[76px] shrink-0 overflow-hidden rounded-md bg-midnight">
          <Poster src={articleImage(a)} alt={a.title} sizes="76px" zoom={false} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[9px] font-extrabold" style={{ color: cat.accent }}>{cat.short}</span>
          <span className="clamp-2 mt-0.5 block text-[10.5px] font-bold leading-[1.5] text-white">{a.title}</span>
          <span className="mt-0.5 block text-[8.5px] text-white/45">{relativeTime(a.agoMin)}</span>
        </span>
      </button>
      <button onClick={onSave} aria-label={saved ? "إزالة من المحفوظة" : "حفظ"}
        className={cx("focusable mt-1 grid size-6 shrink-0 place-items-center self-start rounded-full transition",
          saved ? "bg-cyan text-midnight" : "bg-white/10 text-white/60 hover:bg-white/20")}>
        <svg width="10" height="10" viewBox="0 0 16 16" fill={saved ? "currentColor" : "none"}>
          <path d="M4 2.5h8v11l-4-2.8-4 2.8v-11z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

/* ═════════ الشاشات ═════════ */

export function HomeScreen({ st, set, go }: Props) {
  const feed = latest(7);
  const lead = feed[0];
  const rest = feed.slice(1);
  const toggle = (slug: string) =>
    set({ saved: st.saved.includes(slug) ? st.saved.filter((s) => s !== slug) : [...st.saved, slug] });

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2.5">
        <span className="flex items-center gap-1.5">
          <span className="ltr-num text-[10px] font-extrabold tracking-widest text-white/70">ALFORAT</span>
          <span className="rounded-[3px] bg-gold px-1 text-[7.5px] font-extrabold text-midnight">HD</span>
        </span>
        <button onClick={() => go("alerts")} aria-label="التنبيهات"
          className="focusable relative grid size-7 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M8 2.2a4 4 0 00-4 4v2.4L2.8 11.4h10.4L12 8.6V6.2a4 4 0 00-4-4zM6.4 12.8a1.6 1.6 0 003.2 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {st.readAlerts.length < APP_ALERTS.length && (
            <span className="absolute -left-0.5 -top-0.5 grid size-3.5 place-items-center rounded-full bg-onair text-[7px] font-extrabold text-white">
              {APP_ALERTS.length - st.readAlerts.length}
            </span>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* شريط عاجل */}
        <div className="flex items-center gap-1.5 bg-onair/90 px-3 py-1.5">
          <span className="text-[8.5px] font-extrabold text-white">عاجل</span>
          <span className="clamp-1 text-[9px] text-white/95">الرئاسات الأربع تبحث استكمال الكابينة وحصر السلاح</span>
        </div>

        {/* بطاقة البثّ */}
        <button onClick={() => go("live")} className="focusable relative block aspect-16/9 w-full overflow-hidden">
          <Poster src={ytImage(YT_LIVE_ID)} alt="بثّ الفرات المباشر" sizes="380px" zoom={false} />
          <span className="scrim absolute inset-0" />
          <span className="absolute right-2 top-2 flex items-center gap-1 rounded bg-onair px-1.5 py-[2px]">
            <span className="size-[3.5px] rounded-full bg-white" style={{ animation: "pulse-dot 1.8s infinite" }} />
            <span className="text-[8px] font-extrabold text-white">مباشر</span>
          </span>
          <span className="absolute inset-x-0 bottom-0 p-2.5 text-right">
            <span className="block text-[11px] font-extrabold text-white">تلفزيون الفرات المباشر</span>
          </span>
        </button>

        {/* الخبر الرئيس */}
        {lead && (
          <button onClick={() => go("article", { articleSlug: lead.slug })} className="focusable block w-full text-right">
            <span className="relative block aspect-16/9 overflow-hidden">
              <Poster src={articleImage(lead)} alt={lead.title} sizes="380px" zoom={false} />
            </span>
            <span className="block px-3 py-2.5">
              <span className="block text-[9px] font-extrabold" style={{ color: CATEGORY_MAP[lead.category].accent }}>
                {CATEGORY_MAP[lead.category].short}
              </span>
              <span className="clamp-3 mt-1 block text-[12px] font-extrabold leading-[1.5] text-white">{lead.title}</span>
              <span className="mt-1 block text-[8.5px] text-white/45">{relativeTime(lead.agoMin)}</span>
            </span>
          </button>
        )}

        {rest.map((a) => (
          <Row key={a.slug} a={a} onOpen={() => go("article", { articleSlug: a.slug })}
            saved={st.saved.includes(a.slug)} onSave={() => toggle(a.slug)} />
        ))}
        <div className="h-3" />
      </div>
    </div>
  );
}

export function ArticleScreen({ st, set, go, back, canBack, device }: Props) {
  const a = st.articleSlug ? bySlug(st.articleSlug) : undefined;
  if (!a) return <div className="grid h-full place-items-center text-[11px] text-white/50">لا خبر محدّد</div>;
  const cat = CATEGORY_MAP[a.category];
  const isSaved = st.saved.includes(a.slug);
  const related = byCategory(a.category).filter((x) => x.slug !== a.slug && (x.yt || x.photo)).slice(0, 2);

  return (
    <div className="flex h-full flex-col">
      <TopBar title={cat.name} back={back} canBack={canBack} accent={device.ui.accent} />
      <div className="flex-1 overflow-y-auto">
        <div className="relative aspect-16/9 overflow-hidden">
          <Poster src={articleImage(a)} alt={a.title} sizes="380px" zoom={false} />
        </div>
        <div className="px-3 py-3">
          <span className="rounded px-1.5 py-[2px] text-[8.5px] font-extrabold text-white" style={{ background: cat.accent }}>
            {cat.short}
          </span>
          <h3 className="mt-2 text-[13px] font-extrabold leading-[1.5] text-white">{a.title}</h3>
          <p className="mt-1 text-[8.5px] text-white/45">{a.desk} · {relativeTime(a.agoMin)}</p>
          {a.lede && <p className="mt-2.5 text-[10.5px] leading-[1.85] text-white/75">{a.lede}</p>}
          {a.body.slice(0, 2).map((t, i) => (
            <p key={i} className="mt-2.5 text-[10.5px] leading-[1.85] text-white/65">{t}</p>
          ))}
          {a.archiveOnly && (
            <p className="mt-2.5 rounded-lg bg-white/8 p-2.5 text-[9.5px] leading-relaxed text-white/60">
              النصّ الكامل على الموقع الرسمي للفرات نيوز.
            </p>
          )}

          <div className="mt-3.5 flex gap-2">
            <button
              onClick={() => set({ saved: isSaved ? st.saved.filter((s) => s !== a.slug) : [...st.saved, a.slug] })}
              className={cx("focusable flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-[10px] font-extrabold transition",
                isSaved ? "bg-cyan text-midnight" : "bg-white/10 text-white")}>
              <svg width="10" height="10" viewBox="0 0 16 16" fill={isSaved ? "currentColor" : "none"}>
                <path d="M4 2.5h8v11l-4-2.8-4 2.8v-11z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
              {isSaved ? "محفوظ" : "حفظ"}
            </button>
            <button onClick={() => go("saved")} className="focusable rounded-lg bg-white/10 px-3 py-2 text-[10px] font-extrabold text-white">
              المحفوظة
            </button>
          </div>

          {related.length > 0 && (
            <>
              <p className="mt-4 text-[9.5px] font-extrabold text-white/50">ذات صلة</p>
              <div className="mt-1.5 space-y-2">
                {related.map((r) => (
                  <button key={r.slug} onClick={() => go("article", { articleSlug: r.slug })}
                    className="focusable flex w-full gap-2 text-right">
                    <span className="relative aspect-16/9 w-[64px] shrink-0 overflow-hidden rounded bg-midnight">
                      <Poster src={articleImage(r)} alt={r.title} sizes="64px" zoom={false} />
                    </span>
                    <span className="clamp-2 text-[9.5px] font-bold leading-[1.5] text-white/85">{r.title}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="h-3" />
      </div>
    </div>
  );
}

export function LiveScreen({ back, canBack, device }: Props) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="flex h-full flex-col">
      <TopBar title="تلفزيون الفرات" back={back} canBack={canBack} accent={device.ui.accent} />
      <div className="flex-1 overflow-y-auto">
        <div className="relative aspect-16/9 overflow-hidden bg-midnight">
          <Poster src={ytImage(YT_LIVE_ID)} alt="بثّ الفرات المباشر" sizes="380px" zoom={false} />
          <span className="scrim-soft absolute inset-0" />
          <button onClick={() => setPlaying((v) => !v)} aria-label={playing ? "إيقاف" : "تشغيل البثّ"}
            className="focusable absolute inset-0 grid place-items-center">
            <span className={cx("grid size-11 place-items-center rounded-full text-white transition",
              playing ? "bg-white/15 ring-1 ring-white/30" : "bg-onair shadow-[0_0_28px_-4px_rgba(255,45,70,.9)]")}>
              {playing
                ? <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor"><rect x="5.4" y="3.2" width="3.2" height="13.6" rx="1.2" /><rect x="11.4" y="3.2" width="3.2" height="13.6" rx="1.2" /></svg>
                : <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor"><path d="M5.5 3.4l11 6.6-11 6.6V3.4z" /></svg>}
            </span>
          </button>
          <span className="absolute right-2 top-2 flex items-center gap-1 rounded bg-onair px-1.5 py-[2px]">
            <span className="size-[3.5px] rounded-full bg-white" style={{ animation: "pulse-dot 1.8s infinite" }} />
            <span className="text-[8px] font-extrabold text-white">مباشر</span>
          </span>
        </div>
        <div className="px-3 py-3">
          <p className="text-[11.5px] font-extrabold text-white">قناة الفرات الفضائية — البثّ الرسمي</p>
          <p className="ltr-num mt-1 text-[8.5px] text-white/45">NILESAT 201 · 11746 V · 27500 3/4</p>
          <p className="mt-2 rounded-lg bg-white/8 p-2.5 text-[9.5px] leading-relaxed text-white/60">
            {playing ? "البثّ المباشر يعمل داخل التطبيق." : "اضغط للتشغيل."}
          </p>

          <p className="mt-3.5 text-[9.5px] font-extrabold text-white/50">الشبكة اليومية الثابتة</p>
          <div className="mt-1.5 space-y-1.5">
            {PROGRAMS.filter((p) => p.airtime && p.airtime.time.includes(":")).slice(0, 4).map((p) => (
              <div key={p.slug} className="flex items-center gap-2 rounded-lg bg-white/6 p-1.5">
                <span className="relative aspect-16/9 w-[54px] shrink-0 overflow-hidden rounded bg-midnight">
                  <Poster src={programCover(p)} alt={p.title} sizes="54px" zoom={false} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="clamp-1 block text-[9.5px] font-bold text-white">{p.title}</span>
                  <span className="ltr-num block text-[8.5px] text-cyan">{p.airtime!.time}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="h-3" />
      </div>
    </div>
  );
}

export function ShortsScreen({ st, set, back, canBack }: Props) {
  const s = SHORTS[st.shortIndex % SHORTS.length];
  const cat = CATEGORY_MAP[s.category];
  const move = (d: 1 | -1) =>
    set({ shortIndex: (st.shortIndex + d + SHORTS.length) % SHORTS.length });

  return (
    <div className="relative h-full bg-black">
      <Poster src={shortImage(s)} alt={s.title} sizes="380px" zoom={false} />
      <div className="scrim absolute inset-0" />

      <div className="absolute inset-x-0 top-0 flex items-center gap-2 p-2.5">
        {canBack && (
          <button onClick={back} aria-label="رجوع" className="focusable grid size-6 place-items-center rounded-full bg-black/45 text-white">
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M4.5 2.5L8 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        )}
        <span className="text-[10.5px] font-extrabold text-white">الفرات Shorts</span>
        <span className="ltr-num mr-auto rounded bg-black/50 px-1.5 py-[2px] text-[8px] text-white/80">
          {duration(s.duration)}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-3">
        <span className="rounded px-1.5 py-[2px] text-[8px] font-extrabold text-white" style={{ background: cat.accent }}>
          {cat.short}
        </span>
        <p className="clamp-3 mt-1.5 text-[10.5px] font-extrabold leading-[1.55] text-white">{s.title}</p>
        <p className="mt-1 text-[8.5px] text-white/50">
          <span className="num">{compactViews(s.views)}</span> مشاهدة
        </p>
      </div>

      <div className="absolute bottom-16 left-2 flex flex-col gap-2.5">
        <button onClick={() => move(-1)} aria-label="السابق"
          className="focusable grid size-8 place-items-center rounded-full bg-black/45 text-white ring-1 ring-white/20">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M4 10l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button onClick={() => move(1)} aria-label="التالي"
          className="focusable grid size-8 place-items-center rounded-full bg-black/45 text-white ring-1 ring-white/20">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>

      <div className="absolute inset-x-0 top-9 flex gap-[2px] px-2.5">
        {SHORTS.slice(0, 12).map((_, i) => (
          <span key={i} className={cx("h-[2px] flex-1 rounded-full", i <= st.shortIndex % 12 ? "bg-cyan" : "bg-white/25")} />
        ))}
      </div>
    </div>
  );
}

export function RadioScreen({ back, canBack, device }: Props) {
  return (
    <div className="flex h-full flex-col">
      <TopBar title="إذاعة الفرات" back={back} canBack={canBack} accent={device.ui.accent} />
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="rounded-2xl bg-gradient-to-b from-navy/80 to-midnight p-4 text-center ring-1 ring-white/10">
          <p className="silver-text text-[16px] font-extrabold">إذاعة الفرات</p>
          <div className="mt-3 space-y-2">
            {RADIO.frequencies.map((f) => (
              <div key={f.city} className="rounded-xl bg-cyan/12 px-3 py-2 ring-1 ring-cyan/30">
                <p className="text-[9px] font-bold text-white/70">{f.city}</p>
                <p className="ltr-num text-[15px] font-extrabold text-cyan">{f.freq} {RADIO.band}</p>
              </div>
            ))}
          </div>
          <a href={RADIO.official} target="_blank" rel="noopener noreferrer"
            className="focusable mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-l from-broadcast to-cyan py-2.5 text-[10.5px] font-extrabold text-midnight">
            استمع الآن
          </a>
        </div>
      </div>
    </div>
  );
}

export function AlertsScreen({ st, set, go, back, canBack, device }: Props) {
  const markAll = () => set({ readAlerts: APP_ALERTS.map((a) => a.id) });
  return (
    <div className="flex h-full flex-col">
      <TopBar title="التنبيهات" back={back} canBack={canBack} accent={device.ui.accent} />
      <div className="flex items-center justify-between border-b border-white/8 px-3 py-2">
        <span className="text-[9px] text-white/50">
          <span className="num">{APP_ALERTS.length - st.readAlerts.length}</span> غير مقروء
        </span>
        <button onClick={markAll} className="focusable text-[9px] font-extrabold text-cyan">تعليم الكل كمقروء</button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {APP_ALERTS.map((al) => {
          const meta = ALERT_META[al.kind];
          const read = st.readAlerts.includes(al.id);
          return (
            <button
              key={al.id}
              onClick={() => {
                set({ readAlerts: read ? st.readAlerts : [...st.readAlerts, al.id] });
                go(al.opens, al.ref ? { articleSlug: al.ref } : undefined);
              }}
              className={cx("focusable flex w-full items-start gap-2.5 border-b border-white/8 px-3 py-2.5 text-right transition",
                read ? "opacity-55" : "bg-white/[.04]")}
            >
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-[7.5px] font-extrabold text-white"
                style={{ background: meta.color }}>
                {meta.label.slice(0, 2)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10.5px] font-extrabold text-white">{al.title}</span>
                <span className="clamp-2 mt-0.5 block text-[9.5px] leading-[1.5] text-white/60">{al.body}</span>
                <span className="mt-0.5 block text-[8px] text-white/35">{relativeTime(al.agoMin)}</span>
              </span>
              {!read && <span className="mt-2 size-1.5 shrink-0 rounded-full bg-cyan" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function SavedScreen({ st, set, go, back, canBack, device }: Props) {
  const items = st.saved.map((s) => bySlug(s)).filter(Boolean) as Article[];
  return (
    <div className="flex h-full flex-col">
      <TopBar title="المحفوظة" back={back} canBack={canBack} accent={device.ui.accent} />
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="grid h-full place-items-center px-6 text-center">
            <div>
              <span className="mx-auto grid size-11 place-items-center rounded-full bg-white/8 text-white/40">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 2.5h8v11l-4-2.8-4 2.8v-11z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </span>
              <p className="mt-2.5 text-[10.5px] font-bold text-white/70">لا مواد محفوظة</p>
              <p className="mt-1 text-[9px] text-white/40">احفظ خبراً من الرئيسية ليظهر هنا</p>
              <button onClick={() => go("home")} className="focusable mt-3 rounded-lg bg-cyan px-3.5 py-1.5 text-[9.5px] font-extrabold text-midnight">
                تصفّح الأخبار
              </button>
            </div>
          </div>
        ) : (
          items.map((a) => (
            <Row key={a.slug} a={a} onOpen={() => go("article", { articleSlug: a.slug })}
              saved onSave={() => set({ saved: st.saved.filter((s) => s !== a.slug) })} />
          ))
        )}
      </div>
    </div>
  );
}
