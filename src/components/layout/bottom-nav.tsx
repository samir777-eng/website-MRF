"use client";

import { Home, Trophy, User, Video } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HapticManager } from "@/lib/haptics";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  haptic?: "light" | "medium" | "heavy" | "selection";
}

export function BottomNav() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    setMounted(true);
    const user = localStorage.getItem("user");
    setIsAuthenticated(!!user);
  }, []);

  // Navigation items - Max 4 items for optimal mobile UX
  const navItems: NavItem[] = [
    { 
      href: "/ar/dashboard", 
      label: "الرئيسية", 
      icon: Home,
      haptic: "light",
    },
    { 
      href: "/ar/lectures", 
      label: "الدروس", 
      icon: Video,
      haptic: "light",
    },
    { 
      href: "/ar/achievements", 
      label: "التقدم", 
      icon: Trophy,
      haptic: "light",
    },
    { 
      href: "/ar/profile", 
      label: "أنا", 
      icon: User,
      haptic: "light",
    },
  ];

  const isActive = (href: string) => {
    if (href === "/ar/dashboard") {
      return pathname === "/ar/dashboard" || pathname === "/ar";
    }
    return pathname?.startsWith(href);
  };

  // Hide/show bottom nav on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Trigger haptic feedback with proper pattern
  const triggerHaptic = (pattern: "light" | "medium" | "heavy" | "selection" = "light") => {
    HapticManager.trigger(pattern);
  };

  // Don't render for guests or before hydration
  if (!mounted || !isAuthenticated) {
    return null;
  }

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
      dir="rtl"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-x-0 bottom-full h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      <div className="bg-background/95 backdrop-blur-xl border-t border-border/40 shadow-2xl">
        <div className="container mx-auto px-2">
          <div className="flex items-center justify-around h-16">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => triggerHaptic(item.haptic)}
                  className={`flex flex-col items-center justify-center flex-1 py-2 px-2 rounded-xl transition-all duration-200 ${
                    active ? "text-primary scale-105" : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label={item.label}
                  aria-current={active ? "page" : undefined}
                >
                  <div
                    className={`relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200 ${
                      active 
                        ? "bg-primary/10 shadow-lg shadow-primary/20" 
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <Icon className={`w-6 h-6 transition-all ${
                      active ? "text-primary" : "text-current"
                    }`} />
                    {/* Active indicator dot */}
                    {active && (
                      <span className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full" />
                    )}
                  </div>
                  <span className={`text-[11px] mt-1 font-medium transition-all ${
                    active ? "text-primary" : "text-current"
                  }`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Safe area for iOS devices */}
      <div className="pb-safe bg-background/95 backdrop-blur-xl" />
    </nav>
  );
}
