import Image from "next/image";
import { cx } from "@/lib/format";

const SIZES = { sm: 28, md: 38, lg: 56, xl: 96 } as const;

export function LogoMark({
  size = "md",
  glow = true,
  className,
  /** أولوية التحميل — تُفعَّل في الهيدر فقط، وما عداه كسول */
  priority = false,
}: {
  size?: keyof typeof SIZES;
  glow?: boolean;
  className?: string;
  priority?: boolean;
}) {
  const px = SIZES[size];
  return (
    <span
      className={cx("relative inline-grid place-items-center shrink-0", className)}
      style={{ width: px, height: px }}
    >
      {glow && (
        <span
          aria-hidden
          className="absolute inset-[-45%] rounded-full blur-xl"
          style={{
            background:
              "radial-gradient(circle, rgba(0,215,255,.38) 0%, rgba(10,84,216,.22) 40%, transparent 70%)",
          }}
        />
      )}
      <Image
        src="/brand/alforat-logo.png"
        alt="شعار قناة الفرات الفضائية"
        width={px}
        height={px}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        className="relative drop-shadow-[0_2px_10px_rgba(0,0,0,.5)]"
      />
    </span>
  );
}

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex flex-col justify-center leading-none">
      <span
        className={cx(
          "silver-text font-semibold tracking-tight",
          compact ? "text-[15px]" : "text-[17px] md:text-[19px]",
        )}
      >
        قناة الفرات الفضائية
      </span>
      <span className="mt-1 flex items-center gap-1.5">
        <span className="ltr-num text-[10px] font-semibold tracking-[.22em] text-muted">
          ALFORAT
        </span>
        <span className="ltr-num rounded-[3px] bg-gold/90 px-1 text-[9px] font-bold leading-[14px] text-midnight">
          HD
        </span>
      </span>
    </span>
  );
}

/** الشعار الكامل: علامة + اسم */
export function Logo({ compact = false, priority = false }: { compact?: boolean; priority?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark size={compact ? "sm" : "md"} priority={priority} />
      <Wordmark compact={compact} />
    </span>
  );
}
