import type { CategoryKey } from "@/data/categories";

/**
 * ════════════════════════════════════════════════════════════════════
 * إعدادات الصفحة الرئيسية التحريرية
 *
 * الصفحة الرئيسية **مختارة تحريرياً**، لا تُبنى بدمج مصفوفات الأرشيف
 * حسب الحجم. حجم الأرشيف لا يقرّر تركيب الصفحة.
 *
 * قواعد ملزِمة:
 *  1) لا قسم في الرئيسية يعرض أرشيف تصنيف كاملاً.
 *  2) لا تعويض من تصنيف إلى آخر — إن توفّر عنصران فقط في «العالم»
 *     يُعرض عنصران، ولا يُملأ الفراغ بالرياضة أو بغيرها.
 *  3) إزالة التكرار على مستوى الصفحة كلها: ما ظهر في الهيرو لا يتكرر.
 *  4) الأرشيف الكامل يبقى في صفحات الأقسام والبحث فقط.
 * ════════════════════════════════════════════════════════════════════
 */

export type SlotId =
  | "hero" | "topStories" | "iraq" | "economy" | "world"
  | "reports" | "variety" | "video" | "sports" | "shorts" | "mostRead";

export interface HomeSlot {
  id: SlotId;
  /** الحدّ الأقصى المطلق لعدد العناصر */
  max: number;
  /** التصنيفات المسموح السحب منها — لا تعويض من خارجها إطلاقاً */
  from: CategoryKey[] | null;
  /** ترتيب الظهور في الصفحة */
  order: number;
  title?: string;
  sub?: string;
  href?: string;
  hrefLabel?: string;
}

export const HOME_SLOTS: Record<SlotId, HomeSlot> = {
  /** خبر أولوية واحد — يُفضَّل الشأن الوطني. لا يقع على الرياضة أبداً. */
  hero: {
    id: "hero", max: 1, order: 10,
    from: ["iraq", "reports", "economic", "world"],
  },

  topStories: {
    id: "topStories", max: 4, order: 20,
    from: ["iraq", "reports", "economic", "world", "miscellaneous", "video"],
    title: "أبرز الأخبار", sub: "مختارات محرّري الفرات", href: "/news/iraq",
  },

  iraq: {
    id: "iraq", max: 4, order: 30, from: ["iraq"],
    title: "أخبار العراق", href: "/news/iraq",
  },

  economy: {
    id: "economy", max: 3, order: 40, from: ["economic"],
    title: "اقتصادية", href: "/news/economic",
  },

  world: {
    id: "world", max: 3, order: 50, from: ["world"],
    title: "أخبار العالم", href: "/news/world",
  },

  reports: {
    id: "reports", max: 3, order: 60, from: ["reports"],
    title: "تقارير وتحليلات", sub: "قراءة أعمق من الخبر", href: "/news/reports",
  },

  variety: {
    id: "variety", max: 4, order: 70, from: ["miscellaneous"],
    title: "منوعات", href: "/news/miscellaneous",
  },

  video: {
    id: "video", max: 6, order: 80, from: ["video"],
    title: "فيديوات الفرات", href: "/news/video",
  },

  /** وحدة رياضية واحدة فقط، أسفل الصفحة */
  sports: {
    id: "sports", max: 4, order: 90, from: ["sports"],
    title: "رياضة", href: "/news/sports", hrefLabel: "كل الأخبار الرياضية",
  },

  shorts: { id: "shorts", max: 6, order: 55, from: null, title: "الفرات Shorts", href: "/shorts" },

  /** قائمة نصّية مضغوطة — لا قوائم طويلة في الرئيسية */
  mostRead: { id: "mostRead", max: 5, order: 25, from: null, title: "الأكثر قراءة" },
};

/** التصنيفات الممنوع أن تُستخدم كتعويض في أي فتحة */
export const NEVER_BACKFILL: CategoryKey[] = ["sports"];

export const slotsInOrder = () =>
  Object.values(HOME_SLOTS).sort((a, b) => a.order - b.order);
