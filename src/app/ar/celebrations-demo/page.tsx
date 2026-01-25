"use client";

/**
 * Celebrations Demo Page - REFINED
 * Test all Phase 1 enhancements: Confetti, XP animations, Combo, Sounds, Streak
 */

import { useCelebration } from "@/components/celebrations";
import { EnhancedStreakDisplay } from "@/components/gamification/EnhancedStreakDisplay";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Award,
  Flame,
  PartyPopper,
  Settings,
  Sparkles,
  Star,
  Trophy,
  Vibrate,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { useState } from "react";

export default function CelebrationsDemoPage() {
  const celebration = useCelebration();
  const [streakDays, setStreakDays] = useState(7);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-24" dir="rtl">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-purple-500/30">
            <PartyPopper className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-purple-600 dark:text-purple-400">
            عرض نظام الاحتفالات 🎉
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            اختبر جميع تحسينات المرحلة الأولى المُحسَّنة: الكونفيتي، رسوم XP
            المتحركة، نظام الكومبو، الاهتزاز، والسلسلة
          </p>
        </div>

        {/* Settings Toggle */}
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => setShowSettings(!showSettings)}
            className="gap-2"
          >
            <Settings className="w-4 h-4" />
            الإعدادات
          </Button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <Card className="max-w-md mx-auto border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-600">
                <Settings className="w-5 h-5" />
                إعدادات الاحتفالات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {celebration.settings.soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-gray-400" />
                  )}
                  <span>الأصوات</span>
                </div>
                <Switch
                  checked={celebration.settings.soundEnabled}
                  onCheckedChange={(checked) =>
                    celebration.updateSettings({ soundEnabled: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Vibrate
                    className={`w-4 h-4 ${
                      celebration.settings.hapticEnabled
                        ? "text-green-500"
                        : "text-gray-400"
                    }`}
                  />
                  <span>الاهتزاز</span>
                </div>
                <Switch
                  checked={celebration.settings.hapticEnabled}
                  onCheckedChange={(checked) =>
                    celebration.updateSettings({ hapticEnabled: checked })
                  }
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>مستوى الصوت</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(celebration.settings.volume * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={celebration.settings.volume * 100}
                  onChange={(e) =>
                    celebration.updateSettings({
                      volume: parseInt(e.target.value) / 100,
                    })
                  }
                  className="w-full accent-purple-500"
                />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* XP Gain Demo */}
          <Card className="border-yellow-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-600">
                <Zap className="w-5 h-5" />
                رسوم XP المتحركة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                اضغط لإظهار رسوم XP المتحركة بمضاعفات مختلفة (مع جزيئات متدرجة)
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={() => celebration.showXPGain(50)}
                  className="bg-yellow-500 hover:bg-yellow-600"
                >
                  +50 XP
                </Button>
                <Button
                  size="sm"
                  onClick={() => celebration.showXPGain(100, 2)}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  +100 XP (×2)
                </Button>
                <Button
                  size="sm"
                  onClick={() => celebration.showXPGain(200, 3)}
                  className="bg-red-500 hover:bg-red-600"
                >
                  +200 XP (×3)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Level Up Demo */}
          <Card className="border-amber-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-600">
                <Star className="w-5 h-5" />
                ترقية المستوى
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                عرض رسوم ترقية المستوى مع الكونفيتي الذهبي والاهتزاز
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={() => celebration.showLevelUp(5, "متعلم نشط")}
                  className="bg-amber-500 hover:bg-amber-600"
                >
                  المستوى 5
                </Button>
                <Button
                  size="sm"
                  onClick={() => celebration.showLevelUp(10, "طالب متميز")}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  المستوى 10
                </Button>
                <Button
                  size="sm"
                  onClick={() => celebration.showLevelUp(25, "خبير اللغة")}
                  className="bg-amber-700 hover:bg-amber-800"
                >
                  المستوى 25
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Achievement Demo */}
          <Card className="border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-600">
                <Trophy className="w-5 h-5" />
                الإنجازات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                إشعارات الإنجازات بمستويات ندرة مختلفة (مع XP)
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    celebration.showAchievement(
                      "البداية",
                      "أكمل أول درس",
                      "star",
                      "common",
                      25
                    )
                  }
                >
                  عادي
                </Button>
                <Button
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600"
                  onClick={() =>
                    celebration.showAchievement(
                      "متفوق",
                      "احصل على 5 درجات كاملة",
                      "target",
                      "rare",
                      100
                    )
                  }
                >
                  نادر
                </Button>
                <Button
                  size="sm"
                  className="bg-purple-500 hover:bg-purple-600"
                  onClick={() =>
                    celebration.showAchievement(
                      "بطل",
                      "أكمل 50 درس",
                      "award",
                      "epic",
                      250
                    )
                  }
                >
                  ملحمي
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700"
                  onClick={() =>
                    celebration.showAchievement(
                      "أسطورة التعلم",
                      "100 يوم متتالي!",
                      "crown",
                      "legendary",
                      500
                    )
                  }
                >
                  أسطوري
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Combo Demo */}
          <Card className="border-green-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <Sparkles className="w-5 h-5" />
                نظام الكومبو
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                الكومبو الحالي: {celebration.comboCount}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  className="bg-green-500 hover:bg-green-600"
                  onClick={() => celebration.incrementCombo()}
                >
                  إجابة صحيحة ✓
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => celebration.breakCombo()}
                >
                  كسر الكومبو ✗
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => celebration.resetCombo()}
                >
                  إعادة تعيين
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                3+ = ×1.5 | 5+ = ×2 | 10+ = ×3 | 20+ = ×4
              </p>
            </CardContent>
          </Card>

          {/* Confetti Demo */}
          <Card className="border-pink-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-pink-600">
                <PartyPopper className="w-5 h-5" />
                الكونفيتي
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                أنواع مختلفة من تأثيرات الكونفيتي
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => celebration.triggerConfetti("default")}
                >
                  عادي
                </Button>
                <Button
                  size="sm"
                  className="bg-yellow-500 hover:bg-yellow-600"
                  onClick={() => celebration.triggerConfetti("gold")}
                >
                  ذهبي
                </Button>
                <Button
                  size="sm"
                  className="bg-pink-500 hover:bg-pink-600"
                  onClick={() => celebration.triggerConfetti("celebration")}
                >
                  احتفال
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-red-500 to-blue-500"
                  onClick={() => celebration.triggerConfetti("fireworks")}
                >
                  ألعاب نارية
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-yellow-300 to-amber-400"
                  onClick={() => celebration.triggerConfetti("stars")}
                >
                  نجوم ⭐
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Perfect Score Demo */}
          <Card className="border-emerald-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-600">
                <Award className="w-5 h-5" />
                درجة كاملة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                تأثير الدرجة الكاملة 100% (مع +100 XP مكافأة)
              </p>
              <Button
                className="w-full bg-gradient-to-r from-emerald-500 to-green-600"
                onClick={() => celebration.showPerfectScore()}
              >
                عرض الدرجة الكاملة ⭐
              </Button>
            </CardContent>
          </Card>

          {/* Streak Demo */}
          <Card className="border-orange-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <Flame className="w-5 h-5" />
                السلسلة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                عرض إشعارات السلسلة المختلفة
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => celebration.showStreak(5, false)}
                >
                  5 أيام
                </Button>
                <Button
                  size="sm"
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={() => celebration.showStreak(7, true)}
                >
                  7 أيام (إنجاز!)
                </Button>
                <Button
                  size="sm"
                  className="bg-red-500 hover:bg-red-600"
                  onClick={() => celebration.showStreak(30, true)}
                >
                  30 يوم (إنجاز!)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Screen Shake Demo */}
          <Card className="border-red-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                📳 اهتزاز الشاشة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                تأثير الاهتزاز للأحداث المهمة
              </p>
              <Button
                variant="destructive"
                onClick={() => celebration.triggerScreenShake()}
              >
                اهتز الشاشة!
              </Button>
            </CardContent>
          </Card>

          {/* Enhanced Streak Display Demo */}
          <Card className="border-orange-500/30 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <Flame className="w-5 h-5" />
                عرض السلسلة المحسّن
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                عدل عدد الأيام لرؤية التأثيرات المختلفة
              </p>

              {/* Days slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">عدد الأيام: {streakDays}</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setStreakDays(Math.max(0, streakDays - 1))}
                    >
                      -
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setStreakDays(streakDays + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={streakDays}
                  onChange={(e) => setStreakDays(parseInt(e.target.value))}
                  className="w-full accent-orange-500"
                />
              </div>

              {/* Quick presets */}
              <div className="flex flex-wrap gap-2">
                {[0, 3, 7, 14, 30, 60, 100].map((days) => (
                  <Button
                    key={days}
                    size="sm"
                    variant={streakDays === days ? "default" : "outline"}
                    onClick={() => setStreakDays(days)}
                  >
                    {days} يوم
                  </Button>
                ))}
              </div>

              {/* Streak display variants */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">شارة صغيرة</p>
                  <EnhancedStreakDisplay days={streakDays} variant="mini" />
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">شارة</p>
                  <EnhancedStreakDisplay
                    days={streakDays}
                    variant="badge"
                    hasStreakFreeze={streakDays > 5}
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">في خطر</p>
                  <EnhancedStreakDisplay
                    days={streakDays}
                    variant="badge"
                    isAtRisk={true}
                  />
                </div>
              </div>

              {/* Full card */}
              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-2">
                  بطاقة كاملة
                </p>
                <EnhancedStreakDisplay
                  days={streakDays}
                  longestStreak={Math.max(streakDays, 45)}
                  variant="card"
                  hasStreakFreeze={streakDays > 5}
                  streakFreezeCount={2}
                  isAtRisk={streakDays > 0 && streakDays % 7 === 0}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Combined Demo */}
        <Card className="border-gradient-to-r from-purple-500 to-pink-500">
          <CardHeader>
            <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              🎮 محاكاة إنهاء الدرس
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              جرب التجربة الكاملة لإنهاء درس بنجاح (مع الأصوات والاهتزاز)
            </p>
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
              onClick={() => {
                // Simulate completing a lesson
                celebration.incrementCombo();
                celebration.incrementCombo();
                celebration.incrementCombo();

                setTimeout(() => {
                  celebration.showXPGain(150, 1.5);
                }, 500);

                setTimeout(() => {
                  celebration.showStreak(8, false);
                }, 1000);

                setTimeout(() => {
                  celebration.triggerConfetti("celebration");
                }, 1500);

                setTimeout(() => {
                  celebration.showAchievement(
                    "متعلم نشط",
                    "أكملت 10 دروس هذا الأسبوع!",
                    "award",
                    "rare",
                    100
                  );
                }, 2500);
              }}
            >
              <Sparkles className="w-5 h-5 ml-2" />
              أكمل الدرس بنجاح!
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
