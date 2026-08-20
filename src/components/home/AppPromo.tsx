import Link from "next/link";
import Image from "next/image";
import { SignalRings } from "@/components/brand/SignalRings";
import { LogoMark } from "@/components/brand/Logo";
import { DEVICES } from "@/data/apps";
import { latest, articleImage } from "@/data/news";

/**
 * قسم تطبيق الفرات على الصفحة الرئيسية — موضعه بعد «على الهواء»
 * ليكون في أعلى مواضع الظهور بعد البثّ والأخبار.
 * أزرار المتاجر تُبنى من `DEVICES` فلا يظهر زر إلا لمنصّة لها رابط رسمي.
 */

const STORE_ICON: Record<string, React.ReactNode> = {
  ios: (
    <path d="M13.6 3.2c.1 1-.3 1.9-.9 2.6-.6.7-1.6 1.2-2.5 1.1-.1-.9.3-1.9.9-2.5.6-.7 1.7-1.2 2.5-1.2zM16.8 14c-.4 1-.6 1.4-1.1 2.3-.7 1.2-1.7 2.7-3 2.7-1.1 0-1.4-.7-2.9-.7s-1.9.7-3 .7c-1.3 0-2.2-1.3-3-2.5-2-3.2-2.2-7-1-9 .8-1.4 2.2-2.3 3.5-2.3 1.3 0 2.2.8 3.3.8 1.1 0 1.8-.8 3.3-.8 1.2 0 2.5.7 3.3 1.8-2.9 1.6-2.5 5.9.6 7z" />
  ),
  android: (
    <path d="M5.4 7.6h9.2v6.9a.9.9 0 01-.9.9h-.7v2.1a1.1 1.1 0 11-2.2 0v-2.1H9.2v2.1a1.1 1.1 0 11-2.2 0v-2.1h-.7a.9.9 0 01-.9-.9V7.6zM3.6 7.8a1.1 1.1 0 012.2 0v4.4a1.1 1.1 0 01-2.2 0V7.8zm10.6 0a1.1 1.1 0 012.2 0v4.4a1.1 1.1 0 01-2.2 0V7.8zM6.8 2.6l.9 1.6a5.9 5.9 0 014.6 0l.9-1.6a.3.3 0 01.5.3l-.9 1.6a4.9 4.9 0 012.6 3.1H5.6a4.9 4.9 0 012.6-3.1l-.9-1.6a.3.3 0 01.5-.3zM8.2 6a.5.5 0 100-1 .5.5 0 000 1zm3.6 0a.5.5 0 100-1 .5.5 0 000 1z" />
  ),
};

const FEATURES = [
  ["تنبيهات فورية", "العاجل يصل قبل أن تفتح الموقع"],
  ["البثّ في جيبك", "تلفزيون الفرات وإذاعته بنقرة واحدة"],
  ["Shorts عمودية", "تمرير سريع بين مقاطع الفرات"],
  ["قائمة محفوظاتك", "احفظ الخبر واقرأه لاحقاً"],
];

export function AppPromo() {
  const covers = latest(3);
  const stores = DEVICES.filter((d) => d.storeUrl);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[color:var(--line-2)] bg-gradient-to-l from-navy/70 via-midnight-2/80 to-navy/40">
      <SignalRings className="-right-24 top-1/2 size-[520px] -translate-y-1/2 opacity-40" rings={6} />
      <span
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle,rgba(0,215,255,.22),transparent 70%)" }}
      />

      <div className="relative grid gap-9 p-6 md:p-9 lg:grid-cols-[1.15fr_auto] lg:items-center lg:gap-12">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan/35 bg-cyan/10 px-3 py-1 text-[11px] font-extrabold text-cyan">
            <LogoMark size="sm" glow={false} />
            تطبيق الفرات
          </span>

          <h2 className="mt-4 text-[26px] font-extrabold leading-[1.35] text-[color:var(--fg)] md:text-[36px]">
            الفرات معك أينما كنت
          </h2>
          <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-[color:var(--fg-2)] md:text-[15px]">
            الأخبار والبثّ المباشر والإذاعة و Shorts في تطبيق واحد — بتنبيهات فورية
            وقائمة محفوظات تُبنى على ذوقك.
          </p>

          <dl className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {FEATURES.map(([t, d]) => (
              <div
                key={t}
                className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface)] px-3.5 py-3"
              >
                <dt className="flex items-center gap-2 text-[13px] font-extrabold text-[color:var(--fg)]">
                  <span className="size-[6px] rounded-full bg-cyan shadow-[0_0_10px_var(--color-cyan)]" />
                  {t}
                </dt>
                <dd className="mt-1 pr-[14px] text-[11.5px] leading-relaxed text-[color:var(--fg-3)]">{d}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-7 flex flex-wrap items-center gap-2.5">
            <Link
              href="/apps"
              className="focusable inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-broadcast to-cyan px-6 py-3 text-[13px] font-extrabold text-midnight shadow-[0_0_40px_-10px_var(--color-cyan)] transition hover:brightness-110"
            >
              جرّب التطبيق داخل الموقع
              <svg width="13" height="13" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M7.5 2.5L4 6l3.5 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            {stores.map((d) => (
              <a
                key={d.key}
                href={d.storeUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="focusable inline-flex items-center gap-2.5 rounded-full border border-[color:var(--line-2)] bg-[color:var(--surface)] px-4 py-2.5 text-[color:var(--fg-2)] transition hover:border-cyan/50 hover:text-cyan"
              >
                <svg width="17" height="17" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                  {STORE_ICON[d.key]}
                </svg>
                <span className="text-right leading-tight">
                  <span className="block text-[9px] opacity-70">حمّله من</span>
                  <span className="ltr-num block text-[12px] font-extrabold">{d.storeName}</span>
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* هاتفان متداخلان — لقطة من واجهة التطبيق */}
        <div className="relative mx-auto hidden h-[380px] w-[300px] shrink-0 md:block">
          <PhoneMock
            className="absolute right-0 top-6 rotate-[6deg] scale-[.86] opacity-70"
            cover={(covers[1] && articleImage(covers[1])) || undefined}
            title={covers[1]?.title}
            accent="#783cff"
          />
          <PhoneMock
            className="absolute left-0 top-0"
            cover={(covers[0] && articleImage(covers[0])) || undefined}
            title={covers[0]?.title}
            accent="#00d7ff"
            primary
          />
        </div>
      </div>
    </section>
  );
}

function PhoneMock({
  className, cover, title, accent, primary = false,
}: {
  className?: string; cover?: string; title?: string; accent: string; primary?: boolean;
}) {
  return (
    <div
      className={`w-[188px] rounded-[30px] bg-[#0b0f1e] p-[6px] shadow-[0_30px_70px_-26px_rgba(0,0,0,.95)] ${className ?? ""}`}
      style={{ boxShadow: `0 0 0 1.5px ${accent}40, 0 30px 70px -26px rgba(0,0,0,.95)` }}
    >
      <div className="relative h-[352px] overflow-hidden rounded-[25px] bg-[#050a20]">
        <span aria-hidden className="absolute left-1/2 top-1.5 z-20 h-[15px] w-[54px] -translate-x-1/2 rounded-full bg-black" />

        <div className="flex items-center justify-between px-3.5 pb-1.5 pt-2.5">
          <LogoMark size="sm" glow={false} />
          <span className="flex items-center gap-1 rounded bg-onair px-1.5 py-[2px] text-[7px] font-extrabold text-white">
            <span className="size-[3px] rounded-full bg-white" />
            مباشر
          </span>
        </div>

        {cover && (
          <div className="relative mx-2.5 aspect-16/9 overflow-hidden rounded-lg bg-midnight">
            <Image src={cover} alt="" fill loading="lazy" sizes="180px" className="object-cover" />
            <span className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>
        )}
        {title && (
          <p className="clamp-3 px-2.5 pt-2 text-[8.5px] font-extrabold leading-[1.6] text-white">{title}</p>
        )}

        <div className="mt-2 space-y-1.5 px-2.5">
          {[92, 74, 84].map((w, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="size-6 shrink-0 rounded bg-white/10" />
              <span className="flex-1 space-y-1">
                <span className="block h-[5px] rounded-full bg-white/16" style={{ width: `${w}%` }} />
                <span className="block h-[5px] w-1/2 rounded-full bg-white/8" />
              </span>
            </div>
          ))}
        </div>

        {primary && (
          <nav className="absolute inset-x-0 bottom-0 flex h-[34px] items-center justify-around border-t border-white/10 bg-[#070d24]/95">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="size-[9px] rounded-[3px]"
                style={{ background: i === 0 ? accent : "rgba(255,255,255,.28)" }}
              />
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
