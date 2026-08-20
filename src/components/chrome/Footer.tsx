import Link from "next/link";
import { LogoMark } from "@/components/brand/Logo";
import { SignalRings } from "@/components/brand/SignalRings";
import { SITE, SOCIALS } from "@/data/site";
import { CATEGORIES } from "@/data/categories";

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  youtube: <path d="M9.5 5.5l4.2 2.4-4.2 2.4V5.5z M2 8c0-2.1.2-3 .6-3.5.4-.5 1-.7 1.8-.8C5.6 3.6 7.6 3.5 10 3.5s4.4.1 5.6.2c.8.1 1.4.3 1.8.8.4.5.6 1.4.6 3.5s-.2 3-.6 3.5c-.4.5-1 .7-1.8.8-1.2.1-3.2.2-5.6.2s-4.4-.1-5.6-.2c-.8-.1-1.4-.3-1.8-.8C2.2 11 2 10.1 2 8z" />,
  facebook: <path d="M11.2 17v-6.3h2.1l.32-2.45h-2.42V6.68c0-.71.2-1.19 1.21-1.19h1.29V3.3c-.22-.03-.99-.1-1.88-.1-1.86 0-3.14 1.14-3.14 3.22v1.83H6.6v2.45h2.08V17h2.52z" />,
  instagram: <path d="M10 3.6c2.08 0 2.33.01 3.15.05.76.03 1.17.16 1.45.27.36.14.62.31.9.58.27.28.44.54.58.9.11.28.24.69.27 1.45.04.82.05 1.07.05 3.15s-.01 2.33-.05 3.15c-.03.76-.16 1.17-.27 1.45-.14.36-.31.62-.58.9-.28.27-.54.44-.9.58-.28.11-.69.24-1.45.27-.82.04-1.07.05-3.15.05s-2.33-.01-3.15-.05c-.76-.03-1.17-.16-1.45-.27a2.4 2.4 0 01-.9-.58 2.4 2.4 0 01-.58-.9c-.11-.28-.24-.69-.27-1.45C3.61 12.33 3.6 12.08 3.6 10s.01-2.33.05-3.15c.03-.76.16-1.17.27-1.45.14-.36.31-.62.58-.9.28-.27.54-.44.9-.58.28-.11.69-.24 1.45-.27C7.67 3.61 7.92 3.6 10 3.6zm0 3.1a3.3 3.3 0 100 6.6 3.3 3.3 0 000-6.6zm0 5.44a2.14 2.14 0 110-4.28 2.14 2.14 0 010 4.28zm4.2-5.57a.77.77 0 11-1.54 0 .77.77 0 011.54 0z" />,
  x: <path d="M13.9 3.5h2.2l-4.8 5.5 5.6 7.5h-4.4l-3.4-4.5-3.9 4.5H3l5.1-5.9L2.7 3.5h4.5l3.1 4.1 3.6-4.1zm-.8 11.7h1.2L7 4.7H5.7l7.4 10.5z" />,
  tiktok: <path d="M13.1 2.5c.3 1.9 1.4 3 3.2 3.2v2.2c-1.1.1-2.1-.2-3.2-.9v4.6c0 3.7-3.4 5.8-6.2 4.1-2.9-1.7-2.9-5.9 0-7.6.8-.5 1.7-.7 2.6-.6v2.3c-1.5-.3-2.6.8-2.4 2.1.2 1.2 1.5 1.9 2.6 1.3.6-.3.9-.9.9-1.7V2.5h2.5z" />,
  telegram: <path d="M17.3 4.1L2.9 9.6c-.7.3-.7 1.2 0 1.4l3.6 1.1 1.4 4.3c.2.5.8.6 1.2.3l2-1.6 3.6 2.6c.5.4 1.2.1 1.3-.5l2.3-11.9c.1-.7-.5-1.2-1-1.2zM7.6 12l6.8-4.2-5.6 5c-.2.2-.3.4-.3.6l-.2 1.6L7.6 12z" />,
};

export function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden border-t border-[var(--line-2)]">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy/35 to-midnight" />
      <SignalRings className="left-1/2 top-0 size-[520px] -translate-x-1/2 -translate-y-1/2 opacity-45" rings={6} />

      <div className="shell relative py-14">
        {/* الشريط العلوي: الشعار + التردد */}
        <div className="flex flex-col items-center gap-6 border-b border-[color:var(--line)] pb-10 text-center">
          <LogoMark size="xl" />
          <div>
            <p className="silver-text text-[24px] font-bold md:text-[30px]">قناة الفرات الفضائية</p>
            <p className="mt-2 text-[13.5px] text-[color:var(--fg-2)]">{SITE.tagline}</p>
          </div>

          <div className="ltr-num flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-2)] px-5 py-3 text-[11.5px] text-[color:var(--fg-2)]">
            <span>القمر <b className="text-cyan">{SITE.satellite.name}</b></span>
            <span className="opacity-30">|</span>
            <span>التردد <b className="text-cyan">{SITE.satellite.frequency} ({SITE.satellite.polarization})</b></span>
            <span className="opacity-30">|</span>
            <span>FEC/SR <b className="text-cyan">{SITE.satellite.symbolRate} - {SITE.satellite.fec}</b></span>
          </div>

          {/* التواصل */}
          <div className="flex flex-wrap justify-center gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.key}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                title={`${s.label} — ${s.handle}`}
                className="focusable group flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] px-3.5 py-2 text-[color:var(--fg-2)] transition hover:border-cyan/45 hover:bg-cyan/8 hover:text-cyan"
              >
                <svg width="17" height="17" viewBox="0 0 20 20" fill="currentColor">{SOCIAL_ICONS[s.key]}</svg>
                <span className="ltr-num text-[11.5px]">{s.handle}</span>
              </a>
            ))}
          </div>
        </div>

        {/* الأعمدة */}
        <div className="grid gap-9 py-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-3.5 text-[13px] font-bold text-[color:var(--fg)]">الأقسام</h3>
            <ul className="space-y-2">
              {CATEGORIES.map((c) => (
                <li key={c.key}>
                  <Link href={`/news/${c.key}`} className="focusable text-[13px] text-[color:var(--fg-2)] transition hover:text-cyan">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3.5 text-[13px] font-bold text-[color:var(--fg)]">المنصات</h3>
            <ul className="space-y-2">
              {[
                ["/live", "تلفزيون الفرات المباشر"],
                ["/radio", "إذاعة الفرات — بغداد والنجف"],
                ["/shorts", "الفرات Shorts"],
                ["/programs", "دليل البرامج"],
                ["/apps", "تطبيق الفرات"],
              ].map(([h, l]) => (
                <li key={h}>
                  <Link href={h} className="focusable text-[13px] text-[color:var(--fg-2)] transition hover:text-cyan">{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3.5 text-[13px] font-bold text-[color:var(--fg)]">القناة</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="focusable text-[13px] text-[color:var(--fg-2)] transition hover:text-cyan">من نحن</Link></li>
              <li><Link href="/breaking" className="focusable text-[13px] text-[color:var(--fg-2)] transition hover:text-cyan">الأخبار العاجلة</Link></li>
              <li><Link href="/search" className="focusable text-[13px] text-[color:var(--fg-2)] transition hover:text-cyan">البحث</Link></li>
            </ul>
            <p className="mt-4 text-[12px] leading-relaxed text-[color:var(--fg-3)]">
              تأسست في {SITE.founded}
            </p>
          </div>

          <div>
            <h3 className="mb-3.5 text-[13px] font-bold text-[color:var(--fg)]">العنوان</h3>
            <p className="text-[12.5px] leading-relaxed text-[color:var(--fg-2)]">{SITE.address}</p>
            <p className="num mt-2 text-[12.5px] text-[color:var(--fg-2)]">هاتف: {SITE.phone}</p>
            <p className="ltr-num mt-3 flex flex-wrap gap-x-2 text-[11.5px] text-[color:var(--fg-3)]">
              {SITE.domains.map((d) => <span key={d}>{d}</span>)}
            </p>
          </div>
        </div>

        {/* حقوق النشر */}
        <div className="flex flex-col gap-3 border-t border-[color:var(--line)] pt-6 text-center">
          <p className="ltr-num text-[11px] text-[color:var(--fg-3)]">
            © {new Date().getFullYear()} {SITE.name} — All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
