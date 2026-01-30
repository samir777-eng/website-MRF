"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { AccessState, LectureAccessStatus } from "@/types/lives-system";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle,
  Clock,
  Lock,
  Play,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ActivateLectureModal } from "./activate-lecture-modal";
import { LectureAccessTimer } from "./lecture-access-timer";
import { LectureLifeDisplay } from "./lecture-lives-display";
import { PurchaseLifeModal } from "./purchase-life-modal";

interface LectureCardProps {
  id: string;
  title: string;
  weekNumber: number;
  thumbnail?: string;
  videosCount: number;
  duration?: string;
  progress?: number;
  accessState?: AccessState;
  userCoins?: number;
  className?: string;
  onActivate?: () => Promise<void>;
  onPurchaseLife?: (
    method: "coins" | "money"
  ) => Promise<{ success: boolean; message: string }>;
  onPurchaseLecture?: () => void;
}

const statusConfig: Record<
  LectureAccessStatus,
  { label: string; color: string; bgColor: string; icon: React.ElementType }
> = {
  purchased: {
    label: "جاهز للتفعيل",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    icon: Play,
  },
  activated: {
    label: "مفعّل",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    icon: CheckCircle,
  },
  active: {
    label: "نشط",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    icon: BookOpen,
  },
  needs_life: {
    label: "يحتاج حياة",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    icon: AlertTriangle,
  },
  expired: {
    label: "منتهي",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    icon: Clock,
  },
  locked: {
    label: "مقفل",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    icon: Lock,
  },
  not_purchased: {
    label: "غير مشترى",
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    icon: ShoppingCart,
  },
};

export function LectureCard({
  id,
  title,
  weekNumber,
  thumbnail,
  videosCount,
  duration,
  progress = 0,
  accessState,
  userCoins = 0,
  className,
  onActivate,
  onPurchaseLife,
  onPurchaseLecture,
}: LectureCardProps) {
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [showPurchaseLifeModal, setShowPurchaseLifeModal] = useState(false);

  const status = accessState?.status ?? "not_purchased";
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  const canAccess = status === "active" || status === "activated";
  const needsActivation = status === "purchased";
  const needsLife = status === "needs_life";
  const isLocked = status === "locked";
  const isExpired = status === "expired";
  const notPurchased = status === "not_purchased";

  const handleCardClick = () => {
    if (needsActivation) {
      setShowActivateModal(true);
    } else if (needsLife) {
      setShowPurchaseLifeModal(true);
    } else if (notPurchased && onPurchaseLecture) {
      onPurchaseLecture();
    }
  };

  const cardClassName = cn(
    "block rounded-2xl border bg-card overflow-hidden transition-all",
    "hover:shadow-lg hover:border-primary/20",
    !canAccess && !notPurchased && "cursor-pointer",
    notPurchased && "opacity-75",
    isLocked && "opacity-60",
    className
  );

  const cardContent = (
    <>
      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <BookOpen className="w-12 h-12 text-primary/40" />
          </div>
        )}
        <Badge className="absolute top-2 start-2 bg-background/90 text-foreground">
          الأسبوع {weekNumber}
        </Badge>
        <Badge
          className={cn("absolute top-2 end-2", config.bgColor, config.color)}
        >
          <StatusIcon className="w-3 h-3 me-1" />
          {config.label}
        </Badge>
        {(isLocked || isExpired || notPurchased) && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <Lock className="w-10 h-10 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="font-semibold line-clamp-2">{title}</h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{videosCount} فيديو</span>
          {duration && <span>{duration}</span>}
        </div>

        {accessState &&
          (canAccess || needsLife) &&
          accessState.accessExpiresAt && (
            <div className="flex items-center justify-between pt-2 border-t">
              <LectureAccessTimer
                expiresAt={accessState.accessExpiresAt}
                variant="compact"
              />
              <LectureLifeDisplay
                livesRemaining={accessState.livesRemaining}
                variant="compact"
              />
            </div>
          )}

        {canAccess && progress > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">التقدم</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}

        {needsActivation && (
          <Button className="w-full" onClick={() => setShowActivateModal(true)}>
            <Play className="w-4 h-4 me-2" />
            تفعيل المحاضرة
          </Button>
        )}

        {needsLife && (
          <Button
            variant="outline"
            className="w-full border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
            onClick={() => setShowPurchaseLifeModal(true)}
          >
            <AlertTriangle className="w-4 h-4 me-2" />
            شراء حياة للاستمرار
          </Button>
        )}

        {notPurchased && onPurchaseLecture && (
          <Button
            variant="outline"
            className="w-full"
            onClick={onPurchaseLecture}
          >
            <ShoppingCart className="w-4 h-4 me-2" />
            شراء المحاضرة
          </Button>
        )}
      </div>
    </>
  );

  return (
    <>
      {canAccess ? (
        <Link href={`/ar/lectures/${id}`} className={cardClassName}>
          {cardContent}
        </Link>
      ) : (
        <div
          className={cardClassName}
          onClick={handleCardClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleCardClick();
            }
          }}
        >
          {cardContent}
        </div>
      )}

      {onActivate && (
        <ActivateLectureModal
          open={showActivateModal}
          onOpenChange={setShowActivateModal}
          lectureTitle={title}
          lectureNumber={weekNumber}
          onConfirm={onActivate}
        />
      )}

      {onPurchaseLife && (
        <PurchaseLifeModal
          open={showPurchaseLifeModal}
          onOpenChange={setShowPurchaseLifeModal}
          lectureTitle={title}
          userCoins={userCoins}
          onPurchase={onPurchaseLife}
        />
      )}
    </>
  );
}
