"use client";

import { cn } from "@/lib/utils";
import { BookOpen, Home, Trophy, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: <Home className="w-6 h-6" />, label: "الرئيسية", href: "/ar" },
  {
    icon: <BookOpen className="w-6 h-6" />,
    label: "الدروس",
    href: "/ar/lectures",
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    label: "الإنجازات",
    href: "/ar/achievements",
  },
  {
    icon: <User className="w-6 h-6" />,
    label: "الملف الشخصي",
    href: "/ar/profile",
  },
];

export function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.icon}
              <span className="text-sm leading-tight font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
