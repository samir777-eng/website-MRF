"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import type { DailyQuestion, UserXP } from "@/types/gamification";
import { XP_REWARDS, calculateStreakBonus } from "@/types/gamification";
import {
  CheckCircle,
  Clock,
  Flame,
  Star,
  TrendingUp,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

interface DailyQuestionProps {
  onComplete?: (xpEarned: number) => void;
}

export function DailyQuestionCard({ onComplete }: DailyQuestionProps) {
  const { user } = useAuth();
  const [question, setQuestion] = useState<DailyQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());

  // Mock user XP data - In production, fetch from API
  const [userXp, setUserXp] = useState<UserXP>({
    userId: user?.id || "",
    totalXp: 1250,
    currentLevel: 3,
    xpToNextLevel: 250,
    xpFromQuizzes: 500,
    xpFromExercises: 300,
    xpFromHomework: 200,
    xpFromDailyQuestions: 150,
    xpFromTips: 50,
    xpFromAchievements: 50,
    dailyQuestionStreak: 7,
    longestStreak: 12,
    lastDailyQuestionDate: new Date(Date.now() - 86400000), // Yesterday
    totalQuestionsAnswered: 45,
    correctAnswers: 38,
    accuracy: 84.4,
    lastXpGainedAt: new Date(),
    updatedAt: new Date(),
  });

  // Mock daily question - In production, fetch from API
  useEffect(() => {
    // Check if user already answered today's question
    const today = new Date().toDateString();
    const lastAnswered = userXp.lastDailyQuestionDate?.toDateString();

    if (lastAnswered === today) {
      setIsSubmitted(true);
      return;
    }

    // Fetch today's question
    const mockQuestion: DailyQuestion = {
      id: "dq-" + Date.now(),
      date: new Date(),
      question: 'ما إعراب كلمة "الطالبُ" في الجملة: "جاء الطالبُ مبكراً"؟',
      type: "multiple-choice",
      difficulty: "medium",
      gradeLevel: user?.gradeLevel || "1",
      category: "grammar",
      options: [
        "فاعل مرفوع وعلامة رفعه الضمة",
        "مبتدأ مرفوع وعلامة رفعه الضمة",
        "خبر مرفوع وعلامة رفعه الضمة",
        "نائب فاعل مرفوع وعلامة رفعه الضمة",
      ],
      correctAnswer: 0,
      explanation:
        'الطالبُ فاعل مرفوع وعلامة رفعه الضمة الظاهرة على آخره، لأنه جاء بعد الفعل "جاء" وهو من فعل الفعل.',
      xpReward: XP_REWARDS.DAILY_QUESTION_MEDIUM,
      totalAttempts: 234,
      correctAttempts: 189,
      averageTime: 45,
    };

    setQuestion(mockQuestion);
  }, [user, userXp]);

  const handleSubmit = () => {
    if (selectedAnswer === null || !question) return;

    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    setTimeSpent(timeTaken);

    const correct = selectedAnswer === question.correctAnswer;
    setIsCorrect(correct);
    setIsSubmitted(true);

    if (correct) {
      // Calculate XP
      const baseXp = question.xpReward;
      const streakBonus = calculateStreakBonus(userXp.dailyQuestionStreak + 1);
      const totalXp = baseXp + streakBonus;

      setXpEarned(totalXp);

      // Update user XP (in production, call API)
      setUserXp((prev) => ({
        ...prev,
        totalXp: prev.totalXp + totalXp,
        xpFromDailyQuestions: prev.xpFromDailyQuestions + totalXp,
        dailyQuestionStreak: prev.dailyQuestionStreak + 1,
        longestStreak: Math.max(
          prev.longestStreak,
          prev.dailyQuestionStreak + 1
        ),
        lastDailyQuestionDate: new Date(),
        totalQuestionsAnswered: prev.totalQuestionsAnswered + 1,
        correctAnswers: prev.correctAnswers + 1,
        accuracy:
          ((prev.correctAnswers + 1) / (prev.totalQuestionsAnswered + 1)) * 100,
      }));

      onComplete?.(totalXp);
    } else {
      // Wrong answer - streak resets
      setUserXp((prev) => ({
        ...prev,
        dailyQuestionStreak: 0,
        lastDailyQuestionDate: new Date(),
        totalQuestionsAnswered: prev.totalQuestionsAnswered + 1,
        accuracy:
          (prev.correctAnswers / (prev.totalQuestionsAnswered + 1)) * 100,
      }));
    }
  };

  if (!question) {
    return null;
  }

  // Already answered today
  if (isSubmitted && !isCorrect && selectedAnswer === null) {
    return (
      <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">أحسنت! ✨</h3>
          <p className="text-muted-foreground mb-4">
            لقد أجبت على سؤال اليوم بالفعل
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge className="bg-green-600 text-white text-lg px-4 py-2">
              <Flame className="w-5 h-5 ml-2" />
              {userXp.dailyQuestionStreak} يوم متتالي
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl flex items-center gap-3">
            <Zap className="w-7 h-7 text-yellow-600" />
            سؤال اليوم
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className="bg-yellow-600 text-white">
              <Star className="w-4 h-4 ml-1" />+{question.xpReward} XP
            </Badge>
            {userXp.dailyQuestionStreak > 0 && (
              <Badge className="bg-orange-600 text-white">
                <Flame className="w-4 h-4 ml-1" />
                {userXp.dailyQuestionStreak} 🔥
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Streak Info */}
        {userXp.dailyQuestionStreak > 0 && !isSubmitted && (
          <div className="p-4 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
            <p className="text-sm text-orange-900 dark:text-orange-100">
              <Flame className="w-4 h-4 inline ml-1" />
              <strong>سلسلة نارية!</strong> أنت في سلسلة{" "}
              {userXp.dailyQuestionStreak} يوم متتالي. أجب بشكل صحيح للحصول على{" "}
              <strong>
                +{calculateStreakBonus(userXp.dailyQuestionStreak + 1)} XP
              </strong>{" "}
              إضافية!
            </p>
          </div>
        )}

        {/* Question */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline">
              {question.category === "grammar" ? "النحو" : question.category}
            </Badge>
            <Badge
              variant="outline"
              className={
                question.difficulty === "easy"
                  ? "text-green-600"
                  : question.difficulty === "medium"
                    ? "text-yellow-600"
                    : "text-red-600"
              }
            >
              {question.difficulty === "easy"
                ? "سهل"
                : question.difficulty === "medium"
                  ? "متوسط"
                  : "صعب"}
            </Badge>
          </div>
          <h3 className="text-xl font-bold mb-4">{question.question}</h3>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {question.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => !isSubmitted && setSelectedAnswer(index)}
              disabled={isSubmitted}
              className={`
                w-full p-4 rounded-lg border-2 text-right transition-all
                ${
                  selectedAnswer === index
                    ? isSubmitted
                      ? index === question.correctAnswer
                        ? "border-green-600 bg-green-100 dark:bg-green-900/20"
                        : "border-red-600 bg-red-100 dark:bg-red-900/20"
                      : "border-purple-600 bg-purple-100 dark:bg-purple-900/20"
                    : isSubmitted && index === question.correctAnswer
                      ? "border-green-600 bg-green-100 dark:bg-green-900/20"
                      : "border-muted hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/10"
                }
                ${isSubmitted ? "cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{option}</span>
                {isSubmitted &&
                  (index === question.correctAnswer ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : selectedAnswer === index ? (
                    <XCircle className="w-5 h-5 text-red-600" />
                  ) : null)}
              </div>
            </button>
          ))}
        </div>

        {/* Submit Button */}
        {!isSubmitted && (
          <Button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg py-6"
          >
            <CheckCircle className="w-5 h-5 ml-2" />
            تأكيد الإجابة
          </Button>
        )}

        {/* Result */}
        {isSubmitted && (
          <div
            className={`p-4 rounded-lg ${
              isCorrect
                ? "bg-green-100 dark:bg-green-900/20 border-2 border-green-600"
                : "bg-red-100 dark:bg-red-900/20 border-2 border-red-600"
            }`}
          >
            <div className="flex items-start gap-3 mb-3">
              {isCorrect ? (
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              )}
              <div>
                <h4 className="font-semibold text-lg mb-2">
                  {isCorrect ? "إجابة صحيحة! 🎉" : "إجابة خاطئة 😔"}
                </h4>
                <p className="text-sm mb-3">{question.explanation}</p>

                {isCorrect && (
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge className="bg-yellow-600 text-white text-base px-3 py-1">
                      <Trophy className="w-4 h-4 ml-1" />+{xpEarned} XP
                    </Badge>
                    {calculateStreakBonus(userXp.dailyQuestionStreak) > 0 && (
                      <Badge className="bg-orange-600 text-white text-base px-3 py-1">
                        <Flame className="w-4 h-4 ml-1" />
                        مكافأة السلسلة: +
                        {calculateStreakBonus(userXp.dailyQuestionStreak)} XP
                      </Badge>
                    )}
                    <Badge className="bg-blue-600 text-white text-base px-3 py-1">
                      <TrendingUp className="w-4 h-4 ml-1" />
                      المستوى {userXp.currentLevel}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Time */}
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>الوقت المستغرق: {timeSpent} ثانية</span>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {userXp.totalQuestionsAnswered}
            </p>
            <p className="text-sm text-muted-foreground">سؤال</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {userXp.accuracy.toFixed(1)}%
            </p>
            <p className="text-sm text-muted-foreground">دقة</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              {userXp.longestStreak}
            </p>
            <p className="text-sm text-muted-foreground">أطول سلسلة</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
