"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { SearchableItem, SearchResult, searchItems, getSearchSuggestions } from '@/lib/utils/search';

interface SearchContextType {
  // Search state
  query: string;
  results: SearchResult[];
  suggestions: string[];
  isSearching: boolean;
  isOpen: boolean;
  
  // Recent searches
  recentSearches: string[];
  
  // Actions
  setQuery: (query: string) => void;
  search: (query: string) => void;
  clearSearch: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  
  // Filters
  filters: {
    type?: SearchableItem['type'][];
    difficulty?: string[];
    category?: string[];
  };
  setFilters: (filters: SearchContextType['filters']) => void;
  clearFilters: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

const RECENT_SEARCHES_KEY = 'mrf-recent-searches';
const MAX_RECENT_SEARCHES = 10;

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQueryState] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [filters, setFiltersState] = useState<SearchContextType['filters']>({});
  
  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error);
    }
  }, []);
  
  // Save recent searches to localStorage
  const saveRecentSearches = useCallback((searches: string[]) => {
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
    } catch (error) {
      console.error('Failed to save recent searches:', error);
    }
  }, []);
  
  // Get all searchable items (this would be replaced with actual data)
  const getAllSearchableItems = useCallback((): SearchableItem[] => {
    // This is a placeholder - in a real app, this would fetch from API or state
    // For now, return empty array - will be populated when integrated
    return [];
  }, []);
  
  // Set query and update suggestions
  const setQuery = useCallback((newQuery: string) => {
    setQueryState(newQuery);
    
    if (newQuery.trim().length > 0) {
      const items = getAllSearchableItems();
      const newSuggestions = getSearchSuggestions(newQuery, items, 5);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [getAllSearchableItems]);
  
  // Perform search
  const search = useCallback((searchQuery: string) => {
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
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [getAllSearchableItems, filters]);
  
  // Clear search
  const clearSearch = useCallback(() => {
    setQueryState('');
    setResults([]);
    setSuggestions([]);
  }, []);
  
  // Open search modal
  const openSearch = useCallback(() => {
    setIsOpen(true);
  }, []);
  
  // Close search modal
  const closeSearch = useCallback(() => {
    setIsOpen(false);
  }, []);
  
  // Toggle search modal
  const toggleSearch = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);
  
  // Add to recent searches
  const addRecentSearch = useCallback((searchQuery: string) => {
    if (!searchQuery || searchQuery.trim().length === 0) return;
    
    setRecentSearches(prev => {
      // Remove if already exists
      const filtered = prev.filter(s => s !== searchQuery);
      // Add to beginning
      const updated = [searchQuery, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      saveRecentSearches(updated);
      return updated;
    });
  }, [saveRecentSearches]);
  
  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    saveRecentSearches([]);
  }, [saveRecentSearches]);
  
  // Set filters
  const setFilters = useCallback((newFilters: SearchContextType['filters']) => {
    setFiltersState(newFilters);
    // Re-search with new filters if there's a query
    if (query.trim().length > 0) {
      search(query);
    }
  }, [query, search]);
  
  // Clear filters
  const clearFilters = useCallback(() => {
    setFiltersState({});
    // Re-search without filters if there's a query
    if (query.trim().length > 0) {
      search(query);
    }
  }, [query, search]);
  
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
  
  const value: SearchContextType = {
    query,
    results,
    suggestions,
    isSearching,
    isOpen,
    recentSearches,
    setQuery,
    search,
    clearSearch,
    openSearch,
    closeSearch,
    toggleSearch,
    addRecentSearch,
    clearRecentSearches,
    filters,
    setFilters,
    clearFilters,
  };
  
  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}

