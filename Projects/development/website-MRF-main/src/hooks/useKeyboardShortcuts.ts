"use client";

import { useEffect } from "react";

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  action: () => void;
  description?: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey;
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
        const altMatch = shortcut.alt ? e.altKey : !e.altKey;
        const metaMatch = shortcut.meta ? e.metaKey : !e.metaKey;

        if (
          e.key.toLowerCase() === shortcut.key.toLowerCase() &&
          ctrlMatch &&
          shiftMatch &&
          altMatch &&
          metaMatch
        ) {
          e.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}

export const COMMON_SHORTCUTS = {
  SEARCH: { key: "k", ctrl: true, description: "فتح البحث" },
  ESCAPE: { key: "Escape", description: "إغلاق" },
  ENTER: { key: "Enter", description: "تأكيد" },
  HELP: { key: "?", shift: true, description: "عرض المساعدة" },
  ARROW_UP: { key: "ArrowUp", description: "للأعلى" },
  ARROW_DOWN: { key: "ArrowDown", description: "للأسفل" },
  ARROW_LEFT: { key: "ArrowLeft", description: "لليسار" },
  ARROW_RIGHT: { key: "ArrowRight", description: "لليمين" },
};

