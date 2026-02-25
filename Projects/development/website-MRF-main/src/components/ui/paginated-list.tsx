"use client";

import { useState, useMemo } from 'react';
import { Pagination } from './pagination';
import { cn } from '@/lib/utils';

interface PaginatedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemsPerPage?: number;
  className?: string;
  listClassName?: string;
  paginationClassName?: string;
  emptyState?: React.ReactNode;
  loadingState?: React.ReactNode;
  isLoading?: boolean;
}

export function PaginatedList<T>({
  items,
  renderItem,
  itemsPerPage = 20,
  className,
  listClassName,
  paginationClassName,
  emptyState,
  loadingState,
  isLoading = false,
}: PaginatedListProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of list when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading && loadingState) {
    return <div className={className}>{loadingState}</div>;
  }

  if (items.length === 0 && emptyState) {
    return <div className={className}>{emptyState}</div>;
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Items List */}
      <div className={listClassName} role="list" aria-label="قائمة العناصر">
        {paginatedItems.map((item, index) => (
          <div key={index} role="listitem">
            {renderItem(item, (currentPage - 1) * itemsPerPage + index)}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={items.length}
          itemsPerPage={itemsPerPage}
          className={paginationClassName}
        />
      )}
    </div>
  );
}

// Grid version for card layouts
interface PaginatedGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemsPerPage?: number;
  columns?: number;
  gap?: number;
  className?: string;
  gridClassName?: string;
  paginationClassName?: string;
  emptyState?: React.ReactNode;
  loadingState?: React.ReactNode;
  isLoading?: boolean;
}

export function PaginatedGrid<T>({
  items,
  renderItem,
  itemsPerPage = 20,
  columns = 3,
  gap = 6,
  className,
  gridClassName,
  paginationClassName,
  emptyState,
  loadingState,
  isLoading = false,
}: PaginatedGridProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of grid when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading && loadingState) {
    return <div className={className}>{loadingState}</div>;
  }

  if (items.length === 0 && emptyState) {
    return <div className={className}>{emptyState}</div>;
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Items Grid */}
      <div 
        className={cn(
          "grid",
          gridClassName
        )}
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: `${gap * 0.25}rem`,
        }}
        role="grid"
        aria-label="شبكة العناصر"
      >
        {paginatedItems.map((item, index) => (
          <div key={index} role="gridcell">
            {renderItem(item, (currentPage - 1) * itemsPerPage + index)}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={items.length}
          itemsPerPage={itemsPerPage}
          className={paginationClassName}
        />
      )}
    </div>
  );
}

export default PaginatedList;
