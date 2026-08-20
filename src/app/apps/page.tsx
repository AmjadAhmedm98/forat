import type { Metadata } from "next";
import { AppsClient } from "@/components/apps/AppsClient";

export const metadata: Metadata = {
  title: "تطبيق الفرات",
  description: "عرض تفاعلي لتطبيق الفرات نيوز على iOS و Android.",
};

export default function Page() {
  return <AppsClient />;
}
