import { HOME_SLOTS, type SlotId } from "@/config/home.config";
import { ALL, hasImage, hasFullImage, featured, type Article } from "@/data/news";
import type { CategoryKey } from "@/data/categories";

/**
 * منتقي الصفحة الرئيسية.
 *
 * يبني الخلاصة من `HOME_SLOTS` مع:
 *  • احترام الحدّ الأقصى لكل فتحة
 *  • السحب من التصنيفات المصرّح بها فقط (لا تعويض عابر للتصنيفات)
 *  • إزالة تكرار المواد عبر الصفحة كلها
 */
export class HomeFeed {
  private used = new Set<string>();

  /**
   * مجمّع المواد المؤهّلة.
   * `need = "full"` يقصر الاختيار على الصور عالية الدقّة الصالحة للبطاقات الكبيرة،
   * فلا تُعرض صورة مؤرشفة صغيرة في سياق أكبر من دقّتها.
   */
  private pool(from: CategoryKey[] | null, need: "full" | "any"): Article[] {
    const gate = need === "full" ? hasFullImage : hasImage;
    const list = ALL.filter(gate).sort((a, b) => a.agoMin - b.agoMin);
    return from ? list.filter((a) => from.includes(a.category)) : list;
  }

  /** يختار عناصر فتحة ويسجّلها كمستهلَكة */
  take(
    id: SlotId,
    opts: { prefer?: string[]; max?: number; quality?: "full" | "any" } = {},
  ): Article[] {
    const slot = HOME_SLOTS[id];
    const cap = Math.min(opts.max ?? slot.max, slot.max);
    const candidates = this.pool(slot.from, opts.quality ?? "full")
      .filter((a) => !this.used.has(a.slug));

    const out: Article[] = [];
    // تفضيل صريح أولاً (مثل المواد المميّزة يدوياً)
    for (const slug of opts.prefer ?? []) {
      if (out.length >= cap) break;
      const hit = candidates.find((a) => a.slug === slug);
      if (hit) out.push(hit);
    }
    for (const a of candidates) {
      if (out.length >= cap) break;
      if (!out.includes(a)) out.push(a);
    }

    out.forEach((a) => this.used.add(a.slug));
    return out;
  }

  /**
   * قائمة نصّية مضغوطة — لا تستهلك المواد، لكنها تستبعد ما ظهر في وحدات أخرى
   * حتى لا يتكرّر أي خبر على الصفحة (قاعدة إزالة التكرار الشاملة).
   */
  peek(id: SlotId, sort: "recent" | "views" = "views"): Article[] {
    const slot = HOME_SLOTS[id];
    const list = this.pool(slot.from, "any").filter((a) => !this.used.has(a.slug));
    const sorted = sort === "views"
      ? [...list].sort((a, b) => b.views - a.views)
      : list;
    return sorted.slice(0, slot.max);
  }

  has(slug: string) { return this.used.has(slug); }
  get count() { return this.used.size; }
}

/** يبني خلاصة الرئيسية كاملة بترتيب واحد حتمي */
export function buildHomeFeed() {
  const feed = new HomeFeed();

  // الهيرو: خبر أولوية واحد — يُفضَّل ما وسمه المحرّر، ضمن التصنيفات الوطنية فقط
  const editorPicks = featured()
    .filter((a) => HOME_SLOTS.hero.from!.includes(a.category))
    .map((a) => a.slug);
  const hero = feed.take("hero", { prefer: editorPicks })[0] ?? null;

  const topStories = feed.take("topStories");
  const iraq = feed.take("iraq");
  const economy = feed.take("economy");
  const world = feed.take("world");
  const reports = feed.take("reports");
  const variety = feed.take("variety");
  // فيديو ورياضة يُعرضان ببطاقات مصغّرة، فتكفيهما الصور متوسطة الدقّة
  const video = feed.take("video", { quality: "any" });
  const sports = feed.take("sports", { quality: "any" });

  // «الأكثر قراءة» قائمة نصّية مضغوطة — لا تستهلك ولا تُقصي
  const mostRead = feed.peek("mostRead");

  return { hero, topStories, iraq, economy, world, reports, variety, video, sports, mostRead };
}

export type HomeFeedData = ReturnType<typeof buildHomeFeed>;
