"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { SectionHead } from "@/components/ui/Bits";
import { SignalRings } from "@/components/brand/SignalRings";
import { DEVICES, TABS, deviceByKey, type DeviceKey, type ScreenKey } from "@/data/apps";
import {
  HomeScreen, ArticleScreen, LiveScreen, ShortsScreen,
  RadioScreen, AlertsScreen, SavedScreen, type ScreenState,
} from "./PhoneScreens";
import { clock, cx } from "@/lib/format";

const SCREEN_TITLE: Record<ScreenKey, string> = {
  home: "الرئيسية", article: "صفحة الخبر", live: "البثّ المباشر",
  shorts: "Shorts", radio: "الإذاعة", alerts: "التنبيهات", saved: "المحفوظة",
};

export function AppsClient() {
  const [deviceKey, setDeviceKey] = useState<DeviceKey>("ios");
  const device = deviceByKey(deviceKey);

  const [st, setSt] = useState<ScreenState>({
    screen: "home", shortIndex: 0, saved: [], readAlerts: [],
  });
  const [stack, setStack] = useState<ScreenKey[]>([]);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = window.setTimeout(tick, 0);
    const t = window.setInterval(tick, 30_000);
    return () => { window.clearTimeout(first); window.clearInterval(t); };
  }, []);

  const set = useCallback((patch: Partial<ScreenState>) => setSt((v) => ({ ...v, ...patch })), []);

  const go = useCallback((screen: ScreenKey, extra?: Partial<ScreenState>) => {
    setStack((s) => [...s, st.screen]);
    setSt((v) => ({ ...v, screen, ...(extra ?? {}) }));
  }, [st.screen]);

  const back = useCallback(() => {
    setStack((s) => {
      if (!s.length) return s;
      const prev = s[s.length - 1];
      setSt((v) => ({ ...v, screen: prev }));
      return s.slice(0, -1);
    });
  }, []);

  const tab = useCallback((screen: ScreenKey) => {
    setStack([]);
    setSt((v) => ({ ...v, screen }));
  }, []);

  const props = { device, st, set, go, back, canBack: stack.length > 0 };
  const ui = device.ui;

  const body = (() => {
    switch (st.screen) {
      case "home":    return <HomeScreen {...props} />;
      case "article": return <ArticleScreen {...props} />;
      case "live":    return <LiveScreen {...props} />;
      case "shorts":  return <ShortsScreen {...props} />;
      case "radio":   return <RadioScreen {...props} />;
      case "alerts":  return <AlertsScreen {...props} />;
      case "saved":   return <SavedScreen {...props} />;
    }
  })();

  return (
    <div>
      {/* ══ الترويسة + الجهاز ══ */}
      <section className="zone-dark relative overflow-hidden">
        <SignalRings className="left-1/2 top-0 size-[820px] -translate-x-1/2 -translate-y-1/3 opacity-35" rings={6} />

        <div className="shell relative grid gap-9 py-8 md:py-12 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-12">
          <div className="min-w-0">
            <nav className="mb-3 flex items-center gap-2 text-[12.5px] text-[color:var(--fg-3)]">
              <Link href="/" className="focusable hover:text-cyan">الرئيسية</Link>
              <span className="opacity-40">/</span><span>التطبيق</span>
            </nav>
            <h1 className="text-[28px] font-extrabold text-[color:var(--fg)] md:text-[38px]">تطبيق الفرات نيوز</h1>
            <p className="mt-2.5 max-w-xl text-[13.5px] leading-relaxed text-[color:var(--fg-2)]">
              جرّب تطبيق الفرات داخل الجهاز: اختر المنصّة ثم تنقّل داخل الهاتف —
              كل تبويب وبطاقة وتنبيه وزرّ رجوع يعمل فعلاً.
            </p>

            {/* اختيار الجهاز */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              {DEVICES.map((d) => (
                <button
                  key={d.key}
                  onClick={() => setDeviceKey(d.key)}
                  aria-pressed={deviceKey === d.key}
                  className={cx(
                    "focusable min-w-[132px] rounded-xl border px-4 py-3 text-right transition",
                    deviceKey === d.key
                      ? "border-cyan bg-cyan/12"
                      : "border-[color:var(--line-2)] hover:border-cyan/45",
                  )}
                >
                  <span className={cx("block text-[14px] font-extrabold", deviceKey === d.key ? "text-cyan" : "text-[color:var(--fg)]")}>
                    {d.label}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-[color:var(--fg-3)]">{d.os}</span>
                  <span className={cx(
                    "mt-1.5 inline-block rounded px-1.5 py-[2px] text-[9.5px] font-bold",
                    d.status === "published" ? "bg-cyan/15 text-cyan" : "bg-gold/15 text-gold",
                  )}>
                    {d.status === "published" ? "متاح للتنزيل" : "معاينة الجهاز"}
                  </span>
                </button>
              ))}
            </div>

            {/* حالة التوزيع */}
            <div className="mt-5 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-4">
              <p className="text-[12.5px] font-extrabold text-[color:var(--fg)]">{device.storeName}</p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-[color:var(--fg-2)]">{device.statusNote}</p>
              {device.storeUrl ? (
                <a href={device.storeUrl} target="_blank" rel="noopener noreferrer"
                  className="focusable mt-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-broadcast to-cyan px-5 py-2.5 text-[12.5px] font-extrabold text-midnight transition hover:brightness-110">
                  فتح صفحة التطبيق على {device.storeName}
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M5.5 8.5L12 2M12 2H8.2M12 2v3.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  {DEVICES.filter((alt) => alt.storeUrl).map((alt) => (
                    <a key={alt.key} href={alt.storeUrl!} target="_blank" rel="noopener noreferrer"
                      className="focusable inline-flex items-center gap-2 rounded-full border border-[color:var(--line-2)] px-4 py-2 text-[12px] font-bold text-[color:var(--fg-2)] transition hover:border-cyan hover:text-cyan">
                      حمّله من {alt.storeName}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* تفاصيل المنصّة */}
            <dl className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {[
                ["نظام التشغيل", device.os],
                ["الرجوع", ui.backGesture],
                ["واجهة النظام", ui.statusStyle],
                ["الشاشة الحالية", SCREEN_TITLE[st.screen]],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface)] px-3.5 py-2.5">
                  <dt className="text-[10.5px] text-[color:var(--fg-3)]">{k}</dt>
                  <dd className="mt-0.5 text-[12.5px] font-bold text-[color:var(--fg)]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* ══ الهاتف ══ */}
          <div className="mx-auto w-full max-w-[340px] lg:mx-0">
            <div
              className="relative mx-auto w-[300px] bg-[#0b0f1e] p-[9px] shadow-[0_40px_90px_-30px_rgba(0,0,0,.9)] transition-all duration-400 sm:w-[318px]"
              style={{ borderRadius: ui.radius, boxShadow: `0 0 0 2px ${ui.accent}33, 0 40px 90px -30px rgba(0,0,0,.9)` }}
            >
              {/* أزرار جانبية */}
              <span aria-hidden className="absolute -left-[3px] top-[110px] h-14 w-[3px] rounded-l bg-white/15" />
              <span aria-hidden className="absolute -right-[3px] top-[86px] h-8 w-[3px] rounded-r bg-white/15" />
              <span aria-hidden className="absolute -right-[3px] top-[128px] h-8 w-[3px] rounded-r bg-white/15" />

              <div
                className="relative overflow-hidden bg-[#050a20]"
                style={{ borderRadius: ui.radius - 8, height: 620 }}
              >
                {/* شريط حالة النظام */}
                <div className="relative z-20 flex items-center justify-between px-4 pb-1 pt-2 text-white">
                  <span className="ltr-num text-[10px] font-semibold">{now ? clock(now, false) : "--:--"}</span>
                  <span className="flex items-center gap-1">
                    <svg width="13" height="9" viewBox="0 0 14 10" fill="currentColor"><rect x="0" y="6" width="2.4" height="4" rx=".6" /><rect x="3.6" y="4" width="2.4" height="6" rx=".6" /><rect x="7.2" y="2" width="2.4" height="8" rx=".6" /><rect x="10.8" y="0" width="2.4" height="10" rx=".6" /></svg>
                    <svg width="14" height="9" viewBox="0 0 16 10" fill="none"><rect x=".6" y=".6" width="12" height="8.8" rx="2.2" stroke="currentColor" strokeWidth="1" /><rect x="2" y="2" width="8.4" height="6" rx="1.2" fill="currentColor" /><rect x="13.6" y="3.4" width="1.6" height="3.2" rx=".8" fill="currentColor" /></svg>
                  </span>
                </div>

                {/* قصّة الشاشة — تختلف بالمنصّة */}
                {ui.notch === "island" && (
                  <span aria-hidden className="absolute left-1/2 top-1.5 z-30 h-[22px] w-[86px] -translate-x-1/2 rounded-full bg-black" />
                )}
                {ui.notch === "punch" && (
                  <span aria-hidden className="absolute left-1/2 top-2 z-30 size-[11px] -translate-x-1/2 rounded-full bg-black ring-1 ring-white/10" />
                )}
                {ui.notch === "pill" && (
                  <span aria-hidden className="absolute left-1/2 top-1.5 z-30 h-[15px] w-[52px] -translate-x-1/2 rounded-full bg-black" />
                )}

                {/* المحتوى */}
                <div className="relative h-[calc(620px-26px-46px)]">{body}</div>

                {/* شريط التبويبات */}
                <nav className="absolute inset-x-0 bottom-0 z-20 flex h-[46px] items-center justify-around border-t border-white/10 bg-[#070d24]/95 backdrop-blur">
                  {TABS.map((tb) => {
                    const active = st.screen === tb.key;
                    return (
                      <button
                        key={tb.key}
                        onClick={() => tab(tb.key)}
                        aria-label={tb.label}
                        aria-pressed={active}
                        className="focusable flex flex-1 flex-col items-center gap-[3px] py-1"
                      >
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"
                          style={{ color: active ? ui.accent : "rgba(255,255,255,.42)" }}>
                          <path d={tb.icon} />
                        </svg>
                        <span className="text-[7.5px] font-bold" style={{ color: active ? ui.accent : "rgba(255,255,255,.42)" }}>
                          {tb.label}
                        </span>
                      </button>
                    );
                  })}
                </nav>

                {/* مؤشّر الإيماءة */}
                {ui.homeIndicator && (
                  <span aria-hidden className="absolute bottom-[3px] left-1/2 z-30 h-[3px] w-24 -translate-x-1/2 rounded-full bg-white/35" />
                )}
              </div>
            </div>

            <p className="mt-3 text-center text-[11px] text-[color:var(--fg-3)]">
              {device.label} · {ui.backGesture}
            </p>
          </div>
        </div>
      </section>

      {/* ══ ما يقدّمه التطبيق ══ */}
      <section className="zone-light shell py-9 md:py-11">
        <SectionHead title="ما يقدّمه التطبيق" sub="سبع تجارب تعمل داخل الجهاز أعلاه" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["الرئيسية", "خلاصة إخبارية بصور الفرات الرسمية", "home"],
            ["صفحة الخبر", "الخبر كاملاً مع الحفظ والمواد ذات الصلة", "article"],
            ["البثّ المباشر", "مدخل تلفزيون الفرات والشبكة اليومية", "live"],
            ["Shorts", "تمرير عمودي بين المقاطع الرسمية", "shorts"],
            ["الإذاعة", "إذاعة الفرات وترددّاها في بغداد والنجف", "radio"],
            ["التنبيهات", "مركز تنبيهات يفتح المادة المرتبطة", "alerts"],
            ["المحفوظة", "قائمة تُبنى مما تحفظه فعلاً", "saved"],
          ].map(([t, d, k]) => (
            <button
              key={k}
              onClick={() => { tab(k as ScreenKey); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className={cx(
                "focusable card rounded-xl p-4 text-right transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]",
                st.screen === k && "ring-2 ring-[color:var(--accent)]",
              )}
            >
              <span className="block text-[14px] font-extrabold text-[color:var(--fg)]">{t}</span>
              <span className="mt-1 block text-[12px] leading-relaxed text-[color:var(--fg-3)]">{d}</span>
            </button>
          ))}
        </div>

      </section>
    </div>
  );
}
