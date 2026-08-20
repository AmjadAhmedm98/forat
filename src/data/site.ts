/**
 * بيانات القناة الرسمية — مصدرها صفحة «من نحن» والـ Key Art الرسمي وحسابات الفرات الموثّقة.
 * راجع docs/PHASE-0-RESEARCH.md للمصادر.
 */

export const SITE = {
  name: "قناة الفرات الفضائية",
  shortName: "الفرات",
  latin: "ALFORAT",
  hd: "HD",
  agency: "الفرات نيوز",
  tagline: "الأصالة والاعتدال",
  founded: "10 تشرين الثاني 2004",
  domains: ["alforattv.net", "alforatnews.com", "alforatnews.iq"],
  address: "العراق — بغداد — الكرادة، م 903 ز 10 — د 21",
  phone: "07758432028",
  coverage:
    "العراق والعالم العربي والآسيوي والأوروبي وأمريكا الشمالية وكندا وأستراليا ونيوزيلندا",
  about: [
    "«قناة الفرات» هي قناة عراقية مستقلة تأسست في 10 تشرين الثاني 2004، وتضم اليوم طاقماً من طليعة الإعلاميين وأفضل التقنيين العاملين في العراق، إضافة إلى وكالة «الفرات نيوز» الإخبارية التي تهتم بالشأن المحلي والعالمي وتواكب الأحداث السياسية والرياضية والاجتماعية.",
    "تتبنّى قناة الفرات الفضائية خطاباً معتدلاً لعراق واحد يقف على مسافة واحدة من جميع أطياف الشعب العراقي المتنوّع، وتعتبر هذا التنوّع الطريق نحو التعايش السلمي، والتسليم بتداول السلطة سلمياً.",
    "قناة الفرات الفضائية هي منبر الأفكار الخلّاقة، والفكر النقدي الهادف إلى تطوّر المجتمع، كما تشجّع الطاقات والمواهب العراقية في المجالات كافة وتعتبر ذلك من صلب دورها في بناء العراق الجديد.",
  ],
  satellite: {
    name: "NILESAT 201",
    frequency: "11746",
    polarization: "V",
    symbolRate: "27500",
    fec: "3/4",
  },
} as const;

export type SocialKey =
  | "facebook" | "youtube" | "instagram" | "x" | "tiktok" | "telegram";

export const SOCIALS: {
  key: SocialKey; label: string; handle: string; href: string;
}[] = [
  { key: "youtube",   label: "يوتيوب",    handle: "@alforat_tv",  href: "https://youtube.com/@alforat_tv" },
  { key: "facebook",  label: "فيسبوك",    handle: "alforattvnet", href: "https://facebook.com/alforattvnet" },
  { key: "instagram", label: "إنستغرام",  handle: "@alforat_tv",  href: "https://instagram.com/alforat_tv" },
  { key: "x",         label: "إكس",       handle: "@alforat_tv",  href: "https://x.com/alforat_tv" },
  { key: "tiktok",    label: "تيك توك",   handle: "@alforattvnet",href: "https://tiktok.com/@alforattvnet" },
  { key: "telegram",  label: "تلغرام",    handle: "@alforat_tv",  href: "https://t.me/alforat_tv" },
];

export const APP_STORES = [
  { key: "ios",     label: "App Store",   sub: "iPhone و iPad", href: "https://apps.apple.com/us/app/id1494556520", available: true },
  { key: "android", label: "Google Play", sub: "أندرويد",       href: "https://play.google.com/store/apps/details?id=com.rgn.alforatnews", available: true },
  { key: "huawei",  label: "AppGallery",  sub: "هواوي",         href: null, available: false },
] as const;
