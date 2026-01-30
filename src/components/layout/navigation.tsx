"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationBadge } from "@/components/ui/notification-badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Award,
  ChevronDown,
  LayoutDashboard,
  LogIn,
  LogOut,
  Medal,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Trophy,
  User,
  UserPlus,
  Video,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";

export function Navigation() {
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  // Handle mounting and auth check
  useEffect(() => {
    setMounted(true);
    const user = localStorage.getItem("user");
    setIsAuthenticated(!!user);
  }, []);

  // Close mobile menu on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Mobile menu focus management
  const previousIsMenuOpenRef = useRef(isMenuOpen);
  useEffect(() => {
    const wasOpen = previousIsMenuOpenRef.current;
    previousIsMenuOpenRef.current = isMenuOpen;

    if (isMenuOpen && mobileMenuRef.current) {
      // Focus the first link in the mobile menu when it opens
      const firstLink = mobileMenuRef.current.querySelector<HTMLElement>(
        "a, button"
      );
      if (firstLink) {
        firstLink.focus();
      }
    } else if (wasOpen && !isMenuOpen && menuButtonRef.current) {
      // Return focus to the hamburger button only when menu actually closes
      menuButtonRef.current.focus();
    }
  }, [isMenuOpen]);

  const isActive = (href: string) => {
    if (href === "/ar") return pathname === "/ar";
    if (href === "/ar/dashboard")
      return pathname === "/ar/dashboard" || pathname === "/ar";
    return pathname?.startsWith(href);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    window.location.href = "/ar";
  };

  // Navigation items based on auth state
  const authNavItems = [
    { href: "/ar/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
    { href: "/ar/lectures", label: "المحاضرات", icon: Video },
    { href: "/ar/store", label: "المتجر", icon: ShoppingBag },
  ];

  const accountMenuItems = [
    { href: "/ar/achievements", label: "الإنجازات", icon: Trophy },
    { href: "/ar/leaderboard", label: "المتصدرون", icon: Medal },
    { href: "/ar/orders", label: "طلباتي", icon: Package },
    { href: "/ar/profile", label: "الملف الشخصي", icon: User },
    { href: "/ar/settings", label: "الإعدادات", icon: Settings },
  ];

  return (
    <nav
      ref={navRef}
      className="fixed top-0 inset-x-0 z-[9999] w-full glass transition-all duration-300 border-b-0 overflow-visible"
    >
      <div
        className="container mx-auto px-4 overflow-visible"
        style={{ overflow: "visible" }}
      >
        <div
          className="flex h-16 items-center justify-between overflow-visible"
          style={{ overflow: "visible" }}
        >
          {/* Logo - Always link to /ar, dashboard redirect handled by page */}
          <Link href="/ar" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-lg">ر</span>
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:block">
              رضا الفاروق
            </span>
          </Link>

          {/* Desktop Navigation - Only show for authenticated users after mount */}
          <div
            className="hidden md:flex items-center gap-1"
            suppressHydrationWarning
          >
            {mounted && isAuthenticated && (
              <>
                {authNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                        active
                          ? "bg-gradient-primary text-white shadow-glow-sm"
                          : "text-muted-foreground hover:text-primary hover:bg-white/5"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </>
            )}
          </div>

          {/* Right Side - Auth buttons with hydration suppression */}
          <div
            className="flex items-center gap-1 overflow-visible"
            style={{ overflow: "visible" }}
            suppressHydrationWarning
          >
            {/* Auth-dependent content - wrapped to suppress hydration warnings */}
            <div
              className="flex items-center gap-1"
              suppressHydrationWarning
            >
              {!mounted ? (
                // Skeleton placeholder during SSR/hydration
                <>
                  <div className="h-11 w-16 rounded-lg bg-muted/30 animate-pulse" />
                  <div className="h-11 w-24 rounded-lg bg-muted/30 animate-pulse" />
                </>
              ) : isAuthenticated ? (
                // Authenticated user content
                <>
                  {/* Cart */}
                  <Link href="/ar/cart">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative h-9 w-9"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </Link>

                  {/* Notifications */}
                  <NotificationBadge />

                  {/* Account Dropdown — Radix UI for proper a11y */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="group flex items-center gap-1 px-2"
                      >
                        <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center">
                          <User className="w-3.5 h-3.5 text-white" />
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 transition-transform data-[state=open]:rotate-180" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="start" className="w-56">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-border">
                        <p className="font-medium text-foreground">
                          أحمد محمد
                        </p>
                        <p className="text-xs text-muted-foreground">
                          الصف الثالث الثانوي
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            <Award className="w-3 h-3 ms-1" />
                            المستوى 12
                          </Badge>
                        </div>
                      </div>

                      {/* Menu Items */}
                      {accountMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <DropdownMenuItem key={item.href} asChild>
                            <Link
                              href={item.href}
                              className="flex items-center gap-3 cursor-pointer"
                            >
                              <Icon className="w-4 h-4 text-muted-foreground" />
                              {item.label}
                            </Link>
                          </DropdownMenuItem>
                        );
                      })}

                      {/* Logout */}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        تسجيل الخروج
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Mobile Menu Button */}
                  <Button
                    ref={menuButtonRef}
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={toggleMenu}
                    aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
                    aria-expanded={isMenuOpen}
                    aria-controls="mobile-menu"
                  >
                    {isMenuOpen ? (
                      <X className="w-5 h-5" />
                    ) : (
                      <Menu className="w-5 h-5" />
                    )}
                  </Button>
                </>
              ) : (
                // Guest content - Login/Signup buttons
                <>
                  {/* Dev: Quick login for testing */}
                  {process.env.NODE_ENV === "development" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs border-dashed hidden sm:flex"
                      onClick={() => {
                        localStorage.setItem(
                          "user",
                          JSON.stringify({ id: 1, name: "أحمد" })
                        );
                        window.location.reload();
                      }}
                    >
                      Dev Login
                    </Button>
                  )}
                  {/* Guest: Login/Signup */}
                  <Link href="/ar/auth/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 text-sm"
                    >
                      <LogIn className="w-4 h-4" />
                      دخول
                    </Button>
                  </Link>
                  <Link href="/ar/signup">
                    <Button
                      size="sm"
                      className="gap-1.5 text-sm bg-gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-105"
                    >
                      <UserPlus className="w-4 h-4" />
                      حساب جديد
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Theme Toggle - Always render consistently */}
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Menu - Only show after mount and when authenticated */}
        {mounted && isMenuOpen && isAuthenticated && (
          <nav
            id="mobile-menu"
            ref={mobileMenuRef}
            aria-label="القائمة الرئيسية"
            className="md:hidden border-t border-border py-4 space-y-2"
          >
            <ul className="space-y-2">
              {authNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                        active
                          ? "bg-gradient-primary text-white shadow-glow-sm"
                          : "text-muted-foreground hover:text-primary hover:bg-white/5"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-border my-2" />
            <ul className="space-y-2">
              {accountMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-500 hover:bg-red-500/10 w-full transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  تسجيل الخروج
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </nav>
  );
}
