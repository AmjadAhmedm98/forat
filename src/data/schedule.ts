/**
 * ══════════════════════════════════════════════════════════════════════
 * جدول بثّ قناة الفرات — **مواعيد مؤكّدة فقط**
 *
 * قاعدة ملزِمة: لا تُختلق مواعيد بثّ. لا يدخل الجدول إلا فقرة يوجد لها دليل.
 *
 * الأدلّة المعتمدة:
 *  (أ) اسم النشرة الرسمي يحدّد وقتها صراحةً كما تنشره القناة:
 *      «نشرة الثامنة صباحاً» · «نشرة/مرصد الظهيرة» · «نشرة/مرصد الثالثة»
 *      «نشرة/مرصد الخامسة» · «مرصد الثامنة» · «نشرة/مرصد العاشرة»
 *      «نشرة الثانية عشرة بعد منتصف الليل»
 *  (ب) توقيت نشر بثوث «الآن | …» في تغذية القناة الرسمية (RSS)، بتوقيت بغداد:
 *      نشرة الثالثة → نُشر 14:58  ·  نشرة الخامسة → نُشر 16:32
 *      برنامج «ليتفقهوا» → نُشر 17:56
 *
 * كل برنامج بلا موعد مؤكّد لا يظهر هنا، بل في «دليل برامج الفرات» (/programs).
 * ══════════════════════════════════════════════════════════════════════
 */

export type Evidence = "name" | "live-feed" | "both";

export interface Slot {
  /** بداية الفقرة بالدقائق من منتصف الليل */
  start: number;
  /** المدة التقريبية للعرض؛ ليست مدة رسمية معلنة */
  duration: number;
  title: string;
  program?: string;
  host?: string;
  kind: "news" | "program" | "religious" | "documentary" | "rerun" | "quran";
  /** مصدر تأكيد الموعد */
  evidence: Evidence;
  /** شرح الدليل للعرض في الواجهة */
  evidenceNote: string;
}

/**
 * «موثّق من عنوان/نشر رسمي» تُستخدم فقط حين يكون وقت الفقرة صريحاً في المصدر:
 * إمّا داخل العنوان الرسمي نفسه، وإمّا في توقيت نشر بثّها على القناة.
 */
export const EVIDENCE_LABEL: Record<Evidence, string> = {
  name: "موثّق من عنوان رسمي",
  "live-feed": "موثّق من نشر رسمي",
  both: "موثّق من عنوان ونشر رسمي",
};

const t = (h: number, m = 0) => h * 60 + m;

/**
 * **الشبكة اليومية الثابتة** — تتكرّر كما هي كل يوم.
 * لم يُعثر على أي دليل رسمي يخصّص فقرة بيوم بعينه أو يفرّق بين أيام الأسبوع،
 * لذلك لا يُعرض تبويب أيام ولا يُدّعى اختلاف أسبوعي.
 */
export const CONFIRMED_SLOTS: Slot[] = [
  { start: t(0),  duration: 45, title: "نشرة الثانية عشرة بعد منتصف الليل", kind: "news",
    evidence: "name", evidenceNote: "الاسم الرسمي للنشرة يحدّد وقتها" },
  { start: t(8),  duration: 40, title: "نشرة الثامنة صباحاً", kind: "news",
    evidence: "name", evidenceNote: "الاسم الرسمي للنشرة يحدّد وقتها" },
  { start: t(12), duration: 45, title: "مرصد الظهيرة", program: "marsad-azzahira", kind: "news",
    evidence: "name", evidenceNote: "الاسم الرسمي للنشرة يحدّد وقتها" },
  { start: t(15), duration: 45, title: "مرصد الثالثة", program: "marsad-aththalitha", host: "فرح الشيخلي", kind: "news",
    evidence: "both", evidenceNote: "بثّ «الآن | نشرة الثالثة» نُشر 14:58 بتوقيت بغداد" },
  { start: t(17), duration: 45, title: "مرصد الخامسة", program: "marsad-alkhamisa", host: "غفران الجزائري", kind: "news",
    evidence: "both", evidenceNote: "بثّ «الآن | نشرة الخامسة» نُشر 16:32 بتوقيت بغداد" },
  { start: t(18), duration: 45, title: "ليتفقّهوا", program: "liyatafaqqahu", host: "السيد عباس الزاملي", kind: "religious",
    evidence: "live-feed", evidenceNote: "بثّ «الآن | برنامج ليتفقهوا» نُشر 17:56 بتوقيت بغداد" },
  { start: t(20), duration: 55, title: "مرصد الثامنة", program: "marsad-aththamina", host: "غفران الجزائري ومحمود قاسم", kind: "news",
    evidence: "name", evidenceNote: "الاسم الرسمي للنشرة يحدّد وقتها" },
  { start: t(22), duration: 45, title: "مرصد العاشرة", program: "marsad-alashira", kind: "news",
    evidence: "name", evidenceNote: "الاسم الرسمي للنشرة يحدّد وقتها" },
];

/** فقرات تُبثّ فعلاً لكن بلا موعد ثابت مؤكّد */
export const ROLLING = [
  { title: "الموجز الخبري", program: "almawjiz-alkhabari", note: "يتجدّد على مدار اليوم بين النشرات" },
  { title: "المرصد الخبري", program: undefined as string | undefined, note: "فقرة متجدّدة على مدار اليوم" },
];

export const DAYS = [
  { key: "sat", label: "السبت",   short: "س" },
  { key: "sun", label: "الأحد",   short: "ح" },
  { key: "mon", label: "الاثنين", short: "ن" },
  { key: "tue", label: "الثلاثاء",short: "ث" },
  { key: "wed", label: "الأربعاء",short: "ر" },
  { key: "thu", label: "الخميس",  short: "خ" },
  { key: "fri", label: "الجمعة",  short: "ج" },
] as const;

export type DayKey = (typeof DAYS)[number]["key"];
export const DAY_ORDER: DayKey[] = ["sat", "sun", "mon", "tue", "wed", "thu", "fri"];

/** الشبكة اليومية الثابتة — النتيجة نفسها لأي يوم */
export function scheduleFor(): Slot[] {
  return [...CONFIRMED_SLOTS].sort((a, b) => a.start - b.start);
}

export const NETWORK_LABEL = "الشبكة اليومية الثابتة";
export const NETWORK_NOTE =
  "تتكرّر هذه الشبكة كما هي كل يوم. لم يُعثر على مصدر رسمي يفرّق بين أيام الأسبوع، فلا يُدّعى اختلاف أسبوعي.";

export const fmtSlot = (m: number) =>
  `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

export function todayKey(d: Date = new Date()): DayKey {
  return (["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as DayKey[])[d.getDay()];
}
