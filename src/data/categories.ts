export type CategoryKey =
  | "iraq" | "world" | "sports" | "economic" | "miscellaneous" | "reports" | "video";

export interface Category {
  key: CategoryKey;
  name: string;
  short: string;
  /** تسمية لاتينية للعرض في اللوحات التقنية */
  latin: string;
  /** لون التمييز — يُستخدم في اللوحة التوليدية والوسوم */
  accent: string;
  blurb: string;
}

export const CATEGORIES: Category[] = [
  { key: "iraq", latin: "IRAQ",          name: "أخبار العراق", short: "العراق",  accent: "#00d7ff", blurb: "الشأن المحلي: الحكومة والبرلمان والأمن والخدمات في المحافظات." },
  { key: "world", latin: "WORLD",         name: "أخبار العالم", short: "العالم",  accent: "#0a54d8", blurb: "الإقليم والعالم كما يهمّ المشاهد العراقي." },
  { key: "economic", latin: "ECONOMY",      name: "اقتصادية",     short: "اقتصاد",  accent: "#4fe4ff", blurb: "النفط والدينار والموازنة والأسواق." },
  { key: "sports", latin: "SPORT",        name: "رياضية",       short: "رياضة",   accent: "#783cff", blurb: "المنتخب الوطني ودوري النجوم والملاعب العالمية." },
  { key: "miscellaneous", latin: "MIXED", name: "منوعات",       short: "منوعات",  accent: "#b62ddb", blurb: "علوم وتقنية وصحة وقصص من الحياة اليومية." },
  { key: "reports", latin: "REPORT",       name: "تقارير",       short: "تقارير",  accent: "#c9bfa3", blurb: "تقارير وتحليلات معمّقة من فريق الفرات." },
  { key: "video", latin: "VIDEO",         name: "فيديوات",      short: "فيديو",   accent: "#e5e3dc", blurb: "المادة المصوّرة: تقارير ميدانية ومقاطع النشرات." },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c]),
) as Record<CategoryKey, Category>;
