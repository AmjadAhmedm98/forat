import { scheduleFor, todayKey, type Slot, type DayKey } from "@/data/schedule";

export interface OnAir {
  current: Slot;
  next: Slot;
  /** نسبة التقدّم داخل الفقرة الحالية 0..1 */
  progress: number;
  /** الدقائق المتبقية */
  remaining: number;
  day: DayKey;
  /** true حين تكون الفقرة الحالية فاصلاً بين فقرتين مجدولتين */
  isFiller: boolean;
}

/**
 * فاصل يملأ الفجوات بين الفقرات المؤكّدة.
 * لا يدّعي محتوى بعينه — يذكر صراحةً أنه خارج الفقرات المؤكّدة.
 */
function filler(start: number, duration: number): Slot {
  return {
    start,
    duration,
    title: "بثّ الفرات المتصل",
    kind: "rerun",
    evidence: "name",
    evidenceNote: "خارج الفقرات ذات المواعيد المؤكّدة",
  };
}

/**
 * يبني جدولاً متصلاً بلا فجوات، ثم يحدّد الفقرة الجارية الآن.
 * يُستدعى على العميل فقط (يعتمد على الوقت الحالي).
 */
export function continuousSchedule(): { slot: Slot; isFiller: boolean }[] {
  const src = scheduleFor();
  const out: { slot: Slot; isFiller: boolean }[] = [];
  let cursor = 0;

  for (const s of src) {
    if (s.start > cursor) out.push({ slot: filler(cursor, s.start - cursor), isFiller: true });
    out.push({ slot: s, isFiller: false });
    cursor = Math.max(cursor, s.start + s.duration);
  }
  if (cursor < 1440) out.push({ slot: filler(cursor, 1440 - cursor), isFiller: true });

  return out;
}

export function onAir(now: Date = new Date()): OnAir {
  const day = todayKey(now);
  const timeline = continuousSchedule();
  const mins = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

  let idx = timeline.findIndex(
    (e) => mins >= e.slot.start && mins < e.slot.start + e.slot.duration,
  );
  if (idx === -1) idx = timeline.length - 1;

  const entry = timeline[idx];
  const current = entry.slot;

  // «التالي» = أول فقرة مجدولة حقيقية بعد الحالية (نتجاوز الفواصل)
  let nextEntry = timeline[(idx + 1) % timeline.length];
  for (let i = 1; i <= timeline.length; i++) {
    const cand = timeline[(idx + i) % timeline.length];
    if (!cand.isFiller) { nextEntry = cand; break; }
  }

  const span = Math.max(current.duration, 1);
  const elapsed = Math.min(Math.max(mins - current.start, 0), span);

  return {
    current,
    next: nextEntry.slot,
    progress: elapsed / span,
    remaining: Math.max(0, Math.round(current.start + span - mins)),
    day,
    isFiller: entry.isFiller,
  };
}

export const KIND_LABEL: Record<Slot["kind"], string> = {
  news: "نشرة",
  program: "برنامج",
  religious: "ديني",
  documentary: "وثائقي",
  rerun: "إعادة",
  quran: "تلاوة",
};
