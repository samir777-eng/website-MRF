"use client";

/**
 * WeakAreasSection - Phase 2 Task 2.2
 * Tracks and displays topics where user needs improvement
 */

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  ChevronLeft,

} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================

interface WeakArea {
  topic: string;
  topicName: string;
  icon: string;
  accuracy: number;
  questionsAttempted: number;
  lastAttempt?: Date;
  improvementRate?: number; // Percentage improvement over last week
  category: string;
}

interface WeakAreasSectionProps {
  className?: string;
  maxAreas?: number;
  showInsight?: boolean;
}

// ============================================================================
// MOCK DATA (Replace with real API data)
// ============================================================================

const mockWeakAreas: WeakArea[] = [
  {
    topic: "nasikh-verbs",
    topicName: "الأفعال الناسخة",
    icon: "📝",
    accuracy: 58,
    questionsAttempted: 24,
    lastAttempt: new Date(2024, 0, 20),
    improvementRate: 5,
    category: "النحو",
  },
  {
    topic: "poetry-meters",
    topicName: "البحور الشعرية",
    icon: "🎭",
    accuracy: 62,
    questionsAttempted: 18,
    lastAttempt: new Date(2024, 0, 19),
    improvementRate: -2,
    category: "العروض",
  },
  {
    topic: "rhetoric-bayan",
    topicName: "علم البيان",
    icon: "✨",
    accuracy: 67,
    questionsAttempted: 15,
    lastAttempt: new Date(2024, 0, 21),
    improvementRate: 8,
    category: "البلاغة",
  },
  {
    topic: "syntax-mafoul",
    topicName: "المفعولات الخمسة",
    icon: "🎯",
    accuracy: 54,
    questionsAttempted: 30,
    lastAttempt: new Date(2024, 0, 18),
    improvementRate: 3,
    category: "النحو",
  },
];

// Calculate overall improvement
const overallImprovementRate = Math.round(
  mockWeakAreas.reduce((sum, area) => sum + (area.improvementRate || 0), 0) /
    mockWeakAreas.filter((a) => a.improvementRate).length
);

// ============================================================================
// WEAK AREAS SECTION COMPONENT
// ============================================================================

export function WeakAreasSection({
  className,
  maxAreas = 4,
  showInsight = true,
}: WeakAreasSectionProps) {
  // Sort by accuracy (lowest first) and take top N
  const topWeakAreas = [...mockWeakAreas]
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, maxAreas);

  return (
    <section className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-orange-500" />
          <h2 className="text-xl font-bold text-foreground">
            ركّز على هذه المواضيع
          </h2>
        </div>
        <Link href="/ar/weak-areas">
          <Button variant="ghost" size="sm" className="text-primary">
            عرض الكل
            <ChevronLeft className="w-4 h-4 me-2" />
          </Button>
        </Link>
      </div>

      {/* Progress Insight Card */}
      {showInsight && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card
            className={cn(
              "border-2",
              overallImprovementRate > 0
                ? "bg-success-500/5 border-success-500/30"
                : "bg-orange-500/5 border-orange-500/30"
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                    overallImprovementRate > 0
                      ? "bg-success-500/20"
                      : "bg-orange-500/20"
                  )}
                >
                  {overallImprovementRate > 0 ? (
                    <TrendingUp className="w-5 h-5 text-success-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground mb-1">
                    {overallImprovementRate > 0
                      ? `تحسّن رائع! 🎉`
                      : `استمر في التدريب! 💪`}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {overallImprovementRate > 0
                      ? `تحسّنت دقتك بنسبة ${overallImprovementRate}% خلال الأسبوع الماضي. استمر في هذا التقدم الممتاز!`
                      : `ركز على المواضيع أدناه لتحسين أدائك. مع القليل من التدريب ستلاحظ فرقاً كبيراً!`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Weak Areas List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topWeakAreas.map((area, index) => (
          <WeakAreaCard key={area.topic} area={area} index={index} />
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// WEAK AREA CARD
// ============================================================================

function WeakAreaCard({ area, index }: { area: WeakArea; index: number }) {
  const getAccuracyStatus = (accuracy: number) => {
    if (accuracy < 60) return "danger";
    if (accuracy < 75) return "warning";
    return "success";
  };

  const status = getAccuracyStatus(area.accuracy);

  const statusConfig = {
    danger: {
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      borderColor: "border-destructive/30",
      progressColor: "bg-destructive",
    },
    warning: {
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30",
      progressColor: "bg-orange-500",
    },
    success: {
      color: "text-success-600",
      bgColor: "bg-success-500/10",
      borderColor: "border-success-500/30",
      progressColor: "bg-success-500",
    },
  };

  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="glass border-border/50 hover:shadow-lg transition-shadow duration-300 h-full">
        <CardContent className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Icon */}
              <div className="text-3xl flex-shrink-0">{area.icon}</div>

              {/* Title & Category */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground truncate">
                  {area.topicName}
                </h3>
                <Badge variant="secondary" className="text-xs mt-1">
                  {area.category}
                </Badge>
              </div>
            </div>

            {/* Improvement Rate Badge */}
            {area.improvementRate !== undefined && area.improvementRate !== 0 && (
              <Badge
                variant="outline"
                className={cn(
                  "text-xs font-medium flex items-center gap-1",
                  area.improvementRate > 0
                    ? "border-success-500/30 text-success-600 bg-success-500/10"
                    : "border-destructive/30 text-destructive bg-destructive/10"
                )}
              >
                {area.improvementRate > 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {Math.abs(area.improvementRate)}%
              </Badge>
            )}
          </div>

          {/* Accuracy Display */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">الدقة الحالية</span>
              <span className={cn("font-bold text-lg", config.color)}>
                {area.accuracy}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="relative">
              <Progress value={area.accuracy} className="h-2" />
              {/* Threshold Markers */}
              <div className="absolute top-0 left-[40%] w-0.5 h-2 bg-border" />
              <div className="absolute top-0 left-[25%] w-0.5 h-2 bg-border" />
            </div>

            {/* Threshold Labels */}
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>0%</span>
              <span>60%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>{area.questionsAttempted} سؤال</span>
            </div>

            {area.lastAttempt && (
              <div>
                آخر محاولة:{" "}
                {area.lastAttempt.toLocaleDateString("ar-EG", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            )}
          </div>

          {/* Action Button */}
          <Link href={`/ar/practice/${area.topic}`}>
            <Button
              className={cn(
                "w-full",
                status === "danger" && "bg-destructive hover:bg-destructive/90",
                status === "warning" && "bg-orange-500 hover:bg-orange-600",
                status === "success" && "bg-success-500 hover:bg-success-600"
              )}
            >
              <Target className="w-4 h-4 ms-2" />
              تدرب الآن
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default WeakAreasSection;
