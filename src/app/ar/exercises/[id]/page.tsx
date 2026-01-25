"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  Award,
  BookOpen,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  Lock,
  Play,
  Target,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type GradeLevel = "1" | "2" | "3";
type QuestionType = "multiple-choice" | "true-false" | "short-answer" | "essay";

interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer?: number | string;
  points: number;
  explanation?: string;
}

interface Exercise {
  id: string;
  lectureId: string;
  title: string;
  description: string;
  gradeLevel: GradeLevel;
  timeLimit?: number;
  passingScore: number;
  maxAttempts?: number;
  questions: Question[];
  totalPoints: number;
  requiresAllLessonsComplete: boolean;
}

export default function ExercisePage() {
  const params = useParams();
  const exerciseId = params.id as string;
  const userGrade: GradeLevel = "1";

  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string | number }>(
    {}
  );
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);

  const exercise: Exercise = {
    id: exerciseId,
    lectureId: "5",
    title: "تمرين المحاضرة الخامسة",
    description: "تمرين شامل على محاضرة الكتابة الإبداعية",
    gradeLevel: "1",
    timeLimit: 45,
    passingScore: 75,
    maxAttempts: 2,
    totalPoints: 50,
    requiresAllLessonsComplete: true,
    questions: [
      {
        id: "1",
        type: "multiple-choice",
        question: "ما هي أهم عناصر القصة القصيرة؟",
        options: [
          "الشخصيات والأحداث والزمان والمكان",
          "الشعر والنثر",
          "القافية والوزن",
          "المقدمة والخاتمة",
        ],
        correctAnswer: 0,
        points: 10,
        explanation:
          "عناصر القصة القصيرة الأساسية هي: الشخصيات، الأحداث، الزمان، والمكان.",
      },
      {
        id: "2",
        type: "true-false",
        question: "الكتابة الإبداعية تتطلب الخيال والإبداع",
        options: ["صح", "خطأ"],
        correctAnswer: 0,
        points: 10,
        explanation:
          "نعم، الكتابة الإبداعية تعتمد بشكل أساسي على الخيال والإبداع.",
      },
      {
        id: "3",
        type: "multiple-choice",
        question: "أي من التالي يعتبر من أنواع الكتابة الإبداعية؟",
        options: ["التقرير العلمي", "الرواية", "المذكرة الرسمية", "الفاتورة"],
        correctAnswer: 1,
        points: 10,
        explanation: "الرواية هي أحد أشكال الكتابة الإبداعية.",
      },
      {
        id: "4",
        type: "short-answer",
        question: "اذكر ثلاثة من أنواع الكتابة الإبداعية",
        correctAnswer: "القصة القصيرة، الرواية، الشعر",
        points: 10,
        explanation:
          "أنواع الكتابة الإبداعية تشمل: القصة القصيرة، الرواية، الشعر، المقال الأدبي.",
      },
      {
        id: "5",
        type: "essay",
        question:
          "اكتب فقرة قصيرة (5-7 أسطر) عن أهمية الكتابة الإبداعية في حياتنا",
        points: 10,
        explanation:
          "يجب أن تتضمن الإجابة: التعبير عن المشاعر، تطوير الخيال، التواصل مع الآخرين، الحفاظ على التراث.",
      },
    ],
  };

  const allLessonsCompleted = true; // MOCK
  const hasGradeAccess = exercise.gradeLevel === userGrade;
  const canAccessExercise =
    hasGradeAccess &&
    (!exercise.requiresAllLessonsComplete || allLessonsCompleted);
  const currentQuestion = exercise.questions[currentQuestionIndex];
  const progress =
    ((currentQuestionIndex + 1) / exercise.questions.length) * 100;

  useEffect(() => {
    if (exerciseStarted && !exerciseCompleted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmitExercise();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [exerciseStarted, exerciseCompleted, timeRemaining]);

  const handleStartExercise = () => {
    setExerciseStarted(true);
    if (exercise.timeLimit) {
      setTimeRemaining(exercise.timeLimit * 60);
    }
  };

  const handleAnswerSelect = (questionId: string, answer: string | number) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < exercise.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitExercise = () => {
    let correctCount = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    exercise.questions.forEach((q) => {
      totalPoints += q.points;
      if (q.type === "multiple-choice" || q.type === "true-false") {
        if (answers[q.id] === q.correctAnswer) {
          correctCount++;
          earnedPoints += q.points;
        }
      } else if (q.type === "short-answer" || q.type === "essay") {
        // For demo, give partial credit if answered
        if (answers[q.id]) {
          earnedPoints += q.points * 0.7; // 70% credit for attempting
        }
      }
    });

    const finalScore = (earnedPoints / totalPoints) * 100;
    setScore(finalScore);
    setPassed(finalScore >= exercise.passingScore);
    setExerciseCompleted(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!hasGradeAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <Card className="max-w-md border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <XCircle className="w-20 h-20 text-red-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">غير مصرح بالوصول</h2>
            <p className="text-muted-foreground mb-6">
              هذا التمرين غير متاح لصفك الدراسي
            </p>
            <Link
              href="/ar/lectures"
              className="block w-full"
              style={{ minHeight: "44px" }}
            >
              <Button className="w-full h-full">العودة</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!canAccessExercise) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <Card className="max-w-md border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <Lock className="w-20 h-20 text-orange-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">التمرين مغلق</h2>
            <p className="text-muted-foreground mb-6">
              يجب إكمال جميع دروس المحاضرة أولاً للوصول إلى التمرين
            </p>
            <Link
              href={`/ar/lectures/${exercise.lectureId}`}
              className="block w-full"
              style={{ minHeight: "44px" }}
            >
              <Button className="w-full h-full">العودة إلى المحاضرة</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (exerciseCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <Card
            className={`border-0 shadow-2xl ${passed ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20" : "bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20"}`}
          >
            <CardContent className="p-8 text-center">
              {passed ? (
                <Award className="w-24 h-24 text-green-600 mx-auto mb-6" />
              ) : (
                <Target className="w-24 h-24 text-orange-600 mx-auto mb-6" />
              )}
              <h1 className="text-4xl font-bold mb-4">
                {passed ? "ممتاز! لقد نجحت" : "جيد، لكن يمكنك تحسين أدائك"}
              </h1>
              <div className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {Math.round(score)}%
              </div>
              <p className="text-xl text-muted-foreground mb-8">
                {passed
                  ? `أحسنت! لقد تجاوزت الحد الأدنى (${exercise.passingScore}%)`
                  : `تحتاج إلى ${exercise.passingScore}% للنجاح`}
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-background rounded-lg">
                  <div className="text-2xl font-bold">
                    {Object.keys(answers).length}
                  </div>
                  <div className="text-sm text-muted-foreground">إجابات</div>
                </div>
                <div className="p-4 bg-background rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round((score / 100) * exercise.questions.length)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    صحيحة (تقريباً)
                  </div>
                </div>
                <div className="p-4 bg-background rounded-lg">
                  <div className="text-2xl font-bold">{Math.round(score)}%</div>
                  <div className="text-sm text-muted-foreground">النتيجة</div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {passed ? (
                  <>
                    <div className="p-6 bg-green-100 dark:bg-green-900/20 rounded-lg mb-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                        <div className="text-right">
                          <h3 className="font-bold mb-2">
                            تم فتح الواجب المنزلي!
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            يمكنك الآن الوصول إلى الواجب المنزلي لهذه المحاضرة
                          </p>
                        </div>
                      </div>
                    </div>
                    <Link
                      href={`/ar/homework/${exercise.lectureId}`}
                      className="block w-full"
                      style={{ minHeight: "44px" }}
                    >
                      <Button
                        size="lg"
                        className="w-full h-full bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                      >
                        <BookOpen className="w-5 h-5 ms-2" aria-hidden="true" />
                        ابدأ الواجب المنزلي
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Button
                    onClick={() => {
                      setExerciseCompleted(false);
                      setExerciseStarted(false);
                      setCurrentQuestionIndex(0);
                      setAnswers({});
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg py-6"
                  >
                    <ChevronRight className="w-5 h-5 ms-2" />
                    إعادة المحاولة
                  </Button>
                )}
                <Link
                  href={`/ar/lectures/${exercise.lectureId}`}
                  className="block w-full"
                  style={{ minHeight: "44px" }}
                >
                  <Button variant="outline" className="w-full h-full">
                    العودة إلى المحاضرة
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!exerciseStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <Card className="border-0 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <Badge className="mx-auto mb-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                تمرين إلزامي
              </Badge>
              <CardTitle className="text-3xl md:text-4xl font-bold">
                {exercise.title}
              </CardTitle>
              <p className="text-lg text-muted-foreground mt-2">
                {exercise.description}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted rounded-lg text-center">
                  <div className="text-2xl font-bold">
                    {exercise.questions.length}
                  </div>
                  <div className="text-sm text-muted-foreground">سؤال</div>
                </div>
                {exercise.timeLimit && (
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <div className="text-2xl font-bold">
                      {exercise.timeLimit}
                    </div>
                    <div className="text-sm text-muted-foreground">دقيقة</div>
                  </div>
                )}
                <div className="p-4 bg-muted rounded-lg text-center">
                  <div className="text-2xl font-bold">
                    {exercise.passingScore}%
                  </div>
                  <div className="text-sm text-muted-foreground">للنجاح</div>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <div className="text-2xl font-bold">
                    {exercise.totalPoints}
                  </div>
                  <div className="text-sm text-muted-foreground">نقطة</div>
                </div>
              </div>
              <div className="p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-2">تعليمات مهمة:</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• يجب الإجابة على جميع الأسئلة</li>
                      {exercise.timeLimit && (
                        <li>
                          • لديك {exercise.timeLimit} دقيقة لإكمال التمرين
                        </li>
                      )}
                      <li>• يجب الحصول على {exercise.passingScore}% للنجاح</li>
                      {exercise.maxAttempts && (
                        <li>• يمكنك المحاولة {exercise.maxAttempts} مرات</li>
                      )}
                      <li>• بعد النجاح سيتم فتح الواجب المنزلي</li>
                    </ul>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleStartExercise}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white text-lg py-6"
              >
                <Play className="w-5 h-5 ms-2" />
                ابدأ التمرين
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-4xl mx-auto px-6 py-6">
        {exercise.timeLimit && (
          <Card className="mb-6 border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    السؤال {currentQuestionIndex + 1} من{" "}
                    {exercise.questions.length}
                  </div>
                  <Progress value={progress} className="w-32 h-2" />
                </div>
                <div className="flex items-center gap-2 text-lg font-bold">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <span className={timeRemaining < 300 ? "text-red-600" : ""}>
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6 border-0 shadow-xl">
          <CardContent className="p-8">
            <div className="mb-6">
              <Badge className="mb-4">{currentQuestion.points} نقاط</Badge>
              <h2 className="text-2xl font-bold mb-2">
                {currentQuestion.question}
              </h2>
              <Badge variant="outline" className="text-sm">
                {currentQuestion.type === "multiple-choice"
                  ? "اختيار من متعدد"
                  : currentQuestion.type === "true-false"
                    ? "صح أو خطأ"
                    : currentQuestion.type === "short-answer"
                      ? "إجابة قصيرة"
                      : "مقال"}
              </Badge>
            </div>

            {(currentQuestion.type === "multiple-choice" ||
              currentQuestion.type === "true-false") &&
              currentQuestion.options && (
                <RadioGroup
                  value={answers[currentQuestion.id]?.toString()}
                  onValueChange={(value) =>
                    handleAnswerSelect(currentQuestion.id, parseInt(value))
                  }
                >
                  <div
                    className="space-y-3"
                    role="radiogroup"
                    aria-label="خيارات الإجابة"
                  >
                    {currentQuestion.options.map((option, index) => (
                      <div
                        key={index}
                        className={`flex items-center space-x-2 space-x-reverse p-4 rounded-lg border-2 transition-all cursor-pointer focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 ${answers[currentQuestion.id] === index ? "border-green-600 bg-green-50 dark:bg-green-950/20" : "border-muted hover:border-green-300"}`}
                        onClick={() =>
                          handleAnswerSelect(currentQuestion.id, index)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleAnswerSelect(currentQuestion.id, index);
                          }
                        }}
                        role="radio"
                        aria-checked={answers[currentQuestion.id] === index}
                        tabIndex={0}
                      >
                        <RadioGroupItem
                          value={index.toString()}
                          id={`option-${index}`}
                        />
                        <Label
                          htmlFor={`option-${index}`}
                          className="flex-1 cursor-pointer text-lg"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              )}

            {(currentQuestion.type === "short-answer" ||
              currentQuestion.type === "essay") && (
              <Textarea
                value={(answers[currentQuestion.id] as string) || ""}
                onChange={(e) =>
                  handleAnswerSelect(currentQuestion.id, e.target.value)
                }
                placeholder={
                  currentQuestion.type === "essay"
                    ? "اكتب إجابتك هنا (5-7 أسطر)..."
                    : "اكتب إجابتك هنا..."
                }
                className="min-h-[150px] text-lg"
                rows={currentQuestion.type === "essay" ? 8 : 4}
              />
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex-1"
          >
            <ChevronRight className="w-4 h-4 ms-2" />
            السابق
          </Button>
          {currentQuestionIndex === exercise.questions.length - 1 ? (
            <Button
              onClick={handleSubmitExercise}
              disabled={
                Object.keys(answers).length !== exercise.questions.length
              }
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white"
            >
              <Flag className="w-4 h-4 ms-2" />
              إنهاء
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            >
              التالي
              <ChevronLeft className="w-4 h-4 me-2" />
            </Button>
          )}
        </div>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          أجبت على {Object.keys(answers).length} من {exercise.questions.length}{" "}
          سؤال
        </div>
      </div>
    </div>
  );
}
