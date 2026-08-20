import { seed, cx } from "@/lib/format";

/**
 * Broadcast Plate — لوحة عرض تحريرية محايدة.
 *
 * لا تُستخدم صور مولّدة لوجوه أو أحداث، ولا تُستنسخ صور صحفية.
 * تُولَّد لوحة SVG حتمية من مُعرّف المادة بهوية الفرات، بأربع تركيبات مختلفة
 * حتى لا تبدو صفوف البطاقات متطابقة: حلقات إرسال، مسح راداري، طيف موجي، شبكة إشارة.
 */

export function BroadcastPlate({
  id,
  accent = "#00d7ff",
  label,
  className,
  dense = false,
}: {
  id: string;
  accent?: string;
  label?: string;
  className?: string;
  dense?: boolean;
}) {
  const s = seed(id);
  const uid = `bp${(s % 99991).toString(36)}`;
  const comp = ((s ^ (s >>> 11) ^ (s >>> 19)) >>> 0) % 4;
  const cxp = 22 + (s % 56);
  const cyp = 26 + ((s >> 5) % 48);
  const cxu = (cxp / 100) * 400;
  const cyu = (cyp / 100) * 225;

  return (
    <svg
      viewBox="0 0 400 225"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={label ? `لوحة عرض — ${label}` : "لوحة عرض"}
      className={cx("block h-full w-full", className)}
    >
      <defs>
        <linearGradient id={`${uid}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0b1a5c" />
          <stop offset="48%" stopColor="#102a7e" />
          <stop offset="100%" stopColor="#050f3c" />
        </linearGradient>
        <radialGradient id={`${uid}r`} cx={`${cxp}%`} cy={`${cyp}%`} r="60%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.72" />
          <stop offset="40%" stopColor={accent} stopOpacity="0.22" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}sw`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="48%" stopColor="#fff" stopOpacity="0.09" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${uid}b`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={accent} stopOpacity="0" />
          <stop offset="38%" stopColor={accent} stopOpacity="0.6" />
          <stop offset="74%" stopColor="#b62ddb" stopOpacity="0.32" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${uid}v`} cx="50%" cy="45%" r="78%">
          <stop offset="52%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#02072a" stopOpacity="0.55" />
        </radialGradient>
        <clipPath id={`${uid}c`}><rect width="400" height="225" /></clipPath>
      </defs>

      <g clipPath={`url(#${uid}c)`}>
        <rect width="400" height="225" fill={`url(#${uid}g)`} />
        <rect width="400" height="225" fill={`url(#${uid}r)`} />

        {/* ——— حلقات إرسال متحدة المركز ——— */}
        {comp === 0 && (
          <g transform={`translate(${cxu} ${cyu})`} fill="none" stroke={accent}>
            {[0, 1, 2, 3, 4].map((i) => (
              <circle key={i} r={14 + i * 24} strokeOpacity={0.5 - i * 0.075} strokeWidth={i === 0 ? 1.2 : 0.7} />
            ))}
            <circle r="3.4" fill={accent} fillOpacity="0.85" stroke="none" />
          </g>
        )}

        {/* ——— مسح راداري ——— */}
        {comp === 1 && (
          <g transform={`translate(${cxu} ${cyu})`}>
            <g fill="none" stroke={accent} strokeOpacity="0.3">
              <circle r="34" /><circle r="66" /><circle r="98" />
              <line x1="-110" y1="0" x2="110" y2="0" />
              <line x1="0" y1="-110" x2="0" y2="110" />
            </g>
            <path d="M0,0 L98,-46 A108,108 0 0,1 98,46 Z" fill={accent} fillOpacity="0.2" />
            <circle r="3.4" fill={accent} fillOpacity="0.85" />
            <circle cx="33" cy="30" r="2" fill={accent} fillOpacity="0.6" />
            <circle cx="-53" cy="-4" r="2" fill={accent} fillOpacity="0.6" />
            <circle cx="70" cy="-22" r="2" fill={accent} fillOpacity="0.6" />
          </g>
        )}

        {/* ——— طيف موجي ——— */}
        {comp === 2 && (
          <g transform={`translate(0 ${cyu})`}>
            {Array.from({ length: 46 }).map((_, i) => {
              const t = (s >> (i % 12)) % 53;
              const h = 6 + ((t * ((i % 7) + 3)) % 62);
              return (
                <rect
                  key={i}
                  x={6 + i * 8.6} y={-h / 2}
                  width="3" height={h} rx="1.5"
                  fill={accent} fillOpacity={0.22 + ((i * 7) % 5) * 0.11}
                />
              );
            })}
            <line x1="0" y1="0" x2="400" y2="0" stroke={accent} strokeOpacity="0.28" strokeWidth="0.6" />
          </g>
        )}

        {/* ——— شبكة إشارة ——— */}
        {comp === 3 && (
          <g>
            {Array.from({ length: 9 }).map((_, r) =>
              Array.from({ length: 15 }).map((_, c) => {
                const t = (s >> ((r * 15 + c) % 17)) % 41;
                const on = t % 6 === 0;
                return (
                  <rect
                    key={`${r}-${c}`}
                    x={8 + c * 27} y={10 + r * 25}
                    width={on ? 11 : 3} height="3" rx="1.5"
                    fill={accent} fillOpacity={on ? 0.48 : 0.16}
                  />
                );
              }),
            )}
            <g transform={`translate(${cxu} ${cyu})`} fill="none" stroke={accent}>
              <circle r="20" strokeOpacity="0.4" /><circle r="40" strokeOpacity="0.18" />
              <circle r="3" fill={accent} fillOpacity="0.8" stroke="none" />
            </g>
          </g>
        )}

        {/* شرائط تيليمتري مشتركة */}
        {Array.from({ length: 5 }).map((_, i) => {
          const t = (s >> (i * 4)) % 89;
          return (
            <rect
              key={i}
              x={(t * 4) % 280} y={14 + i * 44 + (t % 13)}
              width={70 + (t % 140)} height="1"
              fill={`url(#${uid}b)`} opacity={0.4 + (t % 4) * 0.12}
            />
          );
        })}

        {/* شعاع ضوئي قطري */}
        <rect width="400" height="225" fill={`url(#${uid}sw)`} />

        {/* شبكة إطار البثّ */}
        {!dense && (
          <g stroke="#94b2ff" strokeOpacity="0.055">
            <line x1="0" y1="75" x2="400" y2="75" />
            <line x1="0" y1="150" x2="400" y2="150" />
            <line x1="133" y1="0" x2="133" y2="225" />
            <line x1="266" y1="0" x2="266" y2="225" />
          </g>
        )}

        {/* علامات زوايا — إطار كاميرا */}
        <g stroke={accent} strokeOpacity="0.3" strokeWidth="1" fill="none">
          <path d="M10 22 V10 H22" /><path d="M378 10 H390 V22" />
          <path d="M10 203 V215 H22" /><path d="M378 215 H390 V203" />
        </g>

        {/* بصمة الشعار الرسمي */}
        <image
          href="/brand/alforat-logo.png"
          x="336" y="174" width="34" height="34"
          opacity="0.2"
          preserveAspectRatio="xMidYMid meet"
        />

        <rect width="400" height="225" fill={`url(#${uid}v)`} />

        {label && (
          <text
            x="26" y="20"
            fontSize="8.5"
            fontFamily="var(--font-plex-mono), monospace"
            fill={accent} fillOpacity="0.7"
            letterSpacing="2"
          >
            {label}
          </text>
        )}
      </g>
    </svg>
  );
}
