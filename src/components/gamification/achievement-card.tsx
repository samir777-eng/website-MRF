"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Copy,
  Download,
  Share2,
  Star,
  Trophy,
  Zap,
} from "@/components/ui/icons";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { ScaleIn } from "@/lib/animations/lightweight-motion";
import { Award, Check, Crown, Medal } from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  earnedAt: Date;
  category: string;
  xpValue?: number;
}

interface AchievementCardProps {
  achievement: Achievement;
  studentName: string;
  className?: string;
  onShare?: () => void;
  onDownload?: () => void;
  onTap?: () => void; // Mobile tap handler
  onLongPress?: () => void; // Mobile long press
  hapticFeedback?: boolean;
}

export function AchievementCard({
  achievement,
  studentName,
  className,
  onShare,
  onDownload,
  onTap,
  onLongPress,
  hapticFeedback = true,
}: AchievementCardProps) {
  const [copied, setCopied] = useState(false);
  const [_isPressed, setIsPressed] = useState(false);
  const [isLongPress, setIsLongPress] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  // Simulate haptic feedback
  const simulateHaptic = useCallback(
    (intensity: "light" | "medium" | "heavy" = "light") => {
      if (hapticFeedback && "vibrate" in navigator) {
        const patterns = {
          light: 50,
          medium: 100,
          heavy: 200,
        };
        navigator.vibrate(patterns[intensity]);
      }
    },
    [hapticFeedback],
  );

  // Touch handlers for mobile interactions
  const _handleTouchStart = useCallback(() => {
    setIsPressed(true);
    simulateHaptic("light");

    // Start long press timer
    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        setIsLongPress(true);
        simulateHaptic("heavy");
        onLongPress();
      }, 500); // 500ms for long press
    }
  }, [simulateHaptic, onLongPress]);

  const _handleTouchEnd = useCallback(() => {
    setIsPressed(false);
    setIsLongPress(false);

    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    // Trigger tap if not a long press
    if (!isLongPress && onTap) {
      simulateHaptic("medium");
      onTap();
    }
  }, [isLongPress, onTap, simulateHaptic]);

  const getIcon = (iconName: string) => {
    const icons = {
      Trophy,
      Star,
      Crown,
      Medal,
      Award,
      Zap,
    };
    return icons[iconName as keyof typeof icons] || Trophy;
  };

  const getRarityGradient = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "from-gray-400 via-gray-500 to-gray-600";
      case "rare":
        return "from-blue-400 via-blue-500 to-blue-600";
      case "epic":
        return "from-purple-400 via-purple-500 to-purple-600";
      case "legendary":
        return "from-yellow-400 via-orange-500 to-red-500";
      default:
        return "from-gray-400 via-gray-500 to-gray-600";
    }
  };

  const getRarityLabel = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "عادي";
      case "rare":
        return "نادر";
      case "epic":
        return "ملحمي";
      case "legendary":
        return "أسطوري";
      default:
        return rarity;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const copyToClipboard = async () => {
    const text = `🏆 حصلت على إنجاز "${achievement.title}" في منصة الأستاذ رضا الفاروق التعليمية!\n\n${achievement.description}\n\n#تعلم_العربية #إنجاز`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_err) {
      // Failed to copy text - could show error toast here
    }
  };

  const IconComponent = getIcon(achievement.icon);

  return (
    <ScaleIn className={className}>
      <Card className="overflow-hidden relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <CardContent className="p-6 relative">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <div
                className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${getRarityGradient(achievement.rarity)} p-1 transition-transform duration-200 hover:scale-105 active:scale-95`}
              >
                <div className="w-full h-full bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
                  <IconComponent className="w-10 h-10 text-primary-600" />
                </div>

                {/* Rarity Indicator */}
                <div className="absolute -top-2 -end-2">
                  <Badge
                    className={`bg-gradient-to-r ${getRarityGradient(achievement.rarity)} text-white border-0 text-sm px-2 py-1`}
                  >
                    {getRarityLabel(achievement.rarity)}
                  </Badge>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-primary-900 dark:text-primary-100 mb-2">
              إنجاز جديد!
            </h2>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">{achievement.title}</h3>
              <p className="text-muted-foreground">{achievement.description}</p>
            </div>
          </div>

          {/* Student Info */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-950 rounded-full">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {studentName.charAt(0)}
                </span>
              </div>
              <span className="font-semibold text-primary-900 dark:text-primary-100">
                {studentName}
              </span>
            </div>
          </div>

          {/* Achievement Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">الفئة</div>
              <div className="font-semibold">{achievement.category}</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">التاريخ</div>
              <div className="font-semibold text-sm">
                {formatDate(achievement.earnedAt)}
              </div>
            </div>
          </div>

          {/* XP Reward */}
          {achievement.xpValue && (
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-950 rounded-full">
                <Zap className="w-5 h-5 text-purple-600" />
                <span className="font-bold text-purple-700 dark:text-purple-300">
                  +{achievement.xpValue} XP
                </span>
              </div>
            </div>
          )}

          {/* Branding */}
          <div className="text-center mb-6">
            <div className="text-sm text-muted-foreground">
              منصة الأستاذ رضا الفاروق التعليمية
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              تعلم اللغة العربية بطريقة تفاعلية
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={copyToClipboard}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 me-2" />
                  تم النسخ
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 me-2" />
                  نسخ النص
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={onShare}
            >
              <Share2 className="w-4 h-4 me-2" />
              مشاركة
            </Button>

            <Button size="sm" className="flex-1" onClick={onDownload}>
              <Download className="w-4 h-4 me-2" />
              تحميل
            </Button>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-4 start-4 opacity-20">
            <Star className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="absolute top-4 end-4 opacity-20">
            <Trophy className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="absolute bottom-4 start-4 opacity-20">
            <Medal className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="absolute bottom-4 end-4 opacity-20">
            <Crown className="w-6 h-6 text-yellow-400" />
          </div>
        </CardContent>
      </Card>
    </ScaleIn>
  );
}

// Achievement Share Modal Component with Focus Trap
export function AchievementShareModal({
  achievement,
  studentName,
  isOpen,
  onClose,
}: {
  achievement: Achievement;
  studentName: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const modalRef = useFocusTrap(isOpen, {
    returnFocus: true,
    onEscape: onClose,
  });

  const handleShare = () => {
    // Mock share functionality - could implement social sharing here
  };

  const handleDownload = () => {
    // Mock download functionality - in real app, this would generate and download an image
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="achievement-share-title"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <AchievementCard
          achievement={achievement}
          studentName={studentName}
          onShare={handleShare}
          onDownload={handleDownload}
        />
        <div className="text-center mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="focus-visible:ring-2 focus-visible:ring-primary"
          >
            إغلاق
          </Button>
        </div>
      </div>
    </div>
  );
}
export default AchievementCard;
