'use client';

import { useEffect, useCallback } from 'react';
import { Product } from '@/types/product';
import { ProductCatalogProvider, useProductCatalog } from '@/contexts/ProductCatalogContext';
import { useFilters } from '@/hooks/useFilters';
import { useProducts } from '@/hooks/useProducts';
import { ProductGrid } from '@/components/ProductGrid';
import { ProductFilters } from '@/components/ProductFilters';
import { SearchHeader } from '@/components/SearchHeader';
import { Pagination } from '@/components/Pagination';

// Main product catalog component
function ProductCatalogPage() {
  const { filters, updatePage, resetFilters } = useFilters();
  const { products, pagination, categories, loading, error, fetchProducts, retry } = useProducts();
  const { addToCart, cartItemsCount } = useProductCatalog();

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts({
      search: filters.searchQuery || undefined,
      category: filters.category === 'all' ? undefined : filters.category,
      minPrice: filters.priceRange.min > 0 ? filters.priceRange.min : undefined,
      maxPrice: filters.priceRange.max > 0 ? filters.priceRange.max : undefined,
      sortBy: filters.sortBy,
      page: filters.page,
      limit: filters.limit,
    });
  }, [
    filters.searchQuery,
    filters.category,
    filters.priceRange.min,
    filters.priceRange.max,
    filters.sortBy,
    filters.page,
    filters.limit,
    fetchProducts,
  ]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    updatePage(page);
  }, [updatePage]);

  // Handle retry
  const handleRetry = useCallback(() => {
    retry();
  }, [retry]);

  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  // Handle add to cart
  const handleAddToCart = useCallback((product) => {
    addToCart(product);
    // You could add a toast notification here
    console.log(`Added ${product.name} to cart`);
  }, [addToCart]);

  // Simple cart indicator (you could expand this to a full cart component)
  const CartIndicator = () => {
    if (cartItemsCount === 0) return null;

    return (
      <div className="fixed top-4 right-4 bg-blue-600 text-white px-3 py-2 rounded-full shadow-lg z-50 flex items-center gap-2">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <span className="font-medium">{cartItemsCount}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cart Indicator */}
      <CartIndicator />

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Product Catalog</h1>
            <div className="text-sm text-gray-600">
              {categories.length > 0 && `${categories.reduce((sum, cat) => sum + cat.productCount, 0)} products`}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <SearchHeader
          filters={filters}
          totalProducts={pagination.totalProducts}
          onClearFilters={handleClearFilters}
        />

        {/* Filters */}
        <ProductFilters
          filters={filters}
          categories={categories}
          onFiltersChange={(newFilters) => {
            if (newFilters.searchQuery !== undefined) filters.searchQuery = newFilters.searchQuery;
            if (newFilters.category !== undefined) filters.category = newFilters.category;
            if (newFilters.priceRange !== undefined) filters.priceRange = newFilters.priceRange;
            if (newFilters.sortBy !== undefined) filters.sortBy = newFilters.sortBy;
          }}
        />

        {/* Products Grid */}
        <ProductGrid
          products={products}
          loading={loading}
          error={error}
          onAddToCart={handleAddToCart}
          onRetry={handleRetry}
          className="mb-8"
        />

        {/* Pagination */}
        {products.length > 0 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalProducts={pagination.totalProducts}
            productsPerPage={filters.limit}
            onPageChange={handlePageChange}
          />
        )}

        {/* Scroll to top when page changes */}
        {loading && products.length > 0 && (
          <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg z-40">
            <svg
              className="w-5 h-5 animate-spin"
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
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2024 Product Catalog. Built with Next.js, React, and Tailwind CSS.</p>
            <p className="mt-2">Mock data for demonstration purposes.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Export the page with the provider wrapper
export default function Home() {
  return (
    <ProductCatalogProvider>
      <ProductCatalogPage />
    </ProductCatalogProvider>
  );
}

