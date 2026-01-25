"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  GraduationCap,
  Heart,
  Lightbulb,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen page-bg-blue" dir="rtl">
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="relative inline-block">
            <div className="w-40 h-40 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl">
              <GraduationCap className="w-20 h-20 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-xl">
              <Award className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            الأستاذ رضا الفاروق
          </h1>

          <p className="text-2xl text-muted-foreground max-w-3xl mx-auto">
            31 عاماً من التميز في تدريس اللغة العربية للثانوية العامة
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-lg px-6 py-2">
              خبير اللغة العربية
            </Badge>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg px-6 py-2">
              معلم متميز
            </Badge>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white text-lg px-6 py-2">
              مؤسس المنصة
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <CardContent className="p-6 text-center">
              <Clock className="w-10 h-10 mx-auto mb-3" />
              <div className="text-4xl font-bold mb-2">31</div>
              <div className="text-blue-100">عام خبرة</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <CardContent className="p-6 text-center">
              <Users className="w-10 h-10 mx-auto mb-3" />
              <div className="text-4xl font-bold mb-2">15,000+</div>
              <div className="text-green-100">طالب متفوق</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-500 to-red-600 text-white">
            <CardContent className="p-6 text-center">
              <Trophy className="w-10 h-10 mx-auto mb-3" />
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-orange-100">معدل النجاح</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white">
            <CardContent className="p-6 text-center">
              <Star className="w-10 h-10 mx-auto mb-3" />
              <div className="text-4xl font-bold mb-2">4.9/5</div>
              <div className="text-purple-100">تقييم الطلاب</div>
            </CardContent>
          </Card>
        </div>

        {/* Biography */}
        <Card className="border-0 shadow-2xl">
          <CardHeader>
            <h2 className="text-3xl font-semibold leading-none tracking-tight flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              السيرة الذاتية
            </h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
              <p className="text-lg">
                الأستاذ <strong className="text-foreground">رضا الفاروق</strong>{" "}
                هو أحد أبرز معلمي اللغة العربية في مصر، بخبرة تمتد لأكثر من{" "}
                <strong className="text-foreground">31 عاماً</strong> في تدريس
                منهج الثانوية العامة. تخرج من كلية دار العلوم جامعة القاهرة
                بتقدير امتياز، وحصل على دبلومة خاصة في التربية.
              </p>

              <p className="text-lg">
                على مدار مسيرته المهنية، ساعد الأستاذ رضا أكثر من{" "}
                <strong className="text-foreground">15,000 طالب</strong>
                على تحقيق التفوق في اللغة العربية والحصول على أعلى الدرجات في
                الثانوية العامة. يتميز بأسلوبه التعليمي الفريد الذي يجمع بين
                الأصالة والمعاصرة، مما يجعل اللغة العربية سهلة وممتعة للطلاب.
              </p>

              <p className="text-lg">
                في عام 2024، قرر الأستاذ رضا إطلاق هذه المنصة التعليمية الرقمية
                لإتاحة خبرته ومعرفته لأكبر عدد ممكن من الطلاب في جميع أنحاء مصر،
                مستخدماً أحدث تقنيات التعليم الإلكتروني والذكاء الاصطناعي.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Teaching Philosophy */}
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <CardHeader>
            <h2 className="text-3xl font-semibold leading-none tracking-tight flex items-center gap-3">
              <Lightbulb className="w-8 h-8 text-yellow-600" />
              فلسفة التدريس
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: Heart,
                  title: "التعلم بالحب",
                  description:
                    "نؤمن بأن حب اللغة العربية هو المفتاح الأول للتفوق. نسعى لغرس هذا الحب في قلوب طلابنا من خلال أساليب تعليمية مبتكرة وممتعة.",
                  color: "from-red-500 to-pink-600",
                },
                {
                  icon: Target,
                  title: "التركيز على الفهم",
                  description:
                    "لا نكتفي بالحفظ، بل نركز على الفهم العميق للقواعد والمفاهيم، مما يمكن الطالب من التطبيق الصحيح في أي موقف.",
                  color: "from-blue-500 to-indigo-600",
                },
                {
                  icon: TrendingUp,
                  title: "التدرج في التعلم",
                  description:
                    "نبدأ من الأساسيات ونتدرج بشكل منطقي نحو المستويات المتقدمة، مع مراعاة الفروق الفردية بين الطلاب.",
                  color: "from-green-500 to-emerald-600",
                },
                {
                  icon: CheckCircle,
                  title: "التطبيق العملي",
                  description:
                    "نوفر تمارين وتطبيقات عملية متنوعة تغطي جميع أنماط الأسئلة في امتحانات الثانوية العامة.",
                  color: "from-purple-500 to-pink-600",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-6 bg-white/50 dark:bg-black/10 rounded-xl"
                >
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center mb-4`}
                  >
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold leading-tight tracking-tight text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements & Recognition */}
        <Card className="border-0 shadow-2xl">
          <CardHeader>
            <h2 className="text-3xl font-semibold leading-none tracking-tight flex items-center gap-3">
              <Award className="w-8 h-8 text-yellow-600" />
              الإنجازات والتكريمات
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  year: "2023",
                  achievement: "جائزة أفضل معلم لغة عربية على مستوى الجمهورية",
                },
                {
                  year: "2021",
                  achievement:
                    "شهادة تقدير من وزارة التربية والتعليم للتميز في التدريس",
                },
                {
                  year: "2019",
                  achievement: "المركز الأول في مسابقة المعلم المبدع",
                },
                {
                  year: "2018",
                  achievement:
                    "تكريم من محافظة القاهرة لإنجازات الطلاب المتميزة",
                },
                {
                  year: "2015",
                  achievement: "جائزة الإبداع التربوي من نقابة المعلمين",
                },
                {
                  year: "2012",
                  achievement: "شهادة تقدير لأعلى نسبة نجاح في الثانوية العامة",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-xl"
                >
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    {item.year}
                  </div>
                  <div className="flex-1 pt-3">
                    <p className="text-lg font-medium text-foreground">
                      {item.achievement}
                    </p>
                  </div>
                  <Trophy className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-3" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Platform Mission */}
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <CardHeader>
            <h2 className="text-3xl font-semibold leading-none tracking-tight flex items-center gap-3">
              <Target className="w-8 h-8 text-purple-600" />
              رسالة المنصة
            </h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              تهدف منصة{" "}
              <strong className="text-foreground">الأستاذ رضا الفاروق</strong>{" "}
              إلى تقديم تعليم متميز للغة العربية يجمع بين الخبرة الطويلة
              والتكنولوجيا الحديثة. نسعى لتحقيق الأهداف التالية:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "إتاحة تعليم عالي الجودة لجميع طلاب الثانوية العامة في مصر",
                "استخدام أحدث أساليب التعليم الإلكتروني والذكاء الاصطناعي",
                "توفير بيئة تعليمية تفاعلية ومحفزة للطلاب",
                "مساعدة الطلاب على تحقيق أعلى الدرجات في اللغة العربية",
                "غرس حب اللغة العربية في نفوس الطلاب",
                "تطوير مهارات التفكير النقدي والإبداعي لدى الطلاب",
              ].map((goal, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-white/50 dark:bg-black/10 rounded-xl"
                >
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <p className="text-muted-foreground">{goal}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Teaching Methodology */}
        <Card className="border-0 shadow-2xl">
          <CardHeader>
            <h2 className="text-3xl font-semibold leading-none tracking-tight flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              منهجية التدريس
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                نتبع منهجية تدريس شاملة ومتكاملة تضمن تحقيق أفضل النتائج:
              </p>

              <div className="space-y-4">
                {[
                  {
                    step: "1",
                    title: "التقييم الأولي",
                    description:
                      "نبدأ بتقييم مستوى الطالب لتحديد نقاط القوة والضعف",
                    color: "from-blue-500 to-indigo-600",
                  },
                  {
                    step: "2",
                    title: "الشرح التفصيلي",
                    description:
                      "شرح القواعد والمفاهيم بأسلوب مبسط مع أمثلة متنوعة",
                    color: "from-green-500 to-emerald-600",
                  },
                  {
                    step: "3",
                    title: "التطبيق العملي",
                    description:
                      "تمارين وتطبيقات متدرجة الصعوبة لترسيخ المعلومات",
                    color: "from-orange-500 to-red-600",
                  },
                  {
                    step: "4",
                    title: "المراجعة المستمرة",
                    description: "مراجعات دورية باستخدام نظام التكرار المتباعد",
                    color: "from-purple-500 to-pink-600",
                  },
                  {
                    step: "5",
                    title: "التقييم النهائي",
                    description:
                      "اختبارات شاملة تحاكي امتحانات الثانوية العامة",
                    color: "from-yellow-500 to-orange-500",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center text-white font-bold text-xl`}
                    >
                      {item.step}
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student Success Stories */}
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          <CardHeader>
            <h2 className="text-3xl font-semibold leading-none tracking-tight flex items-center gap-3">
              <Star className="w-8 h-8 text-yellow-600" />
              قصص نجاح الطلاب
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: "أحمد محمد",
                  score: "98%",
                  quote:
                    "بفضل الأستاذ رضا، تحولت اللغة العربية من أصعب المواد إلى أسهلها وأمتعها!",
                  year: "2023",
                },
                {
                  name: "فاطمة علي",
                  score: "97%",
                  quote:
                    "أسلوب الشرح المبسط والتمارين المتنوعة ساعدوني كثيراً في التفوق.",
                  year: "2023",
                },
                {
                  name: "محمود حسن",
                  score: "99%",
                  quote:
                    "المنصة رائعة! التعلم التفاعلي والمراجعات الذكية حققت لي الدرجة النهائية.",
                  year: "2024",
                },
              ].map((student, index) => (
                <div
                  key={index}
                  className="p-6 bg-white/50 dark:bg-black/10 rounded-xl"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-foreground">
                        {student.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        دفعة {student.year}
                      </div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-3">
                    {student.score}
                  </div>
                  <p className="text-muted-foreground italic">
                    "{student.quote}"
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
