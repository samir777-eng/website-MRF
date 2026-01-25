"use client";

/**
 * RecommendedSection - Phase 2 Task 2.2
 * Personalized content recommendations based on user performance
 */

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  TrendingUp,
  RefreshCw,
  BookOpen,
  Target,
  Clock,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================

type RecommendationType = "weak-area" | "review" | "next-lesson" | "challenge";

interface Recommendation {
  id: string;
  type: RecommendationType;
  title: string;
  reason: string;
  thumbnail?: string;
  duration?: string;
  difficulty?: "easy" | "medium" | "hard";
  xpReward?: number;
  href: string;
  priority: number; // 1-5, higher is more important
}

interface RecommendedSectionProps {
  className?: string;
  maxRecommendations?: number;
}

// ============================================================================
// MOCK DATA (Replace with real API data)
// ============================================================================

const mockRecommendations: Recommendation[] = [
  {
    id: "weak-1",
    type: "weak-area",
    title: "الأفعال الناسخة",
    reason: "لاحظنا أن دقتك في هذا الموضوع 58%. دعنا نحسن ذلك!",
    duration: "20 دقيقة",
    difficulty: "medium",
    xpReward: 150,
    href: "/ar/lessons/weak-area-1",
    priority: 5,
  },
  {
    id: "review-1",
    type: "review",
    title: "مراجعة: الأسماء الخمسة",
    reason: "مر أسبوع منذ آخر مراجعة. حافظ على مستواك!",
    duration: "15 دقيقة",
    difficulty: "easy",
    xpReward: 100,
    href: "/ar/lessons/review-1",
    priority: 3,
  },
  {
    id: "next-1",
    type: "next-lesson",
    title: "أسلوب الاستثناء",
    reason: "الدرس التالي في مسارك التعليمي",
    duration: "25 دقيقة",
    difficulty: "medium",
    xpReward: 200,
    href: "/ar/lessons/next-1",
    priority: 4,
  },
  {
    id: "challenge-1",
    type: "challenge",
    title: "تحدي النحو السريع",
    reason: "أنت جاهز لتحدي جديد! اختبر مهاراتك",
    duration: "10 دقائق",
    difficulty: "hard",
    xpReward: 300,
    href: "/ar/challenges/challenge-1",
    priority: 2,
  },
];

// ============================================================================
// RECOMMENDATION TYPE CONFIG
// ============================================================================

const recommendationTypeConfig: Record<
  RecommendationType,
  {
    label: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  "weak-area": {
    label: "💪 حسّن نقاط ضعفك",
    icon: <Target className="w-4 h-4" />,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
  },
  review: {
    label: "🔄 مراجعة",
    icon: <RefreshCw className="w-4 h-4" />,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
  "next-lesson": {
    label: "📚 الدرس التالي",
    icon: <BookOpen className="w-4 h-4" />,
    color: "text-success-600 dark:text-success-400",
    bgColor: "bg-success-500/10",
    borderColor: "border-success-500/30",
  },
  challenge: {
    label: "⚡ تحدي",
    icon: <Star className="w-4 h-4" />,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
  },
};

// ============================================================================
// RECOMMENDED SECTION COMPONENT
// ============================================================================

export function RecommendedSection({
  className,
  maxRecommendations = 3,
}: RecommendedSectionProps) {
  // Sort by priority and take top N
  const topRecommendations = [...mockRecommendations]
    .sort((a, b) => b.priority - a.priority)
    .slice(0, maxRecommendations);

  return (
    <section className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">موصى به لك</h2>
        </div>
        <p className="text-sm text-muted-foreground">بناءً على أدائك الأخير</p>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {topRecommendations.map((recommendation, index) => (
          <RecommendationCard
            key={recommendation.id}
            recommendation={recommendation}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// RECOMMENDATION CARD
// ============================================================================

function RecommendationCard({
  recommendation,
  index,
}: {
  recommendation: Recommendation;
  index: number;
}) {
  const config = recommendationTypeConfig[recommendation.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <Link href={recommendation.href}>
        <Card className="glass border-border/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group h-full">
          <CardContent className="p-5 space-y-4 h-full flex flex-col">
            {/* Type Badge */}
            <div className="flex items-center justify-between">
              <Badge
                variant="outline"
                className={cn(
                  "text-xs font-medium",
                  config.color,
                  config.bgColor,
                  config.borderColor
                )}
              >
                {config.label}
              </Badge>

              {/* Priority Indicator */}
              {recommendation.priority >= 4 && (
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-primary" />
                  <span className="text-xs font-medium text-primary">
                    أولوية عالية
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail or Icon */}
            {recommendation.thumbnail ? (
              <div className="w-full h-32 bg-muted rounded-lg overflow-hidden">
                <img
                  src={recommendation.thumbnail}
                  alt={recommendation.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ) : (
              <div
                className={cn(
                  "w-full h-32 rounded-lg flex items-center justify-center",
                  config.bgColor
                )}
              >
                <div className="text-5xl">
                  {recommendation.type === "weak-area" && "💪"}
                  {recommendation.type === "review" && "🔄"}
                  {recommendation.type === "next-lesson" && "📚"}
                  {recommendation.type === "challenge" && "⚡"}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 space-y-2">
              <h3 className="font-bold text-lg text-foreground line-clamp-1">
                {recommendation.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {recommendation.reason}
              </p>
            </div>

            {/* Meta Info */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {recommendation.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{recommendation.duration}</span>
                </div>
              )}

              {recommendation.difficulty && (
                <Badge variant="secondary" className="text-xs">
                  {recommendation.difficulty === "easy" && "سهل"}
                  {recommendation.difficulty === "medium" && "متوسط"}
                  {recommendation.difficulty === "hard" && "صعب"}
                </Badge>
              )}

              {recommendation.xpReward && (
                <Badge
                  variant="outline"
                  className="text-xs border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10 mr-auto"
                >
                  +{recommendation.xpReward} XP
                </Badge>
              )}
            </div>

            {/* Action Button */}
            <Button
              className="w-full bg-premium-gradient hover:opacity-90 transition-opacity"
              asChild
            >
              <span>ابدأ الآن</span>
            </Button>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export default RecommendedSection;
