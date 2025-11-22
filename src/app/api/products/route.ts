import { NextRequest, NextResponse } from 'next/server';
import { mockProducts, mockCategories } from '@/data/mockProducts';
import { ProductResponse, ProductQueryParams } from '@/types/product';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const params: ProductQueryParams = {
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      sortBy: searchParams.get('sortBy') || 'featured',
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 24,
    };

    // Validate parameters
    if (params.page !== undefined && params.page < 1) {
      return NextResponse.json(
        { error: 'Page must be greater than 0' },
        { status: 400 }
      );
    }

    if (params.limit !== undefined && (params.limit < 1 || params.limit > 100)) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 100' },
        { status: 400 }
      );
    }

    if (params.minPrice !== undefined && params.minPrice < 0) {
      return NextResponse.json(
        { error: 'Minimum price cannot be negative' },
        { status: 400 }
      );
    }

    if (params.maxPrice !== undefined && params.maxPrice < 0) {
      return NextResponse.json(
        { error: 'Maximum price cannot be negative' },
        { status: 400 }
      );
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

    let filteredProducts = [...mockProducts];

    // Apply search filter
    if (params.search) {
      const searchQuery = params.search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery)) ||
        product.brand?.toLowerCase().includes(searchQuery) ||
        product.category.toLowerCase().includes(searchQuery) ||
        product.subcategory?.toLowerCase().includes(searchQuery)
      );
    }

    // Apply category filter
    if (params.category && params.category !== 'all') {
      filteredProducts = filteredProducts.filter(product =>
        product.category === params.category
      );
    }

    // Apply price range filter
    if (params.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product =>
        product.price >= params.minPrice!
      );
    }

    if (params.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product =>
        product.price <= params.maxPrice!
      );
    }

    // Apply sorting
    switch (params.sortBy) {
      case 'price-low':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filteredProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'name':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'bestselling':
        filteredProducts.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'featured':
      default:
        // Sort by featured first, then by rating
        filteredProducts.sort((a, b) => {
          if (a.featured !== b.featured) {
            return a.featured ? -1 : 1;
          }
          return b.rating - a.rating;
        });
        break;
    }

    // Calculate pagination
    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / params.limit!);
    const startIndex = (params.page! - 1) * params.limit!;
    const endIndex = startIndex + params.limit!;

    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    // Filter categories to include only those with products
    const categoriesWithProducts = mockCategories.map(category => ({
      ...category,
      productCount: mockProducts.filter(p =>
        category.slug === 'all' || p.category === category.slug
      ).length
    }));

    const response: ProductResponse = {
      products: paginatedProducts,
      pagination: {
        currentPage: params.page!,
        totalPages,
        totalProducts,
        hasNextPage: params.page! < totalPages,
        hasPrevPage: params.page! > 1,
      },
      filters: {
        categories: categoriesWithProducts,
      }
    };

    // Add CORS headers
    const headers = new Headers({
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      'Content-Type': 'application/json',
    });

    return NextResponse.json(response, { headers });

  } catch (error) {
    console.error('API Error:', error);

    // Simulate occasional server errors
    if (Math.random() > 0.95) {
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}