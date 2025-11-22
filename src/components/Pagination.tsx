import { useState, useEffect } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  productsPerPage?: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination = ({
  currentPage,
  totalPages,
  totalProducts,
  productsPerPage = 24,
  onPageChange,
  className = '',
}: PaginationProps) => {
  const [jumpToPage, setJumpToPage] = useState('');

  // Calculate showing range
  const startProduct = (currentPage - 1) * productsPerPage + 1;
  const endProduct = Math.min(currentPage * productsPerPage, totalProducts);

  // Generate page numbers with ellipsis
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than or equal to maxVisible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 4) {
        // Show pages 2-5
        for (let i = 2; i <= Math.min(5, totalPages - 1); i++) {
          pages.push(i);
        }
        if (totalPages > 6) {
          pages.push('...');
        }
        // Show last page
        if (totalPages > 5) {
          pages.push(totalPages);
        }
      } else if (currentPage >= totalPages - 3) {
        // Show ellipsis and last 5 pages
        pages.push('...');
        for (let i = Math.max(totalPages - 4, 2); i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show ellipsis, current page, and neighboring pages
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  // Handle page navigation
  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  // Handle jump to page
  const handleJumpToPage = () => {
    const page = parseInt(jumpToPage);
    if (page >= 1 && page <= totalPages) {
      handlePageClick(page);
      setJumpToPage('');
    }
  };

  // Handle jump input
  const handleJumpInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setJumpToPage(value);
    }
  };

  // Handle jump input key press
  const handleJumpKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJumpToPage();
    }
  };

  if (totalPages <= 1) {
    return null; // Don't show pagination if there's only one page
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 ${className}`}>
      {/* Products count */}
      <div className="text-sm text-gray-700 order-2 sm:order-1">
        Showing {startProduct}-{endProduct} of {totalProducts} products
      </div>

      {/* Mobile pagination (simplified) */}
      <div className="sm:hidden flex items-center gap-2 order-1 w-full justify-between">
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Previous
        </button>

        <div className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </div>

        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Next
        </button>
      </div>

      {/* Desktop pagination (full) */}
      <div className="hidden sm:flex items-center gap-1 order-2">
        {/* Previous button */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Previous page"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Page numbers */}
        {pageNumbers.map((page, index) => (
          <div key={index}>
            {page === '...' ? (
              <span className="px-3 py-2 text-sm text-gray-500">...</span>
            ) : (
              <button
                onClick={() => handlePageClick(page as number)}
                disabled={page === currentPage}
                className={`
                  px-3 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${page === currentPage
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }
                `}
                aria-label={`Go to page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            )}
          </div>
        ))}

        {/* Next button */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Next page"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Jump to page (only show if more than 10 pages) */}
      {totalPages > 10 && (
        <div className="flex items-center gap-2 order-3">
          <label htmlFor="jump-to-page" className="text-sm text-gray-700 whitespace-nowrap">
            Jump to page:
          </label>
          <input
            id="jump-to-page"
            type="text"
            value={jumpToPage}
            onChange={handleJumpInputChange}
            onKeyPress={handleJumpKeyPress}
            placeholder={totalPages.toString()}
            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={handleJumpToPage}
            disabled={!jumpToPage}
            className="px-2 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            Go
          </button>
        </div>
      )}
    </div>
  );
};