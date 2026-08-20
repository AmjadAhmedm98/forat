import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/brand/Logo";
import { SignalRings } from "@/components/brand/SignalRings";
import { SectionHead } from "@/components/ui/Bits";
import { SITE, SOCIALS } from "@/data/site";

export const metadata: Metadata = {
  title: "من نحن",
  description: "قناة الفرات الفضائية — قناة عراقية مستقلة تأسست عام 2004، ووكالة الفرات نيوز الإخبارية.",
};

/** نصّ الصفحة مأخوذ حرفياً من صفحة «من نحن» الرسمية للقناة (SITE.about). */
export default function AboutPage() {
  return (
    <div>
      <header className="zone-dark relative overflow-hidden">
        <SignalRings className="left-1/2 top-0 size-[720px] -translate-x-1/2 -translate-y-1/3 opacity-35" rings={6} />

        <div className="shell relative py-9 md:py-12">
          <nav className="mb-4 flex items-center gap-2 text-[12.5px] text-[color:var(--fg-3)]">
            <Link href="/" className="focusable hover:text-cyan">الرئيسية</Link>
            <span className="opacity-40">/</span><span>من نحن</span>
          </nav>

          <div className="flex flex-col items-start gap-5 md:flex-row md:items-center md:gap-7">
            <LogoMark size="xl" />
            <div className="min-w-0">
              <h1 className="silver-text text-[28px] font-extrabold md:text-[40px]">{SITE.name}</h1>
              <p className="mt-2 text-[14px] text-[color:var(--fg-2)]">
                {SITE.tagline} · تأسست في {SITE.founded}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ══ النصّ الرسمي ══ */}
      <section className="zone-light shell py-9 md:py-11">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <SectionHead title="عن القناة" />
            <div className="space-y-4">
              {SITE.about.map((para, i) => (
                <p key={i} className="text-[14.5px] leading-[1.95] text-[color:var(--fg-2)] md:text-[15.5px]">
                  {para}
                </p>
              ))}
            </div>

            <div className="mt-7">
              <SectionHead title="نطاق البثّ" tight accent="#4fe4ff" />
              <p className="text-[14px] leading-[1.9] text-[color:var(--fg-2)]">{SITE.coverage}</p>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="card rounded-2xl p-5">
              <h2 className="text-[15px] font-extrabold text-[color:var(--fg)]">بيانات البثّ الفضائي</h2>
              <dl className="mt-3 space-y-2.5">
                {[
                  ["القمر", SITE.satellite.name],
                  ["التردد", `${SITE.satellite.frequency} ${SITE.satellite.polarization}`],
                  ["معدّل الترميز", SITE.satellite.symbolRate],
                  ["FEC", SITE.satellite.fec],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-3 border-b border-[color:var(--line)] pb-2 last:border-0 last:pb-0">
                    <dt className="text-[12.5px] text-[color:var(--fg-3)]">{k}</dt>
                    <dd className="ltr-num text-[13px] font-extrabold text-[color:var(--accent)]">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="card rounded-2xl p-5">
              <h2 className="text-[15px] font-extrabold text-[color:var(--fg)]">العنوان والتواصل</h2>
              <p className="mt-3 text-[13px] leading-relaxed text-[color:var(--fg-2)]">{SITE.address}</p>
              <p className="num mt-2 text-[13px] text-[color:var(--fg-2)]">هاتف: {SITE.phone}</p>
              <p className="ltr-num mt-3 flex flex-wrap gap-x-2 gap-y-1 text-[11.5px] text-[color:var(--fg-3)]">
                {SITE.domains.map((d) => <span key={d}>{d}</span>)}
              </p>
            </div>

            <div className="card rounded-2xl p-5">
              <h2 className="text-[15px] font-extrabold text-[color:var(--fg)]">حسابات الفرات</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {SOCIALS.map((s) => (
                  <a
                    key={s.key}
                    href={s.href}
                    target="_blank" rel="noopener noreferrer"
                    className="focusable rounded-full border border-[color:var(--line-2)] px-3 py-1.5 text-[11.5px] font-bold text-[color:var(--fg-2)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-9 flex flex-wrap gap-2.5">
          <Link
            href="/live"
            className="focusable inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-broadcast to-cyan px-6 py-3 text-[13px] font-extrabold text-midnight transition hover:brightness-110"
          >
            البثّ المباشر
          </Link>
          <Link
            href="/programs"
            className="focusable rounded-full border border-[color:var(--line-2)] px-5 py-3 text-[12.5px] font-bold text-[color:var(--fg-2)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
          >
            دليل البرامج
          </Link>
          <Link
            href="/apps"
            className="focusable rounded-full border border-[color:var(--line-2)] px-5 py-3 text-[12.5px] font-bold text-[color:var(--fg-2)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
          >
            تطبيق الفرات
          </Link>
        </div>
      </section>
    </div>
  );
}
