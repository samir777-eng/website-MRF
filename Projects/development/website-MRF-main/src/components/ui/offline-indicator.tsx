"use client";

import { cn } from "@/lib/utils";
import { Wifi, WifiOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowNotification(true);
      // Clear any existing timeout to prevent memory leaks
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => setShowNotification(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
    };

    setIsOnline(navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      // Cleanup timeout on unmount
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!showNotification && isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed top-4 inset-x-4 mx-auto max-w-sm z-50",
        "px-4 py-3 rounded-xl shadow-lg",
        "flex items-center gap-3",
        "transition-all duration-300",
        isOnline
          ? "bg-green-600 text-white dark:bg-green-500"
          : "bg-destructive text-destructive-foreground"
      )}
    >
      {isOnline ? (
        <>
          <Wifi className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">تم الاتصال بالإنترنت</span>
        </>
      ) : (
        <>
          <WifiOff className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">لا يوجد اتصال بالإنترنت</span>
        </>
      )}
    </div>
  );
}
