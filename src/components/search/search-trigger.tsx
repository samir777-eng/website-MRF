"use client";

import { Button } from "@/components/ui/button";
import { useSearch } from "@/contexts/SearchContext";
import { SHORTCUTS, useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { cn } from "@/lib/utils";
import { Command, Search } from "lucide-react";
import { useEffect, useState } from "react";

interface SearchTriggerProps {
  variant?: "default" | "compact";
  className?: string;
}

export function SearchTrigger({
  variant = "default",
  className,
}: SearchTriggerProps) {
  const { openSearch } = useSearch();
  const [isMac, setIsMac] = useState(false);

  // Detect if user is on Mac
  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
  }, []);

  // Register Cmd+K / Ctrl+K shortcut
  useKeyboardShortcut(SHORTCUTS.SEARCH, openSearch);

  if (variant === "compact") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={openSearch}
        className={cn("relative", className)}
        aria-label="فتح البحث"
        title="فتح البحث"
      >
        <Search className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={openSearch}
      className={cn(
        "relative w-full sm:w-64 justify-between text-muted-foreground hover:text-foreground",
        className
      )}
      aria-label="فتح البحث"
      title="فتح البحث"
    >
      <div className="flex items-center gap-2">
        <Search className="w-4 h-4" />
        <span className="text-sm">بحث...</span>
      </div>
      <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-sm font-medium opacity-100">
        {isMac ? (
          <>
            <Command className="w-3 h-3" />
            <span>K</span>
          </>
        ) : (
          <>
            <span>Ctrl</span>
            <span>K</span>
          </>
        )}
      </kbd>
    </Button>
  );
}
