"use client";

import { AvatarDisplay } from "@/components/avatar/AvatarDisplay";
import { SearchTrigger } from "@/components/search/search-trigger";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationCenter } from "@/components/ui/notification-center";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useGamification } from "@/contexts/GamificationContext";
import {
    BarChart3,
    BookOpen,
    ChevronDown,
    Flame,
    Globe,
    GraduationCap,
    LogOut,
    Menu,
    Moon,
    Settings,
    ShoppingBag,
    ShoppingCart,
    Sun,
    Trophy,
    User,
    Users,
    Zap,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

// Mock cart count - in production this would come from context/state
const useCartCount = () => {
  // This would be replaced with actual cart state
  return 2;
};

export function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { userStats } = useGamification();
  const cartCount = useCartCount();

  const currentStreak = userStats?.currentStreak || 0;
  const totalXP = userStats?.totalXP || 0;

  const navigation = [
    { name: t("nav.home"), href: `/${locale}`, icon: BookOpen },
    { name: t("nav.dashboard"), href: `/${locale}/dashboard`, icon: BarChart3 },
    { name: "الدورات", href: `/${locale}/courses`, icon: GraduationCap },
    {
      name: t("nav.achievements"),
      href: `/${locale}/achievements`,
      icon: Trophy,
    },
    { name: t("nav.leaderboard"), href: `/${locale}/leaderboard`, icon: Users },
  ];

  // Additional mobile-only quick links
  const mobileQuickLinks = [
    { name: "المتجر", href: `/${locale}/shop`, icon: ShoppingBag },
    { name: "سلة التسوق", href: `/${locale}/cart`, icon: ShoppingCart },
  ];

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const switchLanguage = (newLocale: string) => {
    const currentPath = pathname.replace(`/${locale}`, "");
    router.push(`/${newLocale}${currentPath}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full glass transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-3 group">
            <div className="relative hover-lift">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
                <span className="text-white font-bold text-lg font-display">
                  ر
                </span>
              </div>
              <div className="absolute -bottom-1 -end-1 w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-sm ring-2 ring-background">
                <span className="text-[8px] text-white font-bold">ف</span>
              </div>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-bold text-base text-foreground leading-tight group-hover:text-primary transition-colors font-display">
                الأستاذ رضا الفاروق
              </span>
              <span className="text-xs text-muted-foreground leading-tight">
                {t("common.arabicTeacher")}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center gap-1"
            aria-label="التنقل الرئيسي"
          >
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 relative group overflow-hidden ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors ${isActive ? "text-primary" : "group-hover:text-primary"}`}
                  />
                  <span>{item.name}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full mb-1" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Search - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-sm">
            <SearchTrigger />
          </div>

          {/* Gamification Stats - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <div
              className="streak-counter shadow-sm hover-lift cursor-help"
              title="Consecutive days learning"
            >
              <Flame className="w-3.5 h-3.5 text-white/90" />
              <span className="text-sm">{currentStreak}</span>
            </div>
            <div
              className="xp-badge shadow-sm hover-lift cursor-help"
              title="Total Experience Points"
            >
              <Zap className="w-3.5 h-3.5 text-white/90" />
              <span className="text-sm">{totalXP.toLocaleString()}</span>
            </div>
          </div>

          {/* Desktop Actions */}
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="إجراءات المستخدم"
          >
            {/* Notifications - Full NotificationCenter */}
            <NotificationCenter />

            {/* Cart */}
            <Link href={`/${locale}/cart`}>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-muted"
                title="سلة التسوق"
                aria-label={`سلة التسوق (${cartCount} عناصر)`}
              >
                <ShoppingCart className="w-5 h-5 text-muted-foreground" />
                {cartCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -end-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Shop */}
            <Link href={`/${locale}/shop`}>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-muted"
                title="المتجر"
              >
                <ShoppingBag className="w-5 h-5 text-muted-foreground" />
              </Button>
            </Link>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hover:bg-muted"
              title={t("ui.toggleTheme")}
            >
              <Sun className="w-5 h-5 text-muted-foreground rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute w-5 h-5 text-muted-foreground rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* Language */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-muted"
                  title={t("ui.changeLanguage")}
                >
                  <Globe className="w-5 h-5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onClick={() => switchLanguage("ar")}
                  className={
                    locale === "ar" ? "bg-violet-50 dark:bg-violet-900/20" : ""
                  }
                >
                  <span className="me-2">🇪🇬</span>
                  العربية
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => switchLanguage("en")}
                  className={
                    locale === "en" ? "bg-violet-50 dark:bg-violet-900/20" : ""
                  }
                >
                  <span className="me-2">🇺🇸</span>
                  English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu with Avatar */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-2 py-1.5 h-auto hover:bg-muted rounded-full"
                >
                  <AvatarDisplay
                    size={32}
                    className="ring-2 ring-border"
                  />
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                {/* User Info Header */}
                <Link href={`/${locale}/profile`}>
                  <div className="px-3 py-3 border-b border-border hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <AvatarDisplay
                        size={44}
                        className="ring-2 ring-primary/20"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          أحمد محمد
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-primary font-medium">
                            المستوى ٧
                          </span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            {totalXP.toLocaleString()} XP
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Learning Section */}
                <div className="py-1">
                  <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                    التعلم
                  </p>
                  <Link href={`/${locale}/profile`}>
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="me-2 h-4 w-4" />
                      <span>ملفي الشخصي</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href={`/${locale}/achievements`}>
                    <DropdownMenuItem className="cursor-pointer">
                      <Trophy className="me-2 h-4 w-4 text-amber-500" />
                      <span>الإنجازات</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href={`/${locale}/orders`}>
                    <DropdownMenuItem className="cursor-pointer">
                      <BarChart3 className="me-2 h-4 w-4" />
                      <span>طلباتي</span>
                    </DropdownMenuItem>
                  </Link>
                </div>

                <DropdownMenuSeparator />

                {/* Commerce Section */}
                <div className="py-1">
                  <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                    الاشتراكات والباقات
                  </p>
                  <Link href={`/${locale}/subscription`}>
                    <DropdownMenuItem className="cursor-pointer">
                      <GraduationCap className="me-2 h-4 w-4 text-violet-500" />
                      <span>اشتراكي</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href={`/${locale}/bundles`}>
                    <DropdownMenuItem className="cursor-pointer">
                      <BookOpen className="me-2 h-4 w-4" />
                      <span>الباقات المتاحة</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href={`/${locale}/purchases`}>
                    <DropdownMenuItem className="cursor-pointer">
                      <ShoppingBag className="me-2 h-4 w-4" />
                      <span>سجل المشتريات</span>
                    </DropdownMenuItem>
                  </Link>
                </div>

                <DropdownMenuSeparator />

                {/* Settings Section */}
                <div className="py-1">
                  <Link href={`/${locale}/settings`}>
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="me-2 h-4 w-4" />
                      <span>{t("nav.settings")}</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href={`/${locale}/help`}>
                    <DropdownMenuItem className="cursor-pointer">
                      <Globe className="me-2 h-4 w-4" />
                      <span>المساعدة</span>
                    </DropdownMenuItem>
                  </Link>
                </div>

                <DropdownMenuSeparator />

                {/* Logout */}
                <div className="py-1">
                  <DropdownMenuItem className="text-red-600 dark:text-red-400 cursor-pointer">
                    <LogOut className="me-2 h-4 w-4" />
                    <span>{t("auth.logout")}</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-1">
            {/* Mobile Stats */}
            <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 dark:bg-orange-900/20 rounded-full">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                {currentStreak}
              </span>
            </div>

            {/* Mobile Cart */}
            <Link href={`/${locale}/cart`}>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10"
                aria-label={`سلة التسوق (${cartCount} عناصر)`}
              >
                <ShoppingCart className="w-5 h-5 text-muted-foreground" />
                {cartCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-0.5 -end-0.5 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <SearchTrigger variant="compact" />

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-muted"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side={locale === "ar" ? "left" : "right"}
                className="w-80 p-0 border-s border-white/10 glass-panel"
              >
                {/* Mobile Menu Header - User Profile */}
                <div className="p-6 bg-gradient-to-br from-primary to-violet-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10"></div>
                  <div className="absolute -bottom-10 -end-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

                  <div className="relative z-10 flex items-center gap-4">
                    <AvatarDisplay
                      size={56}
                      className="ring-4 ring-white/20 shadow-xl"
                    />
                    <div className="flex-1 text-white">
                      <p className="font-bold text-lg font-display">
                        أحمد محمد
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="secondary"
                          className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
                        >
                          المستوى ٧
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center gap-3 mt-6 relative z-10">
                    <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl px-3 py-2.5 text-center border border-white/10 shadow-sm">
                      <div className="flex items-center justify-center gap-1.5">
                        <Flame className="w-4 h-4 text-orange-300 fill-orange-300/20" />
                        <span className="font-bold text-white text-lg">
                          {currentStreak}
                        </span>
                      </div>
                      <p className="text-[10px] text-white/70 font-medium uppercase tracking-wider">
                        يوم
                      </p>
                    </div>
                    <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl px-3 py-2.5 text-center border border-white/10 shadow-sm">
                      <div className="flex items-center justify-center gap-1.5">
                        <Zap className="w-4 h-4 text-emerald-300 fill-emerald-300/20" />
                        <span className="font-bold text-white text-lg">
                          {totalXP.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[10px] text-white/70 font-medium uppercase tracking-wider">
                        XP
                      </p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="p-4 space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-muted"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}

                  {/* Quick Links Section */}
                  <div className="pt-3 mt-3 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-2 px-4">
                      روابط سريعة
                    </p>
                    <div className="flex gap-2 px-4">
                      {mobileQuickLinks.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-muted text-sm font-medium text-foreground hover:bg-muted/80 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{item.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div className="p-4 border-t border-border">
                  <p className="text-xs font-medium text-muted-foreground mb-3 px-2">
                    {t("ui.preferences")}
                  </p>

                  <div className="flex items-center justify-between px-4 py-2">
                    <span className="text-sm text-foreground">
                      {t("ui.theme")}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleTheme}
                      className="gap-2"
                    >
                      {theme === "dark" ? (
                        <>
                          <Moon className="w-4 h-4" />
                          داكن
                        </>
                      ) : (
                        <>
                          <Sun className="w-4 h-4" />
                          فاتح
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between px-4 py-2">
                    <span className="text-sm text-foreground">
                      {t("ui.language")}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant={locale === "ar" ? "default" : "outline"}
                        size="sm"
                        onClick={() => switchLanguage("ar")}
                        className="text-xs px-3"
                      >
                        🇪🇬 عربي
                      </Button>
                      <Button
                        variant={locale === "en" ? "default" : "outline"}
                        size="sm"
                        onClick={() => switchLanguage("en")}
                        className="text-xs px-3"
                      >
                        🇺🇸 EN
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Account Links */}
                <div className="p-4 border-t border-border space-y-1">
                  <Link
                    href={`/${locale}/profile`}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>{t("nav.profile")}</span>
                  </Link>
                  <Link
                    href={`/${locale}/settings`}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    <span>{t("nav.settings")}</span>
                  </Link>
                  <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 w-full">
                    <LogOut className="w-4 h-4" />
                    <span>{t("auth.logout")}</span>
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
