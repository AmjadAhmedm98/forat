import type { Metadata, Viewport } from "next";
import { Almarai, IBM_Plex_Mono } from "next/font/google";
import { SiteChrome } from "@/components/chrome/SiteChrome";
import "./globals.css";

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
  variable: "--font-ar",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono-num",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "قناة الفرات الفضائية — المنصة الإعلامية الرقمية",
    template: "%s | الفرات",
  },
  description:
    "المنصة الرقمية لقناة الفرات الفضائية: الأخبار والبثّ المباشر والبرامج والإذاعة والفيديوهات القصيرة.",
  applicationName: "الفرات",
};

export const viewport: Viewport = {
  themeColor: "#02072a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${almarai.variable} ${plexMono.variable}`}>
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
