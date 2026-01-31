"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdaptiveLearningDisplay from "@/components/learning/AdaptiveLearningDisplay";
import { Brain, Sparkles, Target, TrendingUp } from "lucide-react";

export default function AdaptiveLearningPage() {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-slate-900 dark:via-purple-900 dark:to-blue-900"
      dir="rtl"
    >
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-12 h-12 text-purple-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
              التعلم التكيفي الذكي
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            نظام تعليمي ذكي يتكيف مع أسلوب تعلمك ومستواك لتحقيق أفضل النتائج
          </p>
        </div>

        {/* What is Adaptive Learning */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="w-7 h-7 text-purple-600" />
              ما هو التعلم التكيفي؟
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg text-muted-foreground leading-relaxed">
              التعلم التكيفي هو نهج تعليمي متطور يستخدم الذكاء الاصطناعي لتخصيص
              تجربة التعلم لكل طالب بناءً على:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="p-6 bg-white/50 dark:bg-black/10 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg">أسلوب التعلم</h3>
                </div>
                <p className="text-muted-foreground">
                  يحدد النظام ما إذا كنت متعلماً بصرياً، سمعياً، حركياً، أو
                  قرائياً ويقدم المحتوى بالطريقة الأنسب لك
                </p>
              </div>

              <div className="p-6 bg-white/50 dark:bg-black/10 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg">مستوى الأداء</h3>
                </div>
                <p className="text-muted-foreground">
                  يراقب دقتك وسرعة استجابتك ويعدل صعوبة المحتوى تلقائياً لتحقيق
                  التوازن المثالي بين التحدي والنجاح
                </p>
              </div>

              <div className="p-6 bg-white/50 dark:bg-black/10 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg">نقاط الضعف</h3>
                </div>
                <p className="text-muted-foreground">
                  يحدد المجالات التي تحتاج تحسين ويوصي بمحتوى إضافي وتمارين
                  مستهدفة لتقوية هذه المجالات
                </p>
              </div>

              <div className="p-6 bg-white/50 dark:bg-black/10 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg">وتيرة التعلم</h3>
                </div>
                <p className="text-muted-foreground">
                  يتكيف مع سرعتك في التعلم - سواء كنت تفضل التقدم السريع أو
                  تحتاج وقتاً أطول لاستيعاب المفاهيم
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Target className="w-7 h-7 text-green-600" />
              فوائد التعلم التكيفي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl">
                <div className="text-4xl font-bold text-blue-600 mb-2">3x</div>
                <div className="font-medium text-foreground mb-2">
                  أسرع في التعلم
                </div>
                <div className="text-sm text-muted-foreground">
                  الطلاب يتعلمون بسرعة أكبر بثلاث مرات مع المحتوى المخصص
                </div>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  85%
                </div>
                <div className="font-medium text-foreground mb-2">
                  معدل الاحتفاظ
                </div>
                <div className="text-sm text-muted-foreground">
                  تحسين كبير في الاحتفاظ بالمعلومات على المدى الطويل
                </div>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  92%
                </div>
                <div className="font-medium text-foreground mb-2">
                  رضا الطلاب
                </div>
                <div className="text-sm text-muted-foreground">
                  الطلاب يشعرون بمزيد من الثقة والتحفيز مع التعلم المخصص
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Adaptive Learning Display */}
        <AdaptiveLearningDisplay
          variant="detailed"
          showRecommendations={true}
          showLearningPaths={true}
        />

        {/* How It Works */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <TrendingUp className="w-7 h-7 text-orange-600" />
              كيف يعمل النظام؟
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">التقييم الأولي</h3>
                  <p className="text-muted-foreground">
                    يبدأ النظام بتقييم مستواك الحالي وأسلوب تعلمك من خلال
                    اختبارات قصيرة وتحليل تفاعلك مع المحتوى
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">المراقبة المستمرة</h3>
                  <p className="text-muted-foreground">
                    يتتبع النظام أداءك في كل درس واختبار، محللاً دقتك، سرعة
                    استجابتك، والمجالات التي تحتاج تحسين
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">التوصيات الذكية</h3>
                  <p className="text-muted-foreground">
                    بناءً على التحليل، يقدم النظام توصيات مخصصة للمحتوى التالي،
                    مستوى الصعوبة، وأفضل أوقات الدراسة
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  4
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">التكيف المستمر</h3>
                  <p className="text-muted-foreground">
                    يعدل النظام المسار التعليمي باستمرار بناءً على تقدمك، مما
                    يضمن أنك دائماً في المستوى المناسب من التحدي
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips for Best Results */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="w-7 h-7 text-green-600" />
              نصائح لأفضل النتائج
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "كن صادقاً في إجاباتك - النظام يتعلم منك لتقديم أفضل تجربة",
                "راجع التوصيات بانتظام وطبقها - هي مصممة خصيصاً لك",
                "لا تتردد في تجربة مستويات صعوبة مختلفة",
                "استخدم التغذية الراجعة لمساعدة النظام على فهمك بشكل أفضل",
                "حافظ على جدول دراسة منتظم للحصول على توصيات أدق",
                "راجع تحليلات أدائك لفهم نقاط قوتك وضعفك",
              ].map((tip, index) => (
                <div
                  key={index}
                  className="flex gap-3 p-4 bg-white/50 dark:bg-black/10 rounded-xl"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    ✓
                  </div>
                  <p className="text-muted-foreground">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
