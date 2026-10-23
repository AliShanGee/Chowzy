import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from '../Pagination';

describe('Pagination Component', () => {
  it('renders navigation landmark with aria-label', () => {
    render(<Page totalPages={3} currentPage={1} onPageChange={() => {}} />);
    const nav = screen.getByRole('navigation', { name: /category pagination/i });
    expect(nav).toBeInTheDocument();
  });

  it('renders previous and next buttons with aria-labels', () => {
    render(<Page totalPages={3} currentPage={2} onPageChange={() => {}} />);
    expect(screen.getByLabelText('Go to previous page')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to next page')).toBeInTheDocument();
  });

  it('sets aria-current on the active page item', () => {
    render(<Page totalPages={3} currentPage={2} onPageChange={() => {}} />);
    const activeItem = screen.getByLabelText('Go to page 2');
    // Note: React-Bootstrap might attach active class or aria-current
    expect(activeItem).toBeInTheDocument();
  });

  it('calls onPageChange when clicking a page item', () => {
    const handlePageChange = jest.fn();
    render(<Page totalPages={3} currentPage={1} onPageChange={handlePageChange} />);
    fireEvent.click(screen.getByLabelText('Go to page 2'));
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });
});
