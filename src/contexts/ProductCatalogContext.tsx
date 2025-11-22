'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';
import { Product } from '@/types/product';

// State interface
interface ProductCatalogState {
  // Data state
  products: Product[];
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    description?: string;
    productCount: number;
  }>;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };

  // UI state
  loading: boolean;
  error: string | null;

  // Preferences
  gridView: 'grid' | 'list';
  itemsPerPage: number;

  // Cart state (simple version for demo)
  cartItems: Array<{
    product: Product;
    quantity: number;
  }>;
  showCart: boolean;
}

// Action types
type ProductCatalogAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PRODUCTS'; payload: { products: Product[]; pagination: ProductCatalogState['pagination']; categories: ProductCatalogState['categories'] } }
  | { type: 'APPEND_PRODUCTS'; payload: { products: Product[]; pagination: ProductCatalogState['pagination'] } }
  | { type: 'SET_GRID_VIEW'; payload: 'grid' | 'list' }
  | { type: 'SET_ITEMS_PER_PAGE'; payload: number }
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'RESET_STATE' };

// Initial state
const initialState: ProductCatalogState = {
  products: [],
  categories: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  loading: false,
  error: null,
  gridView: 'grid',
  itemsPerPage: 24,
  cartItems: [],
  showCart: false,
};

// Reducer
function productCatalogReducer(
  state: ProductCatalogState,
  action: ProductCatalogAction
): ProductCatalogState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case 'SET_PRODUCTS':
      return {
        ...state,
        products: action.payload.products,
        pagination: action.payload.pagination,
        categories: action.payload.categories,
        loading: false,
        error: null,
      };

    case 'APPEND_PRODUCTS':
      return {
        ...state,
        products: [...state.products, ...action.payload.products],
        pagination: action.payload.pagination,
        loading: false,
      };

    case 'SET_GRID_VIEW':
      return {
        ...state,
        gridView: action.payload,
      };

    case 'SET_ITEMS_PER_PAGE':
      return {
        ...state,
        itemsPerPage: action.payload,
      };

    case 'ADD_TO_CART':
      const existingItemIndex = state.cartItems.findIndex(
        item => item.product.id === action.payload.id
      );

      if (existingItemIndex >= 0) {
        const updatedCartItems = [...state.cartItems];
        updatedCartItems[existingItemIndex] = {
          ...updatedCartItems[existingItemIndex],
          quantity: updatedCartItems[existingItemIndex].quantity + 1,
        };
        return {
          ...state,
          cartItems: updatedCartItems,
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, { product: action.payload, quantity: 1 }],
        };
      }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.product.id !== action.payload),
      };

    case 'UPDATE_CART_QUANTITY':
      const updatedCartItems = state.cartItems.map(item =>
        item.product.id === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);

      return {
        ...state,
        cartItems: updatedCartItems,
      };

    case 'CLEAR_CART':
      return {
        ...state,
        cartItems: [],
      };

    case 'TOGGLE_CART':
      return {
        ...state,
        showCart: !state.showCart,
      };

    case 'RESET_STATE':
      return {
        ...initialState,
      };

    default:
      return state;
  }
}

// Context interface
interface ProductCatalogContext extends ProductCatalogState {
  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setProducts: (products: Product[], pagination: ProductCatalogState['pagination'], categories: ProductCatalogState['categories']) => void;
  appendProducts: (products: Product[], pagination: ProductCatalogState['pagination']) => void;
  setGridView: (view: 'grid' | 'list') => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  resetState: () => void;

  // Computed values
  cartTotal: number;
  cartItemsCount: number;
}

// Create context
const ProductCatalogContextInstance = createContext<ProductCatalogContext | null>(null);

// Provider component
interface ProductCatalogProviderProps {
  children: ReactNode;
}

export function ProductCatalogProvider({ children }: ProductCatalogProviderProps) {
  const [state, dispatch] = useReducer(productCatalogReducer, initialState);

  // Actions
  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const setProducts = (
    products: Product[],
    pagination: ProductCatalogState['pagination'],
    categories: ProductCatalogState['categories']
  ) => {
    dispatch({
      type: 'SET_PRODUCTS',
      payload: { products, pagination, categories },
    });
  };

  const appendProducts = (
    products: Product[],
    pagination: ProductCatalogState['pagination']
  ) => {
    dispatch({
      type: 'APPEND_PRODUCTS',
      payload: { products, pagination },
    });
  };

  const setGridView = (view: 'grid' | 'list') => {
    dispatch({ type: 'SET_GRID_VIEW', payload: view });
  };

  const setItemsPerPage = (itemsPerPage: number) => {
    dispatch({ type: 'SET_ITEMS_PER_PAGE', payload: itemsPerPage });
  };

  const addToCart = (product: Product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const resetState = () => {
    dispatch({ type: 'RESET_STATE' });
  };

  // Computed values
  const cartTotal = state.cartItems.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);

  const cartItemsCount = state.cartItems.reduce((count, item) => {
    return count + item.quantity;
  }, 0);

  // Context value
  const contextValue: ProductCatalogContext = {
    ...state,
    setLoading,
    setError,
    setProducts,
    appendProducts,
    setGridView,
    setItemsPerPage,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    toggleCart,
    resetState,
    cartTotal,
    cartItemsCount,
  };

  return (
    <ProductCatalogContextInstance.Provider value={contextValue}>
      {children}
    </ProductCatalogContextInstance.Provider>
  );
}

// Hook to use context
export function useProductCatalog() {
  const context = useContext(ProductCatalogContextInstance);

  if (!context) {
    throw new Error('useProductCatalog must be used within a ProductCatalogProvider');
  }

  return context;
}