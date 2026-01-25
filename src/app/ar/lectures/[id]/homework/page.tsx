"use client";

import { LectureProgressGuard } from "@/components/lectures";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useLectureProgress } from "@/hooks/useLectureProgress";
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Lock,
  Sparkles,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

type QuestionType = "multiple-choice" | "text" | "true-false";

interface HomeworkQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | number;
  points: number;
}

interface HomeworkData {
  lectureId: string;
  lectureNumber: number;
  title: string;
  description: string;
  totalPoints: number;
  passingScore: number;
  xpReward: number;
  questions: HomeworkQuestion[];
  isLocked: boolean;
  lockReason?: string;
}

// Mock homework data
function getMockHomework(lectureId: string): HomeworkData {
  return {
    lectureId,
    lectureNumber: 5,
    title: "واجب المحاضرة 5: المبتدأ والخبر",
    description: "أجب عن الأسئلة التالية لإكمال واجب المحاضرة",
    totalPoints: 100,
    passingScore: 70,
    xpReward: 100,
    isLocked: false,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question: "ما هو المبتدأ في الجملة: 'الطالب مجتهد'؟",
        options: ["الطالب", "مجتهد", "ال", "الجملة كلها"],
        correctAnswer: 0,
        points: 20,
      },
      {
        id: "q2",
        type: "multiple-choice",
        question: "أي من التالي يعد خبراً جملة فعلية؟",
        options: ["العلم نور", "الطالب يذاكر", "الكتاب جديد", "البيت واسع"],
        correctAnswer: 1,
        points: 20,
      },
      {
        id: "q3",
        type: "true-false",
        question: "يجوز تقديم الخبر على المبتدأ في جميع الحالات",
        options: ["صحيح", "خطأ"],
        correctAnswer: 1,
        points: 20,
      },
      {
        id: "q4",
        type: "multiple-choice",
        question: "ما نوع الخبر في جملة 'الكتاب فوق الطاولة'؟",
        options: [
          "خبر مفرد",
          "خبر جملة اسمية",
          "خبر جملة فعلية",
          "خبر شبه جملة",
        ],
        correctAnswer: 3,
        points: 20,
      },
      {
        id: "q5",
        type: "text",
        question: "أعرب الجملة التالية: 'السماء صافية'",
        correctAnswer: "السماء: مبتدأ مرفوع. صافية: خبر مرفوع",
        points: 20,
      },
    ],
  };
}

type HomeworkState = "intro" | "working" | "submitted" | "results";

function HomeworkContent() {
  const params = useParams();
  const router = useRouter();
  const lectureId = params.id as string;

  const { completeHomework, progress: lectureProgress } = useLectureProgress(lectureId);

  const [homework] = useState(() => getMockHomework(lectureId));
  const [state, setState] = useState<HomeworkState>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleStart = () => {
    setState("working");
    setCurrentQuestion(0);
    setAnswers({});
  };

  const handleAnswer = (questionId: string, answer: string | number) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleNext = () => {
    if (currentQuestion < homework.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    let totalScore = 0;
    homework.questions.forEach((q) => {
      const userAnswer = answers[q.id];
      if (q.type === "text") {
        if (typeof userAnswer === "string" && userAnswer.trim().length > 10) {
          totalScore += q.points;
        }
      } else if (userAnswer === q.correctAnswer) {
        totalScore += q.points;
      }
    });
    setScore(totalScore);
    setState("results");

    // Save progress if passed
    const didPass = totalScore >= homework.passingScore;
    if (didPass && !lectureProgress.homeworkCompleted) {
      completeHomework(totalScore);
    }
  };

  const passed = score >= homework.passingScore;
  const quizProgress = ((currentQuestion + 1) / homework.questions.length) * 100;
  const currentQ = homework.questions[currentQuestion];

  // Locked state
  if (homework.isLocked) {
    return (
      <div
        className="min-h-screen page-bg-purple flex items-center justify-center p-6"
        dir="rtl"
      >
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto">
              <Lock className="w-10 h-10 text-orange-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">الواجب مقفل</h2>
              <p className="text-muted-foreground">
                {homework.lockReason ||
                  "يجب إكمال الاختبار البعدي أولاً لفتح الواجب"}
              </p>
            </div>
            <Link href={`/ar/lectures/${lectureId}`}>
              <Button className="w-full">
                <ArrowRight className="w-4 h-4 ms-2" />
                العودة للمحاضرة
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Intro state
  if (state === "intro") {
    return (
      <div className="min-h-screen page-bg-purple py-8" dir="rtl">
        <div className="container mx-auto px-6 max-w-2xl">
          <Link href={`/ar/lectures/${lectureId}`}>
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowRight className="w-4 h-4 ms-2" />
              العودة للمحاضرة
            </Button>
          </Link>
          <Card>
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto">
                <ClipboardList className="w-10 h-10 text-blue-600" />
              </div>
              <div className="space-y-2">
                <Badge variant="outline">محاضرة {homework.lectureNumber}</Badge>
                <h1 className="text-2xl font-bold">{homework.title}</h1>
                <p className="text-muted-foreground">{homework.description}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {homework.questions.length}
                  </div>
                  <div className="text-xs text-muted-foreground">أسئلة</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {homework.totalPoints}
                  </div>
                  <div className="text-xs text-muted-foreground">نقطة</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">
                    {homework.xpReward}
                  </div>
                  <div className="text-xs text-muted-foreground">XP مكافأة</div>
                </div>
              </div>
              <Button size="lg" className="w-full" onClick={handleStart}>
                <BookOpen className="w-4 h-4 ms-2" />
                بدء الواجب
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Results state
  if (state === "results") {
    return (
      <div className="min-h-screen page-bg-purple py-8" dir="rtl">
        <div className="container mx-auto px-6 max-w-2xl">
          <Card>
            <CardContent className="p-8 text-center space-y-6">
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto ${
                  passed
                    ? "bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20"
                    : "bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/20 dark:to-rose-900/20"
                }`}
              >
                {passed ? (
                  <CheckCircle className="w-12 h-12 text-green-600" />
                ) : (
                  <XCircle className="w-12 h-12 text-red-600" />
                )}
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">
                  {passed ? "أحسنت! اجتزت الواجب" : "لم تجتز الواجب"}
                </h2>
                <p className="text-muted-foreground">
                  {passed
                    ? "لقد أكملت واجب المحاضرة بنجاح"
                    : "يمكنك المحاولة مرة أخرى"}
                </p>
              </div>
              <div className="text-5xl font-bold">
                <span className={passed ? "text-green-600" : "text-red-600"}>
                  {score}
                </span>
                <span className="text-muted-foreground text-2xl">
                  /{homework.totalPoints}
                </span>
              </div>
              {passed && (
                <div className="flex items-center justify-center gap-2 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-amber-800 dark:text-amber-200">
                    +{homework.xpReward} XP
                  </span>
                </div>
              )}
              <div className="flex gap-3">
                <Link href={`/ar/lectures/${lectureId}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    العودة للمحاضرة
                  </Button>
                </Link>
                {!passed && (
                  <Button className="flex-1" onClick={handleStart}>
                    إعادة المحاولة
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Working state - answering questions
  return (
    <div className="min-h-screen page-bg-purple py-8" dir="rtl">
      <div className="container mx-auto px-6 max-w-2xl">
        {/* Progress Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              السؤال {currentQuestion + 1} من {homework.questions.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {currentQ.points} نقطة
            </span>
          </div>
          <Progress value={quizProgress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">{currentQ.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQ.type === "multiple-choice" ||
            currentQ.type === "true-false" ? (
              <RadioGroup
                value={String(answers[currentQ.id] ?? "")}
                onValueChange={(value) =>
                  handleAnswer(currentQ.id, parseInt(value))
                }
              >
                {currentQ.options?.map((option, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                      answers[currentQ.id] === index
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => handleAnswer(currentQ.id, index)}
                  >
                    <RadioGroupItem
                      value={String(index)}
                      id={`option-${index}`}
                    />
                    <label
                      htmlFor={`option-${index}`}
                      className="flex-1 cursor-pointer"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <Textarea
                placeholder="اكتب إجابتك هنا..."
                value={String(answers[currentQ.id] ?? "")}
                onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                className="min-h-32"
                dir="rtl"
              />
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentQuestion === 0}
          >
            <ChevronRight className="w-4 h-4 ms-2" />
            السابق
          </Button>

          {currentQuestion === homework.questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < homework.questions.length}
              className="bg-gradient-to-r from-green-600 to-emerald-600"
            >
              <CheckCircle className="w-4 h-4 ms-2" />
              تسليم الواجب
            </Button>
          ) : (
            <Button onClick={handleNext}>
              التالي
              <ChevronLeft className="w-4 h-4 me-2" />
            </Button>
          )}
        </div>

        {/* Question Navigation Dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {homework.questions.map((q, index) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestion(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentQuestion
                  ? "bg-primary"
                  : answers[q.id] !== undefined
                    ? "bg-green-500"
                    : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Export the wrapped component with progress guard
export default function LectureHomeworkPage() {
  const params = useParams();
  const lectureId = params?.id as string;

  return (
    <LectureProgressGuard lectureId={lectureId} requiredStep="homework">
      <HomeworkContent />
    </LectureProgressGuard>
  );
}
