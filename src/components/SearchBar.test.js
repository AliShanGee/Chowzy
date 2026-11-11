import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from './SearchBar';

describe('SearchBar component', () => {
  const dummyItems = [
    { name: 'Veg Pizza', CategoryName: 'Pizza', img: 'pizza.jpg' },
    { name: 'Chicken Biryani', CategoryName: 'Biryani', img: 'biryani.jpg' }
  ];

  it('renders input with accessible aria-label and placeholder', () => {
    const handleSearch = jest.fn();
    render(<SearchBar items={dummyItems} onSearch={handleSearch} />);

    const input = screen.getByRole('combobox', { name: /search food items/i });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'What are you craving today?');
  });

  it('renders clear button with accessible label when input has value and clears input on click', () => {
    const handleSearch = jest.fn();
    render(<SearchBar items={dummyItems} onSearch={handleSearch} />);

    const input = screen.getByRole('combobox', { name: /search food items/i });
    fireEvent.change(input, { target: { value: 'Pizza' } });

    const clearButton = screen.getByRole('button', { name: /clear search input/i });
    expect(clearButton).toBeInTheDocument();
    expect(clearButton).toHaveAttribute('title', 'Clear search');

    fireEvent.click(clearButton);
    expect(handleSearch).toHaveBeenCalledWith('');
    expect(input).toHaveValue('');
  });

  it('triggers onSearch when search button is clicked', () => {
    const handleSearch = jest.fn();
    render(<SearchBar items={dummyItems} onSearch={handleSearch} />);

    const input = screen.getByRole('combobox', { name: /search food items/i });
    fireEvent.change(input, { target: { value: 'Biryani' } });

    const searchButton = screen.getByRole('button', { name: /search food items/i });
    expect(searchButton).toBeInTheDocument();
    fireEvent.click(searchButton);

    expect(handleSearch).toHaveBeenCalledWith('Biryani');
  });
});
