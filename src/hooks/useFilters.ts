import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { FilterState, SortOption, PriceRange } from '@/types/filters';
import { parseUrlFilters, updateUrlFilters } from '@/lib/urlUtils';

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  category: 'all',
  priceRange: {
    min: 0,
    max: 0,
  },
  sortBy: 'featured',
  page: 1,
  limit: 24,
};

export const useFilters = () => {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Initialize filters from URL parameters
  useEffect(() => {
    const urlFilters = parseUrlFilters(searchParams);
    setFilters(prevFilters => ({
      ...DEFAULT_FILTERS,
      ...urlFilters,
      priceRange: {
        ...DEFAULT_FILTERS.priceRange,
        ...urlFilters.priceRange,
      },
    }));
  }, [searchParams]);

  // Update URL when filters change
  useEffect(() => {
    updateUrlFilters(filters, true);
  }, [filters]);

  // Update search query
  const updateSearchQuery = useCallback((searchQuery: string) => {
    setFilters(prev => ({
      ...prev,
      searchQuery,
      page: 1, // Reset to first page when searching
    }));
  }, []);

  // Update category
  const updateCategory = useCallback((category: string) => {
    setFilters(prev => ({
      ...prev,
      category,
      page: 1, // Reset to first page when changing category
    }));
  }, []);

  // Update price range
  const updatePriceRange = useCallback((priceRange: { min: number; max: number }) => {
    setFilters(prev => ({
      ...prev,
      priceRange,
      page: 1, // Reset to first page when changing price range
    }));
  }, []);

  // Update sort
  const updateSort = useCallback((sortBy: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      page: 1, // Reset to first page when changing sort
    }));
  }, []);

  // Update page
  const updatePage = useCallback((page: number) => {
    setFilters(prev => ({
      ...prev,
      page: Math.max(1, page), // Ensure page is at least 1
    }));
  }, []);

  // Update limit
  const updateLimit = useCallback((limit: number) => {
    setFilters(prev => ({
      ...prev,
      limit: Math.min(100, Math.max(1, limit)), // Ensure limit is between 1 and 100
      page: 1, // Reset to first page when changing limit
    }));
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // Clear specific filters
  const clearSearch = useCallback(() => {
    updateSearchQuery('');
  }, [updateSearchQuery]);

  const clearCategory = useCallback(() => {
    updateCategory('all');
  }, [updateCategory]);

  const clearPriceRange = useCallback(() => {
    updatePriceRange({ min: 0, max: 0 });
  }, [updatePriceRange]);

  const clearSort = useCallback(() => {
    updateSort('featured');
  }, [updateSort]);

  // Check if filters have active values
  const hasActiveFilters = Boolean(
    filters.searchQuery.trim() ||
    (filters.category && filters.category !== 'all') ||
    (filters.priceRange.min > 0) ||
    (filters.priceRange.max > 0) ||
    (filters.sortBy && filters.sortBy !== 'featured')
  );

  // Get filter summary for display
  const getFilterSummary = useCallback(() => {
    const summary = [];
    if (filters.searchQuery.trim()) {
      summary.push(`Search: "${filters.searchQuery.trim()}"`);
    }
    if (filters.category && filters.category !== 'all') {
      const categoryName = filters.category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      summary.push(`Category: ${categoryName}`);
    }
    if (filters.priceRange.min || filters.priceRange.max) {
      const min = filters.priceRange.min || 0;
      const max = filters.priceRange.max || '∞';
      summary.push(`Price: $${min}${max !== '∞' ? ` - $${max}` : '+'}`);
    }
    if (filters.sortBy && filters.sortBy !== 'featured') {
      const sortLabels: Record<string, string> = {
        'price-low': 'Price: Low to High',
        'price-high': 'Price: High to Low',
        'rating': 'Highest Rated',
        'newest': 'Newest Arrivals',
        'bestselling': 'Best Selling',
        'name': 'Name: A to Z',
      };
      summary.push(`Sort: ${sortLabels[filters.sortBy] || filters.sortBy}`);
    }
    return summary;
  }, [filters]);

  return {
    filters,
    updateSearchQuery,
    updateCategory,
    updatePriceRange,
    updateSort,
    updatePage,
    updateLimit,
    resetFilters,
    clearSearch,
    clearCategory,
    clearPriceRange,
    clearSort,
    hasActiveFilters,
    getFilterSummary,
  };
};

// Export constants for use in components
export const SORT_OPTIONS: SortOption[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'bestselling', label: 'Best Selling' },
  { value: 'name', label: 'Name: A to Z' },
];

export const PRICE_RANGES: PriceRange[] = [
  { label: 'Any Price' },
  { label: 'Under $25', max: 25 },
  { label: '$25 - $50', min: 25, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100 - $200', min: 100, max: 200 },
  { label: '$200 - $500', min: 200, max: 500 },
  { label: 'Over $500', min: 500 },
  { label: 'Custom Range', min: 0, max: 0 }, // Special case for custom input
];