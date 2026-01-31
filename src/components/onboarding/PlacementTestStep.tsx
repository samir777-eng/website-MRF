"use client";

/**
 * PlacementTestStep - Quick assessment to determine user level
 * 5 questions covering grammar, rhetoric, and literature
 */

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { OnboardingStepWrapper } from "./OnboardingFlow";
import { Brain, CheckCircle2, Clock, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES & DATA
// ============================================================================

interface Question {
  id: string;
  question: string;
  topic: string;
  options: string[];
  correctAnswer: number;
}

const placementQuestions: Question[] = [
  {
    id: "q1",
    question: "ما إعراب كلمة 'كان' في الجملة التالية: 'كان الطالب مجتهداً'؟",
    topic: "النحو",
    options: ["فعل ماضٍ ناسخ", "فعل مضارع", "حرف ناسخ", "اسم"],
    correctAnswer: 0,
  },
  {
    id: "q2",
    question: "أي من التالي يُعتبر من أنواع البديع؟",
    topic: "البلاغة",
    options: ["الاستعارة", "الطباق", "التشبيه", "الكناية"],
    correctAnswer: 1,
  },
  {
    id: "q3",
    question: "من هو شاعر 'معلقة امرئ القيس'؟",
    topic: "الأدب",
    options: [
      "امرؤ القيس",
      "طرفة بن العبد",
      "عنترة بن شداد",
      "زهير بن أبي سلمى",
    ],
    correctAnswer: 0,
  },
  {
    id: "q4",
    question: "ما نوع الجملة: 'إن العلم نور'؟",
    topic: "النحو",
    options: ["جملة فعلية", "جملة اسمية", "جملة منسوخة", "جملة شرطية"],
    correctAnswer: 2,
  },
  {
    id: "q5",
    question: "ما معنى 'الكناية' في البلاغة؟",
    topic: "البلاغة",
    options: [
      "التشبيه بدون أداة",
      "التعبير عن شيء بلازمه",
      "استخدام المجاز",
      "التكرار للتأكيد",
    ],
    correctAnswer: 1,
  },
];

// ============================================================================
// PLACEMENT TEST COMPONENT
// ============================================================================

export function PlacementTestStep() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, number>
  >({});
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = placementQuestions[currentQuestionIndex];
  const progress =
    ((currentQuestionIndex + 1) / placementQuestions.length) * 100;
  const isLastQuestion = currentQuestionIndex === placementQuestions.length - 1;
  const hasSelectedAnswer = selectedAnswers[currentQuestion.id] !== undefined;

  const handleSelectAnswer = (answerIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answerIndex,
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Calculate score
      const finalScore = placementQuestions.reduce((score, question) => {
        return (
          score +
          (selectedAnswers[question.id] === question.correctAnswer ? 1 : 0)
        );
      }, 0);
      setScore(finalScore);
      setIsComplete(true);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const getRecommendedLevel = (score: number) => {
    if (score >= 4)
      return {
        level: "متقدم",
        color: "text-success-500",
        description: "أنت متفوق! ابدأ من المستوى المتقدم",
      };
    if (score >= 3)
      return {
        level: "متوسط",
        color: "text-blue-500",
        description: "أداء جيد! المستوى المتوسط مناسب لك",
      };
    return {
      level: "مبتدئ",
      color: "text-orange-500",
      description: "لا بأس! سنبدأ من الأساسيات",
    };
  };

  const recommendation = getRecommendedLevel(score);

  if (isComplete) {
    return (
      <OnboardingStepWrapper
        title="رائع! انتهيت من التقييم"
        description="إليك النتائج والمستوى الموصى به"
        icon={
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-success-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-success-500/50">
            <Star className="w-10 h-10 text-white fill-white" />
          </div>
        }
      >
        <Card className="glass border-border/50">
          <CardContent className="p-8 text-center space-y-6">
            {/* Score */}
            <div>
              <div className="text-6xl font-bold text-foreground mb-2">
                {score}/{placementQuestions.length}
              </div>
              <p className="text-muted-foreground">إجابات صحيحة</p>
            </div>

            {/* Progress Circle */}
            <div className="flex justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    className="stroke-muted"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    className="stroke-success-500"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(score / placementQuestions.length) * 352} 352`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-foreground">
                    {Math.round((score / placementQuestions.length) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Recommended Level */}
            <div className="p-6 bg-muted/50 rounded-xl">
              <Badge className={cn("text-lg mb-2", recommendation.color)}>
                المستوى الموصى به: {recommendation.level}
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">
                {recommendation.description}
              </p>
            </div>
          </CardContent>
        </Card>
      </OnboardingStepWrapper>
    );
  }

  return (
    <OnboardingStepWrapper
      title="اختبار تحديد المستوى"
      description="5 أسئلة سريعة لتحديد مستواك"
      icon={
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/50">
          <Brain className="w-10 h-10 text-white" />
        </div>
      }
    >
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            السؤال {currentQuestionIndex + 1} من {placementQuestions.length}
          </span>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>دقيقتين</span>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
        >
          <Card className="glass border-border/50">
            <CardContent className="p-6 space-y-6">
              {/* Topic Badge */}
              <Badge variant="secondary">{currentQuestion.topic}</Badge>

              {/* Question */}
              <h3 className="text-xl font-bold text-foreground leading-relaxed">
                {currentQuestion.question}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectAnswer(index)}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 text-right transition-all",
                      "hover:shadow-md",
                      selectedAnswers[currentQuestion.id] === index
                        ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                        : "border-border bg-card hover:border-primary/50",
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex-1 font-medium text-foreground">
                        {option}
                      </span>
                      {selectedAnswers[currentQuestion.id] === index && (
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Next Button */}
              <Button
                onClick={handleNext}
                disabled={!hasSelectedAnswer}
                className="w-full bg-premium-gradient"
                size="lg"
              >
                {isLastQuestion ? "عرض النتائج" : "السؤال التالي"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </OnboardingStepWrapper>
  );
}

export default PlacementTestStep;
