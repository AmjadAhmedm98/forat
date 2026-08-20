"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { LiveDot } from "@/components/ui/Bits";
import { useSearch } from "@/components/search/SearchProvider";
import { CATEGORIES } from "@/data/categories";
import { clock, arabicDate, cx } from "@/lib/format";

const NAV = [
  { href: "/", label: "الرئيسية" },
  { href: "/news/iraq", label: "العراق" },
  { href: "/news/world", label: "العالم" },
  { href: "/news/economic", label: "اقتصاد" },
  { href: "/news/sports", label: "رياضة" },
  { href: "/news/reports", label: "تقارير" },
  { href: "/shorts", label: "Shorts" },
  { href: "/programs", label: "البرامج" },
  { href: "/radio", label: "الراديو" },
  { href: "/apps", label: "تطبيق الفرات" },
];

function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    // أول قراءة بعد الترطيب حتى لا يختلف الخادم عن المتصفّح
    const first = window.setTimeout(tick, 0);
    const t = window.setInterval(tick, 1000);
    return () => { window.clearTimeout(first); window.clearInterval(t); };
  }, []);
  if (!now) return <span className="ltr-num text-[12px] text-[color:var(--fg-2)]-2">--:--:--</span>;
  return (
    <span className="flex items-center gap-2.5">
      <span className="ltr-num text-[12.5px] font-medium text-cyan">{clock(now)}</span>
      <span className="hidden text-[11.5px] text-[color:var(--fg-2)]-2 lg:inline">{arabicDate(now)}</span>
      <span className="ltr-num hidden text-[10px] text-[color:var(--fg-2)]-2 xl:inline">بغداد GMT+3</span>
    </span>
  );
}

export function Header() {
  const path = usePathname();
  const { open } = useSearch();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const first = window.setTimeout(onScroll, 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.clearTimeout(first); window.removeEventListener("scroll", onScroll); };
  }, []);

  const isActive = (href: string) =>
    href === "/" ? path === "/" : path.startsWith(href);

  /** إغلاق قائمة الموبايل فور الانتقال */
  const closeMenu = () => setMenu(false);

  return (
    <header className="zone-dark sticky top-0 z-[100]">
      {/* الشريط العلوي — الحالة والوقت */}
      <div
        className={cx(
          "hidden border-b border-[color:var(--line)] transition-all duration-300 md:block",
          scrolled ? "h-0 overflow-hidden opacity-0" : "opacity-100",
        )}
        style={{ background: "rgba(2,7,42,.9)", backdropFilter: "blur(14px)" }}
      >
        <div className="shell flex h-9 items-center justify-between">
          <Clock />
          <div className="flex items-center gap-4">
            <Link
              href="/live"
              className="focusable flex items-center gap-2 rounded-full border border-onair/30 bg-onair/10 px-2.5 py-1 text-onair transition hover:bg-onair/20"
            >
              <LiveDot label="الفرات HD — على الهواء" />
            </Link>
            <span className="ltr-num hidden text-[10.5px] text-[color:var(--fg-2)]-2 lg:inline">
              NILESAT 201 · 11746 V · 27500 3/4
            </span>
          </div>
        </div>
      </div>

      {/* الشريط الرئيسي */}
      <div
        className={cx(
          "border-b transition-all duration-300",
          scrolled
            ? "border-[var(--line-2)] shadow-[0_10px_40px_-16px_rgba(0,0,0,.9)]"
            : "border-[color:var(--line)]",
        )}
        style={{
          background: scrolled ? "rgba(2,7,42,.94)" : "rgba(3,10,48,.72)",
          backdropFilter: "blur(20px) saturate(150%)",
        }}
      >
        <div className="shell flex h-[62px] items-center gap-3 md:h-[70px] md:gap-5">
          <Link href="/" className="focusable shrink-0" aria-label="الفرات — الصفحة الرئيسية">
            <Logo compact={scrolled} priority />
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center gap-0.5 lg:flex" aria-label="الأقسام">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={cx(
                  "focusable relative rounded-lg px-2.5 py-2 text-[13.5px] font-medium transition",
                  isActive(n.href) ? "text-cyan" : "text-[color:var(--fg-2)] hover:bg-white/5 hover:text-[color:var(--fg)]",
                )}
              >
                {n.label}
                {isActive(n.href) && (
                  <span className="absolute inset-x-2.5 -bottom-[1px] h-[2px] rounded-full bg-cyan shadow-[0_0_10px_var(--color-cyan)]" />
                )}
              </Link>
            ))}
          </nav>

          <div className="mr-auto flex items-center gap-1.5 md:gap-2">
            <button
              onClick={open}
              aria-label="بحث"
              className="focusable flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-navy/40 px-3 py-2 text-[color:var(--fg-2)] transition hover:border-cyan/40 hover:text-cyan"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <circle cx="9" cy="9" r="6.3" stroke="currentColor" strokeWidth="1.7" />
                <path d="M13.6 13.6L17.5 17.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
              <span className="hidden text-[12.5px] xl:inline">بحث</span>
              <kbd className="ltr-num hidden rounded border border-[color:var(--line)] px-1 text-[9.5px] xl:inline">⌘K</kbd>
            </button>

            <Link
              href="/live"
              className="focusable hidden items-center gap-2 rounded-full bg-gradient-to-l from-broadcast to-cyan px-3.5 py-2 text-[12.5px] font-bold text-midnight shadow-[0_4px_20px_-4px_rgba(0,215,255,.55)] transition hover:brightness-110 sm:flex"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M3 2l7 4-7 4V2z" /></svg>
              البث المباشر
            </Link>

            <button
              onClick={() => setMenu((v) => !v)}
              aria-label="القائمة"
              aria-expanded={menu}
              className="focusable rounded-lg border border-[color:var(--line)] p-2 text-[color:var(--fg-2)] transition hover:text-[color:var(--fg)] lg:hidden"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                {menu ? (
                  <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                ) : (
                  <path d="M2.5 5h13M2.5 9h13M2.5 13h13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* قائمة الموبايل */}
      {menu && (
        <div
          className="border-b border-[color:var(--line)] lg:hidden"
          style={{ background: "rgba(2,7,42,.97)", backdropFilter: "blur(20px)" }}
        >
          <nav className="shell grid grid-cols-2 gap-1.5 py-4 anim-rise">
            {NAV.filter((n) => n.href !== "/apps").map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={closeMenu}
                className={cx(
                  "focusable rounded-xl border px-3.5 py-3 text-[13.5px] font-medium transition",
                  isActive(n.href)
                    ? "border-cyan/40 bg-cyan/10 text-cyan"
                    : "border-[color:var(--line)] text-[color:var(--fg-2)]",
                )}
              >
                {n.label}
              </Link>
            ))}
            {/* تطبيق الفرات — عنصر رئيسي بعرض كامل */}
            <Link
              href="/apps"
              onClick={closeMenu}
              className={cx(
                "focusable col-span-2 flex items-center justify-between rounded-xl border px-3.5 py-3 text-[13.5px] font-extrabold transition",
                isActive("/apps")
                  ? "border-cyan/50 bg-cyan/12 text-cyan"
                  : "border-cyan/30 bg-gradient-to-l from-broadcast/20 to-cyan/10 text-cyan",
              )}
            >
              <span className="flex items-center gap-2">
                <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden>
                  <rect x="5.4" y="2" width="9.2" height="16" rx="2.2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8.8 15.4h2.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                تطبيق الفرات
              </span>
              <span className="ltr-num text-[10.5px] font-bold opacity-75">iOS · Android</span>
            </Link>
            <div className="col-span-2 mt-2 flex flex-wrap gap-1.5">
              {CATEGORIES.map((c) => (
                <Link
                  key={c.key}
                  href={`/news/${c.key}`}
                  onClick={closeMenu}
                  className="rounded-full border px-2.5 py-1 text-[11.5px]"
                  style={{ borderColor: `${c.accent}30`, color: c.accent }}
                >
                  {c.short}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
