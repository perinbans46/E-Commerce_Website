export interface FilterState {
  searchQuery: string;
  category: string;
  priceRange: {
    min: number;
    max: number;
  };
  sortBy: string;
  page: number;
  limit: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  productsPerPage: number;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface PriceRange {
  label: string;
  min?: number;
  max?: number;
}