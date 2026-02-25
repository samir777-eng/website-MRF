"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { LEVELS } from "@/types/gamification";
import { Gift, Sparkles, Star, TrendingUp, Trophy, X, Zap } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

interface LevelUpAnimationProps {
  newLevel: number;
  previousLevel: number;
  totalXp: number;
  onClose: () => void;
}

export function LevelUpAnimation({
  newLevel,
  previousLevel,
  totalXp,
  onClose,
}: LevelUpAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const levelInfo = LEVELS.find((l) => l.level === newLevel) || LEVELS[0];
  const previousLevelInfo =
    LEVELS.find((l) => l.level === previousLevel) || LEVELS[0];

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  // Focus trap for level up modal
  const modalRef = useFocusTrap(isVisible, {
    returnFocus: true,
    onEscape: () => handleClose(),
  });

  useEffect(() => {
    // Trigger animation
    setTimeout(() => setIsVisible(true), 100);
    setTimeout(() => setShowConfetti(true), 500);

    // Auto-close after 5 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [handleClose]);

  return (
    <>
      {/* Overlay with Focus Trap */}
      <div
        className={`
          fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center
          transition-opacity duration-300
          ${isVisible ? "opacity-100" : "opacity-0"}
        `}
        onClick={handleClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="level-up-title"
      >
        {/* Confetti Effect */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: "-10%",
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              >
                {
                  ["🎉", "⭐", "✨", "🏆", "💎", "🔥"][
                    Math.floor(Math.random() * 6)
                  ]
                }
              </div>
            ))}
          </div>
        )}

        {/* Level Up Card with Focus Trap */}
        <div ref={modalRef} onClick={(e) => e.stopPropagation()}>
          <Card
            className={`
              max-w-2xl w-full mx-6 border-0 shadow-2xl
              transform transition-all duration-500
              ${isVisible ? "scale-100 rotate-0" : "scale-50 rotate-12"}
            `}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 start-4 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            <CardContent className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-block relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-50 animate-pulse" />
                  <Trophy className="w-24 h-24 text-yellow-500 relative animate-bounce" />
                </div>
                <h2 className="text-4xl font-bold mt-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  مستوى جديد! 🎉
                </h2>
                <p className="text-muted-foreground text-lg mt-2">
                  تهانينا! لقد وصلت إلى مستوى جديد
                </p>
              </div>

              {/* Level Transition */}
              <div className="flex items-center justify-center gap-6 mb-8">
                {/* Previous Level */}
                <div className="text-center">
                  <div className="text-6xl mb-2 opacity-50">
                    {previousLevelInfo.icon}
                  </div>
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    المستوى {previousLevel}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    {previousLevelInfo.nameAr}
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex flex-col items-center">
                  <TrendingUp className="w-12 h-12 text-green-600 animate-pulse" />
                  <Sparkles className="w-6 h-6 text-yellow-500 mt-2" />
                </div>

                {/* New Level */}
                <div className="text-center">
                  <div className="text-6xl mb-2 animate-bounce">
                    {levelInfo.icon}
                  </div>
                  <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    المستوى {newLevel}
                  </Badge>
                  <p className="text-sm font-bold mt-1">{levelInfo.nameAr}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">
                    {(totalXp || 0).toLocaleString("ar-EG")}
                  </p>
                  <p className="text-sm text-muted-foreground">إجمالي XP</p>
                </div>

                <div className="text-center p-4 bg-muted rounded-lg">
                  <Star className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{newLevel}</p>
                  <p className="text-sm text-muted-foreground">
                    المستوى الحالي
                  </p>
                </div>

                <div className="text-center p-4 bg-muted rounded-lg">
                  <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">
                    {LEVELS.length - newLevel}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    مستويات متبقية
                  </p>
                </div>
              </div>

              {/* Rewards */}
              {levelInfo.rewards && levelInfo.rewards.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Gift className="w-5 h-5 text-purple-500" />
                    <h3 className="font-bold text-lg">المكافآت:</h3>
                  </div>
                  <div className="space-y-2">
                    {levelInfo.rewards.map((reward, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg"
                      >
                        <Sparkles className="w-5 h-5 text-purple-500" />
                        <span>{reward}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Level Info */}
              <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">المستوى التالي:</span>
                  <Badge variant="outline">
                    {LEVELS[newLevel]?.nameAr || "الحد الأقصى"}
                  </Badge>
                </div>
                {LEVELS[newLevel] && (
                  <>
                    <div className="h-2 bg-white dark:bg-gray-800 rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                        style={{
                          width: `${((totalXp - levelInfo.minXp) / (LEVELS[newLevel].minXp - levelInfo.minXp)) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      {(LEVELS[newLevel].minXp - totalXp).toLocaleString(
                        "ar-EG",
                      )}{" "}
                      XP متبقية
                    </p>
                  </>
                )}
              </div>

              {/* Action Button */}
              <Button
                onClick={handleClose}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg py-6"
              >
                <Sparkles className="w-5 h-5 ms-2" />
                رائع! استمر في التقدم
              </Button>

              {/* Motivational Message */}
              <p className="text-center text-sm text-muted-foreground mt-4">
                أنت تقوم بعمل رائع! استمر في التعلم والتقدم 🚀
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confetti Animation Styles */}
      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        .animate-confetti {
          animation: confetti linear forwards;
          font-size: 24px;
        }
      `}</style>
    </>
  );
}

// Hook to trigger level-up animation
export function useLevelUp() {
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpData, setLevelUpData] = useState<{
    newLevel: number;
    previousLevel: number;
    totalXp: number;
  } | null>(null);

  const triggerLevelUp = (
    newLevel: number,
    previousLevel: number,
    totalXp: number,
  ) => {
    setLevelUpData({ newLevel, previousLevel, totalXp });
    setShowLevelUp(true);
  };

  const closeLevelUp = () => {
    setShowLevelUp(false);
    setLevelUpData(null);
  };

  return {
    showLevelUp,
    levelUpData,
    triggerLevelUp,
    closeLevelUp,
  };
}
