import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/data/categories";
import { PROGRAMS } from "@/data/programs";
import { ALL } from "@/data/news";
import { SNAPSHOT } from "@/data/media";

const BASE = "https://alforattv.net";

export default function sitemap(): MetadataRoute.Sitemap {
  const stat: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "hourly" as const, priority: 1 },
    { url: `${BASE}/live`, changeFrequency: "hourly" as const, priority: 0.9 },
    { url: `${BASE}/breaking`, changeFrequency: "hourly" as const, priority: 0.9 },
    { url: `${BASE}/shorts`, changeFrequency: "daily" as const, priority: 0.8 },
    { url: `${BASE}/programs`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE}/radio`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE}/apps`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE}/about`, changeFrequency: "yearly" as const, priority: 0.5 },
    { url: `${BASE}/search`, changeFrequency: "monthly" as const, priority: 0.4 },
  ].map((e) => ({ ...e, lastModified: SNAPSHOT }));

  return [
    ...stat,
    ...CATEGORIES.map((c) => ({
      url: `${BASE}/news/${c.key}`,
      lastModified: SNAPSHOT,
      changeFrequency: "hourly" as const,
      priority: 0.7,
    })),
    ...PROGRAMS.map((p) => ({
      url: `${BASE}/programs/${p.slug}`,
      lastModified: SNAPSHOT,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...ALL.map((a) => ({
      url: `${BASE}/article/${encodeURIComponent(a.slug)}`,
      lastModified: new Date(SNAPSHOT.getTime() - a.agoMin * 60_000),
      changeFrequency: "daily" as const,
      priority: 0.6,
    })),
  ];
}
