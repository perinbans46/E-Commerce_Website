import { FilterState } from '@/types/filters';

export const createFilterUrl = (filters: Partial<FilterState>): string => {
  const params = new URLSearchParams();

  // Add non-empty filters to URL
  if (filters.searchQuery && filters.searchQuery.trim()) {
    params.set('search', filters.searchQuery.trim());
  }

  if (filters.category && filters.category !== 'all') {
    params.set('category', filters.category);
  }

  if (filters.priceRange?.min && filters.priceRange.min > 0) {
    params.set('minPrice', filters.priceRange.min.toString());
  }

  if (filters.priceRange?.max && filters.priceRange.max > 0) {
    params.set('maxPrice', filters.priceRange.max.toString());
  }

  if (filters.sortBy && filters.sortBy !== 'featured') {
    params.set('sort', filters.sortBy);
  }

  if (filters.page && filters.page > 1) {
    params.set('page', filters.page.toString());
  }

  if (filters.limit && filters.limit !== 24) {
    params.set('limit', filters.limit.toString());
  }

  const queryString = params.toString();
  return queryString ? `/?${queryString}` : '/';
};

export const parseUrlFilters = (searchParams: URLSearchParams): Partial<FilterState> => {
  const filters: Partial<FilterState> = {
    searchQuery: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    sortBy: searchParams.get('sort') || 'featured',
    page: parseInt(searchParams.get('page') || '1', 10),
    limit: parseInt(searchParams.get('limit') || '24', 10),
    priceRange: {
      min: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!, 10) : 0,
      max: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!, 10) : 0,
    },
  };

  // Validate numeric values
  if (isNaN(filters.page!) || filters.page! < 1) {
    filters.page = 1;
  }

  if (isNaN(filters.limit!) || filters.limit! < 1 || filters.limit! > 100) {
    filters.limit = 24;
  }

  if (filters.priceRange!.min && (isNaN(filters.priceRange!.min) || filters.priceRange!.min < 0)) {
    filters.priceRange!.min = 0;
  }

  if (filters.priceRange!.max && (isNaN(filters.priceRange!.max) || filters.priceRange!.max < 0)) {
    filters.priceRange!.max = 0;
  }

  return filters;
};

export const updateUrlFilters = (filters: Partial<FilterState>, push: boolean = false): void => {
  if (typeof window === 'undefined') return;

  const newUrl = createFilterUrl(filters);
  const currentUrl = window.location.pathname + window.location.search;

  if (newUrl !== currentUrl) {
    if (push) {
      window.history.pushState({}, '', newUrl);
    } else {
      window.history.replaceState({}, '', newUrl);
    }
  }
};

export const getFilterSummary = (filters: Partial<FilterState>): string[] => {
  const summary: string[] = [];

  if (filters.searchQuery && filters.searchQuery.trim()) {
    summary.push(`Search: "${filters.searchQuery.trim()}"`);
  }

  if (filters.category && filters.category !== 'all') {
    // Convert slug back to readable format
    const categoryName = filters.category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    summary.push(`Category: ${categoryName}`);
  }

  if (filters.priceRange?.min || filters.priceRange?.max) {
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
};