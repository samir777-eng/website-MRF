"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./dialog";
import { Keyboard } from "lucide-react";

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

const shortcuts: Shortcut[] = [
  { keys: ["Ctrl", "K"], description: "فتح البحث", category: "عام" },
  { keys: ["Esc"], description: "إغلاق النافذة", category: "عام" },
  { keys: ["Shift", "?"], description: "عرض الاختصارات", category: "عام" },
  { keys: ["Enter"], description: "تأكيد/إرسال", category: "عام" },
  { keys: ["↑", "↓"], description: "التنقل في القوائم", category: "تنقل" },
  { keys: ["←", "→"], description: "التنقل بين الصفحات", category: "تنقل" },
  { keys: ["Tab"], description: "الانتقال للعنصر التالي", category: "تنقل" },
  { keys: ["Shift", "Tab"], description: "الانتقال للعنصر السابق", category: "تنقل" },
];

export function KeyboardShortcutsModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === "?") {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const categories = Array.from(new Set(shortcuts.map((s) => s.category)));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            اختصارات لوحة المفاتيح
          </DialogTitle>
          <DialogDescription>
            استخدم هذه الاختصارات للتنقل بشكل أسرع في المنصة
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                {category}
              </h3>
              <div className="space-y-2">
                {shortcuts
                  .filter((s) => s.category === category)
                  .map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50"
                    >
                      <span className="text-sm">{shortcut.description}</span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, i) => (
                          <span key={i} className="flex items-center gap-1">
                            <kbd className="px-2 py-1 text-sm font-semibold bg-muted border border-border rounded">
                              {key}
                            </kbd>
                            {i < shortcut.keys.length - 1 && (
                              <span className="text-muted-foreground">+</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

