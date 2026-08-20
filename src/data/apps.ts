import { YT_LIVE_URL } from "./media";

/**
 * ══════════════════════════════════════════════════════════════════════
 * منصّات تطبيق «الفرات نيوز»
 *
 * قاعدة دقّة ملزِمة: لا يُنشأ رابط تنزيل إلا إذا تُحقّق من كونه رسمياً.
 *  • App Store  — رابط رسمي مُتحقَّق منه (معرّف التطبيق 1494556520)
 *  • Google Play — رابط رسمي مُتحقَّق منه (حزمة com.rgn.alforatnews)
 *  • Huawei AppGallery — **لم يُعثر على تطبيق منشور**. يُعرض بوصفه
 *    خيار توزيع متوافق مستقبلاً، لا تطبيقاً منشوراً، وبلا أي رابط.
 * ══════════════════════════════════════════════════════════════════════
 */

export type DeviceKey = "ios" | "android" | "huawei";

export interface Device {
  key: DeviceKey;
  label: string;
  os: string;
  /** حالة التوزيع */
  status: "published" | "planned";
  storeName: string;
  /** رابط رسمي متحقَّق منه فقط — null حين لا يوجد */
  storeUrl: string | null;
  statusNote: string;
  /** تفاصيل تفاعلية تخصّ المنصّة */
  ui: {
    /** شكل الحوافّ */
    radius: number;
    /** نوع القصّة العلوية */
    notch: "island" | "punch" | "pill";
    /** مؤشّر الإيماءة السفلي */
    homeIndicator: boolean;
    /** زرّ الرجوع الخاص بالمنصّة */
    backGesture: string;
    /** لون تمييز واجهة النظام */
    accent: string;
    /** خطّ حالة النظام */
    statusStyle: string;
  };
}

export const DEVICES: Device[] = [
  {
    key: "ios",
    label: "iPhone",
    os: "iOS",
    status: "published",
    storeName: "App Store",
    storeUrl: "https://apps.apple.com/us/app/id1494556520",
    statusNote: "تطبيق «الفرات نيوز» متاح على App Store",
    ui: {
      radius: 46, notch: "island", homeIndicator: true,
      backGesture: "السحب من حافة الشاشة للرجوع",
      accent: "#0a54d8", statusStyle: "منحنى ديناميكي",
    },
  },
  {
    key: "android",
    label: "Android",
    os: "Android",
    status: "published",
    storeName: "Google Play",
    storeUrl: "https://play.google.com/store/apps/details?id=com.rgn.alforatnews",
    statusNote: "تطبيق «الفرات نيوز» متاح على Google Play",
    ui: {
      radius: 34, notch: "punch", homeIndicator: true,
      backGesture: "زرّ الرجوع في شريط النظام",
      accent: "#00d7ff", statusStyle: "ثقب الكاميرا",
    },
  },
  {
    key: "huawei",
    label: "Huawei",
    os: "HarmonyOS",
    status: "planned",
    storeName: "AppGallery",
    storeUrl: null,
    /**
     * داخلي: لا يوجد تطبيق منشور لقناة الفرات على AppGallery، فلا يُعرض أي
     * رابط متجر ولا أي ادّعاء بالنشر — الجهاز هنا معاينة للواجهة فقط.
     */
    statusNote:
      "معاينة واجهة تطبيق الفرات على أجهزة هواوي — التنزيل متاح حالياً من App Store و Google Play.",
    ui: {
      radius: 40, notch: "pill", homeIndicator: false,
      backGesture: "السحب من الحافة أو شريط الإيماءات",
      accent: "#783cff", statusStyle: "كبسولة علوية",
    },
  },
];

export const deviceByKey = (k: DeviceKey) => DEVICES.find((d) => d.key === k)!;

/** شاشات التطبيق داخل المعاينة */
export type ScreenKey = "home" | "article" | "live" | "shorts" | "radio" | "alerts" | "saved";

export const TABS: { key: ScreenKey; label: string; icon: string }[] = [
  { key: "home",   label: "الرئيسية", icon: "M10 2.6l7 5.8v8.2a1.4 1.4 0 01-1.4 1.4h-3.4v-5.2H7.8V18H4.4A1.4 1.4 0 013 16.6V8.4l7-5.8z" },
  { key: "live",   label: "مباشر",    icon: "M10 5.4a4.6 4.6 0 100 9.2 4.6 4.6 0 000-9.2zm0 2.4a2.2 2.2 0 110 4.4 2.2 2.2 0 010-4.4zM4.6 3.2l1.5 1.5A7.6 7.6 0 004 10c0 2 .8 3.9 2.1 5.3L4.6 16.8A9.6 9.6 0 012 10c0-2.6 1-5 2.6-6.8zm10.8 0A9.6 9.6 0 0118 10c0 2.6-1 5-2.6 6.8l-1.5-1.5A7.6 7.6 0 0016 10c0-2-.8-3.9-2.1-5.3l1.5-1.5z" },
  { key: "shorts", label: "Shorts",   icon: "M6 3.4h8a2.6 2.6 0 012.6 2.6v8a2.6 2.6 0 01-2.6 2.6H6A2.6 2.6 0 013.4 14V6A2.6 2.6 0 016 3.4zm2.4 3.4v6.4l5-3.2-5-3.2z" },
  { key: "radio",  label: "الإذاعة",  icon: "M10 2.5a7.5 7.5 0 00-7.5 7.5v4.2A2.3 2.3 0 004.8 16.5h1.4a1 1 0 001-1v-3.6a1 1 0 00-1-1H4.3V10a5.7 5.7 0 0111.4 0v.9h-1.9a1 1 0 00-1 1v3.6a1 1 0 001 1h1.4a2.3 2.3 0 002.3-2.3V10A7.5 7.5 0 0010 2.5z" },
  { key: "saved",  label: "محفوظة",   icon: "M5 2.6h10v14.8l-5-3.5-5 3.5V2.6z" },
];

export interface AppAlert {
  id: string;
  kind: "breaking" | "live" | "program" | "radio";
  title: string;
  body: string;
  agoMin: number;
  /** الشاشة التي يفتحها التنبيه داخل التطبيق */
  opens: ScreenKey;
  /** معرّف اختياري للمادة */
  ref?: string;
}

export const APP_ALERTS: AppAlert[] = [
  { id: "a1", kind: "breaking", agoMin: 8,
    title: "عاجل — الرئاسات الأربع",
    body: "اجتماع الرئاسات الأربع يبحث استكمال الكابينة وحصر السلاح",
    opens: "article", ref: "arriasat-alarbaa-alkabina-hasr-assilah" },
  { id: "a2", kind: "live", agoMin: 26,
    title: "مرصد الخامسة على الهواء",
    body: "بدأ بثّ نشرة الخامسة على شاشة الفرات",
    opens: "live" },
  { id: "a3", kind: "breaking", agoMin: 74,
    title: "اقتصاد — عجز الموازنة",
    body: "عجز الموازنة يلامس 21 تريليون دينار",
    opens: "article", ref: "ajz-almawazana-21-trilion" },
  { id: "a4", kind: "program", agoMin: 132,
    title: "برنامج ليتفقّهوا",
    body: "حلقة جديدة مع سماحة السيد عباس الزاملي",
    opens: "shorts" },
  { id: "a5", kind: "radio", agoMin: 210,
    title: "إذاعة الفرات",
    body: "بغداد 107.1 FM · النجف الأشرف 101.7 FM",
    opens: "radio" },
];

export const ALERT_META: Record<AppAlert["kind"], { label: string; color: string }> = {
  breaking: { label: "عاجل",   color: "#ff2d46" },
  live:     { label: "مباشر",  color: "#00d7ff" },
  program:  { label: "برنامج", color: "#783cff" },
  radio:    { label: "إذاعة",  color: "#0a54d8" },
};

export const APP_LIVE_URL = YT_LIVE_URL;
