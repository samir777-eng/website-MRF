"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSearch } from "@/contexts/SearchContext";
import { cn } from "@/lib/utils";
import DOMPurify from "dompurify";
import {
  ArrowRight,
  BookOpen,
  Clock,
  FileQuestion,
  FileText,
  Filter,
  Loader2,
  Megaphone,
  Search,
  TrendingUp,
  Trophy,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Safely sanitize search highlight HTML
 * Only allows <mark> tags for highlighting
 */
function sanitizeHighlight(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["mark"],
    ALLOWED_ATTR: ["class"],
  });
}

const typeIcons = {
  lesson: BookOpen,
  quiz: FileQuestion,
  material: FileText,
  achievement: Trophy,
  announcement: Megaphone,
};

const typeLabels = {
  lesson: "درس",
  quiz: "اختبار",
  material: "مادة",
  achievement: "إنجاز",
  announcement: "إعلان",
};

export function SearchModal() {
  const router = useRouter();
  const {
    query,
    results,
    suggestions,
    isSearching,
    isOpen,
    recentSearches,
    setQuery,
    closeSearch,
    addRecentSearch,
    clearRecentSearches,
    filters,
    setFilters,
  } = useSearch();

  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        } else if (query.trim()) {
          addRecentSearch(query);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        closeSearch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, query, addRecentSearch, closeSearch]);

  const handleResultClick = (result: (typeof results)[0]) => {
    addRecentSearch(query);
    closeSearch();
    router.push(result.url);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    addRecentSearch(suggestion);
  };

  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
  };

  const handleClearInput = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const toggleFilter = (
    filterType: "type" | "difficulty" | "category",
    value: string
  ) => {
    const currentFilters = filters[filterType] || [];
    const newFilters = currentFilters.includes(value)
      ? currentFilters.filter((v) => v !== value)
      : [...currentFilters, value];

    setFilters({
      ...filters,
      [filterType]: newFilters,
    });
  };

  const hasActiveFilters = Object.values(filters).some(
    (f) => f && f.length > 0
  );

  return (
    <Dialog open={isOpen} onOpenChange={closeSearch}>
      <DialogContent className="max-w-3xl p-0 gap-0">
        <DialogHeader className="sr-only">
          <DialogTitle>البحث</DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b">
          <label htmlFor="search-input" className="sr-only">
            البحث في الموقع
          </label>
          <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <Input
            id="search-input"
            ref={inputRef}
            type="text"
            placeholder="ابحث عن دروس، اختبارات، مواد..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-lg"
            aria-label="البحث في الموقع"
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearInput}
              className="flex-shrink-0"
              aria-label="مسح البحث"
              title="مسح البحث"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={cn("flex-shrink-0", hasActiveFilters && "text-primary")}
            aria-label={showFilters ? "إخفاء الفلاتر" : "إظهار الفلاتر"}
            title={showFilters ? "إخفاء الفلاتر" : "إظهار الفلاتر"}
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="p-4 border-b bg-muted/30 space-y-3">
            <div>
              <div className="text-sm font-medium mb-2">النوع</div>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    "lesson",
                    "quiz",
                    "material",
                    "achievement",
                    "announcement",
                  ] as const
                ).map((type) => (
                  <Badge
                    key={type}
                    variant={
                      filters.type?.includes(type) ? "default" : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => toggleFilter("type", type)}
                  >
                    {typeLabels[type]}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium mb-2">الصعوبة</div>
              <div className="flex flex-wrap gap-2">
                {["مبتدئ", "متوسط", "متقدم"].map((difficulty) => (
                  <Badge
                    key={difficulty}
                    variant={
                      filters.difficulty?.includes(difficulty)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => toggleFilter("difficulty", difficulty)}
                  >
                    {difficulty}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <ScrollArea className="max-h-[400px]">
          <div className="p-2">
            {isSearching ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : query.trim() && results.length > 0 ? (
              <div className="space-y-1">
                {results.map((result, index) => {
                  const Icon = typeIcons[result.type];
                  return (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleResultClick(result)}
                      className={cn(
                        "w-full text-end p-3 rounded-lg transition-colors",
                        "hover:bg-muted/50 focus:bg-muted/50 focus:outline-none",
                        index === selectedIndex && "bg-muted/50"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4
                              className="font-semibold text-sm truncate"
                              dangerouslySetInnerHTML={{
                                __html: sanitizeHighlight(
                                  result.highlightedTitle
                                ),
                              }}
                            />
                            <Badge
                              variant="secondary"
                              className="text-sm flex-shrink-0"
                            >
                              {typeLabels[result.type]}
                            </Badge>
                          </div>
                          {result.highlightedDescription && (
                            <p
                              className="text-sm text-muted-foreground line-clamp-2"
                              dangerouslySetInnerHTML={{
                                __html: sanitizeHighlight(
                                  result.highlightedDescription
                                ),
                              }}
                            />
                          )}
                          {result.difficulty && (
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-sm">
                                {result.difficulty}
                              </Badge>
                              {result.duration && (
                                <span className="text-sm text-muted-foreground">
                                  {result.duration}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : query.trim() && results.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  لا توجد نتائج لـ "{query}"
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  جرب كلمات مختلفة أو تحقق من الإملاء
                </p>
              </div>
            ) : (
              <div className="space-y-6 p-2">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <h3 className="text-sm font-medium">
                          عمليات البحث الأخيرة
                        </h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearRecentSearches}
                        className="text-sm"
                      >
                        مسح الكل
                      </Button>
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleRecentSearchClick(search)}
                          className="w-full text-end p-2 rounded-lg hover:bg-muted/50 transition-colors text-sm"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <h3 className="text-sm font-medium">اقتراحات</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-secondary/80"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex items-center justify-between p-3 border-t bg-muted/30 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-background rounded border">↑</kbd>
              <kbd className="px-2 py-1 bg-background rounded border">↓</kbd>
              <span>للتنقل</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-background rounded border">
                Enter
              </kbd>
              <span>للاختيار</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-background rounded border">Esc</kbd>
              <span>للإغلاق</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
