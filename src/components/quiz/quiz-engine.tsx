"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useScreenReaderAnnouncer } from "@/components/accessibility/screen-reader-announcer";
import { FadeIn, SlideIn } from "@/lib/animations/lightweight-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  Home,
  Play,
  RefreshCw,
  Target,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";
import React, { useEffect, useState } from "react";
// Removed canvas-confetti dependency for bundle size optimization

interface Question {
  id: number;
  type: "multiple-choice" | "true-false" | "fill-blank";
  question: string;
  options?: string[];
  correct: number | boolean | string;
  explanation: string;
}

interface Quiz {
  id: number;
  title: string;
  questions_data: Question[];
  duration: number;
  xpReward: number;
}

interface QuizEngineProps {
  quiz: Quiz;
}

export function QuizEngine({ quiz }: QuizEngineProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | boolean | string | null)[]>(
    new Array(quiz.questions_data.length).fill(null)
  );
  const [timeLeft, setTimeLeft] = useState(quiz.duration * 60); // Convert to seconds
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<
    number | boolean | string | null
  >(null);

  // Screen reader announcements
  const {
    announceQuestion,
    announceAnswer,
    announceQuizStart,
    announceQuizEnd,
    announceTimeWarning,
  } = useScreenReaderAnnouncer();
  const lastAnnouncedMinute = React.useRef<number | null>(null);

  // Timer effect with screen reader time warnings
  useEffect(() => {
    if (!isStarted || isFinished || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsFinished(true);
          return 0;
        }
        // Announce time warnings at 5 minutes and 1 minute
        const minutesLeft = Math.ceil(prev / 60);
        if (minutesLeft === 5 && lastAnnouncedMinute.current !== 5) {
          lastAnnouncedMinute.current = 5;
          announceTimeWarning(5);
        } else if (minutesLeft === 1 && lastAnnouncedMinute.current !== 1) {
          lastAnnouncedMinute.current = 1;
          announceTimeWarning(1);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted, isFinished, timeLeft, announceTimeWarning]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const startQuiz = () => {
    setIsStarted(true);
    announceQuizStart(quiz.title, quiz.questions_data.length, quiz.duration);
    // Announce first question after a short delay
    setTimeout(() => {
      const q = quiz.questions_data[0];
      announceQuestion(1, quiz.questions_data.length, q.question);
    }, 500);
  };

  const selectAnswer = (answer: number | boolean | string) => {
    setSelectedAnswer(answer);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);
    setShowExplanation(true);

    // Announce answer result for screen readers
    const question = quiz.questions_data[currentQuestion];
    const isCorrect = selectedAnswer === question.correct;
    announceAnswer(isCorrect, question.explanation);
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions_data.length - 1) {
      const nextIndex = currentQuestion + 1;
      setCurrentQuestion(nextIndex);
      setSelectedAnswer(answers[nextIndex]);
      setShowExplanation(false);
      // Announce next question for screen readers
      const q = quiz.questions_data[nextIndex];
      setTimeout(() => {
        announceQuestion(nextIndex + 1, quiz.questions_data.length, q.question);
      }, 300);
    } else {
      finishQuiz();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      const prevIndex = currentQuestion - 1;
      setCurrentQuestion(prevIndex);
      setSelectedAnswer(answers[prevIndex]);
      setShowExplanation(answers[prevIndex] !== null);
      // Announce previous question for screen readers
      const q = quiz.questions_data[prevIndex];
      setTimeout(() => {
        announceQuestion(prevIndex + 1, quiz.questions_data.length, q.question);
      }, 300);
    }
  };

  const finishQuiz = () => {
    let correctAnswers = 0;
    quiz.questions_data.forEach((question, index) => {
      if (answers[index] === question.correct) {
        correctAnswers++;
      }
    });

    const finalScore = Math.round(
      (correctAnswers / quiz.questions_data.length) * 100
    );
    setScore(finalScore);
    setIsFinished(true);

    // Announce quiz end for screen readers
    announceQuizEnd(finalScore, correctAnswers, quiz.questions_data.length);

    // CSS-based celebration effect for good scores (no canvas-confetti needed)
    // Visual celebration is handled by component animations
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers(new Array(quiz.questions_data.length).fill(null));
    setTimeLeft(quiz.duration * 60);
    setIsStarted(false);
    setIsFinished(false);
    setShowExplanation(false);
    setScore(0);
    setSelectedAnswer(null);
  };

  const question = quiz.questions_data[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions_data.length) * 100;
  const isAnswered = answers[currentQuestion] !== null;
  const isCorrect = answers[currentQuestion] === question?.correct;

  // Start Screen
  if (!isStarted) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-2xl mb-4">{quiz.title}</CardTitle>
          <CardDescription className="text-lg">
            هل أنت مستعد لبدء الاختبار؟
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-muted rounded-lg">
              <Target className="h-6 w-6 mx-auto mb-2 text-primary-600" />
              <div className="font-semibold">{quiz.questions_data.length}</div>
              <div className="text-muted-foreground">سؤال</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <Clock className="h-6 w-6 mx-auto mb-2 text-primary-600" />
              <div className="font-semibold">{quiz.duration}</div>
              <div className="text-muted-foreground">دقيقة</div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              تعليمات الاختبار
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 text-end space-y-1">
              <li>• اقرأ كل سؤال بعناية قبل الإجابة</li>
              <li>• يمكنك العودة لتعديل إجاباتك</li>
              <li>• ستحصل على تفسير لكل إجابة</li>
              <li>• احرص على إنهاء الاختبار في الوقت المحدد</li>
            </ul>
          </div>

          <Button size="lg" onClick={startQuiz} className="w-full">
            <Play className="w-5 h-5 me-2" />
            بدء الاختبار
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Results Screen
  if (isFinished) {
    const correctAnswers = answers.filter(
      (answer, index) => answer === quiz.questions_data[index].correct
    ).length;

    const getScoreColor = (score: number) => {
      if (score >= 90) return "text-green-600";
      if (score >= 80) return "text-blue-600";
      if (score >= 70) return "text-yellow-600";
      return "text-red-600";
    };

    const getScoreMessage = (score: number) => {
      if (score >= 90) return "ممتاز! أداء رائع";
      if (score >= 80) return "جيد جداً! استمر";
      if (score >= 70) return "جيد! يمكنك التحسن";
      return "تحتاج للمزيد من المراجعة";
    };

    return (
      <FadeIn className="space-y-6">
        <Card className="text-center">
          <CardHeader>
            <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
            <CardTitle className="text-2xl">انتهى الاختبار!</CardTitle>
            <CardDescription>{getScoreMessage(score)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score Circle */}
            <div className="relative w-32 h-32 mx-auto">
              <svg
                className="w-32 h-32 transform -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted-foreground/20"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / 100)}`}
                  className={`transition-all duration-1000 ${getScoreColor(score)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
                    {score}%
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <CheckCircle className="h-6 w-6 mx-auto mb-1 text-green-600" />
                <div className="font-bold text-green-700 dark:text-green-300">
                  {correctAnswers}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  صحيحة
                </div>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                <XCircle className="h-6 w-6 mx-auto mb-1 text-red-600" />
                <div className="font-bold text-red-700 dark:text-red-300">
                  {quiz.questions_data.length - correctAnswers}
                </div>
                <div className="text-sm text-red-600 dark:text-red-400">
                  خاطئة
                </div>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <Zap className="h-6 w-6 mx-auto mb-1 text-purple-600" />
                <div className="font-bold text-purple-700 dark:text-purple-300">
                  +{Math.round(quiz.xpReward * (score / 100))}
                </div>
                <div className="text-sm text-purple-600 dark:text-purple-400">
                  XP
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={restartQuiz}
                variant="outline"
                className="flex-1"
              >
                <RefreshCw className="w-4 h-4 me-2" />
                إعادة المحاولة
              </Button>
              <Button className="flex-1">
                <Home className="w-4 h-4 me-2" />
                العودة للرئيسية
              </Button>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    );
  }

  // Quiz Interface
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Badge variant="outline">
                سؤال {currentQuestion + 1} من {quiz.questions_data.length}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span
                  className={timeLeft < 300 ? "text-red-600 font-bold" : ""}
                >
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Question */}
      <div key={currentQuestion}>
        <SlideIn direction="right" distance={20}>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl leading-relaxed">
                {question.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Multiple Choice with keyboard navigation */}
              {question.type === "multiple-choice" && question.options && (
                <div
                  className="space-y-3"
                  role="radiogroup"
                  aria-label="خيارات الإجابة"
                  aria-describedby={`question-${question.id}`}
                >
                  {question.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedAnswer === index ? "default" : "outline"}
                      className="w-full text-end justify-start h-auto p-4 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      onClick={() => selectAnswer(index)}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
                          e.preventDefault();
                          const nextIndex =
                            (index + 1) % question.options!.length;
                          const nextButton = e.currentTarget.parentElement
                            ?.children[nextIndex] as HTMLElement;
                          nextButton?.focus();
                        } else if (
                          e.key === "ArrowUp" ||
                          e.key === "ArrowRight"
                        ) {
                          e.preventDefault();
                          const prevIndex =
                            (index - 1 + question.options!.length) %
                            question.options!.length;
                          const prevButton = e.currentTarget.parentElement
                            ?.children[prevIndex] as HTMLElement;
                          prevButton?.focus();
                        }
                      }}
                      disabled={showExplanation}
                      role="radio"
                      aria-checked={selectedAnswer === index}
                      aria-label={`الخيار ${String.fromCharCode(65 + index)}: ${option}`}
                      tabIndex={
                        selectedAnswer === index ||
                        (selectedAnswer === null && index === 0)
                          ? 0
                          : -1
                      }
                    >
                      <span className="me-3 w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </Button>
                  ))}
                </div>
              )}

              {/* True/False with keyboard navigation */}
              {question.type === "true-false" && (
                <div
                  className="grid grid-cols-2 gap-4"
                  role="radiogroup"
                  aria-label="صحيح أم خطأ"
                >
                  <Button
                    variant={selectedAnswer === true ? "default" : "outline"}
                    className="h-16 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    onClick={() => selectAnswer(true)}
                    onKeyDown={(e) => {
                      if (
                        e.key === "ArrowRight" ||
                        e.key === "ArrowDown" ||
                        e.key === "ArrowLeft" ||
                        e.key === "ArrowUp"
                      ) {
                        e.preventDefault();
                        const sibling =
                          e.currentTarget.parentElement?.querySelector(
                            "button:not(:focus)"
                          ) as HTMLElement;
                        sibling?.focus();
                      }
                    }}
                    disabled={showExplanation}
                    role="radio"
                    aria-checked={selectedAnswer === true}
                    aria-label="صحيح"
                    tabIndex={
                      selectedAnswer === true || selectedAnswer === null
                        ? 0
                        : -1
                    }
                  >
                    <CheckCircle className="w-6 h-6 me-2" />
                    صحيح
                  </Button>
                  <Button
                    variant={selectedAnswer === false ? "default" : "outline"}
                    className="h-16 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    onClick={() => selectAnswer(false)}
                    onKeyDown={(e) => {
                      if (
                        e.key === "ArrowRight" ||
                        e.key === "ArrowDown" ||
                        e.key === "ArrowLeft" ||
                        e.key === "ArrowUp"
                      ) {
                        e.preventDefault();
                        const sibling =
                          e.currentTarget.parentElement?.querySelector(
                            "button:not(:focus)"
                          ) as HTMLElement;
                        sibling?.focus();
                      }
                    }}
                    disabled={showExplanation}
                    role="radio"
                    aria-checked={selectedAnswer === false}
                    aria-label="خطأ"
                    tabIndex={selectedAnswer === false ? 0 : -1}
                  >
                    <XCircle className="w-6 h-6 me-2" />
                    خطأ
                  </Button>
                </div>
              )}

              {/* Fill in the Blank */}
              {question.type === "fill-blank" && (
                <div>
                  <input
                    type="text"
                    value={(selectedAnswer as string) || ""}
                    onChange={(e) => selectAnswer(e.target.value)}
                    placeholder="اكتب إجابتك هنا..."
                    className="w-full p-3 border rounded-lg text-center"
                    disabled={showExplanation}
                  />
                </div>
              )}

              {/* Explanation */}
              {showExplanation && (
                <FadeIn
                  className={`p-4 rounded-lg border-s-4 ${
                    isCorrect
                      ? "bg-green-50 dark:bg-green-950 border-green-500"
                      : "bg-red-50 dark:bg-red-950 border-red-500"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span
                      className={`font-semibold ${
                        isCorrect
                          ? "text-green-700 dark:text-green-300"
                          : "text-red-700 dark:text-red-300"
                      }`}
                    >
                      {isCorrect ? "إجابة صحيحة!" : "إجابة خاطئة"}
                    </span>
                  </div>
                  <p
                    className={`text-sm ${
                      isCorrect
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {question.explanation}
                  </p>
                </FadeIn>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={previousQuestion}
                  disabled={currentQuestion === 0}
                >
                  <ArrowRight className="w-4 h-4 me-2 rtl:-scale-x-100" />
                  السابق
                </Button>

                {!showExplanation ? (
                  <Button
                    onClick={submitAnswer}
                    disabled={selectedAnswer === null}
                  >
                    تأكيد الإجابة
                  </Button>
                ) : (
                  <Button onClick={nextQuestion}>
                    {currentQuestion === quiz.questions_data.length - 1
                      ? "إنهاء الاختبار"
                      : "التالي"}
                    <ArrowLeft className="w-4 h-4 ms-2 rtl:-scale-x-100" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </SlideIn>
      </div>
    </div>
  );
}
export default QuizEngine;
