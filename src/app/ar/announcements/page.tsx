"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertCircle,
  Bell,
  BookOpen,
  Calendar,
  Clock,
  Gift,
  Info,
  Megaphone,
  Star,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { useState } from "react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  type:
    | "update"
    | "feature"
    | "event"
    | "maintenance"
    | "achievement"
    | "content";
  priority: "low" | "medium" | "high" | "urgent";
  date: Date;
  author: string;
  isNew: boolean;
  isPinned: boolean;
}

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "1",
    title: "إطلاق نظام التعلم التكيفي الذكي!",
    content:
      "يسعدنا الإعلان عن إطلاق نظام التعلم التكيفي الجديد الذي يستخدم الذكاء الاصطناعي لتخصيص تجربة التعلم لكل طالب بناءً على أدائه وأسلوب تعلمه. النظام يقدم توصيات مخصصة ويعدل مستوى الصعوبة تلقائياً لضمان أفضل النتائج.",
    type: "feature",
    priority: "high",
    date: new Date("2024-12-15"),
    author: "فريق التطوير",
    isNew: true,
    isPinned: true,
  },
  {
    id: "2",
    title: "محتوى جديد: دروس البلاغة المتقدمة",
    content:
      "تم إضافة 15 درساً جديداً في البلاغة تغطي الاستعارة المكنية والتصريحية، الكناية، والمجاز المرسل. جميع الدروس تتضمن فيديوهات شرح تفصيلية وتمارين تفاعلية.",
    type: "content",
    priority: "medium",
    date: new Date("2024-12-10"),
    author: "الأستاذ رضا الفاروق",
    isNew: true,
    isPinned: false,
  },
  {
    id: "3",
    title: "مسابقة الطالب المتميز - جوائز قيمة!",
    content:
      "انضم إلى مسابقة الطالب المتميز لهذا الشهر! أكمل 20 درساً واحصل على 90% أو أكثر في الاختبارات للفوز بجوائز قيمة تشمل اشتراكات مجانية وشهادات تقدير.",
    type: "event",
    priority: "high",
    date: new Date("2024-12-08"),
    author: "إدارة المنصة",
    isNew: false,
    isPinned: true,
  },
  {
    id: "4",
    title: "صيانة دورية للمنصة",
    content:
      "سيتم إجراء صيانة دورية للمنصة يوم الجمعة 20 ديسمبر من الساعة 2 صباحاً حتى 4 صباحاً. قد تواجه انقطاعاً مؤقتاً في الخدمة خلال هذه الفترة. نعتذر عن أي إزعاج.",
    type: "maintenance",
    priority: "medium",
    date: new Date("2024-12-05"),
    author: "الدعم الفني",
    isNew: false,
    isPinned: false,
  },
  {
    id: "5",
    title: "تحديث: تحسينات في نظام المراجعة الذكية",
    content:
      "تم تحسين خوارزمية المراجعة الذكية لتوفير جدولة أكثر دقة للمراجعات. الآن يمكنك مراجعة المحتوى في الأوقات المثالية لتحقيق أفضل احتفاظ بالمعلومات.",
    type: "update",
    priority: "low",
    date: new Date("2024-12-01"),
    author: "فريق التطوير",
    isNew: false,
    isPinned: false,
  },
  {
    id: "6",
    title: "إنجاز رائع: 10,000 طالب على المنصة!",
    content:
      "نحتفل اليوم بوصولنا إلى 10,000 طالب مسجل على المنصة! شكراً لثقتكم ودعمكم المستمر. نعدكم بمواصلة تقديم أفضل تجربة تعليمية.",
    type: "achievement",
    priority: "medium",
    date: new Date("2024-11-28"),
    author: "إدارة المنصة",
    isNew: false,
    isPinned: false,
  },
  {
    id: "7",
    title: "امتحانات تجريبية للفصل الدراسي الأول",
    content:
      "تم إضافة 5 امتحانات تجريبية شاملة للفصل الدراسي الأول. الامتحانات تحاكي امتحانات الثانوية العامة الفعلية وتتضمن تصحيحاً تلقائياً وتحليلاً مفصلاً للأداء.",
    type: "content",
    priority: "high",
    date: new Date("2024-11-25"),
    author: "الأستاذ رضا الفاروق",
    isNew: false,
    isPinned: false,
  },
];

export default function AnnouncementsPage() {
  const [announcements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [filter, setFilter] = useState<string>("all");

  const filteredAnnouncements = announcements.filter((announcement) => {
    if (filter === "all") return true;
    return announcement.type === filter;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "update":
        return <TrendingUp className="w-5 h-5" />;
      case "feature":
        return <Star className="w-5 h-5" />;
      case "event":
        return <Calendar className="w-5 h-5" />;
      case "maintenance":
        return <AlertCircle className="w-5 h-5" />;
      case "achievement":
        return <Trophy className="w-5 h-5" />;
      case "content":
        return <BookOpen className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "update":
        return "from-blue-500 to-indigo-600";
      case "feature":
        return "from-purple-500 to-pink-600";
      case "event":
        return "from-green-500 to-emerald-600";
      case "maintenance":
        return "from-orange-500 to-red-600";
      case "achievement":
        return "from-yellow-500 to-orange-500";
      case "content":
        return "from-cyan-500 to-blue-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "update":
        return "تحديث";
      case "feature":
        return "ميزة جديدة";
      case "event":
        return "حدث";
      case "maintenance":
        return "صيانة";
      case "achievement":
        return "إنجاز";
      case "content":
        return "محتوى جديد";
      default:
        return "إعلان";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-950/30 dark:text-orange-400";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-400";
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400";
      default:
        return "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400";
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "اليوم";
    if (diffDays === 1) return "أمس";
    if (diffDays < 7) return `منذ ${diffDays} أيام`;
    if (diffDays < 30) return `منذ ${Math.floor(diffDays / 7)} أسابيع`;
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen page-bg-blue" dir="rtl">
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Megaphone className="w-12 h-12 text-blue-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              الإعلانات والتحديثات
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            ابقَ على اطلاع بآخر التحديثات والمحتوى الجديد والأحداث المهمة
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <CardContent className="p-6 text-center">
              <Bell className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{announcements.length}</div>
              <div className="text-sm text-blue-100">إعلان</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {announcements.filter((a) => a.isNew).length}
              </div>
              <div className="text-sm text-green-100">جديد</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white">
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {announcements.filter((a) => a.isPinned).length}
              </div>
              <div className="text-sm text-purple-100">مثبت</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-600 text-white">
            <CardContent className="p-6 text-center">
              <Gift className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {announcements.filter((a) => a.type === "event").length}
              </div>
              <div className="text-sm text-orange-100">حدث</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                الكل ({announcements.length})
              </Button>
              <Button
                variant={filter === "feature" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("feature")}
              >
                <Star className="w-4 h-4 mr-2" />
                ميزات جديدة
              </Button>
              <Button
                variant={filter === "content" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("content")}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                محتوى جديد
              </Button>
              <Button
                variant={filter === "event" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("event")}
              >
                <Calendar className="w-4 h-4 mr-2" />
                أحداث
              </Button>
              <Button
                variant={filter === "update" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("update")}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                تحديثات
              </Button>
              <Button
                variant={filter === "achievement" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("achievement")}
              >
                <Trophy className="w-4 h-4 mr-2" />
                إنجازات
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Announcements List */}
        <div className="space-y-6">
          {filteredAnnouncements.map((announcement) => (
            <Card
              key={announcement.id}
              className={`border-0 shadow-xl hover:shadow-2xl transition-all duration-200 ${
                announcement.isPinned ? "ring-2 ring-yellow-500" : ""
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br ${getTypeColor(announcement.type)} rounded-full flex items-center justify-center text-white`}
                  >
                    {getTypeIcon(announcement.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {announcement.isPinned && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              <Zap className="w-3 h-3 mr-1" />
                              مثبت
                            </Badge>
                          )}
                          {announcement.isNew && (
                            <Badge className="bg-green-100 text-green-800">
                              جديد
                            </Badge>
                          )}
                          <Badge variant="outline">
                            {getTypeLabel(announcement.type)}
                          </Badge>
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-2">
                          {announcement.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {announcement.content}
                    </p>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDate(announcement.date)}
                        </span>
                        <span>بواسطة {announcement.author}</span>
                      </div>

                      {announcement.priority === "high" ||
                      announcement.priority === "urgent" ? (
                        <Badge
                          className={getPriorityColor(announcement.priority)}
                        >
                          {announcement.priority === "urgent" ? "عاجل" : "مهم"}
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredAnnouncements.length === 0 && (
          <Card className="border-0 shadow-xl">
            <CardContent className="p-12 text-center">
              <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-bold text-foreground mb-2">
                لا توجد إعلانات
              </h3>
              <p className="text-muted-foreground">
                لا توجد إعلانات في هذه الفئة حالياً
              </p>
            </CardContent>
          </Card>
        )}

        {/* Subscribe to Notifications */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <CardContent className="p-8 text-center">
            <Bell className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <h3 className="text-2xl font-bold text-foreground mb-3">
              لا تفوت أي تحديث!
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              فعّل الإشعارات لتصلك آخر الأخبار والتحديثات والمحتوى الجديد فور
              نشره
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              <Bell className="w-5 h-5 mr-2" />
              تفعيل الإشعارات
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
