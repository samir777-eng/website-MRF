import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "الواجبات المنزلية",
  description: "قائمة الواجبات المنزلية - منصة الأستاذ رضا الفاروق التعليمية",
};

// Helper to get a date relative to today in YYYY-MM-DD format
function getRelativeDate(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split("T")[0];
}

const homework = [
  {
    id: 1,
    title: "واجب النحو - الأسماء الخمسة",
    description: "حل تمارين الأسماء الخمسة وإعرابها",
    questions: 10,
    duration: 30,
    dueDate: getRelativeDate(-2), // 2 days ago (submitted)
    status: "submitted",
    score: 90,
    submittedDate: getRelativeDate(-3), // 3 days ago
  },
  {
    id: 2,
    title: "واجب البلاغة - الاستعارة",
    description: "تطبيقات على الاستعارة المكنية والتصريحية",
    questions: 8,
    duration: 25,
    dueDate: getRelativeDate(3), // 3 days from now
    status: "pending",
    score: null,
    submittedDate: null,
  },
  {
    id: 3,
    title: "واجب الأدب - العصر الأموي",
    description: "أسئلة تحليلية على الأدب الأموي",
    questions: 12,
    duration: 40,
    dueDate: getRelativeDate(5), // 5 days from now
    status: "pending",
    score: null,
    submittedDate: null,
  },
  {
    id: 4,
    title: "واجب القراءة - تحليل النص",
    description: "تحليل نص أدبي من العصر العباسي",
    questions: 15,
    duration: 45,
    dueDate: getRelativeDate(-5), // 5 days ago (late)
    status: "late",
    score: null,
    submittedDate: null,
  },
];

function getDaysRemaining(dueDate: string): number {
  const due = new Date(dueDate);
  const now = new Date();
  const diff = due.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function HomeworkPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-24">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg">
            <BookOpen className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">الواجبات المنزلية</h1>
          <p className="text-muted-foreground">
            تابع واجباتك المنزلية وسلمها في الوقت المحدد
          </p>
        </header>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    إجمالي الواجبات
                  </p>
                  <p className="text-2xl font-bold">{homework.length}</p>
                </div>
                <BookOpen className="w-8 h-8 text-primary" aria-hidden="true" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">مسلمة</p>
                  <p className="text-2xl font-bold text-green-600">
                    {homework.filter((h) => h.status === "submitted").length}
                  </p>
                </div>
                <CheckCircle
                  className="w-8 h-8 text-green-600"
                  aria-hidden="true"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">قيد الانتظار</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {homework.filter((h) => h.status === "pending").length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" aria-hidden="true" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">متأخرة</p>
                  <p className="text-2xl font-bold text-red-600">
                    {homework.filter((h) => h.status === "late").length}
                  </p>
                </div>
                <AlertCircle
                  className="w-8 h-8 text-red-600"
                  aria-hidden="true"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Homework List */}
        <div className="space-y-4">
          {homework.map((hw) => {
            const daysRemaining = getDaysRemaining(hw.dueDate);
            const isUrgent = daysRemaining <= 2 && hw.status === "pending";

            return (
              <Card
                key={hw.id}
                className={`hover:shadow-lg transition-shadow ${isUrgent ? "border-orange-500" : ""}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{hw.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {hw.description}
                      </p>
                    </div>
                    {hw.status === "submitted" && hw.score && (
                      <Badge
                        variant={hw.score >= 80 ? "default" : "secondary"}
                        className="me-4"
                      >
                        {hw.score}%
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpen className="w-4 h-4" aria-hidden="true" />
                      <span>{hw.questions} سؤال</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" aria-hidden="true" />
                      <span>{hw.duration} دقيقة</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" aria-hidden="true" />
                      <span>موعد التسليم: {hw.dueDate}</span>
                    </div>

                    {hw.status === "submitted" && (
                      <Badge variant="default" className="bg-green-600">
                        <CheckCircle
                          className="w-3 h-3 ms-1"
                          aria-hidden="true"
                        />
                        مسلم
                      </Badge>
                    )}
                    {hw.status === "pending" && (
                      <Badge variant={isUrgent ? "destructive" : "secondary"}>
                        <Clock className="w-3 h-3 ms-1" aria-hidden="true" />
                        {isUrgent
                          ? `عاجل - ${daysRemaining} يوم`
                          : "قيد الانتظار"}
                      </Badge>
                    )}
                    {hw.status === "late" && (
                      <Badge variant="destructive">
                        <AlertCircle
                          className="w-3 h-3 ms-1"
                          aria-hidden="true"
                        />
                        متأخر
                      </Badge>
                    )}
                  </div>

                  {hw.status === "pending" && daysRemaining <= 2 && (
                    <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-3 mb-4">
                      <p className="text-sm text-orange-800 dark:text-orange-200">
                        <AlertCircle
                          className="w-4 h-4 inline ms-1"
                          aria-hidden="true"
                        />
                        تنبيه: يتبقى {daysRemaining} يوم فقط على موعد التسليم!
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {hw.status === "submitted" ? (
                      <>
                        <Button
                          asChild
                          variant="outline"
                          aria-label={`عرض نتيجة ${hw.title}`}
                        >
                          <Link href={`/ar/homework/${hw.id}`}>
                            عرض النتيجة
                          </Link>
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          aria-label={`عرض الإجابات ${hw.title}`}
                        >
                          <Link href={`/ar/homework/${hw.id}`}>
                            عرض الإجابات
                          </Link>
                        </Button>
                      </>
                    ) : (
                      <Button asChild aria-label={`بدء ${hw.title}`}>
                        <Link href={`/ar/homework/${hw.id}`}>
                          {hw.status === "late" ? "تسليم متأخر" : "بدء الواجب"}
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
