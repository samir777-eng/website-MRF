"use client";

import { cn } from "@/lib/utils";
import {
  Bell,
  BookOpen,
  Calendar,
  HelpCircle,
  Info,
  Megaphone,
  Package,
  Trophy,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

type NotificationType =
  | "achievement"
  | "reminder"
  | "update"
  | "info"
  | "lecture"
  | "package"
  | "qa_response"
  | "announcement";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "lecture",
    title: "محاضرة جديدة!",
    message: "تم إضافة المحاضرة السادسة - النحو المتقدم",
    time: "منذ 10 دقائق",
    read: false,
    link: "/ar/lectures/6",
  },
  {
    id: "2",
    type: "qa_response",
    title: "رد على سؤالك",
    message: "الأستاذ رضا أجاب على سؤالك في ركن الأسئلة",
    time: "منذ 30 دقيقة",
    read: false,
    link: "/ar/corners/questions",
  },
  {
    id: "3",
    type: "package",
    title: "باقة جديدة متاحة!",
    message: "باقة الفصل الدراسي الثاني متاحة الآن بخصم 20%",
    time: "منذ ساعة",
    read: false,
    link: "/ar/store?tab=bundles",
  },
  {
    id: "4",
    type: "announcement",
    title: "إعلان هام",
    message: "موعد امتحان نصف العام: 15 يناير 2025",
    time: "منذ ساعتين",
    read: false,
    link: "/ar/announcements",
  },
  {
    id: "5",
    type: "achievement",
    title: "إنجاز جديد!",
    message: "لقد حصلت على شارة المتفوق",
    time: "منذ 3 ساعات",
    read: true,
    link: "/ar/achievements",
  },
  {
    id: "6",
    type: "reminder",
    title: "تذكير",
    message: "لديك واجب يجب تسليمه غداً",
    time: "منذ 5 ساعات",
    read: true,
    link: "/ar/homework",
  },
];

const typeConfig: Record<
  NotificationType,
  { icon: React.ElementType; bgColor: string; textColor: string }
> = {
  lecture: {
    icon: Video,
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-500",
  },
  package: {
    icon: Package,
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-500",
  },
  qa_response: {
    icon: HelpCircle,
    bgColor: "bg-green-500/10",
    textColor: "text-green-500",
  },
  announcement: {
    icon: Megaphone,
    bgColor: "bg-red-500/10",
    textColor: "text-red-500",
  },
  achievement: {
    icon: Trophy,
    bgColor: "bg-yellow-500/10",
    textColor: "text-yellow-500",
  },
  reminder: {
    icon: Calendar,
    bgColor: "bg-orange-500/10",
    textColor: "text-orange-500",
  },
  update: {
    icon: BookOpen,
    bgColor: "bg-teal-500/10",
    textColor: "text-teal-500",
  },
  info: {
    icon: Info,
    bgColor: "bg-zinc-500/10",
    textColor: "text-zinc-600 dark:text-zinc-400",
  },
};

export function NotificationCenter() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={
            unreadCount > 0
              ? `الإشعارات (${unreadCount} غير مقروءة)`
              : "الإشعارات"
          }
          title="الإشعارات"
        >
          <Bell className="w-5 h-5" aria-hidden="true" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -end-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
              aria-hidden="true"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-2">
          <h3 className="font-semibold">الإشعارات</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-sm"
            >
              تحديد الكل كمقروء
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>لا توجد إشعارات</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const config = typeConfig[notification.type];
              const Icon = config.icon;
              const content = (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-3 p-3 cursor-pointer transition-colors",
                    !notification.read && "bg-primary/5 dark:bg-primary/10",
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                      config.bgColor,
                      config.textColor,
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">
                        {notification.title}
                      </span>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <span className="text-xs text-muted-foreground mt-1 block">
                      {notification.time}
                    </span>
                  </div>
                </DropdownMenuItem>
              );

              if (notification.link) {
                return (
                  <Link key={notification.id} href={notification.link}>
                    {content}
                  </Link>
                );
              }
              return content;
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
