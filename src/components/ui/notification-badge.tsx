"use client";

import { cn } from "@/lib/utils";
import { ArrowLeft, Bell, BookOpen, Trophy, X, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

interface Notification {
  id: string;
  type: "achievement" | "lesson" | "reminder" | "update";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "achievement",
    title: "إنجاز جديد!",
    message: 'لقد حصلت على شارة "المتفوق" بعد إكمال 10 دروس',
    time: "منذ 5 دقائق",
    read: false,
  },
  {
    id: "2",
    type: "lesson",
    title: "درس جديد متاح",
    message: "تم إضافة درس جديد في النحو والصرف",
    time: "منذ ساعة",
    read: false,
  },
  {
    id: "3",
    type: "reminder",
    title: "تذكير",
    message: "لا تنسى مراجعة دروس الأسبوع الماضي",
    time: "منذ 3 ساعات",
    read: true,
  },
];

export function NotificationBadge() {
  const [notifications, setNotifications] =
    useState<Notification[]>(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "achievement":
        return <Trophy className="w-5 h-5 text-amber-500" />;
      case "lesson":
        return <BookOpen className="w-5 h-5 text-blue-500" />;
      case "reminder":
        return <Zap className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9"
          aria-label={
            unreadCount > 0
              ? `الإشعارات (${unreadCount} غير مقروءة)`
              : "الإشعارات"
          }
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-0.5 -end-0.5 h-4 w-4 flex items-center justify-center p-0 text-[10px]"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="bottom"
        sideOffset={8}
        className="w-80 z-[200] shadow-2xl border rounded-xl overflow-hidden backdrop-blur-xl bg-white/95 dark:bg-zinc-900/95"
      >
        <div dir="rtl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <h3 className="font-semibold text-foreground">الإشعارات</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs h-7"
              >
                تعليم الكل كمقروء
              </Button>
            )}
          </div>

          {/* Content */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">لا توجد إشعارات</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    "p-3 cursor-pointer focus:bg-muted",
                    !notification.read && "bg-primary/5"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3 w-full">
                    <div className="flex-shrink-0 mt-0.5">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-sm">
                          {notification.title}
                        </h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 flex-shrink-0 opacity-50 hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            )}
          </div>

          {/* View All Button */}
          <div className="p-2 border-t border-border/50">
            <Link href="/ar/notifications" className="block">
              <Button
                variant="ghost"
                className="w-full justify-center gap-2 text-sm text-primary hover:text-primary hover:bg-primary/10"
              >
                عرض جميع الإشعارات
                <ArrowLeft className="w-4 h-4 rtl:-scale-x-100" />
              </Button>
            </Link>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
