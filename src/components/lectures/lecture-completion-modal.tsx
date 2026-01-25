"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Award,
  ChevronLeft,
  Gift,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface LectureCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  lectureTitle: string;
  lectureNumber: number;
  xpEarned: number;
  badgeEarned?: {
    id: string;
    name: string;
    icon: string;
    description: string;
  };
  nextLectureId?: string;
  nextLectureTitle?: string;
}

export function LectureCompletionModal({
  isOpen,
  onClose,
  lectureTitle,
  lectureNumber,
  xpEarned,
  badgeEarned,
  nextLectureId,
  nextLectureTitle,
}: LectureCompletionModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg text-center">
        {/* Celebration Animation */}
        {showConfetti && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${1 + Math.random()}s`,
                }}
              >
                <Sparkles
                  className={cn(
                    "w-4 h-4",
                    i % 3 === 0 && "text-yellow-500",
                    i % 3 === 1 && "text-blue-500",
                    i % 3 === 2 && "text-purple-500"
                  )}
                />
              </div>
            ))}
          </div>
        )}

        <DialogHeader className="space-y-4">
          {/* Trophy Icon */}
          <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-xl shadow-orange-500/30">
            <Trophy className="w-12 h-12 text-white" />
          </div>

          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            أحسنت! 🎉
          </DialogTitle>

          <DialogDescription className="text-lg">
            لقد أكملت المحاضرة {lectureNumber} بنجاح
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* Lecture Title */}
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">المحاضرة</p>
            <p className="font-bold text-lg">{lectureTitle}</p>
          </div>

          {/* Rewards */}
          <div className="grid grid-cols-2 gap-4">
            {/* XP Earned */}
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 rounded-xl">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-600">+{xpEarned}</p>
              <p className="text-sm text-purple-600/70">نقاط خبرة</p>
            </div>

            {/* Badge Earned */}
            {badgeEarned ? (
              <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/30 rounded-xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
                <p className="text-lg font-bold text-amber-600">
                  {badgeEarned.name}
                </p>
                <p className="text-sm text-amber-600/70">شارة جديدة!</p>
              </div>
            ) : (
              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 rounded-xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-600">100%</p>
                <p className="text-sm text-green-600/70">مكتمل</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {nextLectureId && (
            <Link href={`/ar/lectures/${nextLectureId}`} className="w-full">
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                size="lg"
              >
                المحاضرة التالية: {nextLectureTitle}
                <ChevronLeft className="w-5 h-5 mr-2" />
              </Button>
            </Link>
          )}
          <Button variant="outline" onClick={onClose} className="w-full">
            العودة للوحة التحكم
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default LectureCompletionModal;

