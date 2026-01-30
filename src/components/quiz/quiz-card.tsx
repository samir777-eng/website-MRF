"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  explanation?: string;
  difficulty: "easy" | "medium" | "hard";
  points: number;
}

interface QuizCardProps {
  question: QuizQuestion;
  onAnswer: (optionId: string, isCorrect: boolean, points: number) => void;
  showResult?: boolean;
  selectedOption?: string;
  className?: string;
}

export function QuizCard({
  question,
  onAnswer,
  showResult = false,
  selectedOption,
  className,
}: QuizCardProps) {
  const t = useTranslations("quiz");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(
    selectedOption || null,
  );
  const [hasAnswered, setHasAnswered] = useState(showResult);

  const handleOptionSelect = (optionId: string) => {
    if (hasAnswered) return;

    setSelectedAnswer(optionId);
    setHasAnswered(true);

    const selectedOption = question.options.find((opt) => opt.id === optionId);
    if (selectedOption) {
      onAnswer(
        optionId,
        selectedOption.isCorrect,
        selectedOption.isCorrect ? question.points : 0,
      );
    }
  };

  const correctOption = question.options.find((opt) => opt.isCorrect);
  const selectedOptionData = question.options.find(
    (opt) => opt.id === selectedAnswer,
  );

  const difficultyColors = {
    easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  const difficultyLabels = {
    easy: t("beginner"),
    medium: t("intermediate"),
    hard: t("advanced"),
  };

  return (
    <Card className={cn("w-full max-w-2xl mx-auto", className)}>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge className={difficultyColors[question.difficulty]}>
            {difficultyLabels[question.difficulty]}
          </Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Award className="w-4 h-4" />
            <span>
              {question.points} {t("points")}
            </span>
          </div>
        </div>
        <CardTitle className="text-lg leading-relaxed" id={`question-${question.id}`}>
          {question.question}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === option.id;
            const isCorrect = option.isCorrect;
            const showCorrect = hasAnswered && isCorrect;
            const showIncorrect = hasAnswered && isSelected && !isCorrect;

            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant="outline"
                  className={cn(
                    "w-full p-4 h-auto text-end justify-start text-wrap",
                    "hover:bg-muted/50 transition-all duration-200",
                    isSelected && !hasAnswered && "ring-2 ring-primary-500",
                    showCorrect &&
                      "bg-green-50 border-green-500 text-green-700 dark:bg-green-950 dark:text-green-300",
                    showIncorrect &&
                      "bg-red-50 border-red-500 text-red-700 dark:bg-red-950 dark:text-red-300",
                  )}
                  onClick={() => handleOptionSelect(option.id)}
                  disabled={hasAnswered}
                  aria-labelledby={`question-${question.id}`}
                  aria-describedby={hasAnswered && question.explanation ? `explanation-${question.id}` : undefined}
                  aria-pressed={isSelected}
                  role="radio"
                  aria-checked={isSelected}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold",
                          isSelected &&
                            !hasAnswered &&
                            "border-primary-500 bg-primary-500 text-white",
                          showCorrect &&
                            "border-green-500 bg-green-500 text-white",
                          showIncorrect &&
                            "border-red-500 bg-red-500 text-white",
                        )}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-sm leading-relaxed">
                        {option.text}
                      </span>
                    </div>

                    <AnimatePresence>
                      {hasAnswered && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: "spring", duration: 0.3 }}
                        >
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : isSelected ? (
                            <XCircle className="w-5 h-5 text-red-600" />
                          ) : null}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Button>
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence>
          {hasAnswered && question.explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 p-4 bg-muted/50 rounded-lg"
              id={`explanation-${question.id}`}
            >
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">!</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">
                    {t("explanation")}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {question.explanation}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {hasAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-2 text-sm"
          >
            {selectedOptionData?.isCorrect ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium">
                  {t("correct")}! +{question.points} {t("points")}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="w-4 h-4" />
                <span className="font-medium">{t("incorrect")}</span>
              </div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
export default QuizCard;
