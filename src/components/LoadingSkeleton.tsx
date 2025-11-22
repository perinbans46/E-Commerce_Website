interface LoadingSkeletonProps {
  count?: number;
  className?: string;
}

export const LoadingSkeleton = ({ count = 8, className = '' }: LoadingSkeletonProps) => {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-lg p-3 h-[320px] flex flex-col"
        >
          {/* Image skeleton */}
          <div className="relative w-full aspect-square mb-3 overflow-hidden rounded-md bg-gray-100">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-[shimmer_2s_infinite]" />
          </div>

          {/* Content skeleton */}
          <div className="flex-1 flex flex-col">
            {/* Title skeleton */}
            <div className="h-4 bg-gray-200 rounded mb-2 animate-[shimmer_2s_infinite]" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3 animate-[shimmer_2s_infinite]" />

            {/* Brand skeleton */}
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-3 animate-[shimmer_2s_infinite]" />

            {/* Price skeleton */}
            <div className="flex items-center gap-2 mb-3">
              <div className="h-5 bg-gray-200 rounded w-20 animate-[shimmer_2s_infinite]" />
              <div className="h-4 bg-gray-200 rounded w-16 animate-[shimmer_2s_infinite]" />
            </div>

            {/* Button skeleton */}
            <div className="h-8 bg-gray-200 rounded animate-[shimmer_2s_infinite]" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Individual card skeleton for when we need a single skeleton
export const ProductCardSkeleton = ({ className = '' }: { className?: string }) => {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-3 h-[320px] flex flex-col ${className}`}
    >
      {/* Image skeleton */}
      <div className="relative w-full aspect-square mb-3 overflow-hidden rounded-md bg-gray-100">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-[shimmer_2s_infinite]" />
      </div>

      {/* Content skeleton */}
      <div className="flex-1 flex flex-col">
        {/* Title skeleton */}
        <div className="h-4 bg-gray-200 rounded mb-2 animate-[shimmer_2s_infinite]" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3 animate-[shimmer_2s_infinite]" />

        {/* Brand skeleton */}
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-3 animate-[shimmer_2s_infinite]" />

        {/* Price skeleton */}
        <div className="flex items-center gap-2 mb-3">
          <div className="h-5 bg-gray-200 rounded w-20 animate-[shimmer_2s_infinite]" />
          <div className="h-4 bg-gray-200 rounded w-16 animate-[shimmer_2s_infinite]" />
        </div>

        {/* Button skeleton */}
        <div className="h-8 bg-gray-200 rounded animate-[shimmer_2s_infinite]" />
      </div>
    </div>
  );
};