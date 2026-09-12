import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

function Page({ totalPages, currentPage, onPageChange }) {
  let items = [];
  for (let number = 1; number <= totalPages; number++) {
    const isActive = number === currentPage;
    items.push(
      <Pagination.Item
        key={number}
        active={isActive}
        aria-label={`Go to page ${number}`}
        aria-current={isActive ? 'page' : undefined}
        onClick={(e) => { e.preventDefault(); onPageChange(number); }}
      >
        {number}
      </Pagination.Item>,
    );
  }

  return (
    <nav className="d-flex justify-content-center my-4" aria-label="Category pagination">
      <Pagination>
        <Pagination.Prev
          href="#"
          aria-label="Go to previous page"
          onClick={(e) => { e.preventDefault(); onPageChange(currentPage - 1); }}
          disabled={currentPage === 1}
        />
        {items}
        <Pagination.Next
          href="#"
          aria-label="Go to next page"
          onClick={(e) => { e.preventDefault(); onPageChange(currentPage + 1); }}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </nav>
  );
}

export default Page;