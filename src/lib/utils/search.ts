/**
 * Search Utilities
 * Provides fuzzy search, Arabic text normalization, and search ranking
 */

/**
 * Normalize Arabic text for better search matching
 * Removes diacritics, normalizes hamza variants, etc.
 */
export function normalizeArabicText(text: string): string {
  if (!text) return "";

  return (
    text
      // Remove diacritics (tashkeel)
      .replace(/[\u064B-\u065F]/g, "")
      // Normalize Alef variants
      .replace(/[أإآ]/g, "ا")
      // Normalize Teh Marbuta
      .replace(/ة/g, "ه")
      // Normalize Yeh variants
      .replace(/ى/g, "ي")
      // Remove extra whitespace
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase()
  );
}

/**
 * Calculate similarity score between two strings (0-1)
 * Uses Levenshtein distance algorithm
 */
export function calculateSimilarity(str1: string, str2: string): number {
  const s1 = normalizeArabicText(str1);
  const s2 = normalizeArabicText(str2);

  if (s1 === s2) return 1;
  if (s1.length === 0 || s2.length === 0) return 0;

  const matrix: number[][] = [];

  // Initialize matrix
  for (let i = 0; i <= s2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= s1.length; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1, // deletion
        );
      }
    }
  }

  const maxLength = Math.max(s1.length, s2.length);
  const distance = matrix[s2.length][s1.length];
  return 1 - distance / maxLength;
}

/**
 * Check if query matches text (fuzzy matching)
 */
export function fuzzyMatch(
  query: string,
  text: string,
  threshold: number = 0.6,
): boolean {
  const normalizedQuery = normalizeArabicText(query);
  const normalizedText = normalizeArabicText(text);

  // Exact match
  if (normalizedText.includes(normalizedQuery)) {
    return true;
  }

  // Word-by-word matching
  const queryWords = normalizedQuery.split(" ");
  const textWords = normalizedText.split(" ");

  for (const queryWord of queryWords) {
    let found = false;
    for (const textWord of textWords) {
      if (
        textWord.includes(queryWord) ||
        calculateSimilarity(queryWord, textWord) >= threshold
      ) {
        found = true;
        break;
      }
    }
    if (!found) return false;
  }

  return true;
}

/**
 * Calculate search relevance score (0-100)
 */
export function calculateRelevanceScore(
  query: string,
  item: {
    title: string;
    description?: string;
    topics?: string[];
    category?: string;
  },
): number {
  const normalizedQuery = normalizeArabicText(query);
  let score = 0;

  // Title match (highest weight)
  const titleMatch = normalizeArabicText(item.title);
  if (titleMatch === normalizedQuery) {
    score += 50;
  } else if (titleMatch.includes(normalizedQuery)) {
    score += 40;
  } else {
    const titleSimilarity = calculateSimilarity(normalizedQuery, titleMatch);
    score += titleSimilarity * 30;
  }

  // Description match
  if (item.description) {
    const descMatch = normalizeArabicText(item.description);
    if (descMatch.includes(normalizedQuery)) {
      score += 20;
    } else {
      const descSimilarity = calculateSimilarity(normalizedQuery, descMatch);
      score += descSimilarity * 10;
    }
  }

  // Topics match
  if (item.topics && item.topics.length > 0) {
    for (const topic of item.topics) {
      const topicMatch = normalizeArabicText(topic);
      if (topicMatch.includes(normalizedQuery)) {
        score += 15;
        break;
      }
    }
  }

  // Category match
  if (item.category) {
    const categoryMatch = normalizeArabicText(item.category);
    if (categoryMatch.includes(normalizedQuery)) {
      score += 10;
    }
  }

  return Math.min(100, score);
}

/**
 * Highlight search terms in text
 */
export function highlightSearchTerms(text: string, query: string): string {
  if (!query || !text) return text;

  const normalizedQuery = normalizeArabicText(query);
  const words = normalizedQuery.split(" ").filter((w) => w.length > 0);

  let result = text;
  for (const word of words) {
    // Find all occurrences (case-insensitive, diacritic-insensitive)
    const regex = new RegExp(`(${word})`, "gi");
    result = result.replace(regex, "<mark>$1</mark>");
  }

  return result;
}

/**
 * Search item type
 */
export type SearchableItem = {
  id: string | number;
  type: "lesson" | "quiz" | "material" | "achievement" | "announcement";
  title: string;
  description?: string;
  topics?: string[];
  category?: string;
  difficulty?: string;
  duration?: string;
  url: string;
  metadata?: Record<string, any>;
};

/**
 * Search result with relevance score
 */
export type SearchResult = SearchableItem & {
  score: number;
  highlightedTitle: string;
  highlightedDescription?: string;
};

/**
 * Search through items with fuzzy matching and ranking
 */
export function searchItems(
  query: string,
  items: SearchableItem[],
  options: {
    threshold?: number;
    maxResults?: number;
    filters?: {
      type?: SearchableItem["type"][];
      difficulty?: string[];
      category?: string[];
    };
  } = {},
): SearchResult[] {
  const { threshold = 0.3, maxResults = 20, filters = {} } = options;

  if (!query || query.trim().length === 0) {
    return [];
  }

  // Filter items
  let filteredItems = items;

  if (filters.type && filters.type.length > 0) {
    filteredItems = filteredItems.filter((item) =>
      filters.type!.includes(item.type),
    );
  }

  if (filters.difficulty && filters.difficulty.length > 0) {
    filteredItems = filteredItems.filter(
      (item) =>
        item.difficulty && filters.difficulty!.includes(item.difficulty),
    );
  }

  if (filters.category && filters.category.length > 0) {
    filteredItems = filteredItems.filter(
      (item) => item.category && filters.category!.includes(item.category),
    );
  }

  // Search and score
  const results: SearchResult[] = [];

  for (const item of filteredItems) {
    const score = calculateRelevanceScore(query, item);

    if (score >= threshold * 100) {
      results.push({
        ...item,
        score,
        highlightedTitle: highlightSearchTerms(item.title, query),
        highlightedDescription: item.description
          ? highlightSearchTerms(item.description, query)
          : undefined,
      });
    }
  }

  // Sort by relevance score (descending)
  results.sort((a, b) => b.score - a.score);

  // Limit results
  return results.slice(0, maxResults);
}

/**
 * Get search suggestions based on query
 */
export function getSearchSuggestions(
  query: string,
  items: SearchableItem[],
  maxSuggestions: number = 5,
): string[] {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const normalizedQuery = normalizeArabicText(query);
  const suggestions = new Set<string>();

  for (const item of items) {
    const normalizedTitle = normalizeArabicText(item.title);

    // Add title if it starts with query
    if (normalizedTitle.startsWith(normalizedQuery)) {
      suggestions.add(item.title);
    }

    // Add topics that match
    if (item.topics) {
      for (const topic of item.topics) {
        const normalizedTopic = normalizeArabicText(topic);
        if (normalizedTopic.includes(normalizedQuery)) {
          suggestions.add(topic);
        }
      }
    }

    if (suggestions.size >= maxSuggestions) {
      break;
    }
  }

  return Array.from(suggestions).slice(0, maxSuggestions);
}
