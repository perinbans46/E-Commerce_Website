import { useState, useEffect, useCallback, useRef } from 'react';
import { Product, ProductResponse, ProductQueryParams } from '@/types/product';
import { fetchProducts, fetchWithRetry } from '@/lib/apiUtils';

interface UseProductsOptions {
  initialData?: ProductResponse;
  retryAttempts?: number;
  retryDelay?: number;
  cacheTime?: number;
}

interface UseProductsState {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    description?: string;
    productCount: number;
  }>;
  loading: boolean;
  error: string | null;
  lastFetchTime: number;
}

interface UseProductsReturn extends UseProductsState {
  fetchProducts: (params: ProductQueryParams) => Promise<void>;
  retry: () => Promise<void>;
  clearError: () => void;
  refresh: () => Promise<void>;
  isLoadingMore: boolean;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useProducts = ({
  initialData,
  retryAttempts = 3,
  retryDelay = 1000,
  cacheTime = CACHE_DURATION,
}: UseProductsOptions = {}): UseProductsReturn => {
  const [state, setState] = useState<UseProductsState>({
    products: initialData?.products || [],
    pagination: initialData?.pagination || {
      currentPage: 1,
      totalPages: 1,
      totalProducts: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
    categories: initialData?.filters?.categories || [],
    loading: false,
    error: null,
    lastFetchTime: 0,
  });

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const cacheRef = useRef<Map<string, { data: ProductResponse; timestamp: number }>>(new Map());
  const currentRequestIdRef = useRef<string | null>(null);

  // Create cache key from parameters
  const createCacheKey = (params: ProductQueryParams): string => {
    return JSON.stringify({
      search: params.search || '',
      category: params.category || '',
      minPrice: params.minPrice || 0,
      maxPrice: params.maxPrice || 0,
      sortBy: params.sortBy || 'featured',
      page: params.page || 1,
      limit: params.limit || 24,
    });
  };

  // Check cache for valid data
  const getCachedData = (params: ProductQueryParams): ProductResponse | null => {
    const key = createCacheKey(params);
    const cached = cacheRef.current.get(key);

    if (cached && Date.now() - cached.timestamp < cacheTime) {
      return cached.data;
    }

    return null;
  };

  // Store data in cache
  const setCachedData = (params: ProductQueryParams, data: ProductResponse): void => {
    const key = createCacheKey(params);
    cacheRef.current.set(key, {
      data,
      timestamp: Date.now(),
    });

    // Clean old cache entries
    if (cacheRef.current.size > 50) {
      const oldestKey = cacheRef.current.keys().next().value;
      cacheRef.current.delete(oldestKey);
    }
  };

  // Fetch products with caching and error handling
  const fetchProductsData = useCallback(async (
    params: ProductQueryParams,
    isLoadingMore = false
  ): Promise<void> => {
    const requestId = Math.random().toString(36);
    currentRequestIdRef.current = requestId;

    try {
      // Check cache first
      const cachedData = getCachedData(params);
      if (cachedData && !isLoadingMore) {
        setState({
          products: cachedData.products,
          pagination: cachedData.pagination,
          categories: cachedData.filters.categories,
          loading: false,
          error: null,
          lastFetchTime: Date.now(),
        });
        return;
      }

      // Set loading states
      setState(prev => ({
        ...prev,
        loading: !isLoadingMore,
        error: null,
      }));

      if (isLoadingMore) {
        setIsLoadingMore(true);
      }

      // Fetch data with retry logic
      const data = await fetchWithRetry(
        () => fetchProducts(params),
        retryAttempts,
        retryDelay
      );

      // Check if this request is still current
      if (currentRequestIdRef.current !== requestId) {
        return;
      }

      // Update cache
      setCachedData(params, data);

      // Update state
      setState(prev => ({
        ...prev,
        products: isLoadingMore ? [...prev.products, ...data.products] : data.products,
        pagination: data.pagination,
        categories: data.filters.categories,
        loading: false,
        lastFetchTime: Date.now(),
      }));

    } catch (error) {
      // Check if this request is still current
      if (currentRequestIdRef.current !== requestId) {
        return;
      }

      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    } finally {
      setIsLoadingMore(false);
    }
  }, [retryAttempts, retryDelay, cacheTime]);

  // Public fetch function
  const fetchProductsHandler = useCallback(
    (params: ProductQueryParams, isLoadingMore = false) => {
      return fetchProductsData(params, isLoadingMore);
    },
    [fetchProductsData]
  );

  // Retry function
  const retry = useCallback(async () => {
    setState(prev => ({ ...prev, error: null }));
    // Retry with the same parameters - we'd need to track the last params used
    // For now, just clear the error
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Refresh function - refetch current data ignoring cache
  const refresh = useCallback(async () => {
    const currentKey = Array.from(cacheRef.current.keys())[0];
    if (currentKey) {
      const params = JSON.parse(currentKey);
      // Clear cache for current key
      cacheRef.current.delete(currentKey);
      // Fetch fresh data
      await fetchProductsData(params);
    }
  }, [fetchProductsData]);

  // Cleanup old cache entries periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      for (const [key, { timestamp }] of cacheRef.current.entries()) {
        if (now - timestamp > cacheTime) {
          cacheRef.current.delete(key);
        }
      }
    }, cacheTime);

    return () => clearInterval(interval);
  }, [cacheTime]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      currentRequestIdRef.current = null;
    };
  }, []);

  return {
    ...state,
    fetchProducts: fetchProductsHandler,
    retry,
    clearError,
    refresh,
    isLoadingMore,
  };
};