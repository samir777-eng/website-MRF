"use client";

/**
 * LearningJourneyMap - Phase 2 Task 2.5
 * Visual representation of user's learning path with milestones
 */

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  CheckCircle,
  Circle,
  Lock,
  Star,
  Flag,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

// ============================================================================
// TYPES
// ============================================================================

interface Milestone {
  id: string;
  title: string;
  description: string;
  icon: string;
  percentage: number;
  status: "completed" | "current" | "locked";
  lessonsRequired: number;
  lessonsCompleted: number;
  reward?: {
    xp: number;
    badge?: string;
  };
}

interface Topic {
  id: string;
  title: string;
  completed: boolean;
  current: boolean;
  locked: boolean;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockMilestones: Milestone[] = [
  {
    id: "start",
    title: "البداية",
    description: "ابدأ رحلتك التعليمية",
    icon: "🎯",
    percentage: 0,
    status: "completed",
    lessonsRequired: 1,
    lessonsCompleted: 1,
    reward: { xp: 100, badge: "المبتدئ" },
  },
  {
    id: "quarter",
    title: "ربع الطريق",
    description: "25% من المنهج",
    icon: "⭐",
    percentage: 25,
    status: "completed",
    lessonsRequired: 15,
    lessonsCompleted: 15,
    reward: { xp: 500, badge: "المثابر" },
  },
  {
    id: "half",
    title: "منتصف الطريق",
    description: "50% من المنهج",
    icon: "🏆",
    percentage: 50,
    status: "current",
    lessonsRequired: 30,
    lessonsCompleted: 22,
  },
  {
    id: "three-quarters",
    title: "ثلاثة أرباع",
    description: "75% من المنهج",
    icon: "👑",
    percentage: 75,
    status: "locked",
    lessonsRequired: 45,
    lessonsCompleted: 22,
  },
  {
    id: "complete",
    title: "إتمام المنهج",
    description: "100% مكتمل",
    icon: "🎓",
    percentage: 100,
    status: "locked",
    lessonsRequired: 60,
    lessonsCompleted: 22,
    reward: { xp: 2000, badge: "خبير اللغة العربية" },
  },
];

const mockTopics: Topic[] = [
  { id: "1", title: "النحو الأساسي", completed: true, current: false, locked: false },
  { id: "2", title: "الأفعال الناسخة", completed: true, current: false, locked: false },
  { id: "3", title: "البلاغة: التشبيه", completed: false, current: true, locked: false },
  { id: "4", title: "الشعر الجاهلي", completed: false, current: false, locked: false },
  { id: "5", title: "علم البيان", completed: false, current: false, locked: true },
];

const currentProgress = 36; // percentage

// ============================================================================
// LEARNING JOURNEY MAP COMPONENT
// ============================================================================

export function LearningJourneyMap() {
  return (
    <div className="space-y-8" dir="rtl">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">رحلتك التعليمية</h2>
        <p className="text-muted-foreground">
          تابع تقدمك واحصل على المكافآت عند كل معلم
        </p>
      </div>

      {/* Overall Progress */}
      <Card className="glass border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-foreground">التقدم الإجمالي</h3>
            <Badge variant="secondary" className="text-lg font-bold">
              {currentProgress}%
            </Badge>
          </div>
          <Progress value={currentProgress} className="h-3 mb-2" />
          <p className="text-sm text-muted-foreground">
            22 من 60 درس مكتمل
          </p>
        </CardContent>
      </Card>

      {/* Journey Path */}
      <Card className="glass border-border/50 overflow-hidden">
        <CardContent className="p-6">
          <div className="relative">
            {/* Path Line */}
            <div className="absolute right-[2.75rem] top-8 bottom-8 w-1 bg-gradient-to-b from-success-500 via-primary to-muted" />

            {/* Milestones */}
            <div className="space-y-8">
              {mockMilestones.map((milestone, index) => (
                <MilestoneItem
                  key={milestone.id}
                  milestone={milestone}
                  index={index}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Topics */}
      <Card className="glass border-border/50">
        <CardContent className="p-6">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            المواضيع القادمة
          </h3>
          <div className="space-y-2">
            {mockTopics.map((topic) => (
              <TopicItem key={topic.id} topic={topic} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// MILESTONE ITEM
// ============================================================================

function MilestoneItem({
  milestone,
  index,
}: {
  milestone: Milestone;
  index: number;
}) {
  const isCompleted = milestone.status === "completed";
  const isCurrent = milestone.status === "current";
  const isLocked = milestone.status === "locked";

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative flex items-start gap-4"
    >
      {/* Icon/Status */}
      <div className="relative z-10 flex-shrink-0">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-2xl",
            isCompleted && "bg-gradient-to-br from-success-500 to-emerald-600",
            isCurrent && "bg-gradient-to-br from-primary to-primary-600 animate-pulse",
            isLocked && "bg-muted/50 grayscale"
          )}
        >
          {isLocked ? (
            <Lock className="w-8 h-8 text-muted-foreground" />
          ) : (
            <span>{milestone.icon}</span>
          )}
        </motion.div>

        {/* Completion Badge */}
        {isCompleted && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-success-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pt-2">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <h4 className={cn(
              "font-bold text-lg",
              isLocked ? "text-muted-foreground" : "text-foreground"
            )}>
              {milestone.title}
            </h4>
            <p className="text-sm text-muted-foreground">
              {milestone.description}
            </p>
          </div>

          {milestone.reward && (
            <Badge
              variant="outline"
              className={cn(
                "text-xs",
                isCompleted && "border-success-500/30 text-success-600 bg-success-500/10"
              )}
            >
              +{milestone.reward.xp} XP
            </Badge>
          )}
        </div>

        {/* Progress */}
        {!isCompleted && (
          <div className="space-y-2 mt-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {milestone.lessonsCompleted} / {milestone.lessonsRequired} دروس
              </span>
              <span className="font-medium text-foreground">
                {Math.round(
                  (milestone.lessonsCompleted / milestone.lessonsRequired) * 100
                )}%
              </span>
            </div>
            <Progress
              value={
                (milestone.lessonsCompleted / milestone.lessonsRequired) * 100
              }
              className="h-2"
            />
          </div>
        )}

        {/* Reward Info */}
        {isCompleted && milestone.reward?.badge && (
          <Badge variant="secondary" className="mt-2">
            🏅 {milestone.reward.badge}
          </Badge>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================================
// TOPIC ITEM
// ============================================================================

function TopicItem({ topic }: { topic: Topic }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg transition-colors",
        topic.current && "bg-primary/10 border border-primary/30",
        !topic.current && "bg-muted/30"
      )}
    >
      {/* Status Icon */}
      <div className="flex-shrink-0">
        {topic.completed ? (
          <CheckCircle className="w-5 h-5 text-success-500 fill-success-500" />
        ) : topic.current ? (
          <Circle className="w-5 h-5 text-primary fill-primary" />
        ) : topic.locked ? (
          <Lock className="w-5 h-5 text-muted-foreground" />
        ) : (
          <Circle className="w-5 h-5 text-muted-foreground" />
        )}
      </div>

      {/* Title */}
      <span
        className={cn(
          "flex-1 text-sm font-medium",
          topic.completed && "text-muted-foreground line-through",
          topic.current && "text-primary font-bold",
          topic.locked && "text-muted-foreground"
        )}
      >
        {topic.title}
      </span>

      {/* Action */}
      {topic.current && (
        <Link href={`/ar/lessons/${topic.id}`}>
          <Button size="sm" variant="ghost" className="text-primary">
            ابدأ
          </Button>
        </Link>
      )}
    </div>
  );
}

export default LearningJourneyMap;
