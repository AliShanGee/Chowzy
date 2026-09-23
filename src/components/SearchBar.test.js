import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  const mockItems = [
    { name: 'Spaghetti (Bolognese)', CategoryName: 'Pasta', img: 'pasta.jpg' },
    { name: 'Chicken Pizza', CategoryName: 'Pizza', img: 'pizza.jpg' },
  ];

  it('renders search input and responds to input change without throwing on regex characters', () => {
    const handleSearch = jest.fn();
    render(<SearchBar items={mockItems} onSearch={handleSearch} />);

    const input = screen.getByPlaceholderText('What are you craving today?');
    expect(input).toBeInTheDocument();

    // Fire event with regex special character '('
    fireEvent.change(input, { target: { value: '(' } });

    expect(handleSearch).toHaveBeenCalledWith('(');
  });
});
