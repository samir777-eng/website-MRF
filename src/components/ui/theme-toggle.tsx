"use client";

// Theme toggle component with proper touch target size (44px minimum)
// Updated: Force 44px touch target with inline styles to bypass caching issues
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Inline styles to force 44px touch target (bypasses Tailwind caching issues)
  const buttonStyle: React.CSSProperties = {
    width: "44px",
    height: "44px",
    minWidth: "44px",
    minHeight: "44px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
    padding: 0,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    transition: "all 0.2s ease-out",
  };

  if (!mounted) {
    // Show placeholder that matches the mounted state structure to minimize layout shift
    return (
      <button
        style={buttonStyle}
        className="hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring relative overflow-hidden group"
        aria-label="تبديل المظهر"
        suppressHydrationWarning
      >
        <div className="relative w-5 h-5">
          <Sun className="absolute inset-0 h-5 w-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute inset-0 h-5 w-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
        </div>
        <span className="sr-only">تبديل المظهر</span>
      </button>
    );
  }

  const toggleTheme = () => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  const isDark = resolvedTheme === "dark";

  return (
    <button
      style={buttonStyle}
      onClick={toggleTheme}
      className="hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring relative overflow-hidden group"
      aria-label={
        isDark ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع الداكن"
      }
      title={isDark ? "الوضع النهاري" : "الوضع الليلي"}
    >
      <div className="relative w-5 h-5">
        <Sun className="absolute inset-0 h-5 w-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute inset-0 h-5 w-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
      </div>
      <span className="sr-only">تبديل المظهر</span>
    </button>
  );
}
