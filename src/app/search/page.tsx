import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPage } from "@/components/search/SearchPage";

export const metadata: Metadata = { title: "البحث" };

export default function Page() {
  return (
    <Suspense fallback={<div className="zone-light shell py-20 text-center text-[color:var(--fg-3)]">جارٍ التحميل…</div>}>
      <SearchPage />
    </Suspense>
  );
}
