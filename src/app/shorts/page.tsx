import type { Metadata } from "next";
import { Suspense } from "react";
import { ShortsFeed } from "@/components/shorts/ShortsFeed";

export const metadata: Metadata = {
  title: "الفرات Shorts",
  description: "مقاطع عمودية قصيرة من قناة الفرات الفضائية.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="zone-dark shell py-24 text-center text-[color:var(--fg-3)]">جارٍ التحميل…</div>}>
      <ShortsFeed />
    </Suspense>
  );
}
