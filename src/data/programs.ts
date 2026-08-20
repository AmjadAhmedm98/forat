import { ytImage, ytUrl } from "./media";

/**
 * أسماء البرامج والمقدّمين وأغلفتها من قوائم التشغيل الرسمية لقناة الفرات على
 * YouTube (youtube.com/@alforat_tv). كل غلاف/حلقة يحمل `yt` هو مادة رسمية منشورة،
 * وصورتها هي الـ thumbnail الأصلي المخزّن في `public/media/yt/`.
 * الحلقات التي لا يتوفر لها فيديو رسمي في لقطة البيانات تُعرض كسطور تحريرية بلا صورة.
 */

export type ProgramGenre =
  | "news" | "talk" | "political" | "service" | "investigative"
  | "social" | "religious" | "cultural" | "sports";

export interface Episode {
  id: string;
  /** معرّف الفيديو الرسمي — إن وُجد ظهرت صورة حقيقية */
  yt?: string;
  title: string;
  agoDays: number;
  duration: number;
  views: number;
}

export interface Program {
  slug: string;
  title: string;
  host?: string;
  genre: ProgramGenre;
  /** المدة التقريبية للعرض — ليست مدة رسمية معلنة */
  duration: number;
  /**
   * موعد البثّ المؤكّد. `null` = لم يُعثر على مصدر رسمي يؤكّده،
   * ولا يُختلق موعد بديل — يظهر البرنامج في الدليل بلا موعد.
   */
  airtime: { time: string; days: string[]; evidence: string } | null;
  blurb: string;
  about: string;
  accent: string;
  /** معرّف الفيديو الرسمي المستخدم غلافاً */
  cover: string;
  episodes: Episode[];
  flagship?: boolean;
}

export const GENRES: { key: ProgramGenre | "all"; label: string }[] = [
  { key: "all",           label: "الكل" },
  { key: "news",          label: "إخباري" },
  { key: "political",     label: "سياسي" },
  { key: "talk",          label: "حواري" },
  { key: "service",       label: "خدمي" },
  { key: "investigative", label: "تحقيقات" },
  { key: "social",        label: "مجتمعي" },
  { key: "religious",     label: "ديني" },
  { key: "cultural",      label: "ثقافي" },
];

const ep = (
  id: string, title: string, agoDays: number, duration: number, views: number, yt?: string,
): Episode => ({ id, title, agoDays, duration, views, yt });

export const PROGRAMS: Program[] = [
  {
    slug: "annuqta", title: "النقطة", host: "علي وجيه",
    genre: "political", duration: 60, airtime: null,
    accent: "#00d7ff", flagship: true, cover: "9Thm1Cv0pq4",
    blurb: "حوار سياسي مباشر يضع الملف الأسخن على الطاولة بلا مواربة.",
    about:
      "برنامج حواري سياسي يقدّمه الإعلامي علي وجيه، يستضيف صنّاع القرار والمختصين لمناقشة الملفات الأكثر إلحاحاً على الساحة العراقية، بأسلوب يوازن بين المساءلة والاحترام المهني.",
    episodes: [
      ep("9Qx-12Ymmp8", "أحمد عبد ربه: موازنة البرامج ستربط الإنفاق الحكومي بالنتائج", 1, 61, 128000, "9Qx-12Ymmp8"),
      ep("k4SYEr-WG1I", "صلاحيات أوسع للمحافظات .. والبرلمان يعيد ترتيب العلاقة مع المركز", 2, 57, 96400, "k4SYEr-WG1I"),
      ep("nq-3", "حصر السلاح: من يملك القرار ومن يتحمّل الكلفة؟", 5, 58, 74100),
      ep("nq-4", "أزمة الكهرباء بين الفجوة والحلول المؤجلة", 11, 62, 88300),
    ],
  },
  {
    slug: "salon-ali-wajih", title: "صالون علي وجيه", host: "علي وجيه",
    genre: "talk", duration: 45, airtime: null,
    accent: "#783cff", cover: "NguJBBOQ11A",
    blurb: "جلسة مفتوحة مع ضيف واحد.. سيرة وأفكار خارج ضغط الخبر اليومي.",
    about:
      "صالون حواري أسبوعي يستضيف شخصية واحدة في جلسة ممتدة، بعيداً عن إيقاع النشرة، للحديث عن التجربة والفكرة والموقف.",
    episodes: [
      ep("sw-1", "المثقف والسلطة.. حوار في الحدود والمسافات", 2, 47, 41200),
      ep("sw-2", "أن تكتب في زمن الضجيج", 9, 44, 33600),
      ep("sw-3", "الذاكرة العراقية وأسئلة الهوية", 16, 49, 28900),
    ],
  },
  {
    slug: "bila-qina", title: "بلا قناع", host: "ابتسام السراي",
    genre: "talk", duration: 50, airtime: null,
    accent: "#b62ddb", flagship: true, cover: "PyJ_fEJy__o",
    blurb: "أسئلة مباشرة بلا تجميل.. والضيف وحده أمام الكاميرا.",
    about:
      "برنامج حواري تقدّمه الإعلامية ابتسام السراي، يقوم على المواجهة الصريحة مع الضيف حول ما يُطرح في الشارع من أسئلة.",
    episodes: [
      ep("bq-1", "ملف الفساد: من يحمي المتنفّذين؟", 2, 52, 143000),
      ep("bq-2", "الخدمات في المحافظات.. وعود تتكرر", 6, 48, 91700),
      ep("bq-3", "المرأة في المشهد السياسي العراقي", 13, 51, 67300),
    ],
  },
  {
    slug: "almuqaraba", title: "المقاربة", host: "مرتضى الحمامي",
    genre: "talk", duration: 45, airtime: null,
    accent: "#4fe4ff", cover: "FK1R59lBtqE",
    blurb: "قراءة فكرية هادئة تضع الحدث في سياقه الأوسع.",
    about: "برنامج فكري تحليلي يقارب القضايا العامة من زاوية أعمق من الخبر، بمشاركة باحثين ومختصين.",
    episodes: [
      ep("mq-1", "الدولة والمجتمع.. أين تمرّ الحدود؟", 3, 46, 38400),
      ep("mq-2", "الاقتصاد الريعي وسؤال البديل", 10, 44, 31200),
      ep("mq-3", "التعليم بوصفه مشروعاً وطنياً", 17, 47, 26800),
    ],
  },
  {
    slug: "alo-khadamat", title: "ألو خدمات", host: "عدي الجنديل",
    genre: "service", duration: 40, airtime: null,
    accent: "#0a54d8", flagship: true, cover: "D6dJ0th6Qds",
    blurb: "شكوى المواطن تصل مباشرة إلى الجهة المسؤولة.. والكاميرا تتابع حتى الحل.",
    about:
      "برنامج خدمي ميداني يقدّمه عدي الجنديل، يستقبل شكاوى المواطنين وينقلها إلى الجهات المعنية ويتابع تنفيذ المعالجة على الأرض.",
    episodes: [
      ep("D6dJ0th6Qds", "استجابة سريعة لشكوى على شارع في منطقة البلديات", 0, 38, 57400, "D6dJ0th6Qds"),
      ep("5ZuvrbO4Lrc", "استجابة سريعة لمتصلة من الكرادة الشرقية من قبل مدير عام البلدية", 1, 41, 44300, "5ZuvrbO4Lrc"),
      ep("oqTsmvqABRI", "أزمة الكهرباء تخنق حي الغدير الثانية في ميسان", 2, 44, 62100, "oqTsmvqABRI"),
      ep("ak-4", "مياه غير صالحة في قرية بالديوانية.. والحل بعد أسبوع", 7, 39, 48900),
    ],
  },
  {
    slug: "alo-shuoon", cover: "emaFwAqqHlw", title: "ألو شؤون",
    genre: "service", duration: 45, airtime: null,
    accent: "#4fe4ff",
    blurb: "برنامج خدمي على الهواء يستقبل شؤون المواطنين ومطالبهم.",
    about:
      "برنامج خدمي تبثّه قناة الفرات على الهواء مباشرة، يستقبل اتصالات المواطنين في شؤونهم ومعاملاتهم وينقلها إلى الجهات المعنية. مؤكّد من بثوث «الآن | برنامج ألو شؤون» على القناة الرسمية.",
    episodes: [
      ep("emaFwAqqHlw", "ألو شؤون — الحلقة الكاملة على شاشة الفرات", 0, 45, 21400, "emaFwAqqHlw"),
    ],
  },
  {
    slug: "ma-baad-aljarima", title: "ما بعد الجريمة", host: "أحمد عباس",
    genre: "investigative", duration: 45, airtime: null,
    accent: "#c9bfa3", cover: "1hDSqeFGCpM",
    blurb: "ملفات مغلقة تُفتح من جديد.. ما الذي حدث بعد أن انطفأت الأضواء؟",
    about:
      "برنامج تحقيقات يعيد فتح القضايا الجنائية التي شغلت الرأي العام، ويتتبّع مساراتها القضائية وأثرها على الضحايا وذويهم.",
    episodes: [
      ep("bbOYIZFdiYI", "أب أنهكه الانتظار .. عشرة أيام بلا خبر عن ابنه المفقود في الغرّاف", 1, 44, 214000, "bbOYIZFdiYI"),
      ep("c9b0q7urXGA", "عمار جبر أمام حكم بالسجن سبع سنوات .. ومليار و728 مليون دينار غرامة", 3, 46, 132000, "c9b0q7urXGA"),
      ep("RCVGBR6uK7w", "أفراح الشمري: في قبضة النزاهة .. تحقيقات بقضايا رشوة وتزوير عقاري", 6, 43, 98700, "RCVGBR6uK7w"),
    ],
  },
  {
    slug: "aal-mastara", title: "عالمسطرة", host: "أمل علي",
    genre: "social", duration: 40, airtime: null,
    accent: "#00d7ff", cover: "WNyeDGmomh0",
    blurb: "قضايا المجتمع كما يعيشها الناس لا كما تُروى في المكاتب.",
    about:
      "برنامج مجتمعي تقدّمه الإعلامية أمل علي، يضع القضايا اليومية على المسطرة: التعليم، الأسرة، سوق العمل، والفجوة بين القرار والواقع.",
    episodes: [
      ep("am-1", "الإيجارات ترتفع.. والدخل ثابت", 2, 39, 52300),
      ep("am-2", "الابتزاز الإلكتروني: من الأكثر عرضة؟", 9, 41, 87600),
      ep("am-3", "بين المدرسة والبيت.. من يربّي؟", 16, 38, 45100),
    ],
  },
  {
    slug: "sunduq-alamniyat", title: "صندوق الأمنيات", host: "انسجام الغراوي",
    genre: "social", duration: 35, airtime: null,
    accent: "#b62ddb", cover: "0XHsjvZ7lDU",
    blurb: "أمنية واحدة كل حلقة.. وقصة تتغيّر أمام الكاميرا.",
    about:
      "برنامج اجتماعي إنساني تقدّمه انسجام الغراوي، يلتقي أسراً وأفراداً ويعمل على تحقيق أمنية واحدة تُحدث فرقاً حقيقياً في حياتهم.",
    episodes: [
      ep("sa-1", "بيت لأسرة فقدت معيلها", 4, 36, 176000),
      ep("sa-2", "كرسي متحرك وطريق إلى المدرسة", 11, 34, 143000),
      ep("sa-3", "مشروع صغير يعيد الأمل", 18, 37, 112000),
    ],
  },
  {
    slug: "yuhyi-alquloob", title: "يحيي القلوب", host: "انسجام الغراوي",
    genre: "religious", duration: 30, airtime: null,
    accent: "#c9bfa3", cover: "bibMUQuPAuI",
    blurb: "وقفة يومية قصيرة مع معنى.",
    about: "برنامج ديني وجداني يقدّم موعظة قصيرة وقراءة في القيم الأخلاقية بأسلوب هادئ.",
    episodes: [
      ep("yq-1", "الصبر وأثره في السلوك", 1, 29, 34200),
      ep("yq-2", "صلة الرحم في زمن الانشغال", 3, 31, 29800),
    ],
  },
  {
    slug: "liyatafaqqahu", title: "ليتفقّهوا", host: "السيد عباس الزاملي",
    genre: "religious", duration: 45, airtime: null,
    accent: "#e5e3dc", cover: "bmdQsdfh2Ws",
    blurb: "أسئلة الناس الفقهية.. وإجابات مباشرة على الهواء.",
    about:
      "برنامج فقهي يقدّمه سماحة السيد عباس الزاملي، يجيب فيه عن أسئلة المشاهدين في المسائل الشرعية والمعاملات اليومية.",
    episodes: [
      ep("bmdQsdfh2Ws", "ليتفقّهوا — الحلقة الكاملة", 0, 44, 68400, "bmdQsdfh2Ws"),
      ep("Z8Wf2ka1MKI", "إذا اقترض شخص ذهباً قبل سنوات فهل يعيده بالمثل أم بقيمته الحالية؟", 2, 3, 15000, "Z8Wf2ka1MKI"),
      ep("dxeaknPYGkk", "والدي يريد تسجيل أملاكه باسم أبناء أخي الشهيد .. فما الحكم الشرعي؟", 4, 3, 34000, "dxeaknPYGkk"),
      ep("RIyVy0cfzW4", "هل يكفي التيمم لمن يعجز عن الوضوء بسبب المرض أو الإعاقة؟", 6, 2, 22000, "RIyVy0cfzW4"),
    ],
  },
  {
    slug: "o-plus", title: "‎+O", host: "علي سعد، فرح الشيخلي، الشيخ أحمد الصيمري",
    genre: "talk", duration: 60, airtime: null,
    accent: "#783cff", cover: "k87aFg44J10",
    blurb: "ثلاثة مقاعد وثلاث زوايا.. حوار منوّع يخلط الفكرة بالخبر.",
    about:
      "برنامج حواري منوّع بثلاثة مقدّمين، يجمع بين المقاربة الاجتماعية والدينية والإعلامية في طرح واحد.",
    episodes: [
      ep("op-1", "الشباب وسوق العمل.. أين الخلل؟", 3, 58, 63200),
      ep("op-2", "الإعلام الجديد وأثره على الوعي العام", 10, 61, 47800),
    ],
  },
  {
    slug: "jaddat-alhadharat", title: "جدّة الحضارات",
    genre: "cultural", duration: 30, airtime: null,
    accent: "#4fe4ff", cover: "-sfX-YPq8jg",
    blurb: "من بلاد الرافدين إلى العالم.. حكاية أرض علّمت الكتابة.",
    about:
      "سلسلة وثائقية ثقافية تتنقّل بين المواقع الأثرية والمخطوطات لتروي إسهام العراق في الحضارة الإنسانية.",
    episodes: [
      ep("jh-1", "أور.. حين وُلدت المدينة", 6, 28, 39400),
      ep("jh-2", "بابل وقانون حمورابي", 13, 31, 34700),
      ep("jh-3", "بيت الحكمة في بغداد", 20, 29, 30100),
    ],
  },
  {
    slug: "almawjiz-alkhabari", title: "الموجز الخبري",
    genre: "news", duration: 10, airtime: null,
    accent: "#00d7ff", flagship: true, cover: "r-jJt-Vlxao",
    blurb: "أهم ما جرى في عشر دقائق.. يتجدّد على مدار اليوم.",
    about:
      "موجز إخباري مكثّف يغطي أبرز التطورات المحلية والدولية، ويُبثّ على مدار اليوم بين النشرات الرئيسة.",
    episodes: [
      ep("SFDvWRREG6E", "الرئاسات الأربع تجتمع... وحصر السلاح والسيادة يتصدران الملفات", 0, 11, 41200, "SFDvWRREG6E"),
      ep("DHTLJe2Ecj4", "رسائل سياسية وتحركات إقليمية وملفات خدمية في واجهة الموجز الخبري", 0, 10, 36800, "DHTLJe2Ecj4"),
      ep("r-jJt-Vlxao", "الزيدي يطالب بخطط عاجلة لضمان استمرار صادرات النفط", 1, 12, 33100, "r-jJt-Vlxao"),
      ep("v-kIrEkIlGc", "وفد إيراني رفيع برئاسة قاليباف يزور العراق للقاء كبار المسؤولين", 1, 11, 23600, "v-kIrEkIlGc"),
      ep("VEcNESDge1U", "استهداف طال مكتب رئيس الحكومة ومقر إقامة أمن الإقليم", 2, 10, 34200, "VEcNESDge1U"),
    ],
  },
  {
    slug: "marsad-azzahira", cover: "7aNoRt9Lfrg", title: "مرصد الظهيرة",
    genre: "news", duration: 45,
    airtime: { time: "12:00", days: ["يومياً"], evidence: "الاسم الرسمي للنشرة يحدّد وقتها" },
    accent: "#4fe4ff",
    blurb: "نشرة منتصف النهار — حصاد الصباح وأبرز ما استجدّ.",
    about: "نشرة إخبارية يومية تُبثّ ظهراً على شاشة قناة الفرات، تجمع حصاد الساعات الأولى من اليوم محلياً وإقليمياً.",
    episodes: [
      ep("V6S4wSb2aGM", "أكثر من 400 مليار دينار حصيلة مكافحة الفساد", 0, 45, 24870, "V6S4wSb2aGM"),
      ep("8DWXC1PB8Bs", "ما وراء زيارة قاليباف إلى العراق؟", 0, 44, 18200, "8DWXC1PB8Bs"),
      ep("O9jAdK4hQ24", "تطلعات شعبية في تأمين الرواتب وحماية الاقتصاد الوطني", 1, 43, 39400, "O9jAdK4hQ24"),
    ],
  },
  {
    slug: "marsad-aththalitha", cover: "iA3AOTFrg9w", title: "مرصد الثالثة", host: "فرح الشيخلي",
    genre: "news", duration: 45,
    airtime: { time: "15:00", days: ["يومياً"], evidence: "بثّ «الآن | نشرة الثالثة» نُشر 14:58 بتوقيت بغداد" },
    accent: "#00d7ff", flagship: true,
    blurb: "نشرة العصر — تغطية متجدّدة لأحداث النهار.",
    about: "نشرة إخبارية يومية تُبثّ عند الثالثة عصراً، وقد تأكّد موعدها من توقيت نشر بثّها المباشر على قناة الفرات الرسمية.",
    episodes: [
      ep("TxJ8qt2vL08", "الزيدي يهاتف بارزاني ويدين الاعتداء على إقليم كردستان", 0, 44, 27300, "TxJ8qt2vL08"),
      ep("eOuuzhTQBEQ", "طائرتان مسيّرتان في هجوم جديد على إقليم كردستان", 1, 45, 30800, "eOuuzhTQBEQ"),
    ],
  },
  {
    slug: "marsad-alkhamisa", cover: "xtQYoD2WWGQ", title: "مرصد الخامسة", host: "غفران الجزائري",
    genre: "news", duration: 45,
    airtime: { time: "17:00", days: ["يومياً"], evidence: "بثّ «الآن | نشرة الخامسة» نُشر 16:32 بتوقيت بغداد" },
    accent: "#0a54d8", flagship: true,
    blurb: "نشرة المساء الأولى — ما قبل النشرة الرئيسة.",
    about: "نشرة إخبارية يومية تُبثّ عند الخامسة مساءً، وقد تأكّد موعدها من توقيت نشر بثّها المباشر على قناة الفرات الرسمية.",
    episodes: [
      ep("RKL5Jox7ImM", "رئيس الوزراء يمهل الكتل أسبوعاً لاستكمال مرشحي الوزارات الشاغرة", 0, 44, 33100, "RKL5Jox7ImM"),
      ep("P65CETl9dfs", "قانون المحافظات على جدول أعمال البرلمان وسط ترقّب لمناقشة مواده", 1, 45, 15600, "P65CETl9dfs"),
      ep("1gbZmcyI29I", "خمس محافظات تُنهي إجراءات التوزيع ضمن مبادرة المليون قطعة السكنية", 0, 43, 12800, "1gbZmcyI29I"),
    ],
  },
  {
    slug: "marsad-alashira", cover: "8E6ZIHDiCIU", title: "مرصد العاشرة",
    genre: "news", duration: 45,
    airtime: { time: "22:00", days: ["يومياً"], evidence: "الاسم الرسمي للنشرة يحدّد وقتها" },
    accent: "#783cff",
    blurb: "نشرة ما قبل منتصف الليل — خلاصة اليوم.",
    about: "نشرة إخبارية يومية تُبثّ عند العاشرة ليلاً وتقدّم خلاصة أحداث اليوم قبل نشرة منتصف الليل.",
    episodes: [
      ep("Jkftk9Uv65E", "قاليباف يزور العراق ويلتقي كبار المسؤولين", 0, 44, 17400, "Jkftk9Uv65E"),
      ep("WCevsJ_FZLk", "مواعيد استكمال الحكومة تتأجل", 1, 43, 21100, "WCevsJ_FZLk"),
    ],
  },
  {
    slug: "marsad-aththamina", title: "مرصد الثامنة", host: "غفران الجزائري، محمود قاسم",
    genre: "news", duration: 55, airtime: null,
    accent: "#0a54d8", flagship: true, cover: "zNvz8Qw60zo",
    blurb: "النشرة الرئيسة.. الصورة الكاملة ليوم كامل.",
    about:
      "النشرة الإخبارية الرئيسة لقناة الفرات، تقدّم تغطية موسّعة لأحداث اليوم مع تقارير المراسلين ومداخلات المحللين.",
    episodes: [
      ep("KOt0PFDMyJM", "عجز الموازنة يلامس 21 تريليون دينار", 0, 54, 88700, "KOt0PFDMyJM"),
      ep("Ql72dmkOVPo", "الرئاسات الأربع تبحث استكمال الكابينة وحصر السلاح", 1, 56, 76400, "Ql72dmkOVPo"),
      ep("j6AZs5vXZgU", "إعادة طرح مشروع حذف الأصفار من الدينار", 2, 53, 52300, "j6AZs5vXZgU"),
      ep("zNvz8Qw60zo", "تضارب بمذكرة رئيس اللجنة الأمنية في بابل بين نفي وتأكيد", 3, 55, 19800, "zNvz8Qw60zo"),
    ],
  },
];

export const programBySlug = (s: string) => PROGRAMS.find((p) => p.slug === s);
export const flagshipPrograms = () => PROGRAMS.filter((p) => p.flagship);
export const programCover = (p: Program) => ytImage(p.cover);
export const programSource = (p: Program) => ytUrl(p.cover);
export const episodeImage = (e: Episode) => (e.yt ? ytImage(e.yt) : null);
export const episodeSource = (e: Episode) => (e.yt ? ytUrl(e.yt) : null);
