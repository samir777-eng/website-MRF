"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  ArrowLeft,
  Award,
  CheckCircle,
  Clock,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Mock post-quiz data
const postQuizData = {
  lectureTitle: "مقدمة في النحو العربي",
  threshold: 70,
  duration: 600, // 10 minutes
  xpReward: 150,
  questions: [
    {
      id: 1,
      question: "ما هي علامة رفع الفاعل؟",
      options: ["الضمة", "الفتحة", "الكسرة", "السكون"],
      correct: 0,
    },
    {
      id: 2,
      question: "أي من الجمل التالية صحيحة نحوياً؟",
      options: ["جاء الطالبُ", "جاء الطالبَ", "جاء الطالبِ", "جاء الطالبْ"],
      correct: 0,
    },
    {
      id: 3,
      question: "ما نوع كلمة 'الكتاب' في جملة 'قرأت الكتابَ'؟",
      options: ["فاعل", "مفعول به", "مبتدأ", "خبر"],
      correct: 1,
    },
    {
      id: 4,
      question: "ما هي علامة نصب الاسم المفرد؟",
      options: ["الفتحة", "الضمة", "الكسرة", "الألف"],
      correct: 0,
    },
    {
      id: 5,
      question: "ما إعراب كلمة 'محمد' في جملة 'محمدٌ طالبٌ مجتهدٌ'؟",
      options: ["مبتدأ مرفوع", "خبر مرفوع", "فاعل مرفوع", "مفعول به منصوب"],
      correct: 0,
    },
    {
      id: 6,
      question: "ما هو جمع 'كتاب'؟",
      options: ["كتب", "كتابات", "كُتّاب", "كل ما سبق صحيح"],
      correct: 3,
    },
    {
      id: 7,
      question: "ما هي علامة جر الاسم المفرد؟",
      options: ["الكسرة", "الفتحة", "الضمة", "السكون"],
      correct: 0,
    },
    {
      id: 8,
      question: "أي من التالي حرف جر؟",
      options: ["في", "لم", "قد", "سوف"],
      correct: 0,
    },
  ],
};

type QuizState = "intro" | "playing" | "finished";

export default function PostQuizPage() {
  const params = useParams();
  const router = useRouter();
  const lectureId = params?.id as string;

  const [state, setState] = useState<QuizState>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(postQuizData.duration);

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
    setAnswers(new Array(postQuizData.questions.length).fill(null));
    setTimeLeft(postQuizData.duration);
  };

  const selectAnswer = (index: number) => {
    setSelectedAnswer(index);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = index;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < postQuizData.questions.length - 1) {
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
      if (answer === postQuizData.questions[index].correct) correct++;
    });
    return Math.round((correct / postQuizData.questions.length) * 100);
  };

  const calculateXP = (score: number) => {
    return Math.round((score / 100) * postQuizData.xpReward);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Intro Screen
  if (state === "intro") {
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
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Award className="h-10 w-10 text-white" />
              </div>

              <h1 className="text-3xl font-bold">الاختبار البعدي</h1>
              <p className="text-muted-foreground">
                {postQuizData.lectureTitle}
              </p>

              <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-2 justify-center text-blue-800 dark:text-blue-200">
                  <Sparkles className="h-5 w-5" />
                  <span>اختبر فهمك للمحاضرة واحصل على نقاط XP!</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {postQuizData.questions.length}
                  </div>
                  <div className="text-sm text-muted-foreground">سؤال</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {Math.floor(postQuizData.duration / 60)}
                  </div>
                  <div className="text-sm text-muted-foreground">دقيقة</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {postQuizData.xpReward}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    XP كحد أقصى
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                onClick={startQuiz}
                className="w-full gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Play className="h-5 w-5" />
                بدء الاختبار
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Results Screen
  if (state === "finished") {
    const score = calculateScore();
    const passed = score >= postQuizData.threshold;
    const xpEarned = calculateXP(score);

    return (
      <div
        className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-24"
        dir="rtl"
      >
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto border-0 shadow-xl">
            <CardContent className="p-8 text-center space-y-6">
              <div
                className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center ${passed ? "bg-green-100 dark:bg-green-900/20" : "bg-orange-100 dark:bg-orange-900/20"}`}
              >
                {passed ? (
                  <CheckCircle className="h-12 w-12 text-green-600" />
                ) : (
                  <AlertCircle className="h-12 w-12 text-orange-600" />
                )}
              </div>

              <h1 className="text-3xl font-bold">
                {passed ? "أحسنت! 🎉" : "جيد، يمكنك التحسن"}
              </h1>

              <div
                className={`text-6xl font-bold ${passed ? "text-green-600" : "text-orange-600"}`}
              >
                {score}%
              </div>

              {/* XP Reward */}
              <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-xl">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Zap className="h-8 w-8 text-purple-600" />
                  <span className="text-4xl font-bold text-purple-600">
                    +{xpEarned}
                  </span>
                </div>
                <p className="text-sm text-purple-600/70">نقاط خبرة مكتسبة</p>
              </div>

              {passed ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-2 justify-center text-green-800 dark:text-green-200">
                      <CheckCircle className="h-5 w-5" />
                      <span>تم فتح الواجب المنزلي!</span>
                    </div>
                  </div>
                  <Link href={`/ar/lectures/${lectureId}/homework`}>
                    <Button
                      size="lg"
                      className="w-full gap-2 bg-gradient-to-r from-green-500 to-emerald-500"
                    >
                      <Play className="h-5 w-5" />
                      الذهاب للواجب المنزلي
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <Button
                    size="lg"
                    onClick={() => setState("intro")}
                    className="w-full gap-2"
                    variant="outline"
                  >
                    <RotateCcw className="h-5 w-5" />
                    إعادة المحاولة
                  </Button>
                </div>
              )}

              <Link href={`/ar/lectures/${lectureId}`}>
                <Button variant="ghost" className="w-full">
                  العودة للمحاضرة
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Playing Screen
  const question = postQuizData.questions[currentQuestion];
  const progress =
    ((currentQuestion + 1) / postQuizData.questions.length) * 100;

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-24"
      dir="rtl"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-muted-foreground">
            سؤال {currentQuestion + 1} من {postQuizData.questions.length}
          </span>
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${timeLeft <= 60 ? "bg-red-100 dark:bg-red-900/20 text-red-600" : "bg-muted"}`}
          >
            <Clock className="h-4 w-4" />
            <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <Progress value={progress} className="h-2 mb-8" />

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
                {currentQuestion === postQuizData.questions.length - 1
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
