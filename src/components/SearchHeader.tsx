import { FilterState } from '@/types/filters';

interface SearchHeaderProps {
  filters: FilterState;
  totalProducts: number;
  onClearFilters?: () => void;
  className?: string;
}

export const SearchHeader = ({
  filters,
  totalProducts,
  onClearFilters,
  className = '',
}: SearchHeaderProps) => {
  const hasActiveSearch = filters.searchQuery.trim().length > 0;
  const hasActiveCategory = filters.category && filters.category !== 'all';
  const hasActivePriceRange = filters.priceRange.min > 0 || filters.priceRange.max > 0;
  const hasActiveSort = filters.sortBy && filters.sortBy !== 'featured';

  const hasActiveFilters = hasActiveSearch || hasActiveCategory || hasActivePriceRange || hasActiveSort;

  const getCategoryName = (slug: string): string => {
    if (slug === 'all') return 'All Products';
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getSortName = (sortBy: string): string => {
    const sortLabels: Record<string, string> = {
      'featured': 'Featured',
      'price-low': 'Price: Low to High',
      'price-high': 'Price: High to Low',
      'rating': 'Customer Rating',
      'newest': 'Newest Arrivals',
      'bestselling': 'Best Selling',
      'name': 'Name: A to Z',
    };
    return sortLabels[sortBy] || sortBy;
  };

  const formatResultsText = (): string => {
    if (hasActiveSearch) {
      return `${totalProducts} results for "${filters.searchQuery}"`;
    }

    if (hasActiveCategory && filters.category !== 'all') {
      const categoryName = getCategoryName(filters.category);
      return `${totalProducts} products in ${categoryName}`;
    }

    return `${totalProducts} products`;
  };

  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Results text */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {hasActiveSearch ? (
              <>
                Search Results for <span className="text-blue-600">"{filters.searchQuery}"</span>
              </>
            ) : hasActiveCategory && filters.category !== 'all' ? (
              <>
                {getCategoryName(filters.category)}
              </>
            ) : (
              <>
                All Products
              </>
            )}
          </h1>
          <p className="text-gray-600">
            {formatResultsText()}
          </p>
        </div>

        {/* Active filters summary and clear button */}
        {hasActiveFilters && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Active filters summary */}
            <div className="flex flex-wrap items-center gap-2">
              {hasActiveSearch && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Search: "{filters.searchQuery}"
                </span>
              )}
              {hasActiveCategory && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {getCategoryName(filters.category)}
                </span>
              )}
              {hasActivePriceRange && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  {filters.priceRange.min > 0 && `$${filters.priceRange.min}`}
                  {filters.priceRange.min > 0 && filters.priceRange.max > 0 && ' - '}
                  {filters.priceRange.max > 0 && `$${filters.priceRange.max}`}
                  {filters.priceRange.min === 0 && filters.priceRange.max > 0 && `Under $${filters.priceRange.max}`}
                </span>
              )}
              {hasActiveSort && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  {getSortName(filters.sortBy)}
                </span>
              )}
            </div>

            {/* Clear filters button */}
            {onClearFilters && (
              <button
                onClick={onClearFilters}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Additional search suggestions when no results */}
      {totalProducts === 0 && hasActiveSearch && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-800 text-sm">
            <strong>No results found.</strong> Try checking your spelling, using more general terms, or browsing our categories.
          </p>
        </div>
      )}
    </div>
  );
};