"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLectureProgress } from "@/hooks/useLectureProgress";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Clock,
  Lock,
  Play,
  RotateCcw,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Mock pre-quiz data
const preQuizData = {
  lectureTitle: "مقدمة في النحو العربي",
  threshold: 70,
  maxAttempts: 2,
  currentAttempts: 0,
  duration: 300, // 5 minutes
  questions: [
    {
      id: 1,
      question: "ما هو تعريف النحو؟",
      options: [
        "علم يبحث في أصول الكلام",
        "علم يبحث في أواخر الكلمات",
        "علم يبحث في معاني الكلمات",
        "علم يبحث في أصوات الحروف",
      ],
      correct: 1,
    },
    {
      id: 2,
      question: "ما هي أقسام الكلام في اللغة العربية؟",
      options: ["اسم وفعل", "اسم وفعل وحرف", "اسم وحرف", "فعل وحرف"],
      correct: 1,
    },
    {
      id: 3,
      question: "ما هو الإعراب؟",
      options: [
        "تغيير أواخر الكلمات",
        "تغيير أوائل الكلمات",
        "تغيير أوساط الكلمات",
        "لا شيء مما سبق",
      ],
      correct: 0,
    },
    {
      id: 4,
      question: "ما هو المبتدأ؟",
      options: [
        "اسم مرفوع يقع في أول الجملة الاسمية",
        "اسم منصوب",
        "اسم مجرور",
        "فعل ماضٍ",
      ],
      correct: 0,
    },
    {
      id: 5,
      question: "ما هو الخبر؟",
      options: [
        "ما يتم به معنى المبتدأ",
        "ما يسبق المبتدأ",
        "الفعل الماضي",
        "الحرف",
      ],
      correct: 0,
    },
  ],
};

type QuizState = "intro" | "playing" | "finished";

export default function PreQuizPage() {
  const params = useParams();
  const router = useRouter();
  const lectureId = params?.id as string;

  const { completePreQuiz, progress } = useLectureProgress(lectureId);

  const [state, setState] = useState<QuizState>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(preQuizData.duration);

  // Timer
  useEffect(() => {
    if (state !== "playing") return;
    if (timeLeft <= 0) {
      finishQuiz();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [state, timeLeft]);

  const startQuiz = () => {
    setState("playing");
    setCurrentQuestion(0);
    setAnswers(new Array(preQuizData.questions.length).fill(null));
    setTimeLeft(preQuizData.duration);
  };

  const selectAnswer = (index: number) => {
    setSelectedAnswer(index);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = index;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < preQuizData.questions.length - 1) {
      setCurrentQuestion((q) => q + 1);
      setSelectedAnswer(answers[currentQuestion + 1]);
    } else {
      finishQuiz();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((q) => q - 1);
      setSelectedAnswer(answers[currentQuestion - 1]);
    }
  };

  const finishQuiz = () => {
    setState("finished");
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === preQuizData.questions[index].correct) correct++;
    });
    return Math.round((correct / preQuizData.questions.length) * 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Intro Screen
  if (state === "intro") {
    const attemptsLeft = preQuizData.maxAttempts - preQuizData.currentAttempts;
    return (
      <div
        className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-24"
        dir="rtl"
      >
        <div className="container mx-auto px-4 py-8">
          <Link
            href={`/ar/lectures/${lectureId}`}
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            العودة للمحاضرة
          </Link>

          <Card className="max-w-2xl mx-auto border-0 shadow-xl">
            <CardContent className="p-8 text-center space-y-6">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Lock className="h-10 w-10 text-white" />
              </div>

              <h1 className="text-3xl font-bold">الاختبار القبلي</h1>
              <p className="text-muted-foreground">
                {preQuizData.lectureTitle}
              </p>

              <div className="p-4 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                <div className="flex items-center gap-2 justify-center text-amber-800 dark:text-amber-200">
                  <AlertCircle className="h-5 w-5" />
                  <span>
                    يجب الحصول على {preQuizData.threshold}% على الأقل لفتح
                    المحاضرة
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {preQuizData.questions.length}
                  </div>
                  <div className="text-sm text-muted-foreground">سؤال</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {Math.floor(preQuizData.duration / 60)}
                  </div>
                  <div className="text-sm text-muted-foreground">دقيقة</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{attemptsLeft}</div>
                  <div className="text-sm text-muted-foreground">
                    محاولات متبقية
                  </div>
                </div>
              </div>

              {attemptsLeft > 0 ? (
                <Button
                  size="lg"
                  onClick={startQuiz}
                  className="w-full gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                >
                  <Play className="h-5 w-5" />
                  بدء الاختبار
                </Button>
              ) : (
                <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <p className="text-red-800 dark:text-red-200 font-medium">
                    لقد استنفدت جميع المحاولات. يرجى التواصل مع الدعم.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Results Screen
  if (state === "finished") {
    const score = calculateScore();
    const passed = score >= preQuizData.threshold;

    // Save progress when quiz is passed
    if (passed && !progress.preQuizCompleted) {
      completePreQuiz(score);
    }

    return (
      <div
        className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-24"
        dir="rtl"
      >
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto border-0 shadow-xl">
            <CardContent className="p-8 text-center space-y-6">
              <div
                className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center ${passed ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20"}`}
              >
                {passed ? (
                  <CheckCircle className="h-12 w-12 text-green-600" />
                ) : (
                  <XCircle className="h-12 w-12 text-red-600" />
                )}
              </div>

              <h1 className="text-3xl font-bold">
                {passed ? "تم اجتياز الاختبار!" : "لم تجتز الاختبار"}
              </h1>

              <div
                className={`text-6xl font-bold ${passed ? "text-green-600" : "text-red-600"}`}
              >
                {score}%
              </div>

              <p className="text-muted-foreground">
                الحد الأدنى المطلوب: {preQuizData.threshold}%
              </p>

              {passed ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-2 justify-center text-green-800 dark:text-green-200">
                      <CheckCircle className="h-5 w-5" />
                      <span>تم فتح الفيديوهات! يمكنك الآن مشاهدة المحاضرة</span>
                    </div>
                  </div>
                  <Link href={`/ar/lectures/${lectureId}`}>
                    <Button
                      size="lg"
                      className="w-full gap-2 bg-gradient-to-r from-green-500 to-emerald-500"
                    >
                      <Play className="h-5 w-5" />
                      الذهاب للمحاضرة
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    المحاولات المتبقية:{" "}
                    {preQuizData.maxAttempts - preQuizData.currentAttempts - 1}
                  </p>
                  {preQuizData.maxAttempts - preQuizData.currentAttempts - 1 >
                  0 ? (
                    <Button
                      size="lg"
                      onClick={() => setState("intro")}
                      className="w-full gap-2"
                      variant="outline"
                    >
                      <RotateCcw className="h-5 w-5" />
                      إعادة المحاولة
                    </Button>
                  ) : (
                    <p className="text-red-600">لقد استنفدت جميع المحاولات</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Playing Screen
  const question = preQuizData.questions[currentQuestion];
  const quizProgress =
    ((currentQuestion + 1) / preQuizData.questions.length) * 100;

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-24"
      dir="rtl"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-muted-foreground">
            سؤال {currentQuestion + 1} من {preQuizData.questions.length}
          </span>
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${timeLeft <= 30 ? "bg-red-100 dark:bg-red-900/20 text-red-600" : "bg-muted"}`}
          >
            <Clock className="h-4 w-4" />
            <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <Progress value={quizProgress} className="h-2 mb-8" />

        <Card className="max-w-3xl mx-auto border-0 shadow-xl">
          <CardContent className="p-8 space-y-6">
            <h2 className="text-xl font-bold text-center">
              {question.question}
            </h2>

            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectAnswer(index)}
                  className={`w-full p-4 rounded-lg border-2 text-right transition-all ${selectedAnswer === index ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${selectedAnswer === index ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                    >
                      {String.fromCharCode(1571 + index)}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                className="flex-1"
              >
                السابق
              </Button>
              <Button
                onClick={nextQuestion}
                disabled={selectedAnswer === null}
                className="flex-1"
              >
                {currentQuestion === preQuizData.questions.length - 1
                  ? "إنهاء"
                  : "التالي"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
