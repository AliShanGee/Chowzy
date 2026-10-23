import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

function Page({ totalPages, currentPage, onPageChange }) {
  let items = [];
  for (let number = 1; number <= totalPages; number++) {
    const isCurrent = number === currentPage;
    items.push(
      <Pagination.Item
        key={number}
        active={isCurrent}
        aria-label={`Go to page ${number}`}
        aria-current={isCurrent ? 'page' : undefined}
        onClick={(e) => { e.preventDefault(); onPageChange(number); }}
      >
        {number}
      </Pagination.Item>,
    );
  }

  return (
    <nav className="d-flex justify-content-center my-4" aria-label="Pagination">
      <Pagination>
        <Pagination.Prev
          href="#"
          aria-label="Go to previous page"
          aria-disabled={currentPage === 1}
          onClick={(e) => { e.preventDefault(); if (currentPage > 1) onPageChange(currentPage - 1); }}
          disabled={currentPage === 1}
        />
        {items}
        <Pagination.Next
          href="#"
          aria-label="Go to next page"
          aria-disabled={currentPage === totalPages}
          onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) onPageChange(currentPage + 1); }}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </nav>
  );
}

export default Page;