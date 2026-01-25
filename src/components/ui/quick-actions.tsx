"use client";

import { cn } from "@/lib/utils";
import { BookOpen, FileText, Plus, Video, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const actions = [
  {
    icon: BookOpen,
    label: "تصفح الدروس",
    color: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
    href: "/ar/lectures",
  },
  {
    icon: Video,
    label: "المحاضرات",
    color:
      "bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600",
    href: "/ar/lectures",
  },
  {
    icon: FileText,
    label: "التحديات",
    color:
      "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600",
    href: "/ar/challenges",
  },
];

export function QuickActions() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <nav
      className="fixed bottom-6 start-6 z-50"
      aria-label="إجراءات سريعة"
    >
      {/* Action Buttons */}
      <div
        className={cn(
          "flex flex-col gap-3 mb-3 transition-all duration-300",
          open
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        )}
        role="menu"
        aria-hidden={!open}
      >
        {actions.map((action, index) => (
          <button
            key={action.href}
            onClick={() => {
              router.push(action.href);
              setOpen(false);
            }}
            role="menuitem"
            tabIndex={open ? 0 : -1}
            className={cn(
              action.color,
              "text-white h-11 px-4 rounded-full shadow-lg flex items-center gap-2.5 transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
            style={{
              transitionDelay: open ? `${index * 50}ms` : "0ms",
            }}
          >
            <action.icon className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span className="text-sm font-semibold whitespace-nowrap">
              {action.label}
            </span>
          </button>
        ))}
      </div>

      {/* Main Button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          open
            ? "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500"
            : "bg-primary hover:bg-primary/90"
        )}
        aria-label={open ? "إغلاق القائمة السريعة" : "فتح القائمة السريعة"}
        aria-expanded={open}
        aria-controls="quick-actions-menu"
        aria-haspopup="menu"
      >
        <span
          className={cn(
            "transition-transform duration-200",
            open && "rotate-45"
          )}
        >
          {open ? (
            <X className="w-6 h-6 text-white" aria-hidden="true" />
          ) : (
            <Plus className="w-6 h-6 text-white" aria-hidden="true" />
          )}
        </span>
      </button>
    </nav>
  );
}
