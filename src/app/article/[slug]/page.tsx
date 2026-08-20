import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleReader } from "@/components/article/ArticleReader";
import { bySlug, related, nextArticle, ALL, hasImage } from "@/data/news";

export async function generateStaticParams() {
  return ALL.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const a = bySlug(decodeURIComponent(slug));
  if (!a) return { title: "الخبر غير موجود" };
  return { title: a.title, description: a.lede || a.title };
}

export default async function ArticlePage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const a = bySlug(decodeURIComponent(slug));
  if (!a) notFound();

  const rel = related(a, 4);
  const pool = ALL.filter(hasImage);
  const next = nextArticle(a) ?? pool[0];

  return <ArticleReader a={a} related={rel} next={next} />;
}
