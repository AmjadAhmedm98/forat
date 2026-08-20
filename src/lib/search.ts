import { ALL, articleImage } from "@/data/news";
import { PROGRAMS } from "@/data/programs";
import { SHORTS } from "@/data/shorts";
import { CATEGORY_MAP } from "@/data/categories";
import { ytImage } from "@/data/media";

export type ResultKind = "news" | "video" | "program" | "short";

export interface SearchHit {
  kind: ResultKind;
  id: string;
  title: string;
  sub: string;
  href: string;
  accent: string;
  /** صورة رسمية إن وُجدت */
  image: string | null;
  /** إزاحة زمنية بالدقائق للترتيب والفلترة */
  agoMin: number;
  score: number;
}

/** تطبيع عربي: إزالة التشكيل وتوحيد الألف والهاء والياء */
export function normalizeAr(s: string): string {
  return s
    .replace(/[ً-ْٰـ]/g, "")
    .replace(/[إأآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[ؤئ]/g, "ء")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

let INDEX: SearchHit[] | null = null;

function build(): SearchHit[] {
  const out: SearchHit[] = [];

  for (const a of ALL) {
    const cat = CATEGORY_MAP[a.category];
    out.push({
      kind: a.hasVideo || a.category === "video" ? "video" : "news",
      id: a.slug,
      title: a.title,
      sub: a.lede ? `${cat.name} · ${a.lede}` : `${cat.name} · ${a.desk}`,
      href: `/article/${a.slug}`,
      accent: cat.accent,
      image: articleImage(a),
      agoMin: a.agoMin,
      score: 0,
    });
  }

  for (const p of PROGRAMS) {
    out.push({
      kind: "program",
      id: p.slug,
      title: p.title,
      sub: p.host ? `${p.host} · ${p.blurb}` : p.blurb,
      href: `/programs/${p.slug}`,
      accent: p.accent,
      image: ytImage(p.cover),
      agoMin: 100_000, // البرامج ليست مادة زمنية — تُستبعد من ترتيب «الأحدث»
      score: 0,
    });
  }

  for (const s of SHORTS) {
    const cat = CATEGORY_MAP[s.category];
    out.push({
      kind: "short",
      id: s.id,
      title: s.title,
      sub: `الفرات Shorts · ${cat.name}`,
      href: `/shorts?v=${s.id}`,
      accent: cat.accent,
      image: ytImage(s.yt),
      agoMin: s.agoHours * 60,
      score: 0,
    });
  }

  return out;
}

export function searchIndex(): SearchHit[] {
  if (!INDEX) INDEX = build();
  return INDEX;
}

export interface SearchOpts {
  kinds?: ResultKind[];
  /** أقصى عمر بالساعات */
  withinHours?: number;
  limit?: number;
}

export const DATE_FILTERS = [
  { key: "any",  label: "أي وقت",       hours: 0 },
  { key: "24h",  label: "آخر 24 ساعة",  hours: 24 },
  { key: "7d",   label: "آخر أسبوع",     hours: 24 * 7 },
  { key: "30d",  label: "آخر شهر",       hours: 24 * 30 },
] as const;

export function search(q: string, opts: SearchOpts = {}): SearchHit[] {
  const { kinds, withinHours, limit = 60 } = opts;
  const nq = normalizeAr(q);
  const terms = nq.split(" ").filter((t) => t.length > 1);

  let pool = searchIndex();
  if (kinds?.length) pool = pool.filter((h) => kinds.includes(h.kind));
  if (withinHours) pool = pool.filter((h) => h.agoMin <= withinHours * 60);

  if (!terms.length) {
    return [...pool].sort((a, b) => a.agoMin - b.agoMin).slice(0, limit);
  }

  const hits: SearchHit[] = [];
  for (const h of pool) {
    const nt = normalizeAr(h.title);
    const ns = normalizeAr(h.sub);
    let score = 0;
    for (const t of terms) {
      if (nt.startsWith(t)) score += 14;
      else if (nt.includes(` ${t}`)) score += 9;
      else if (nt.includes(t)) score += 6;
      if (ns.includes(t)) score += 2;
    }
    if (score > 0) {
      // ترجيح الطزاجة
      score += Math.max(0, 6 - h.agoMin / 240);
      if (h.kind === "program") score += 3;
      hits.push({ ...h, score });
    }
  }

  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}

export const KIND_LABEL: Record<ResultKind, string> = {
  news: "خبر",
  video: "فيديو",
  program: "برنامج",
  short: "Shorts",
};

export const SUGGESTIONS = [
  "حصر السلاح",
  "موازنة البرامج",
  "الكهرباء",
  "الدينار",
  "ألو خدمات",
  "النقطة",
  "دوري النجوم",
];
