/** تنسيق عربي بأرقام لاتينية (كما في موقع الفرات الرسمي) */
const AR = "ar-IQ-u-nu-latn";

export function relativeTime(minutes: number): string {
  if (minutes < 1) return "الآن";
  if (minutes < 60) return `قبل ${minutes} دقيقة`;
  const h = Math.floor(minutes / 60);
  if (h < 24) return h === 1 ? "قبل ساعة" : h === 2 ? "قبل ساعتين" : `قبل ${h} ساعة`;
  const d = Math.floor(h / 24);
  if (d < 7) return d === 1 ? "أمس" : d === 2 ? "قبل يومين" : `قبل ${d} أيام`;
  const w = Math.floor(d / 7);
  return w === 1 ? "قبل أسبوع" : `قبل ${w} أسابيع`;
}

export function relativeDays(days: number): string {
  if (days === 0) return "اليوم";
  if (days === 1) return "أمس";
  if (days === 2) return "قبل يومين";
  if (days < 7) return `قبل ${days} أيام`;
  const w = Math.floor(days / 7);
  return w === 1 ? "قبل أسبوع" : `قبل ${w} أسابيع`;
}

export function compactViews(n: number): string {
  if (n < 1000) return String(n);
  if (n < 1_000_000) {
    const k = n / 1000;
    return `${k >= 10 ? Math.round(k) : k.toFixed(1).replace(/\.0$/, "")} ألف`;
  }
  const m = n / 1_000_000;
  return `${m >= 10 ? Math.round(m) : m.toFixed(1).replace(/\.0$/, "")} مليون`;
}

export function duration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function minutesLabel(m: number): string {
  if (m < 60) return `${m} دقيقة`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h} س ${r} د` : `${h} ساعة`;
}

export function arabicDate(d: Date): string {
  return new Intl.DateTimeFormat(AR, {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  }).format(d);
}

export function clock(d: Date, withSeconds = true): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return withSeconds
    ? `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
    : `${p(d.getHours())}:${p(d.getMinutes())}`;
}

/** بذرة عددية ثابتة من نص — لتوليد لوحات العرض بشكل حتمي */
export function seed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export const cx = (...v: (string | false | null | undefined)[]) =>
  v.filter(Boolean).join(" ");
