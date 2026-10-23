import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from './Pagination';

describe('Pagination component', () => {
  it('renders navigation landmark and accessibility attributes', () => {
    const handlePageChange = jest.fn();
    render(<Page totalPages={3} currentPage={2} onPageChange={handlePageChange} />);

    // Check nav element with aria-label
    const navElement = screen.getByRole('navigation', { name: /category pagination/i });
    expect(navElement).toBeInTheDocument();

    // Check previous button (when active on page 2)
    const prevButton = screen.getByRole('button', { name: /go to previous page/i });
    expect(prevButton).toBeInTheDocument();

    // Check next button
    const nextButton = screen.getByRole('button', { name: /go to next page/i });
    expect(nextButton).toBeInTheDocument();

    // Check active page 2 item (renders as span with aria-current="page")
    const page2 = screen.getByLabelText('Go to page 2');
    expect(page2).toHaveAttribute('aria-current', 'page');

    // Check inactive page 1 item (renders as button link)
    const page1 = screen.getByRole('button', { name: /go to page 1/i });
    expect(page1).not.toHaveAttribute('aria-current');
  });

  it('triggers onPageChange when page item or next button is clicked', () => {
    const handlePageChange = jest.fn();
    render(<Page totalPages={3} currentPage={1} onPageChange={handlePageChange} />);

    const page2 = screen.getByRole('button', { name: /go to page 2/i });
    fireEvent.click(page2);
    expect(handlePageChange).toHaveBeenCalledWith(2);

    const nextButton = screen.getByRole('button', { name: /go to next page/i });
    fireEvent.click(nextButton);
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });
});
