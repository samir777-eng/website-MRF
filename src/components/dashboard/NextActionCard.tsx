"use client";

/**
 * Next Action Card - Phase 1 Task 1.5
 * Prominent card showing the most important next action for the user
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle, Clock, Play, Star, Timer } from "lucide-react";
import Link from "next/link";

export interface NextAction {
  type: "continue-lesson" | "start-lesson" | "take-quiz" | "complete-homework";
  id: string;
  title: string;
  subject: string;
  progress?: number;
  duration?: string;
  estimatedTime?: string;
  thumbnail?: string;
  completionReward?: {
    xp: number;
    badge?: string;
  };
}

interface NextActionCardProps {
  action: NextAction;
  prominent?: boolean;
  size?: "default" | "large";
}

export function NextActionCard({
  action,
  prominent = true,
  size = "large",
}: NextActionCardProps) {
  const getActionConfig = () => {
    switch (action.type) {
      case "continue-lesson":
        return {
          icon: Play,
          iconColor: "text-primary",
          iconBg: "bg-primary/10",
          gradient: "from-primary/20 to-brand-coral/20",
          borderGradient: "from-primary to-brand-coral",
          label: "متابعة الدرس",
          actionText: "متابعة التعلم",
        };
      case "start-lesson":
        return {
          icon: Star,
          iconColor: "text-success-500",
          iconBg: "bg-success-500/10",
          gradient: "from-success-500/20 to-xp-500/20",
          borderGradient: "from-success-500 to-xp-500",
          label: "درس جديد",
          actionText: "ابدأ الآن",
        };
      case "take-quiz":
        return {
          icon: CheckCircle,
          iconColor: "text-xp-500",
          iconBg: "bg-xp-500/10",
          gradient: "from-xp-500/20 to-success-500/20",
          borderGradient: "from-xp-500 to-success-500",
          label: "اختبار جاهز",
          actionText: "ابدأ الاختبار",
        };
      case "complete-homework":
        return {
          icon: Timer,
          iconColor: "text-brand-coral-500",
          iconBg: "bg-brand-coral-500/10",
          gradient: "from-brand-coral-500/20 to-primary/20",
          borderGradient: "from-brand-coral-500 to-primary",
          label: "واجب منزلي",
          actionText: "أكمل الواجب",
        };
    }
  };

  const config = getActionConfig();
  const Icon = config.icon;

  const isLarge = size === "large";
  const href = getActionHref(action);

  return (
    <Card
      className={`relative overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 ${
        prominent ? `border-transparent bg-gradient-to-br ${config.gradient}` : ""
      } ${isLarge ? "p-6 md:p-8" : "p-4 md:p-6"}`}
    >
      {/* Top gradient accent */}
      <div
        className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${config.borderGradient}`}
      />

      {/* Background pattern */}
      {prominent && (
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          />
        </div>
      )}

      <CardContent className="relative p-0">
        <div className={`flex flex-col ${isLarge ? "gap-6" : "gap-4"}`}>
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              {/* Icon */}
              <div
                className={`${config.iconBg} rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  isLarge ? "w-16 h-16" : "w-12 h-12"
                }`}
              >
                <Icon
                  className={`${config.iconColor} ${isLarge ? "w-8 h-8" : "w-6 h-6"}`}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Label Badge */}
                <Badge
                  className={`${config.iconBg} ${config.iconColor} border-none mb-3 font-semibold`}
                >
                  {config.label}
                </Badge>

                {/* Title */}
                <h3
                  className={`font-bold text-foreground leading-tight mb-2 ${
                    isLarge ? "text-2xl md:text-3xl" : "text-xl"
                  }`}
                >
                  {action.title}
                </h3>

                {/* Subject */}
                <p
                  className={`text-muted-foreground font-medium ${
                    isLarge ? "text-lg" : "text-base"
                  }`}
                >
                  {action.subject}
                </p>
              </div>
            </div>

            {/* Completion Reward */}
            {action.completionReward && (
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                    +{action.completionReward.xp} XP
                  </span>
                </div>
                {action.completionReward.badge && (
                  <span className="text-xs text-muted-foreground">
                    + شارة
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Progress & Time Info */}
          <div className="space-y-3">
            {/* Progress Bar (if applicable) */}
            {action.progress !== undefined && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium">
                    التقدم
                  </span>
                  <span className="font-bold text-primary">
                    {action.progress}%
                  </span>
                </div>
                <Progress value={action.progress} className="h-3" />
              </div>
            )}

            {/* Time Info */}
            <div className="flex items-center gap-4 text-sm">
              {action.duration && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">{action.duration}</span>
                </div>
              )}
              {action.estimatedTime && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Timer className="w-4 h-4" />
                  <span className="font-medium">
                    الوقت المتوقع: {action.estimatedTime}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* CTA Button */}
          <Link href={href} className="w-full">
            <Button
              size={isLarge ? "lg" : "default"}
              className={`w-full bg-gradient-to-r ${config.borderGradient} hover:opacity-90 text-white shadow-lg transition-all duration-300 hover:scale-[1.02] ${
                isLarge ? "h-14 text-lg" : "h-12"
              }`}
            >
              <Icon className="w-5 h-5 ms-2" />
              {config.actionText}
              <ArrowLeft className="w-5 h-5 me-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to get href based on action type
function getActionHref(action: NextAction): string {
  switch (action.type) {
    case "continue-lesson":
    case "start-lesson":
      return `/ar/lessons/${action.id}`;
    case "take-quiz":
      return `/ar/quizzes/${action.id}`;
    case "complete-homework":
      return `/ar/homework/${action.id}`;
    default:
      return "/ar/dashboard";
  }
}

export default NextActionCard;
