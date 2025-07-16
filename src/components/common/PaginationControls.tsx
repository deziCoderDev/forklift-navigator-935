
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  startIndex: number;
  endIndex: number;
  totalItems: number;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  canGoPrevious,
  canGoNext,
  startIndex,
  endIndex,
  totalItems
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate range around current page
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust range if too close to start or end
      if (currentPage <= 3) {
        end = Math.min(4, totalPages - 1);
      }
      if (currentPage >= totalPages - 2) {
        start = Math.max(totalPages - 3, 2);
      }
      
      // Add ellipsis if needed
      if (start > 2) {
        pages.push('...');
      }
      
      // Add pages around current
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }
      
      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="pagination-container mt-8">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 p-6 bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-lg">
        {/* Results info */}
        <div className="pagination-info">
          <span className="text-sm font-medium text-slate-300 tracking-wide">
            Mostrando <span className="font-bold text-white">{startIndex}</span> a{' '}
            <span className="font-bold text-white">{endIndex}</span> de{' '}
            <span className="font-bold text-blue-400">{totalItems}</span> empilhadeiras
          </span>
        </div>

        {/* Pagination controls */}
        <div className="pagination-controls flex items-center gap-2">
          {/* Previous button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!canGoPrevious}
            className={cn(
              "pagination-btn prev h-10 px-4 bg-slate-700/50 border-slate-600/50 text-slate-200",
              "hover:bg-slate-600/60 hover:border-slate-500/50 hover:text-white",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-all duration-200 ease-out",
              "flex items-center gap-2 font-medium tracking-wide"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Anterior</span>
          </Button>

          {/* Page numbers */}
          <div className="pagination-numbers flex items-center gap-1 mx-3">
            {getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-3 py-2 text-slate-500 font-medium">...</span>
                ) : (
                  <button
                    onClick={() => onPageChange(page as number)}
                    className={cn(
                      "page-number w-10 h-10 rounded-lg font-semibold text-sm",
                      "transition-all duration-200 ease-out",
                      "border border-transparent",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                      currentPage === page
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25 border-blue-400/30"
                        : "bg-slate-700/40 text-slate-300 border-slate-600/30 hover:bg-slate-600/50 hover:text-white hover:border-slate-500/40"
                    )}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Next button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!canGoNext}
            className={cn(
              "pagination-btn next h-10 px-4 bg-slate-700/50 border-slate-600/50 text-slate-200",
              "hover:bg-slate-600/60 hover:border-slate-500/50 hover:text-white",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-all duration-200 ease-out",
              "flex items-center gap-2 font-medium tracking-wide"
            )}
          >
            <span className="hidden sm:inline">Próxima</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaginationControls;
