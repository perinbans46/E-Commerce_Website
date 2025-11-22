import { useState, useEffect } from 'react';
import { FilterState, SortOption, PriceRange } from '@/types/filters';
import { useDebounce } from '@/hooks/useDebounce';
import { SORT_OPTIONS, PRICE_RANGES } from '@/hooks/useFilters';

interface ProductFiltersProps {
  filters: FilterState;
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    productCount: number;
  }>;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  className?: string;
}

export const ProductFilters = ({
  filters,
  categories,
  onFiltersChange,
  className = '',
}: ProductFiltersProps) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(filters.searchQuery);
  const [showCustomPrice, setShowCustomPrice] = useState(false);
  const [customMinPrice, setCustomMinPrice] = useState(filters.priceRange.min || '');
  const [customMaxPrice, setCustomMaxPrice] = useState(filters.priceRange.max || '');

  const debouncedSearchQuery = useDebounce(localSearchQuery, 300);

  // Update search when debounced value changes
  useEffect(() => {
    if (debouncedSearchQuery !== filters.searchQuery) {
      onFiltersChange({ searchQuery: debouncedSearchQuery });
    }
  }, [debouncedSearchQuery, filters.searchQuery, onFiltersChange]);

  // Update local search query when filters change (e.g., from URL navigation)
  useEffect(() => {
    setLocalSearchQuery(filters.searchQuery);
  }, [filters.searchQuery]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(e.target.value);
  };

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    onFiltersChange({ category });
  };

  // Handle price range change
  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const selectedRange = PRICE_RANGES[parseInt(selectedValue)];

    if (selectedRange.label === 'Custom Range') {
      setShowCustomPrice(true);
      return;
    }

    setShowCustomPrice(false);
    onFiltersChange({
      priceRange: {
        min: selectedRange.min || 0,
        max: selectedRange.max || 0,
      },
    });
  };

  // Handle custom price input
  const handleCustomPriceSubmit = () => {
    const min = customMinPrice ? Math.max(0, parseInt(customMinPrice, 10)) : 0;
    const max = customMaxPrice ? Math.max(0, parseInt(customMaxPrice, 10)) : 0;

    // Validate that max >= min
    if (max > 0 && min > max) {
      return; // Invalid range
    }

    onFiltersChange({
      priceRange: { min, max },
    });
  };

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortBy = e.target.value;
    onFiltersChange({ sortBy });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setLocalSearchQuery('');
    setCustomMinPrice('');
    setCustomMaxPrice('');
    setShowCustomPrice(false);
    onFiltersChange({
      searchQuery: '',
      category: 'all',
      priceRange: { min: 0, max: 0 },
      sortBy: 'featured',
    });
  };

  // Determine current price range index
  const getCurrentPriceRangeIndex = (): number => {
    const { min, max } = filters.priceRange;

    for (let i = 0; i < PRICE_RANGES.length; i++) {
      const range = PRICE_RANGES[i];
      if (range.min === min && range.max === max) {
        return i;
      }
    }

    // If no predefined range matches, it's custom
    return PRICE_RANGES.findIndex(r => r.label === 'Custom Range');
  };

  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 ${className}`}>
      {/* Mobile-first responsive layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Bar */}
        <div className="lg:col-span-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="search"
              name="search"
              value={localSearchQuery}
              onChange={handleSearchChange}
              placeholder="Search products..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Dropdown */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleCategoryChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name} ({category.productCount})
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Dropdown */}
        <div>
          <label htmlFor="price-range" className="block text-sm font-medium text-gray-700 mb-1">
            Price Range
          </label>
          <select
            id="price-range"
            name="price-range"
            value={getCurrentPriceRangeIndex()}
            onChange={(e) => handlePriceRangeChange(e)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {PRICE_RANGES.map((range, index) => (
              <option key={index} value={index}>
                {range.label}
              </option>
            ))}
          </select>

          {/* Custom Price Input (shown when "Custom Range" is selected) */}
          {showCustomPrice && (
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                min="0"
                placeholder="Min"
                value={customMinPrice}
                onChange={(e) => setCustomMinPrice(e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                min="0"
                placeholder="Max"
                value={customMaxPrice}
                onChange={(e) => setCustomMaxPrice(e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={handleCustomPriceSubmit}
                className="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                Apply
              </button>
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            id="sort"
            name="sort"
            value={filters.sortBy}
            onChange={handleSortChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear Filters Button */}
      {(filters.searchQuery ||
        (filters.category && filters.category !== 'all') ||
        filters.priceRange.min > 0 ||
        filters.priceRange.max > 0 ||
        (filters.sortBy && filters.sortBy !== 'featured')) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};