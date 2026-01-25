"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn, ScaleIn } from "@/lib/animations/lightweight-motion";
import {
  Trophy,
  Star,
  Gift,
  Zap,
  Crown,
  Medal,
  Sparkles,
  X,
  Share2,
} from "lucide-react";
// Removed canvas-confetti dependency for bundle size optimization

interface Reward {
  id: string;
  type: "xp" | "badge" | "achievement" | "streak" | "level";
  title: string;
  description: string;
  value?: number;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlocked: boolean;
}

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rewards: Reward[];
  triggerCelebration?: boolean;
}

export function RewardsModal({
  isOpen,
  onClose,
  rewards,
  triggerCelebration = false,
}: RewardsModalProps) {
  const [currentRewardIndex, setCurrentRewardIndex] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (isOpen && triggerCelebration) {
      setShowCelebration(true);

      // CSS-based celebration effect (no canvas-confetti needed)
      const duration = 3000;
      setTimeout(() => setShowCelebration(false), duration);
    }
  }, [isOpen, triggerCelebration]);

  const getIcon = (iconName: string) => {
    const icons = {
      Trophy,
      Star,
      Gift,
      Zap,
      Crown,
      Medal,
      Sparkles,
    };
    return icons[iconName as keyof typeof icons] || Trophy;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "from-gray-400 to-gray-600";
      case "rare":
        return "from-blue-400 to-blue-600";
      case "epic":
        return "from-purple-400 to-purple-600";
      case "legendary":
        return "from-yellow-400 to-orange-500";
      default:
        return "from-gray-400 to-gray-600";
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

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "border-gray-300";
      case "rare":
        return "border-blue-300";
      case "epic":
        return "border-purple-300";
      case "legendary":
        return "border-yellow-300";
      default:
        return "border-gray-300";
    }
  };

  const currentReward = rewards[currentRewardIndex];

  const nextReward = () => {
    if (currentRewardIndex < rewards.length - 1) {
      setCurrentRewardIndex(currentRewardIndex + 1);
    }
  };

  const previousReward = () => {
    if (currentRewardIndex > 0) {
      setCurrentRewardIndex(currentRewardIndex - 1);
    }
  };

  const shareReward = () => {
    // Mock share functionality - could implement social sharing here
  };

  if (!currentReward) return null;

  const IconComponent = getIcon(currentReward.icon);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl">
            {rewards.length > 1 ? "مكافآت جديدة!" : "مكافأة جديدة!"}
          </DialogTitle>
          <DialogDescription>
            {rewards.length > 1
              ? `لقد حصلت على ${rewards.length} مكافآت جديدة`
              : "تهانينا على إنجازك الرائع!"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Reward Display */}
          <div key={currentRewardIndex}>
            <ScaleIn className="text-center">
              {/* Reward Icon */}
              <div
                className={`relative w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br ${getRarityColor(currentReward.rarity)} p-1 transition-transform duration-200 ${
                  showCelebration ? "animate-bounce" : ""
                }`}
              >
                <div
                  className={`w-full h-full bg-white dark:bg-gray-900 rounded-full flex items-center justify-center border-4 ${getRarityBorder(currentReward.rarity)}`}
                >
                  <IconComponent className="w-10 h-10 text-primary-600" />
                </div>

                {/* Sparkle Effects */}
                {showCelebration && (
                  <>
                    <div className="absolute -top-2 -right-2 animate-spin">
                      <Sparkles className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div className="absolute -bottom-2 -left-2 animate-spin">
                      <Sparkles className="w-4 h-4 text-blue-400" />
                    </div>
                  </>
                )}
              </div>

              {/* Reward Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <h3 className="text-xl font-bold">{currentReward.title}</h3>
                  <Badge
                    className={`${getRarityColor(currentReward.rarity)} text-white border-0`}
                  >
                    {getRarityLabel(currentReward.rarity)}
                  </Badge>
                </div>

                <p className="text-muted-foreground">
                  {currentReward.description}
                </p>

                {currentReward.value && (
                  <div className="flex items-center justify-center gap-1 text-lg font-semibold text-purple-600">
                    <Zap className="w-5 h-5" />
                    <span>+{currentReward.value} XP</span>
                  </div>
                )}
              </div>
            </ScaleIn>
          </div>

          {/* Navigation */}
          {rewards.length > 1 && (
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={previousReward}
                disabled={currentRewardIndex === 0}
              >
                السابق
              </Button>

              <div className="flex gap-1">
                {rewards.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentRewardIndex
                        ? "bg-primary-600"
                        : "bg-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={nextReward}
                disabled={currentRewardIndex === rewards.length - 1}
              >
                التالي
              </Button>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={shareReward}>
              <Share2 className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
              مشاركة
            </Button>

            <Button className="flex-1" onClick={onClose}>
              {currentRewardIndex === rewards.length - 1 ? "رائع!" : "متابعة"}
            </Button>
          </div>

          {/* Progress Indicator */}
          {rewards.length > 1 && (
            <div className="text-center text-sm text-muted-foreground">
              {currentRewardIndex + 1} من {rewards.length}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Example usage component
export function useRewards() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingRewards, setPendingRewards] = useState<Reward[]>([]);

  const showRewards = (rewards: Reward[]) => {
    setPendingRewards(rewards);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPendingRewards([]);
  };

  return {
    RewardsModal: () => (
      <RewardsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        rewards={pendingRewards}
        triggerCelebration={true}
      />
    ),
    showRewards,
    closeModal,
  };
}
