import { cx } from "@/lib/format";

/**
 * دوائر الإرسال — العنصر التوقيعي المأخوذ من الـ Key Art الرسمي للفرات.
 * حلقات متحدة المركز تتمدّد من نقطة بثّ واحدة.
 */
export function SignalRings({
  className,
  rings = 5,
  animated = true,
  color = "rgba(0,215,255,",
}: {
  className?: string;
  rings?: number;
  animated?: boolean;
  color?: string;
}) {
  return (
    <span aria-hidden className={cx("pointer-events-none absolute", className)}>
      {Array.from({ length: rings }).map((_, i) => (
        <span
          key={i}
          className="absolute left-1/2 top-1/2 rounded-full border"
          style={{
            width: `${(i + 1) * (100 / rings)}%`,
            aspectRatio: "1",
            transform: "translate(-50%,-50%)",
            borderColor: `${color}${(0.3 - i * 0.045).toFixed(3)})`,
            animation: animated
              ? `ring-out ${5 + i * 0.9}s cubic-bezier(.2,.6,.3,1) ${i * 0.75}s infinite`
              : undefined,
          }}
        />
      ))}
    </span>
  );
}

/** شرائط تيليمتري أفقية — خلفية غرفة التحكّم */
export function TelemetryBars({ className }: { className?: string }) {
  const bars = [
    [4, 14, 0.30], [22, 9, 0.16], [37, 20, 0.22], [55, 7, 0.12],
    [64, 16, 0.26], [79, 11, 0.15], [88, 8, 0.20], [12, 6, 0.10],
  ];
  return (
    <span aria-hidden className={cx("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {bars.map(([top, w, o], i) => (
        <span
          key={i}
          className="absolute h-px"
          style={{
            top: `${top}%`,
            insetInlineStart: `${(i * 13) % 70}%`,
            width: `${w}%`,
            background: `linear-gradient(90deg, transparent, rgba(0,215,255,${o}) 40%, rgba(182,45,219,${o * 0.6}) 75%, transparent)`,
          }}
        />
      ))}
    </span>
  );
}
