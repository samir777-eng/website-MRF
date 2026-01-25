"use client";

/**
 * StreakCalendar - Phase 2 Task 2.1
 * Enhanced streak visualization with calendar, milestones, and freeze feature
 */

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Flame,
  Snowflake,
  Trophy,
  Medal,
  Crown,
  CheckCircle,
  Circle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================

interface DayData {
  date: number;
  fullDate: Date;
  hasActivity: boolean;
  isToday: boolean;
  inStreak: boolean;
  xpEarned?: number;
}

interface StreakMilestone {
  value: number;
  reward: string;
  title: string;
  reached: boolean;
  nextMilestone?: number;
}

interface StreakCalendarProps {
  currentStreak: number;
  longestStreak: number;
  freezesAvailable: number;
  freezeCost?: number;
  onUseFreeze?: () => void;
  className?: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getLast30Days(): DayData[] {
  const days: DayData[] = [];
  const today = new Date();
  
  // Mock data - Replace with real data from API
  const mockActiveDays = [0, 1, 2, 3, 4, 5, 6, 8, 9, 11, 13, 14, 16, 18, 20, 22, 24, 26, 28];
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const hasActivity = mockActiveDays.includes(i);
    const isToday = i === 0;
    const inStreak = i <= 6; // Last 7 days is current streak
    
    days.push({
      date: date.getDate(),
      fullDate: date,
      hasActivity,
      isToday,
      inStreak,
      xpEarned: hasActivity ? Math.floor(Math.random() * 200) + 50 : undefined,
    });
  }
  
  return days;
}

function getStreakMilestones(currentStreak: number): StreakMilestone[] {
  return [
    {
      value: 7,
      reward: "🏅",
      title: "أسبوع متواصل",
      reached: currentStreak >= 7,
      nextMilestone: currentStreak < 7 ? 7 - currentStreak : undefined,
    },
    {
      value: 30,
      reward: "🏆",
      title: "شهر متواصل",
      reached: currentStreak >= 30,
      nextMilestone: currentStreak < 30 ? 30 - currentStreak : undefined,
    },
    {
      value: 100,
      reward: "👑",
      title: "مئة يوم!",
      reached: currentStreak >= 100,
      nextMilestone: currentStreak < 100 ? 100 - currentStreak : undefined,
    },
  ];
}

function getWeekdayName(date: Date): string {
  const weekdays = ["ح", "ن", "ث", "ر", "خ", "ج", "س"];
  return weekdays[date.getDay()];
}

// ============================================================================
// STREAK CALENDAR COMPONENT
// ============================================================================

export function StreakCalendar({
  currentStreak,
  longestStreak,
  freezesAvailable,
  freezeCost = 50,
  onUseFreeze,
  className,
}: StreakCalendarProps) {
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  
  const last30Days = getLast30Days();
  const milestones = getStreakMilestones(currentStreak);
  const nextMilestone = milestones.find((m) => !m.reached);

  return (
    <Card className={cn("glass border-border/50", className)}>
      <CardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center"
          >
            <div className="relative">
              <Flame className="w-16 h-16 text-orange-500 fill-orange-500 animate-pulse" />
              <motion.div
                className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>
          
          <div>
            <motion.h2
              key={currentStreak}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-bold text-foreground"
            >
              {currentStreak} يوم
            </motion.h2>
            <p className="text-muted-foreground font-medium">
              السلسلة الحالية
            </p>
          </div>

          {/* Longest Streak Badge */}
          <Badge
            variant="outline"
            className="border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10"
          >
            أطول سلسلة: {longestStreak} يوم 🔥
          </Badge>
        </div>

        {/* Progress to Next Milestone */}
        {nextMilestone && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {nextMilestone.nextMilestone} يوم متبقي للإنجاز التالي
              </span>
              <span className="font-bold text-foreground">
                {nextMilestone.reward} {nextMilestone.title}
              </span>
            </div>
            <Progress
              value={(currentStreak / nextMilestone.value) * 100}
              className="h-2"
            />
          </div>
        )}

        {/* Calendar Grid */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground text-center">
            آخر 30 يوم
          </h3>
          
          <div className="grid grid-cols-10 gap-2">
            {last30Days.map((day, index) => (
              <DayCell
                key={index}
                day={day}
                onClick={() => setSelectedDay(day)}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-success-500/20 border border-success-500/50" />
              <span>يوم نشط</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-orange-500/20 border-2 border-orange-500" />
              <span>في السلسلة</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm border border-muted" />
              <span>غير نشط</span>
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">
            المعالم
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {milestones.map((milestone) => (
              <MilestoneCard
                key={milestone.value}
                milestone={milestone}
              />
            ))}
          </div>
        </div>

        {/* Streak Freeze */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Snowflake className="w-5 h-5 text-cyan-500" />
              <h3 className="text-sm font-semibold text-foreground">
                تجميد السلسلة
              </h3>
            </div>
            <Badge variant="secondary" className="font-bold">
              {freezesAvailable} متاح
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground">
            احمِ سلسلتك! استخدم تجميد السلسلة إذا احتجت يوم راحة.
          </p>

          <Button
            variant="outline"
            className="w-full border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
            onClick={() => setShowFreezeModal(true)}
            disabled={freezesAvailable === 0}
          >
            <Snowflake className="w-4 h-4 ml-2" />
            استخدم تجميد ({freezeCost} 💎)
          </Button>
        </div>

        {/* Day Details Modal */}
        <AnimatePresence>
          {selectedDay && (
            <DayDetailsTooltip
              day={selectedDay}
              onClose={() => setSelectedDay(null)}
            />
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// DAY CELL COMPONENT
// ============================================================================

function DayCell({ day, onClick }: { day: DayData; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "aspect-square rounded-lg text-xs font-medium transition-all relative",
        "flex items-center justify-center",
        day.isToday && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        day.hasActivity && "bg-success-500/20 text-success-700 dark:text-success-400",
        day.inStreak && day.hasActivity && "border-2 border-orange-500 bg-orange-500/20",
        !day.hasActivity && "border border-muted text-muted-foreground hover:border-muted-foreground/50",
      )}
    >
      {day.date}
      {day.hasActivity && (
        <CheckCircle className="w-3 h-3 absolute -top-1 -right-1 text-success-500 fill-success-500" />
      )}
    </motion.button>
  );
}

// ============================================================================
// MILESTONE CARD COMPONENT
// ============================================================================

function MilestoneCard({ milestone }: { milestone: StreakMilestone }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={cn(
        "p-3 rounded-xl text-center transition-all cursor-default",
        milestone.reached
          ? "bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-2 border-amber-500/50"
          : "bg-muted/30 border border-muted opacity-60",
      )}
    >
      <div className="text-2xl mb-1">{milestone.reward}</div>
      <div className="text-xs font-bold text-foreground mb-0.5">
        {milestone.value} يوم
      </div>
      <div className="text-[10px] text-muted-foreground leading-tight">
        {milestone.title}
      </div>
      {milestone.reached && (
        <CheckCircle className="w-3 h-3 mx-auto mt-1 text-success-500 fill-success-500" />
      )}
    </motion.div>
  );
}

// ============================================================================
// DAY DETAILS TOOLTIP
// ============================================================================

function DayDetailsTooltip({
  day,
  onClose,
}: {
  day: DayData;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-2xl p-6 max-w-sm mx-4 shadow-2xl"
      >
        <div className="text-center space-y-3">
          <div className="text-4xl">{day.hasActivity ? "✅" : "⚪"}</div>
          <div>
            <h3 className="text-xl font-bold text-foreground">
              {day.fullDate.toLocaleDateString("ar-EG", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {day.isToday && "اليوم"}
              {day.inStreak && day.hasActivity && " • في السلسلة الحالية"}
            </p>
          </div>

          {day.hasActivity && day.xpEarned && (
            <div className="p-3 bg-success-500/10 rounded-lg">
              <div className="text-2xl font-bold text-success-600">
                +{day.xpEarned} XP
              </div>
              <div className="text-xs text-muted-foreground">
                نقاط الخبرة المكتسبة
              </div>
            </div>
          )}

          {!day.hasActivity && (
            <div className="text-sm text-muted-foreground">
              لا يوجد نشاط في هذا اليوم
            </div>
          )}

          <Button onClick={onClose} variant="secondary" className="w-full">
            إغلاق
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default StreakCalendar;
