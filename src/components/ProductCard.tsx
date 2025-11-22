import Image from 'next/image';
import { Product } from '@/types/product';
import { formatPrice, calculateDiscount } from '@/lib/apiUtils';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  className?: string;
}

export const ProductCard = ({ product, onAddToCart, className = '' }: ProductCardProps) => {
  const mainImage = product.images.find(img => img.isMain) || product.images[0];
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? calculateDiscount(product.originalPrice!, product.price)
    : 0;

  const handleAddToCart = () => {
    if (onAddToCart && product.inStock) {
      onAddToCart(product);
    }
  };

  return (
    <div
      className={`
        relative bg-white border border-gray-200 rounded-lg p-3
        hover:shadow-md hover:border-gray-300 hover:-translate-y-0.5
        transition-all duration-200 ease-out
        h-[320px] flex flex-col group cursor-pointer
        ${className}
      `}
    >
      {/* Product Image */}
      <div className="relative w-full aspect-square mb-3 overflow-hidden rounded-md bg-gray-50">
        {mainImage && (
          <Image
            src={mainImage.url}
            alt={mainImage.alt}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 16vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.featured && (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium">
              Featured
            </span>
          )}
          {hasDiscount && (
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded font-medium">
              -{discountPercentage}%
            </span>
          )}
          {!product.inStock && (
            <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded font-medium">
              Out of Stock
            </span>
          )}
        </div>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span>{product.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col">
        {/* Product Title */}
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 leading-tight">
          {product.name}
        </h3>

        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-gray-500 mb-2">{product.brand}</p>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.originalPrice!)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`
            w-full py-2 px-3 rounded text-sm font-medium transition-colors duration-200
            ${product.inStock
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 rounded-lg pointer-events-none">
        <div className="absolute inset-0 rounded-lg border border-transparent group-hover:border-gray-300 transition-colors duration-200" />
      </div>
    </div>
  );
};