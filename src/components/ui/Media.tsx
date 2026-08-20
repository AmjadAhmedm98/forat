"use client";

import Image from "next/image";
import { useState } from "react";
import { FALLBACK_IMAGE } from "@/data/media";
import { relativeTime, cx } from "@/lib/format";
import type { Category } from "@/data/categories";

/**
 * ═══════════════ قواعد الصور — ملزِمة ═══════════════
 *
 * 1) thumbnails قناة الفرات تحمل عناوين مطبوعة داخل الصورة.
 *    → لا يُوضع فوقها أي عنوان إطلاقاً. العنوان الكامل يظهر تحت الصورة.
 * 2) للصور الصحفية العادية: يُسمح فقط بتراكب **التصنيف والوقت**.
 *    لا عنوان ولا مقدّمة فوق الصورة.
 * 3) نسبة الحاوية تطابق نسبة المصدر (16:9 للفيديو، 9:16 للـ Shorts)
 *    حتى لا يُقصّ أي جزء من الإطار أو من النصّ المطبوع.
 * 4) التحويل إلى AVIF/WebP يتم عبر محسّن Next (إعادة تحجيم فقط، بلا قصّ).
 */

export function Poster({
  src,
  alt,
  priority = false,
  sizes = "(max-width:768px) 100vw, 33vw",
  className,
  zoom = true,
  /** contain يمنع أي قصّ حين تختلف نسبة المصدر عن الحاوية */
  fit = "cover",
}: {
  src: string | null;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  zoom?: boolean;
  fit?: "cover" | "contain";
}) {
  const [failed, setFailed] = useState(false);
  const url = !src || failed ? FALLBACK_IMAGE : src;

  return (
    <Image
      src={url}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
      data-fallback={!src || failed ? "1" : undefined}
      className={cx(
        fit === "cover" ? "object-cover" : "object-contain",
        zoom && "transition-transform duration-700 ease-out group-hover:scale-[1.045]",
        className,
      )}
    />
  );
}

/**
 * التراكب المسموح به على الصور فقط: التصنيف + الوقت.
 * لا يقبل هذا المكوّن أي عنوان — بالتصميم.
 */
export function ImageOverlay({
  cat,
  agoMin,
  badge,
  corner = "start",
}: {
  cat?: Category;
  agoMin?: number;
  /** شارة قصيرة مثل «تقرير» أو اسم النشرة — ليست عنواناً */
  badge?: string;
  corner?: "start" | "end";
}) {
  return (
    <span
      className={cx(
        "pointer-events-none absolute top-2 z-[1] flex flex-wrap items-center gap-1.5",
        corner === "start" ? "right-2" : "left-2",
      )}
    >
      {cat && (
        <span
          className="rounded-md px-2 py-[2px] text-[10px] font-extrabold text-white shadow-sm"
          style={{ background: cat.accent }}
        >
          {cat.short}
        </span>
      )}
      {badge && (
        <span className="rounded-md bg-black/60 px-2 py-[2px] text-[10px] font-bold text-white backdrop-blur-sm">
          {badge}
        </span>
      )}
      {agoMin !== undefined && (
        <span className="rounded-md bg-black/55 px-2 py-[2px] text-[10px] font-medium text-white/90 backdrop-blur-sm">
          {relativeTime(agoMin)}
        </span>
      )}
    </span>
  );
}

export function SourceBadge({ href, label = "المصدر الرسمي" }: { href: string; label?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="focusable inline-flex items-center gap-1.5 text-[11.5px] font-medium text-[color:var(--fg-3)] transition hover:text-[color:var(--accent)]"
    >
      <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
        <path d="M5.5 8.5L12 2M12 2H8.2M12 2v3.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 8.6v2.6a1.4 1.4 0 01-1.4 1.4H2.8A1.4 1.4 0 011.4 11.2V4.4A1.4 1.4 0 012.8 3h2.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      {label}
    </a>
  );
}
