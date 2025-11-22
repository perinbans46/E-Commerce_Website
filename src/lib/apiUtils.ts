import { ProductResponse, ProductQueryParams } from '@/types/product';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const fetchProducts = async (params: ProductQueryParams): Promise<ProductResponse> => {
  const searchParams = new URLSearchParams();

  // Add all non-undefined parameters to the search string
  if (params.search !== undefined && params.search !== '') {
    searchParams.set('search', params.search);
  }
  if (params.category !== undefined && params.category !== '') {
    searchParams.set('category', params.category);
  }
  if (params.minPrice !== undefined) {
    searchParams.set('minPrice', params.minPrice.toString());
  }
  if (params.maxPrice !== undefined) {
    searchParams.set('maxPrice', params.maxPrice.toString());
  }
  if (params.sortBy !== undefined && params.sortBy !== '') {
    searchParams.set('sortBy', params.sortBy);
  }
  if (params.page !== undefined) {
    searchParams.set('page', params.page.toString());
  }
  if (params.limit !== undefined) {
    searchParams.set('limit', params.limit.toString());
  }

  const url = `/api/products${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store', // Disable caching for dynamic data
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data: ProductResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch products');
  }
};

// Utility function for retrying failed requests with exponential backoff
export const fetchWithRetry = async (
  fetchFn: () => Promise<ProductResponse>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<ProductResponse> => {
  let lastError: Error;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fetchFn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');

      if (i === maxRetries) {
        break; // Last retry failed
      }

      // Exponential backoff
      const backoffDelay = delay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }

  throw lastError!;
};

// Utility function to check if the user is online
export const isOnline = (): boolean => {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
};

// Utility function to format price
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

// Utility function to calculate discount percentage
export const calculateDiscount = (originalPrice: number, currentPrice: number): number => {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

// Utility function to truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength).trim() + '...';
};