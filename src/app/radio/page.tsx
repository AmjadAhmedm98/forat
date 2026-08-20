import type { Metadata } from "next";
import { RadioClient } from "@/components/radio/RadioClient";

export const metadata: Metadata = {
  title: "إذاعة الفرات",
  description: "إذاعة الفرات — بغداد 107.1 FM والنجف الأشرف 101.7 FM.",
};

export default function Page() {
  return <RadioClient />;
}
