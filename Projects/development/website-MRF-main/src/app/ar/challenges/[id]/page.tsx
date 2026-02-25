"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Flame,
  Play,
  RotateCcw,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// Mock challenge data
const challengesData: Record<
  string,
  {
    id: number;
    title: string;
    category: string;
    questions: { id: number; question: string; options: string[]; correct: number }[];
    duration: number; // in seconds
    difficulty: string;
    xpReward: number;
  }
> = {
  "1": {
    id: 1,
    title: "تحدي أساسيات النحو",
    category: "النحو",
    questions: [
      { id: 1, question: "ما هو إعراب كلمة 'الطالب' في جملة: الطالب مجتهد؟", options: ["مبتدأ مرفوع", "خبر مرفوع", "فاعل مرفوع", "مفعول به منصوب"], correct: 0 },
      { id: 2, question: "ما نوع الجملة: 'يذهب الطالب إلى المدرسة'؟", options: ["جملة اسمية", "جملة فعلية", "شبه جملة", "جملة شرطية"], correct: 1 },
      { id: 3, question: "ما هو الفاعل في جملة: 'كتب الطالب الدرس'؟", options: ["كتب", "الطالب", "الدرس", "لا يوجد فاعل"], correct: 1 },
      { id: 4, question: "ما إعراب 'مجتهد' في: الطالب مجتهد؟", options: ["مبتدأ", "خبر مرفوع", "صفة", "حال"], correct: 1 },
      { id: 5, question: "أي الجمل التالية صحيحة نحوياً؟", options: ["ذهب الطلاب", "ذهبوا الطلاب", "ذهبت الطلاب", "ذهبن الطلاب"], correct: 0 },
    ],
    duration: 300, // 5 minutes
    difficulty: "مبتدئ",
    xpReward: 150,
  },
  "2": {
    id: 2,
    title: "تحدي تحليل النصوص",
    category: "الأدب",
    questions: [
      { id: 1, question: "ما الغرض من الاستعارة في الشعر؟", options: ["التوضيح", "التشبيه الضمني", "المبالغة", "كل ما سبق"], correct: 3 },
      { id: 2, question: "من هو شاعر المعلقات الذي قال 'قفا نبك'؟", options: ["عنترة", "امرؤ القيس", "زهير", "طرفة"], correct: 1 },
      { id: 3, question: "ما نوع الصورة البيانية في 'الشمس تبتسم'؟", options: ["تشبيه", "استعارة مكنية", "كناية", "مجاز مرسل"], correct: 1 },
    ],
    duration: 600, // 10 minutes
    difficulty: "متوسط",
    xpReward: 200,
  },
};

type ChallengeState = "intro" | "playing" | "finished";

export default function ChallengeDetailPage() {
  const params = useParams();
  const challengeId = params?.id as string;
  const challenge = challengesData[challengeId] || challengesData["1"];

  const [state, setState] = useState<ChallengeState>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(challenge.duration);
  const [showResult, setShowResult] = useState(false);

  // Timer
  useEffect(() => {
    if (state !== "playing") return;
    if (timeLeft <= 0) {
      finishChallenge();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [state, timeLeft]);

  const startChallenge = () => {
    setState("playing");
    setCurrentQuestion(0);
    setAnswers(new Array(challenge.questions.length).fill(null));
    setTimeLeft(challenge.duration);
  };

  const selectAnswer = (index: number) => {
    setSelectedAnswer(index);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = index;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < challenge.questions.length - 1) {
      setCurrentQuestion((q) => q + 1);
      setSelectedAnswer(answers[currentQuestion + 1]);
    } else {
      finishChallenge();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((q) => q - 1);
      setSelectedAnswer(answers[currentQuestion - 1]);
    }
  };

  const finishChallenge = () => {
    setState("finished");
    setShowResult(true);
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === challenge.questions[index].correct) correct++;
    });
    return Math.round((correct / challenge.questions.length) * 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const restartChallenge = () => {
    setState("intro");
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setShowResult(false);
  };

  // Intro Screen
  if (state === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-24">
        <div className="container mx-auto px-4 py-8">
          <Link href="/ar/challenges" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            العودة للتحديات
          </Link>

          <Card className="max-w-2xl mx-auto border-0 shadow-xl">
            <CardContent className="p-8 text-center space-y-6">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Flame className="h-10 w-10 text-white" />
              </div>

              <h1 className="text-3xl font-bold">{challenge.title}</h1>

              <div className="flex items-center justify-center gap-4 text-muted-foreground">
                <Badge variant="outline">{challenge.category}</Badge>
                <Badge variant="outline">{challenge.difficulty}</Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 py-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{challenge.questions.length}</div>
                  <div className="text-sm text-muted-foreground">سؤال</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{Math.floor(challenge.duration / 60)}</div>
                  <div className="text-sm text-muted-foreground">دقيقة</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-500">+{challenge.xpReward}</div>
                  <div className="text-sm text-muted-foreground">XP</div>
                </div>
              </div>

              <Button size="lg" onClick={startChallenge} className="w-full gap-2 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600">
                <Play className="h-5 w-5" />
                ابدأ التحدي
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Results Screen
  if (state === "finished" && showResult) {
    const score = calculateScore();
    const passed = score >= 70;
    const earnedXP = passed ? challenge.xpReward : Math.round(challenge.xpReward * 0.3);

    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-24">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto border-0 shadow-xl">
            <CardContent className="p-8 text-center space-y-6">
              <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center ${passed ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20"}`}>
                {passed ? <Trophy className="h-12 w-12 text-green-600" /> : <XCircle className="h-12 w-12 text-red-600" />}
              </div>

              <h1 className="text-3xl font-bold">{passed ? "أحسنت! 🎉" : "حاول مرة أخرى"}</h1>

              <div className="text-6xl font-bold bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                {score}%
              </div>

              <div className="flex items-center justify-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                <span className="text-lg font-medium">+{earnedXP} XP</span>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-green-700 dark:text-green-300">
                    {answers.filter((a, i) => a === challenge.questions[i].correct).length}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">إجابات صحيحة</div>
                </div>
                <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-red-700 dark:text-red-300">
                    {answers.filter((a, i) => a !== challenge.questions[i].correct).length}
                  </div>
                  <div className="text-sm text-red-600 dark:text-red-400">إجابات خاطئة</div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={restartChallenge} className="flex-1 gap-2">
                  <RotateCcw className="h-4 w-4" />
                  إعادة المحاولة
                </Button>
                <Link href="/ar/challenges" className="flex-1">
                  <Button className="w-full gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    العودة للتحديات
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Playing Screen
  const question = challenge.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / challenge.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              سؤال {currentQuestion + 1} من {challenge.questions.length}
            </span>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${timeLeft <= 30 ? "bg-red-100 dark:bg-red-900/20 text-red-600" : "bg-muted"}`}>
            <Clock className="h-4 w-4" />
            <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Progress */}
        <Progress value={progress} className="h-2 mb-8" />

        {/* Question Card */}
        <Card className="max-w-3xl mx-auto border-0 shadow-xl">
          <CardContent className="p-8 space-y-6">
            <h2 className="text-xl font-bold text-center">{question.question}</h2>

            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectAnswer(index)}
                  className={`w-full p-4 rounded-lg border-2 text-end transition-all ${
                    selectedAnswer === index
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      selectedAnswer === index
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {String.fromCharCode(1571 + index)}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex gap-4 pt-4">
              <Button variant="outline" onClick={prevQuestion} disabled={currentQuestion === 0} className="flex-1">
                السابق
              </Button>
              <Button onClick={nextQuestion} disabled={selectedAnswer === null} className="flex-1">
                {currentQuestion === challenge.questions.length - 1 ? "إنهاء" : "التالي"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

