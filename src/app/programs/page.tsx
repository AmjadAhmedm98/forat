import type { Metadata } from "next";
import { ProgramsDirectory } from "@/components/programs/ProgramsDirectory";

export const metadata: Metadata = {
  title: "دليل البرامج",
  description: "برامج ونشرات قناة الفرات الفضائية — أغلفة وحلقات رسمية.",
};

export default function Page() {
  return <ProgramsDirectory />;
}
