import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

function Page({ totalPages, currentPage, onPageChange }) {
  let items = [];
  for (let number = 1; number <= totalPages; number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={(e) => { e.preventDefault(); onPageChange(number); }}
      >
        {number}
      </Pagination.Item>,
    );
  }

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

export default Page;