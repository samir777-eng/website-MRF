"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ProfileSkeleton } from "@/components/loading/ProfileSkeleton";
import { useGamification } from "@/contexts/GamificationContext";
import { useToast } from "@/hooks/useToast";
import {
  Award,
  BookOpen,
  Calendar,
  Camera,
  Edit,
  Flame,
  GraduationCap,
  Medal,
  Save,
  Settings,
  Star,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// Mock achievements
const recentAchievements = [
  { id: 1, title: "المتفوق", icon: "🏆", date: "منذ يومين" },
  { id: 2, title: "7 أيام متتالية", icon: "🔥", date: "منذ 3 أيام" },
  { id: 3, title: "أول اختبار", icon: "📝", date: "منذ أسبوع" },
];

export default function ProfileClient() {
  const { toast } = useToast();
  const { userStats } = useGamification();
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "أحمد محمد",
    email: "ahmed@example.com",
    phone: "01234567890",
    bio: "طالب في الصف الثالث الثانوي، أحب اللغة العربية والأدب",
    grade: "الصف الثالث الثانوي",
    joinDate: "سبتمبر 2024",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentLevel = userStats?.level || 1;
  const totalXP = userStats?.totalXP || 0;
  const currentStreak = userStats?.currentStreak || 0;
  const levelProgress = ((totalXP % 1000) / 1000) * 100;

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "تم الحفظ",
      description: "تم حفظ التغييرات بنجاح",
    });
  };

  if (!mounted) {
    return <ProfileSkeleton />;
  }

  return (
    <div
     
      className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background pb-24"
    >
      <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
        {/* Profile Header */}
        <Card className="border-0 bg-gradient-to-br from-indigo-500 to-purple-600 text-white overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold border-4 border-white/30">
                  {profileData.name.charAt(0)}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    toast({
                      title: "قريباً",
                      description: "سيتم إضافة هذه الميزة قريباً",
                    })
                  }
                  className="absolute bottom-0 start-0 w-8 h-8 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-end">
                <h1 className="text-2xl font-bold mb-1">{profileData.name}</h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-white/80 text-sm">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" />
                    {profileData.grade}
                  </span>
                  <span className="hidden md:inline">•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    انضم في {profileData.joinDate}
                  </span>
                </div>
                <p className="text-white/70 text-sm mt-2 max-w-md">
                  {profileData.bio}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="bg-white/20 hover:bg-white/30 text-white border-0"
                >
                  <Edit className="w-4 h-4 ms-1" />
                  تعديل
                </Button>
                <Link href="/ar/settings">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-0"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-indigo-500/10 flex items-center justify-center mb-2">
                <Star className="w-5 h-5 text-indigo-500" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {currentLevel}
              </p>
              <p className="text-xs text-muted-foreground">المستوى</p>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center mb-2">
                <Zap className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {totalXP.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">نقاط XP</p>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-orange-500/10 flex items-center justify-center mb-2">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {currentStreak}
              </p>
              <p className="text-xs text-muted-foreground">يوم متتالي</p>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-amber-500/10 flex items-center justify-center mb-2">
                <Trophy className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-2xl font-bold text-foreground">12</p>
              <p className="text-xs text-muted-foreground">إنجاز</p>
            </CardContent>
          </Card>
        </div>

        {/* Level Progress */}
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground flex items-center gap-2">
                <Medal className="w-4 h-4 text-indigo-500" />
                التقدم للمستوى {currentLevel + 1}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(levelProgress)}%
              </span>
            </div>
            <Progress value={levelProgress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {1000 - (totalXP % 1000)} XP متبقية للمستوى التالي
            </p>
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                آخر الإنجازات
              </h2>
              <Link href="/ar/achievements">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  عرض الكل
                </Button>
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {recentAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex-shrink-0 w-28 text-center p-3 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20"
                >
                  <span className="text-3xl block mb-2">
                    {achievement.icon}
                  </span>
                  <p className="text-xs font-medium text-foreground line-clamp-1">
                    {achievement.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {achievement.date}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Learning Stats */}
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-5">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-blue-500" />
              إحصائيات التعلم
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-foreground">24</p>
                <p className="text-xs text-muted-foreground">درس مكتمل</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-foreground">156</p>
                <p className="text-xs text-muted-foreground">سؤال محلول</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-foreground">8</p>
                <p className="text-xs text-muted-foreground">اختبار</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-foreground">85%</p>
                <p className="text-xs text-muted-foreground">متوسط الدرجات</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Modal/Card */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <Card className="w-full max-w-lg border-border bg-background shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">تعديل الملف الشخصي</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="name">الاسم</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          phone: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">نبذة عني</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData({ ...profileData, bio: e.target.value })
                      }
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSave} className="flex-1 gap-2">
                      <Save className="w-4 h-4" />
                      حفظ
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="flex-1"
                    >
                      إلغاء
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
