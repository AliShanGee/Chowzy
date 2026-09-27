import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import IconSlideButton from './IconSlideButton';

describe('IconSlideButton', () => {
  it('renders button with correct text and default aria-label', () => {
    render(<IconSlideButton text="ADD TO CART" />);
    const button = screen.getByRole('button', { name: 'ADD TO CART' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
  });

  it('uses custom aria-label when provided', () => {
    render(<IconSlideButton text="ADD TO CART" aria-label="Add Pizza to cart" />);
    const button = screen.getByRole('button', { name: 'Add Pizza to cart' });
    expect(button).toBeInTheDocument();
  });

  it('triggers onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<IconSlideButton text="ADD TO CART" onClick={handleClick} />);
    const button = screen.getByRole('button', { name: 'ADD TO CART' });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
