import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * تحويل استجابي إلى AVIF/WebP دون أي قصّ:
     * محسّن Next يعيد التحجيم فقط ويحافظ على تأطير 16:9 الكامل
     * وعلى النصّ العربي المطبوع داخل الـ thumbnails الرسمية.
     */
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 420, 640, 768, 828, 1024, 1200, 1440, 1920],
    imageSizes: [96, 128, 176, 240, 320, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async redirects() {
    return [
      // مسار قديم: صفحة جدول البثّ أُزيلت — تُحوَّل إلى صفحة التطبيق بلا 404
      { source: "/schedule", destination: "/apps", permanent: true },
    ];
  },
};

export default nextConfig;
