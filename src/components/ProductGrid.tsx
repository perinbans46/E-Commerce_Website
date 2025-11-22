import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';
import { LoadingSkeleton } from './LoadingSkeleton';
import { ErrorMessage } from './ErrorMessage';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
  onAddToCart?: (product: Product) => void;
  onRetry?: () => void;
  className?: string;
}

export const ProductGrid = ({
  products,
  loading = false,
  error = null,
  onAddToCart,
  onRetry,
  className = '',
}: ProductGridProps) => {
  // Show loading state
  if (loading && products.length === 0) {
    return (
      <div className={className}>
        <LoadingSkeleton />
      </div>
    );
  }

  // Show error state
  if (error && products.length === 0) {
    return (
      <div className={className}>
        <ErrorMessage error={error} onRetry={onRetry} />
      </div>
    );
  }

  // Show empty state
  if (products.length === 0 && !loading) {
    return (
      <div className={`text-center py-16 px-4 ${className}`}>
        <div className="max-w-md mx-auto">
          {/* Empty state icon */}
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your filters or search terms to find what you're looking for.
          </p>

          {/* Clear filters button */}
          {onRetry && (
            <button
              onClick={onRetry}
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Clear Filters
            </button>
          )}
        </div>
      </div>
    );
  }

  // Show products grid
  return (
    <div className="relative">
      {/* Loading overlay for pagination loading */}
      {loading && products.length > 0 && (
        <div className="absolute inset-0 z-10 bg-white/80 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading products...</p>
          </div>
        </div>
      )}

      {/* Products grid */}
      <div className={`
        grid gap-4
        grid-cols-2
        sm:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-6
        ${className}
      `}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>

      {/* Error overlay (for pagination errors) */}
      {error && products.length > 0 && (
        <div className="mt-4">
          <ErrorMessage error={error} onRetry={onRetry} />
        </div>
      )}
    </div>
  );
};