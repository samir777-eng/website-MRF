import {
  BarChart3,
  BookOpen,
  Brain,
  Flame,
  Gem,
  GraduationCap,
  Target,
  Trophy,
  Video,
  Zap,
} from "lucide-react";

// Grade Selection Data
export const gradeSelectionData = [
  {
    grade: "الأول الثانوي",
    gradeId: "1",
    description: "بناء الأساسيات مع شرح شامل للمبادئ",
    students: "5,200+ طالب",
    progress: 85,
    color: "from-blue-500 to-cyan-500",
    bgColor:
      "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
  },
  {
    grade: "الثاني الثانوي",
    gradeId: "2",
    description: "المفاهيم المتقدمة والتطبيقات العملية",
    students: "4,800+ طالب",
    progress: 92,
    color: "from-purple-500 to-pink-500",
    bgColor:
      "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
  },
  {
    grade: "الثالث الثانوي",
    gradeId: "3",
    description: "التحضير للامتحانات وتقنيات الإتقان",
    students: "5,000+ طالب",
    progress: 96,
    color: "from-green-500 to-blue-500",
    bgColor:
      "from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20",
  },
];

// Features Data (reduced from 6 to 4 key features)
export const featuresData = [
  {
    icon: Video,
    title: "دروس فيديو تفاعلية",
    description:
      "مكتبة شاملة من الدروس المصورة عالية الجودة مع إمكانية التحكم في السرعة",
    features: ["جودة 4K", "تحميل للمشاهدة دون اتصال"],
    color: "from-blue-500 to-cyan-500",
    bgColor:
      "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
  },
  {
    icon: Brain,
    title: "نظام اختبارات ذكي",
    description: "اختبارات تفاعلية مع تحليل فوري للأداء وتوصيات شخصية للتحسين",
    features: ["تحليل فوري", "مراجعة الأخطاء"],
    color: "from-purple-500 to-pink-500",
    bgColor:
      "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
  },
  {
    icon: BarChart3,
    title: "تتبع التقدم المتقدم",
    description:
      "لوحة تحكم شاملة لمراقبة التقدم مع رسوم بيانية وإحصائيات مفصلة",
    features: ["رسوم بيانية", "تقارير أسبوعية"],
    color: "from-green-500 to-teal-500",
    bgColor:
      "from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20",
  },
  {
    icon: Trophy,
    title: "نظام المكافآت والإنجازات",
    description:
      "نظام تحفيزي متكامل مع نقاط الخبرة والشارات والمسابقات اليومية",
    features: ["نقاط الخبرة", "شارات الإنجاز"],
    color: "from-orange-500 to-red-500",
    bgColor:
      "from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20",
  },
];

// Testimonials Data (reduced from 6 to 3)
export const testimonialsData = [
  {
    name: "أحمد محمد علي",
    grade: "الثالث الثانوي",
    improvement: "+35%",
    score: "95%",
    testimonial:
      "بفضل الأستاذ رضا الفاروق ومنصته الرائعة، تحسنت درجاتي في اللغة العربية من 60% إلى 95%. الشرح واضح والتمارين مفيدة جداً.",
    achievement: "المركز الأول على المحافظة",
    subjects: ["النحو", "الأدب", "البلاغة"],
    studyTime: "6 أشهر",
    avatarColor: "from-blue-500 to-purple-500",
  },
  {
    name: "فاطمة أحمد حسن",
    grade: "الثاني الثانوي",
    improvement: "+42%",
    score: "92%",
    testimonial:
      "المنصة ساعدتني كثيراً في فهم البلاغة والأدب. الدروس التفاعلية والاختبارات جعلت التعلم ممتعاً وسهلاً.",
    achievement: "تفوق في امتحان نصف العام",
    subjects: ["البلاغة", "الأدب", "التعبير"],
    studyTime: "4 أشهر",
    avatarColor: "from-pink-500 to-rose-500",
  },
  {
    name: "نور الهدى محمود",
    grade: "الثالث الثانوي",
    improvement: "+38%",
    score: "97%",
    testimonial:
      "الشرح المبسط والأمثلة الواضحة ساعدوني في التفوق. أنصح كل طالب بالاستفادة من هذه المنصة الرائعة.",
    achievement: "الدرجة النهائية في الثانوية العامة",
    subjects: ["جميع فروع اللغة العربية"],
    studyTime: "8 أشهر",
    avatarColor: "from-green-500 to-teal-500",
  },
];

// Success Statistics
export const successStats = [
  { number: "15,000+", label: "طالب متفوق", color: "green" },
  { number: "98%", label: "معدل النجاح", color: "blue" },
  { number: "+35%", label: "متوسط التحسن", color: "purple" },
  { number: "4.9/5", label: "تقييم الطلاب", color: "orange" },
];

// Platform Metrics
export const platformMetrics = [
  {
    icon: Trophy,
    number: "2,847",
    label: "طالب متفوق",
    desc: "حصلوا على +90%",
  },
  { icon: BookOpen, number: "125,000", label: "درس مكتمل", desc: "هذا الشهر" },
  { icon: Target, number: "89,500", label: "اختبار منجز", desc: "بنجاح" },
  { icon: Zap, number: "15.2", label: "دقيقة متوسط", desc: "وقت الجلسة" },
  {
    icon: Flame,
    number: "67%",
    label: "معدل الاستمرار",
    desc: "لأكثر من 30 يوم",
  },
  { icon: Gem, number: "4,200", label: "شهادة صادرة", desc: "هذا العام" },
];

// Comparison Data
export const comparisonData = {
  traditional: {
    title: "الدروس الخصوصية",
    subtitle: "٣,٠٠٠ - ٥,٠٠٠ جنيه/شهر",
    icon: BookOpen,
    items: [
      "تكلفة ٢٠٠-٥٠٠ جنيه للحصة الواحدة",
      "مواعيد ثابتة غير مرنة",
      "لا يوجد تتبع للتقدم أو التحليلات",
      "صعوبة في المراجعة والإعادة",
      "جودة متفاوتة حسب المدرس",
    ],
  },
  platform: {
    title: "منصة الأستاذ رضا",
    subtitle: "مجاناً ١٠٠٪",
    items: [
      "وفر أكثر من ٣٠,٠٠٠ جنيه سنوياً",
      "تعلم ٢٤/٧ من أي مكان",
      "تحليلات وتقارير تفصيلية للأداء",
      "إعادة الدروس بلا حدود",
      "محتوى موحد عالي الجودة",
    ],
  },
};

// FAQ Data
export const faqData = [
  {
    question: "هل المنصة مجانية حقاً؟",
    answer:
      "نعم، جميع المحتوى التعليمي مجاني بالكامل. هدفنا هو إتاحة التعليم الجيد لجميع الطلاب المصريين.",
  },
  {
    question: "هل يمكنني الوصول للدروس دون اتصال بالإنترنت؟",
    answer:
      "نعم، يمكنك تحميل الدروس ومشاهدتها دون اتصال. التطبيق يدعم التعلم الغير متصل بالكامل.",
  },
  {
    question: "كيف يمكنني تتبع تقدم ابني/ابنتي؟",
    answer:
      "يوفر التطبيق تقارير مفصلة للأهل تتضمن الوقت المستغرق، الدروس المكتملة، ونتائج الاختبارات.",
  },
  {
    question: "ماذا لو واجهت مشكلة تقنية؟",
    answer:
      "فريق الدعم الفني متاح 24/7 عبر الواتساب والبريد الإلكتروني لحل أي مشكلة فوراً.",
  },
];

// How It Works Steps
export const howItWorksSteps = [
  {
    step: 1,
    title: "اختر صفك",
    description: "حدد صفك الدراسي للحصول على منهج مخصص",
    icon: GraduationCap,
    color: "from-blue-500 to-cyan-500",
  },
  {
    step: 2,
    title: "ابدأ التعلم",
    description: "شاهد الدروس وحل الاختبارات التفاعلية",
    icon: Video,
    color: "from-purple-500 to-pink-500",
  },
  {
    step: 3,
    title: "حقق النجاح",
    description: "تابع تقدمك واحصل على شهادات الإنجاز",
    icon: Trophy,
    color: "from-green-500 to-teal-500",
  },
];
