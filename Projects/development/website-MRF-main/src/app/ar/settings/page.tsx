"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { SettingsSkeleton } from "@/components/loading/skeletons/SettingsSkeleton";
import { useToast } from "@/hooks/useToast";
import {
  ArrowLeft,
  Bell,
  Eye,
  Globe,
  Lock,
  Moon,
  Save,
  Settings,
  Shield,
  Sun,
  Volume2,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    quizReminders: true,
    streakReminders: true,
    soundEffects: true,
    profileVisibility: true,
    showProgress: true,
    showOnLeaderboard: true,
    twoFactor: false,
    fontSize: "medium",
    language: "ar",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = () => {
    toast({
      title: "تم الحفظ",
      description: "تم حفظ الإعدادات بنجاح",
    });
  };

  if (!mounted) {
    return <SettingsSkeleton />;
  }

  return (
    <div
     
      className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background pb-24"
    >
      <div className="container mx-auto px-4 py-6 max-w-3xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/ar/profile">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5 rtl:-scale-x-100" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Settings className="w-6 h-6" />
              الإعدادات
            </h1>
            <p className="text-sm text-muted-foreground">
              إدارة إعدادات حسابك والتطبيق
            </p>
          </div>
        </div>

        {/* Notifications */}
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-5">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-blue-500" />
              الإشعارات
            </h2>
            <div className="space-y-4">
              <SettingRow
                label="إشعارات البريد الإلكتروني"
                description="تلقي إشعارات عبر البريد الإلكتروني"
                checked={settings.emailNotifications}
                onChange={(checked) =>
                  setSettings({ ...settings, emailNotifications: checked })
                }
              />
              <SettingRow
                label="الإشعارات الفورية"
                description="تلقي إشعارات فورية على الجهاز"
                checked={settings.pushNotifications}
                onChange={(checked) =>
                  setSettings({ ...settings, pushNotifications: checked })
                }
              />
              <SettingRow
                label="تذكير بالاختبارات"
                description="تذكيرات قبل موعد الاختبارات"
                checked={settings.quizReminders}
                onChange={(checked) =>
                  setSettings({ ...settings, quizReminders: checked })
                }
              />
              <SettingRow
                label="تذكير السلسلة"
                description="تذكير يومي للحفاظ على سلسلتك"
                checked={settings.streakReminders}
                onChange={(checked) =>
                  setSettings({ ...settings, streakReminders: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Sound */}
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-5">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
              <Volume2 className="w-5 h-5 text-purple-500" />
              الصوت
            </h2>
            <SettingRow
              label="المؤثرات الصوتية"
              description="تشغيل الأصوات عند الإجابة والإنجازات"
              checked={settings.soundEffects}
              onChange={(checked) =>
                setSettings({ ...settings, soundEffects: checked })
              }
            />
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-5">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-emerald-500" />
              الخصوصية
            </h2>
            <div className="space-y-4">
              <SettingRow
                label="إظهار الملف الشخصي"
                description="السماح للآخرين برؤية ملفك الشخصي"
                checked={settings.profileVisibility}
                onChange={(checked) =>
                  setSettings({ ...settings, profileVisibility: checked })
                }
              />
              <SettingRow
                label="إظهار التقدم"
                description="عرض تقدمك للمعلم وأولياء الأمور"
                checked={settings.showProgress}
                onChange={(checked) =>
                  setSettings({ ...settings, showProgress: checked })
                }
              />
              <SettingRow
                label="الظهور في لوحة المتصدرين"
                description="عرض اسمك في ترتيب المتصدرين"
                checked={settings.showOnLeaderboard}
                onChange={(checked) =>
                  setSettings({ ...settings, showOnLeaderboard: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-5">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-red-500" />
              الأمان
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <Label className="text-foreground">كلمة المرور</Label>
                  <p className="text-sm text-muted-foreground">
                    آخر تغيير منذ 30 يوماً
                  </p>
                </div>
                <Button variant="outline" size="sm" className="shrink-0">
                  تغيير
                </Button>
              </div>
              <SettingRow
                label="المصادقة الثنائية"
                description="حماية إضافية لحسابك"
                checked={settings.twoFactor}
                onChange={(checked) =>
                  setSettings({ ...settings, twoFactor: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-5">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-amber-500" />
              المظهر
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <Label className="text-foreground">وضع العرض</Label>
                  <p className="text-sm text-muted-foreground">
                    اختر بين الوضع الفاتح والداكن
                  </p>
                </div>
                <div className="flex items-center gap-1 p-1 rounded-lg bg-muted shrink-0">
                  <button
                    onClick={() => setTheme("light")}
                    className={`p-2 rounded-md transition-colors ${theme === "light" ? "bg-background shadow" : ""}`}
                  >
                    <Sun className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`p-2 rounded-md transition-colors ${theme === "dark" ? "bg-background shadow" : ""}`}
                  >
                    <Moon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <Label className="text-foreground">حجم الخط</Label>
                  <p className="text-sm text-muted-foreground">
                    تكبير أو تصغير حجم الخط
                  </p>
                </div>
                <Select
                  value={settings.fontSize}
                  onValueChange={(value) =>
                    setSettings({ ...settings, fontSize: value })
                  }
                >
                  <SelectTrigger className="w-28 shrink-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">صغير</SelectItem>
                    <SelectItem value="medium">متوسط</SelectItem>
                    <SelectItem value="large">كبير</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language */}
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-5">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-cyan-500" />
              اللغة
            </h2>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <Label className="text-foreground">لغة التطبيق</Label>
                <p className="text-sm text-muted-foreground">
                  اختر لغة واجهة التطبيق
                </p>
              </div>
              <Select
                value={settings.language}
                onValueChange={(value) =>
                  setSettings({ ...settings, language: value })
                }
              >
                <SelectTrigger className="w-28 shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button onClick={handleSave} className="w-full gap-2" size="lg">
          <Save className="w-5 h-5" />
          حفظ التغييرات
        </Button>
      </div>
    </div>
  );
}

// Setting Row Component
function SettingRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <Label className="text-foreground">{label}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        className="shrink-0"
      />
    </div>
  );
}
