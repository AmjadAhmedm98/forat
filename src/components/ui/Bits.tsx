import Link from "next/link";
import { cx } from "@/lib/format";
import type { Category } from "@/data/categories";

export function LiveDot({ label = "مباشر", className }: { label?: string; className?: string }) {
  return (
    <span className={cx("inline-flex items-center gap-1.5", className)}>
      <span className="size-[6px] rounded-full bg-onair" style={{ animation: "pulse-dot 2s infinite" }} />
      <span className="text-[11px] font-bold tracking-wide">{label}</span>
    </span>
  );
}

/** وسم التصنيف — يعمل على الفاتح والداكن */
export function CatTag({
  cat, size = "sm", solid = false,
}: { cat: Category; size?: "sm" | "xs"; solid?: boolean }) {
  if (solid) {
    return (
      <span
        className={cx(
          "inline-flex w-fit items-center gap-1.5 rounded-md px-2 font-bold text-white",
          size === "xs" ? "py-[2px] text-[10px]" : "py-[3px] text-[11px]",
        )}
        style={{ background: cat.accent }}
      >
        {cat.short}
      </span>
    );
  }
  return (
    <span
      className={cx(
        "inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 font-bold",
        size === "xs" ? "py-[2px] text-[10px]" : "py-[3px] text-[11px]",
      )}
      style={{ borderColor: `${cat.accent}45`, color: cat.accent, background: `${cat.accent}14` }}
    >
      <span className="size-[5px] rounded-full" style={{ background: cat.accent }} />
      {cat.short}
    </span>
  );
}

export function Meta({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cx("flex flex-wrap items-center gap-x-2 gap-y-1 text-[11.5px] text-[color:var(--fg-3)]", className)}>
      {children}
    </span>
  );
}

export function Dot() {
  return <span className="opacity-40">·</span>;
}

export function SectionHead({
  title, sub, href, hrefLabel = "عرض الكل", accent, children, tight = false,
}: {
  title: string; sub?: string; href?: string; hrefLabel?: string;
  accent?: string; children?: React.ReactNode; tight?: boolean;
}) {
  const bar = accent ?? "var(--accent)";
  return (
    <div className={cx("flex flex-wrap items-end justify-between gap-3", tight ? "mb-3.5" : "mb-5")}>
      <div className="min-w-0">
        <h2 className="flex items-center gap-2.5 text-[20px] font-extrabold text-[color:var(--fg)] md:text-[24px]">
          <span
            className="inline-block h-5 w-[4px] rounded-full md:h-6"
            style={{ background: bar, boxShadow: `0 0 12px ${bar}` }}
          />
          {title}
        </h2>
        {sub && <p className="mt-1.5 pr-[14px] text-[12.5px] text-[color:var(--fg-3)]">{sub}</p>}
      </div>
      <div className="flex items-center gap-2">
        {children}
        {href && (
          <Link
            href={href}
            className="focusable group inline-flex items-center gap-1.5 rounded-full border border-[color:var(--line-2)] px-3.5 py-1.5 text-[12px] font-bold text-[color:var(--fg-2)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
          >
            {hrefLabel}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition group-hover:-translate-x-0.5">
              <path d="M7.5 2.5L4 6l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}

export function Notice({ children, tone = "info" }: { children: React.ReactNode; tone?: "info" | "warn" }) {
  return (
    <p
      className={cx(
        "flex items-start gap-2 rounded-xl border px-3.5 py-2.5 text-[12px] leading-relaxed",
        tone === "warn"
          ? "border-gold/35 bg-gold/10 text-[color:var(--fg-2)]"
          : "border-[color:var(--line)] bg-[color:var(--surface-2)] text-[color:var(--fg-2)]",
      )}
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="mt-1 shrink-0">
        <circle cx="8" cy="8" r="6.6" stroke="currentColor" strokeWidth="1.3" />
        <path d="M8 4.8v.1M8 7v4.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span>{children}</span>
    </p>
  );
}

/** فاصل بين نطاق داكن ونطاق فاتح */
export function ZoneEdge({ dir = "down" }: { dir?: "down" | "up" }) {
  return (
    <div
      aria-hidden
      className="h-px w-full"
      style={{
        background:
          dir === "down"
            ? "linear-gradient(90deg, transparent, rgba(0,215,255,.5), rgba(120,60,255,.35), transparent)"
            : "linear-gradient(90deg, transparent, rgba(10,84,216,.4), transparent)",
      }}
    />
  );
}
