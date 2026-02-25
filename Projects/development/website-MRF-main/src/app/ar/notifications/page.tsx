"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Bell,
  BookOpen,
  Check,
  CheckCheck,
  Filter,
  Trash2,
  Trophy,
  Zap,
} from "lucide-react";
import { useState } from "react";

interface Notification {
  id: string;
  type: "achievement" | "lesson" | "reminder" | "update" | "system";
  title: string;
  message: string;
  time: string;
  date: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "achievement",
    title: "إنجاز جديد!",
    message: 'لقد حصلت على شارة "المتفوق" بعد إكمال 10 دروس. استمر في التقدم!',
    time: "منذ 5 دقائق",
    date: "اليوم",
    read: false,
  },
  {
    id: "2",
    type: "lesson",
    title: "درس جديد متاح",
    message:
      "تم إضافة درس جديد في النحو والصرف: أسلوب الاستثناء. ابدأ التعلم الآن!",
    time: "منذ ساعة",
    date: "اليوم",
    read: false,
  },
  {
    id: "3",
    type: "reminder",
    title: "تذكير بالمراجعة",
    message:
      "لا تنسى مراجعة دروس الأسبوع الماضي. المراجعة المنتظمة تساعد على التثبيت.",
    time: "منذ 3 ساعات",
    date: "اليوم",
    read: true,
  },
  {
    id: "4",
    type: "update",
    title: "تحديث جديد",
    message: "تم تحديث المنصة بميزات جديدة. اكتشف التحسينات في لوحة التحكم.",
    time: "منذ يوم",
    date: "أمس",
    read: true,
  },
  {
    id: "5",
    type: "achievement",
    title: "سلسلة 7 أيام!",
    message: "أحسنت! لقد حافظت على سلسلة تعلم لمدة 7 أيام متتالية.",
    time: "منذ يومين",
    date: "أمس",
    read: true,
  },
  {
    id: "6",
    type: "system",
    title: "مرحباً بك!",
    message:
      "مرحباً بك في منصة الأستاذ رضا الفاروق. ابدأ رحلتك التعليمية الآن!",
    time: "منذ أسبوع",
    date: "الأسبوع الماضي",
    read: true,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const groupedNotifications = filteredNotifications.reduce(
    (acc, notification) => {
      const date = notification.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(notification);
      return acc;
    },
    {} as Record<string, Notification[]>,
  );

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const deleteAllRead = () => {
    setNotifications(notifications.filter((n) => !n.read));
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "achievement":
        return <Trophy className="w-5 h-5 text-amber-500" />;
      case "lesson":
        return <BookOpen className="w-5 h-5 text-blue-500" />;
      case "reminder":
        return <Zap className="w-5 h-5 text-orange-500" />;
      case "update":
        return <Bell className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getTypeBadge = (type: Notification["type"]) => {
    const styles = {
      achievement: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      lesson: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      reminder: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
      update: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      system: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
    };
    const labels = {
      achievement: "إنجاز",
      lesson: "درس",
      reminder: "تذكير",
      update: "تحديث",
      system: "نظام",
    };
    return (
      <Badge className={cn("text-[10px]", styles[type])}>{labels[type]}</Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-24">
      <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Bell className="w-6 h-6 text-primary" />
              الإشعارات
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {unreadCount > 0
                ? `${unreadCount} إشعارات غير مقروءة`
                : "لا توجد إشعارات جديدة"}
            </p>
          </div>
        </div>

        {/* Actions Bar */}
        <Card className="border-border/50">
          <CardContent className="p-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              {/* Filter */}
              <div className="flex items-center gap-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("all")}
                  className="text-xs"
                >
                  الكل
                </Button>
                <Button
                  variant={filter === "unread" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("unread")}
                  className="text-xs gap-1"
                >
                  <Filter className="w-3 h-3" />
                  غير مقروءة
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="h-4 px-1 text-[10px]">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </div>

              {/* Bulk Actions */}
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs gap-1"
                  >
                    <CheckCheck className="w-3 h-3" />
                    تعليم الكل كمقروء
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={deleteAllRead}
                  className="text-xs gap-1 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                  حذف المقروءة
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        {Object.keys(groupedNotifications).length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="p-12 text-center">
              <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground">لا توجد إشعارات</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedNotifications).map(([date, items]) => (
              <div key={date} className="space-y-3">
                <h2 className="text-sm font-medium text-muted-foreground px-1">
                  {date}
                </h2>
                <div className="space-y-2">
                  {items.map((notification) => (
                    <Card
                      key={notification.id}
                      className={cn(
                        "border-border/50 transition-all hover:shadow-md cursor-pointer",
                        !notification.read && "bg-primary/5 border-primary/20",
                      )}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          {/* Icon */}
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                              {getIcon(notification.type)}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-sm">
                                  {notification.title}
                                </h3>
                                {getTypeBadge(notification.type)}
                                {!notification.read && (
                                  <div className="w-2 h-2 rounded-full bg-primary" />
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {notification.time}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {notification.message}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex-shrink-0 flex items-start gap-1">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                                aria-label="تحديد كمقروء"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              aria-label="حذف الإشعار"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
