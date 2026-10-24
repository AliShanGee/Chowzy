import React, { useMemo } from 'react';
import Pagination from 'react-bootstrap/Pagination';

// Bolt Optimization: Wrap component in React.memo and memoize items array creation
// to avoid unnecessary re-renders and JSX allocations when parent state (like search input) updates.
function Page({ totalPages, currentPage, onPageChange }) {
  const items = useMemo(() => {
    let result = [];
    for (let number = 1; number <= totalPages; number++) {
      const isCurrent = number === currentPage;
      result.push(
        <Pagination.Item
          key={number}
          active={isCurrent}
          onClick={(e) => { e.preventDefault(); onPageChange(number); }}
        >
          {number}
        </Pagination.Item>,
      );
    }
    return result;
  }, [totalPages, currentPage, onPageChange]);

  return (
    <div className="d-flex justify-content-center my-4">
      <Pagination>
        <Pagination.Prev href="#" onClick={(e) => { e.preventDefault(); onPageChange(currentPage - 1); }} disabled={currentPage === 1} />
        {items}
        <Pagination.Next href="#" onClick={(e) => { e.preventDefault(); onPageChange(currentPage + 1); }} disabled={currentPage === totalPages} />
      </Pagination>
    </div>
  );
}

export default React.memo(Page);