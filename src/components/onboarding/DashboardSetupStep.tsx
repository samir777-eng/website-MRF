"use client";

/**
 * DashboardSetupStep - Configure preferences and goals
 * Daily goals, notification preferences, study time
 */

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { OnboardingStepWrapper } from "./OnboardingFlow";
import { Target, Bell, Clock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function DashboardSetupStep() {
  const [dailyGoal, setDailyGoal] = useState(30); // minutes
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [studyTime, setStudyTime] = useState<"morning" | "afternoon" | "evening">("evening");

  const studyTimes = [
    { id: "morning", label: "الصباح", time: "8:00 - 12:00", icon: "🌅" },
    { id: "afternoon", label: "الظهيرة", time: "12:00 - 17:00", icon: "☀️" },
    { id: "evening", label: "المساء", time: "17:00 - 23:00", icon: "🌙" },
  ];

  return (
    <OnboardingStepWrapper
      title="لنخصص تجربتك"
      description="حدد أهدافك وتفضيلاتك للحصول على أفضل تجربة تعليمية"
      icon={
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-2xl shadow-purple-500/50">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
      }
    >
      <div className="space-y-6">
        {/* Daily Goal */}
        <Card className="glass border-border/50">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground mb-1">
                  الهدف اليومي
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  كم دقيقة تريد أن تدرس يومياً؟
                </p>

                {/* Goal Display */}
                <div className="text-center mb-4">
                  <motion.div
                    key={dailyGoal}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="text-5xl font-bold text-primary mb-2"
                  >
                    {dailyGoal}
                  </motion.div>
                  <p className="text-sm text-muted-foreground">دقيقة يومياً</p>
                </div>

                {/* Slider */}
                <Slider
                  value={[dailyGoal]}
                  onValueChange={(values) => setDailyGoal(values[0])}
                  min={10}
                  max={120}
                  step={5}
                  className="mb-2"
                />

                {/* Quick Presets */}
                <div className="flex gap-2 mt-4">
                  {[15, 30, 45, 60].map((preset) => (
                    <Button
                      key={preset}
                      variant={dailyGoal === preset ? "default" : "outline"}
                      size="sm"
                      onClick={() => setDailyGoal(preset)}
                      className="flex-1"
                    >
                      {preset} د
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Study Time Preference */}
        <Card className="glass border-border/50">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground mb-1">
                  وقت الدراسة المفضل
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  متى تفضل الدراسة؟
                </p>

                {/* Time Options */}
                <div className="grid grid-cols-3 gap-3">
                  {studyTimes.map((time) => (
                    <motion.button
                      key={time.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setStudyTime(time.id as any)}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        studyTime === time.id
                          ? "border-primary bg-primary/10 shadow-lg"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      <div className="text-3xl mb-2">{time.icon}</div>
                      <div className="font-bold text-sm text-foreground mb-1">
                        {time.label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {time.time}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="glass border-border/50">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-amber-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground mb-1">الإشعارات</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  ساعدنا نذكرك بأهدافك اليومية
                </p>

                {/* Notification Toggles */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        تفعيل الإشعارات
                      </p>
                      <p className="text-xs text-muted-foreground">
                        احصل على تحديثات عن تقدمك
                      </p>
                    </div>
                    <Switch
                      checked={notificationsEnabled}
                      onCheckedChange={setNotificationsEnabled}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        التذكيرات اليومية
                      </p>
                      <p className="text-xs text-muted-foreground">
                        تذكير بهدفك اليومي
                      </p>
                    </div>
                    <Switch
                      checked={remindersEnabled}
                      onCheckedChange={setRemindersEnabled}
                      disabled={!notificationsEnabled}
                    />
                  </div>
                </div>

                {notificationsEnabled && remindersEnabled && (
                  <Badge variant="secondary" className="mt-2">
                    سنذكرك في وقت الدراسة المفضل ({studyTimes.find(t => t.id === studyTime)?.label})
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </OnboardingStepWrapper>
  );
}

export default DashboardSetupStep;
