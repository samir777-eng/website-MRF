"use client";

import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import {
  Award,
  BookOpen,
  Clock,
  FileQuestion,
  Search,
  Video,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent } from "./dialog";
import { Input } from "./input";

interface SearchResult {
  id: string;
  title: string;
  type: "lesson" | "quiz" | "lecture" | "achievement";
  description?: string;
  url: string;
}

const MOCK_RESULTS: SearchResult[] = [
  {
    id: "1",
    title: "النحو - الجملة الاسمية",
    type: "lesson",
    description: "الصف الأول الثانوي",
    url: "/ar/lectures/1",
  },
  {
    id: "2",
    title: "اختبار النحو",
    type: "quiz",
    description: "10 أسئلة",
    url: "/ar/challenges/1",
  },
  {
    id: "3",
    title: "محاضرة البلاغة",
    type: "lesson",
    description: "فيديو - 45 دقيقة",
    url: "/ar/lectures/1",
  },
];

const typeIcons = {
  lesson: BookOpen,
  quiz: FileQuestion,
  lecture: Video,
  achievement: Award,
};

export function GlobalSearch() {
  const isMounted = useMounted();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Load recent searches only after mount to prevent hydration mismatch
  useEffect(() => {
    if (isOpen && isMounted) {
      inputRef.current?.focus();
      const recent = JSON.parse(localStorage.getItem("recentSearches") || "[]");
      setRecentSearches(recent);
    }
  }, [isOpen, isMounted]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    // Simple fuzzy search
    const filtered = MOCK_RESULTS.filter(
      (result) =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description?.toLowerCase().includes(query.toLowerCase()),
    );

    setResults(filtered);
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    // Save to recent searches
    const recent = [query, ...recentSearches.filter((s) => s !== query)].slice(
      0,
      5,
    );
    localStorage.setItem("recentSearches", JSON.stringify(recent));

    window.location.href = result.url;
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      handleSelect(results[selectedIndex]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl p-0" dir="rtl">
        <div className="flex items-center gap-3 p-4 border-b">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ابحث عن دروس، اختبارات، مواد..."
            className="border-0 focus-visible:ring-0 text-lg"
          />
          <kbd className="hidden sm:inline-block px-2 py-1 text-sm bg-muted rounded">
            Esc
          </kbd>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-2">
          {!query && recentSearches.length > 0 && (
            <div className="p-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Clock className="w-4 h-4" />
                <span>عمليات البحث الأخيرة</span>
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(search)}
                  className="w-full text-right p-2 hover:bg-muted rounded text-sm"
                >
                  {search}
                </button>
              ))}
            </div>
          )}

          {results.length > 0 ? (
            <div className="space-y-1">
              {results.map((result, index) => {
                const Icon = typeIcons[result.type];
                return (
                  <button
                    key={result.id}
                    onClick={() => handleSelect(result)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg text-right transition-colors",
                      index === selectedIndex
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted",
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{result.title}</div>
                      {result.description && (
                        <div className="text-sm text-muted-foreground truncate">
                          {result.description}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : query ? (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد نتائج
            </div>
          ) : null}
        </div>

        <div className="border-t p-3 text-sm text-muted-foreground flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-muted rounded">↓</kbd>
              للتنقل
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded">Enter</kbd>
              للاختيار
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-muted rounded">Esc</kbd>
            للإغلاق
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
