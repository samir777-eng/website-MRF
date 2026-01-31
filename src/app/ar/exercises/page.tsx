import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, CheckCircle, XCircle, Trophy } from "lucide-react";

export const metadata: Metadata = {
  title: "التمارين",
  description: "قائمة التمارين - منصة الأستاذ رضا الفاروق التعليمية",
};

const exercises = [
  {
    id: 1,
    title: "تمرين النحو - الفعل المضارع",
    description: "تمارين شاملة على الفعل المضارع وإعرابه",
    questions: 15,
    duration: 20,
    difficulty: "متوسط",
    status: "completed",
    score: 85,
  },
  {
    id: 2,
    title: "تمرين البلاغة - التشبيه",
    description: "تمارين على أنواع التشبيه وأركانه",
    questions: 12,
    duration: 15,
    difficulty: "سهل",
    status: "completed",
    score: 92,
  },
  {
    id: 3,
    title: "تمرين الأدب - العصر الجاهلي",
    description: "أسئلة متنوعة على الأدب الجاهلي",
    questions: 20,
    duration: 30,
    difficulty: "صعب",
    status: "pending",
    score: null,
  },
  {
    id: 4,
    title: "تمرين القراءة - النص الأدبي",
    description: "تحليل وفهم النصوص الأدبية",
    questions: 10,
    duration: 25,
    difficulty: "متوسط",
    status: "pending",
    score: null,
  },
];

export default function ExercisesPage() {
  return (
    <main role="main" className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">التمارين</h1>
        <p className="text-muted-foreground">
          تدرب وطور مهاراتك من خلال التمارين المتنوعة
        </p>
      </header>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">إجمالي التمارين</p>
                <p className="text-2xl font-bold">{exercises.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-primary" aria-hidden="true" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">مكتملة</p>
                <p className="text-2xl font-bold text-green-600">
                  {exercises.filter((e) => e.status === "completed").length}
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
                  {exercises.filter((e) => e.status === "pending").length}
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
                <p className="text-sm text-muted-foreground">متوسط الدرجات</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(
                    exercises
                      .filter((e) => e.score)
                      .reduce((acc, e) => acc + (e.score || 0), 0) /
                      exercises.filter((e) => e.score).length,
                  )}
                  %
                </p>
              </div>
              <Trophy className="w-8 h-8 text-blue-600" aria-hidden="true" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exercises List */}
      <div className="space-y-4">
        {exercises.map((exercise) => (
          <Card key={exercise.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">
                    {exercise.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {exercise.description}
                  </p>
                </div>
                {exercise.status === "completed" && exercise.score && (
                  <Badge
                    variant={exercise.score >= 80 ? "default" : "secondary"}
                    className="me-4"
                  >
                    {exercise.score}%
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="w-4 h-4" aria-hidden="true" />
                  <span>{exercise.questions} سؤال</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" aria-hidden="true" />
                  <span>{exercise.duration} دقيقة</span>
                </div>
                <Badge variant="outline">{exercise.difficulty}</Badge>
                {exercise.status === "completed" ? (
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle className="w-3 h-3 ms-1" aria-hidden="true" />
                    مكتمل
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <Clock className="w-3 h-3 ms-1" aria-hidden="true" />
                    قيد الانتظار
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                {exercise.status === "completed" ? (
                  <>
                    <Button
                      asChild
                      variant="outline"
                      aria-label={`عرض نتيجة ${exercise.title}`}
                    >
                      <Link href={`/ar/exercises/${exercise.id}`}>
                        عرض النتيجة
                      </Link>
                    </Button>
                    <Button asChild aria-label={`إعادة ${exercise.title}`}>
                      <Link href={`/ar/exercises/${exercise.id}`}>
                        إعادة التمرين
                      </Link>
                    </Button>
                  </>
                ) : (
                  <Button asChild aria-label={`بدء ${exercise.title}`}>
                    <Link href={`/ar/exercises/${exercise.id}`}>
                      بدء التمرين
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
