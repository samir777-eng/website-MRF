"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BookOpen, CheckCircle, ClipboardList, FileText, Video, XCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock mistakes data
const mistakesByCategory = {
  lessons: [
    { id: 1, question: "ما إعراب كلمة 'الكتاب' في الجملة؟", correctAnswer: "مفعول به منصوب", yourAnswer: "فاعل مرفوع", lesson: "الدرس الأول", reviewed: false },
    { id: 2, question: "ما نوع الخبر في 'الجو جميل'؟", correctAnswer: "خبر مفرد", yourAnswer: "خبر جملة", lesson: "الدرس الثاني", reviewed: true },
  ],
  lectures: [
    { id: 3, question: "أعرب: 'قرأ الطالب الكتاب'", correctAnswer: "قرأ: فعل ماض", yourAnswer: "قرأ: فعل مضارع", lecture: "المحاضرة الثالثة", reviewed: false },
  ],
  exams: [
    { id: 4, question: "ما الفرق بين التشبيه والاستعارة؟", correctAnswer: "التشبيه يذكر الطرفين", yourAnswer: "لا فرق بينهما", exam: "امتحان البلاغة", reviewed: false },
    { id: 5, question: "حدد نوع البيان في البيت", correctAnswer: "استعارة مكنية", yourAnswer: "تشبيه بليغ", exam: "امتحان منتصف العام", reviewed: true },
  ],
  homework: [
    { id: 6, question: "أعرب: 'في البيت ضيف كريم'", correctAnswer: "ضيف: مبتدأ مؤخر", yourAnswer: "ضيف: خبر", homework: "واجب المحاضرة الخامسة", reviewed: false },
  ],
};

const categories = [
  { id: "lessons", label: "الدروس", icon: BookOpen, count: mistakesByCategory.lessons.length },
  { id: "lectures", label: "المحاضرات", icon: Video, count: mistakesByCategory.lectures.length },
  { id: "exams", label: "الامتحانات", icon: FileText, count: mistakesByCategory.exams.length },
  { id: "homework", label: "الواجبات", icon: ClipboardList, count: mistakesByCategory.homework.length },
];

export default function MistakesCornerPage() {
  const [activeTab, setActiveTab] = useState("lessons");
  const totalMistakes = Object.values(mistakesByCategory).flat().length;
  const reviewedCount = Object.values(mistakesByCategory).flat().filter(m => m.reviewed).length;

  const renderMistakeCard = (mistake: { id: number; question: string; correctAnswer: string; yourAnswer: string; reviewed: boolean } & Record<string, unknown>) => (
    <Card key={mistake.id} className={`hover:shadow-lg transition-shadow ${mistake.reviewed ? "opacity-60" : ""}`}>
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-foreground">{mistake.question}</h3>
          {mistake.reviewed && (
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <CheckCircle className="w-3 h-3 me-1" />
              تمت المراجعة
            </Badge>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
            <div className="text-red-600 dark:text-red-400 font-medium mb-1 flex items-center gap-1">
              <XCircle className="w-4 h-4" />
              إجابتك
            </div>
            <div className="text-foreground">{mistake.yourAnswer}</div>
          </div>
          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
            <div className="text-green-600 dark:text-green-400 font-medium mb-1 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              الإجابة الصحيحة
            </div>
            <div className="text-foreground">{mistake.correctAnswer}</div>
          </div>
        </div>
        {!mistake.reviewed && (
          <Button variant="outline" className="w-full">
            تم فهم الخطأ
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background dark:bg-zinc-950 pb-24 lg:pb-8">
      <div className="container mx-auto px-4 md:px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/ar/corners">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5 rtl:-scale-x-100" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">ركن الأخطاء</h1>
                <p className="text-sm text-muted-foreground">
                  {reviewedCount}/{totalMistakes} تمت مراجعتها
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <TabsTrigger key={cat.id} value={cat.id} className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{cat.label}</span>
                  <Badge variant="secondary" className="text-xs">{cat.count}</Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.entries(mistakesByCategory).map(([key, mistakes]) => (
            <TabsContent key={key} value={key} className="space-y-4 mt-6">
              {mistakes.length > 0 ? (
                mistakes.map(renderMistakeCard)
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">لا توجد أخطاء!</h2>
                  <p className="text-muted-foreground">أحسنت! استمر في التعلم</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

