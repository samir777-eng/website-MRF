"use client";

import SpacedRepetitionDisplay from "@/components/learning/SpacedRepetitionDisplay";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSpacedRepetition } from "@/contexts/SpacedRepetitionContext";
import {
  AlertCircle,
  Award,
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle,
  Clock,
  Flame,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

export default function ReviewPage() {
  const { reviewStats, userPerformance, weakAreas } = useSpacedRepetition();

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-indigo-900/20"
    >
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            نظام المراجعة الذكية
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            نظام مراجعة متقدم يستخدم خوارزميات التكرار المتباعد لتحسين الاحتفاظ
            بالمعلومات على المدى الطويل
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <CardContent className="p-6 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-3" />
              <div className="text-3xl font-bold mb-1">
                {reviewStats.totalItems}
              </div>
              <div className="text-blue-100">إجمالي العناصر</div>
              <div className="text-sm text-blue-200 mt-1">في النظام</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-500 to-red-600 text-white">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 mx-auto mb-3" />
              <div className="text-3xl font-bold mb-1">
                {reviewStats.dueToday + reviewStats.overdue}
              </div>
              <div className="text-orange-100">للمراجعة اليوم</div>
              <div className="text-sm text-orange-200 mt-1">
                {reviewStats.overdue > 0 && `${reviewStats.overdue} متأخرة`}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-3" />
              <div className="text-3xl font-bold mb-1">
                {reviewStats.mastered}
              </div>
              <div className="text-green-100">متقن</div>
              <div className="text-sm text-green-200 mt-1">
                {(
                  (reviewStats.mastered / Math.max(reviewStats.totalItems, 1)) *
                  100
                ).toFixed(0)}
                % من الإجمالي
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-3" />
              <div className="text-3xl font-bold mb-1">
                {userPerformance.averageAccuracy.toFixed(0)}%
              </div>
              <div className="text-purple-100">متوسط الدقة</div>
              <div className="text-sm text-purple-200 mt-1">
                {userPerformance.totalSessions} جلسة
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Learning Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
            <CardHeader>
              <h2 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
                <Award className="w-6 h-6 text-green-600" />
                التقدم في التعلم
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">العناصر المتقنة</span>
                  <span className="font-bold text-green-600">
                    {reviewStats.mastered}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">العناصر النشطة</span>
                  <span className="font-bold">
                    {reviewStats.totalItems - reviewStats.mastered}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">السلاسل الطويلة</span>
                  <span className="font-bold text-orange-600">
                    {reviewStats.streakItems}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">العناصر الصعبة</span>
                  <span className="font-bold text-red-600">
                    {reviewStats.struggling}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <CardHeader>
              <h2 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                إحصائيات الجلسات
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">إجمالي الجلسات</span>
                  <span className="font-bold text-blue-600">
                    {userPerformance.totalSessions}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    متوسط مدة الجلسة
                  </span>
                  <span className="font-bold">
                    {userPerformance.averageSessionTime.toFixed(0)} دقيقة
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    إجمالي المراجعات
                  </span>
                  <span className="font-bold">{reviewStats.totalReviews}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">السلسلة الحالية</span>
                  <span className="font-bold text-orange-600 flex items-center gap-1">
                    <Flame className="w-4 h-4" />
                    {userPerformance.streakDays} أيام
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
            <CardHeader>
              <h2 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-orange-600" />
                المجالات التي تحتاج تحسين
              </h2>
            </CardHeader>
            <CardContent>
              {weakAreas.length > 0 ? (
                <div className="space-y-3">
                  {weakAreas.slice(0, 4).map((area) => (
                    <div
                      key={area.subject}
                      className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-950/20 rounded-lg"
                    >
                      <span className="font-medium text-orange-800">
                        {area.subject}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-orange-600">
                          {area.accuracy.toFixed(0)}%
                        </span>
                        <Badge variant="outline" className="text-sm">
                          {area.count}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <p className="text-sm">ممتاز! لا توجد مجالات تحتاج تحسين</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* How Spaced Repetition Works */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-background to-muted/20">
          <CardHeader>
            <h2 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-600" />
              كيف يعمل نظام التكرار المتباعد؟
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 dark:bg-blue-950/20 rounded-xl">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="font-bold text-foreground mb-2">
                  التعلم الأولي
                </h3>
                <p className="text-sm text-muted-foreground">
                  عند تعلم مفهوم جديد، يتم جدولته للمراجعة بعد يوم واحد
                </p>
              </div>

              <div className="text-center p-6 bg-green-50 dark:bg-green-950/20 rounded-xl">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="font-bold text-foreground mb-2">
                  التكرار التدريجي
                </h3>
                <p className="text-sm text-muted-foreground">
                  مع كل مراجعة ناجحة، تزداد الفترة الزمنية للمراجعة التالية
                </p>
              </div>

              <div className="text-center p-6 bg-purple-50 dark:bg-purple-950/20 rounded-xl">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="font-bold text-foreground mb-2">
                  الاحتفاظ طويل المدى
                </h3>
                <p className="text-sm text-muted-foreground">
                  المفاهيم المتقنة تُراجع بفترات أطول للحفاظ على الذاكرة
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white">
          <CardHeader>
            <h2 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <Target className="w-6 h-6" />
              فوائد نظام المراجعة الذكية
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-200" />
                  <span>تحسين الاحتفاظ بالمعلومات بنسبة تصل إلى 90%</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-200" />
                  <span>توفير الوقت من خلال التركيز على المفاهيم الصعبة</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-200" />
                  <span>تقليل النسيان والحاجة للمراجعة المكثفة</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-200" />
                  <span>تخصيص التعلم حسب مستوى كل طالب</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-200" />
                  <span>بناء ثقة الطالب من خلال النجاح المتدرج</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-200" />
                  <span>تحليل نقاط القوة والضعف بدقة</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Review Interface */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-background to-muted/20">
          <CardHeader>
            <h2 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-600" />
              ابدأ جلسة المراجعة
            </h2>
          </CardHeader>
          <CardContent>
            <SpacedRepetitionDisplay variant="detailed" />
          </CardContent>
        </Card>

        {/* Tips for Effective Review */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <CardHeader>
            <h2 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <Award className="w-6 h-6 text-blue-600" />
              نصائح للمراجعة الفعالة
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">قبل البدء:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    اختر مكاناً هادئاً للدراسة
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    حدد وقتاً ثابتاً للمراجعة يومياً
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    تأكد من وجود اتصال إنترنت مستقر
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">
                  أثناء المراجعة:
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    اقرأ السؤال بعناية قبل الإجابة
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    لا تتردد في استخدام التلميحات
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    راجع الإجابات الخاطئة بعناية
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
