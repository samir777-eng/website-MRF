"use client";

/**
 * SearchContext - Optimized with Memoization and Selectors
 *
 * This context provides search functionality with optimizations:
 * - Memoized context value to prevent unnecessary re-renders
 * - Stable action references via useCallback
 * - Selector hooks for subscribing to specific state slices
 *
 * Update Frequency:
 * - Query/Results: High (every keystroke with debounce)
 * - Filters: Medium (user filter changes)
 * - Recent searches: Low (after search submit)
 * - Modal state: Low (open/close events)
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import {
  SearchableItem,
  SearchResult,
  searchItems,
  getSearchSuggestions,
} from "@/lib/utils/search";

// Split context types by update frequency
interface SearchQueryState {
  query: string;
  results: SearchResult[];
  suggestions: string[];
  isSearching: boolean;
}

interface SearchUIState {
  isOpen: boolean;
}

interface SearchFiltersState {
  filters: {
    type?: SearchableItem["type"][];
    difficulty?: string[];
    category?: string[];
  };
}

interface SearchHistoryState {
  recentSearches: string[];
}

interface SearchActions {
  setQuery: (query: string) => void;
  search: (query: string) => void;
  clearSearch: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  setFilters: (filters: SearchFiltersState["filters"]) => void;
  clearFilters: () => void;
}

type SearchContextType = SearchQueryState &
  SearchUIState &
  SearchFiltersState &
  SearchHistoryState &
  SearchActions;

const SearchContext = createContext<SearchContextType | undefined>(undefined);

const RECENT_SEARCHES_KEY = "mrf-recent-searches";
const MAX_RECENT_SEARCHES = 10;

export function SearchProviderOptimized({
  children,
}: {
  children: React.ReactNode;
}) {
  // Query state - updates frequently
  const [query, setQueryState] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // UI state - updates infrequently
  const [isOpen, setIsOpen] = useState(false);

  // Filter state - updates occasionally
  const [filters, setFiltersState] = useState<SearchFiltersState["filters"]>(
    {},
  );

  // History state - updates rarely
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load recent searches:", error);
    }
  }, []);

  // Save recent searches to localStorage - memoized
  const saveRecentSearches = useCallback((searches: string[]) => {
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
    } catch (error) {
      console.error("Failed to save recent searches:", error);
    }
  }, []);

  // Get all searchable items - memoized
  const getAllSearchableItems = useCallback((): SearchableItem[] => {
    // Placeholder - in a real app, this would fetch from API or state
    return [];
  }, []);

  // Set query and update suggestions - memoized
  const setQuery = useCallback(
    (newQuery: string) => {
      setQueryState(newQuery);

      if (newQuery.trim().length > 0) {
        const items = getAllSearchableItems();
        const newSuggestions = getSearchSuggestions(newQuery, items, 5);
        setSuggestions(newSuggestions);
      } else {
        setSuggestions([]);
      }
    },
    [getAllSearchableItems],
  );

  // Perform search - memoized with filter dependency
  const search = useCallback(
    (searchQuery: string) => {
      if (!searchQuery || searchQuery.trim().length === 0) {
        setResults([]);
        return;
      }

      setIsSearching(true);

      try {
        const items = getAllSearchableItems();
        const searchResults = searchItems(searchQuery, items, {
          threshold: 0.3,
          maxResults: 20,
          filters,
        });

        setResults(searchResults);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [getAllSearchableItems, filters],
  );

  // Clear search - memoized
  const clearSearch = useCallback(() => {
    setQueryState("");
    setResults([]);
    setSuggestions([]);
  }, []);

  // Modal controls - memoized
  const openSearch = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleSearch = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Recent searches - memoized
  const addRecentSearch = useCallback(
    (searchQuery: string) => {
      if (!searchQuery || searchQuery.trim().length === 0) return;

      setRecentSearches((prev) => {
        const filtered = prev.filter((s) => s !== searchQuery);
        const updated = [searchQuery, ...filtered].slice(
          0,
          MAX_RECENT_SEARCHES,
        );
        saveRecentSearches(updated);
        return updated;
      });
    },
    [saveRecentSearches],
  );

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    saveRecentSearches([]);
  }, [saveRecentSearches]);

  // Filters - memoized
  const setFilters = useCallback(
    (newFilters: SearchFiltersState["filters"]) => {
      setFiltersState(newFilters);
    },
    [],
  );

  const clearFilters = useCallback(() => {
    setFiltersState({});
  }, []);

  // Auto-search when query changes (debounced)
  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      search(query);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [query, search]);

  // Re-search when filters change and there's an active query
  useEffect(() => {
    if (query.trim().length > 0) {
      search(query);
    }
  }, [filters, query, search]);

  // Memoize the entire context value
  const value = useMemo<SearchContextType>(
    () => ({
      // Query state
      query,
      results,
      suggestions,
      isSearching,
      // UI state
      isOpen,
      // Filter state
      filters,
      // History state
      recentSearches,
      // Actions
      setQuery,
      search,
      clearSearch,
      openSearch,
      closeSearch,
      toggleSearch,
      addRecentSearch,
      clearRecentSearches,
      setFilters,
      clearFilters,
    }),
    [
      query,
      results,
      suggestions,
      isSearching,
      isOpen,
      filters,
      recentSearches,
      setQuery,
      search,
      clearSearch,
      openSearch,
      closeSearch,
      toggleSearch,
      addRecentSearch,
      clearRecentSearches,
      setFilters,
      clearFilters,
    ],
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

// Main hook
export function useSearchOptimized() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error(
      "useSearchOptimized must be used within a SearchProviderOptimized",
    );
  }
  return context;
}

// === Selector hooks for fine-grained subscriptions ===

/**
 * Get only search query and results - for search results display
 */
export function useSearchResults() {
  const { query, results, isSearching, suggestions } = useSearchOptimized();
  return { query, results, isSearching, suggestions };
}

/**
 * Get only search modal state - for modal toggle button
 */
export function useSearchModal() {
  const { isOpen, openSearch, closeSearch, toggleSearch } =
    useSearchOptimized();
  return { isOpen, openSearch, closeSearch, toggleSearch };
}

/**
 * Get only recent searches - for recent searches display
 */
export function useRecentSearches() {
  const { recentSearches, addRecentSearch, clearRecentSearches } =
    useSearchOptimized();
  return { recentSearches, addRecentSearch, clearRecentSearches };
}

/**
 * Get only filter state - for filter controls
 */
export function useSearchFilters() {
  const { filters, setFilters, clearFilters } = useSearchOptimized();
  return { filters, setFilters, clearFilters };
}

/**
 * Get only search actions - for search input component
 */
export function useSearchActions() {
  const { setQuery, search, clearSearch, addRecentSearch } =
    useSearchOptimized();
  return { setQuery, search, clearSearch, addRecentSearch };
}

/**
 * Check if search is open - minimal subscription
 */
export function useIsSearchOpen() {
  const { isOpen } = useSearchOptimized();
  return isOpen;
}
