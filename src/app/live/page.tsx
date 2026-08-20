import type { Metadata } from "next";
import { LiveClient } from "@/components/live/LiveClient";

export const metadata: Metadata = {
  title: "البثّ المباشر",
  description: "تلفزيون الفرات المباشر — الآن على الهواء وجدول اليوم.",
};

export default function LivePage() {
  return <LiveClient />;
}
