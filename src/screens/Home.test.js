import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './Home';

// Mock dependencies
jest.mock('aos', () => ({
  init: jest.fn(),
}));

jest.mock('lottie-react', () => {
  return function DummyLottie() {
    return <div data-testid="lottie-bg" />;
  };
});

jest.mock('../components/Footer', () => {
  return function DummyFooter() {
    return <footer data-testid="footer">Footer</footer>;
  };
});

jest.mock('../components/Card', () => {
  return function DummyCard({ foodItem }) {
    return <div data-testid="food-card">{foodItem.name}</div>;
  };
});

jest.mock('../components/SearchBar', () => {
  return function DummySearchBar({ onSearch }) {
    return (
      <input
        data-testid="search-input"
        placeholder="Search food"
        onChange={(e) => onSearch(e.target.value)}
      />
    );
  };
});

describe('Home Screen Filtering and Deduplication', () => {
  const mockCategories = [
    { _id: 'cat1', CategoryName: 'Pizza' },
    { _id: 'cat2', CategoryName: 'Burger' },
    { _id: 'cat3', CategoryName: 'Pizza' } // duplicate category
  ];

  const mockFoodItems = [
    { _id: 'item1', name: 'Margherita Pizza', CategoryName: 'Pizza', options: [{ regular: '200' }] },
    { _id: 'item2', name: 'Margherita Pizza', CategoryName: 'Pizza', options: [{ regular: '200' }] }, // duplicate item
    { _id: 'item3', name: 'Pepperoni Pizza', CategoryName: 'Pizza', options: [{ regular: '300' }] },
    { _id: 'item4', name: 'Cheeseburger', CategoryName: 'Burger', options: [{ regular: '150' }] }
  ];

  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [mockFoodItems, mockCategories],
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders deduplicated categories and food items correctly', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Pizza')).toBeInTheDocument();
    });

    expect(screen.getByText('Burger')).toBeInTheDocument();

    const pizzaCategories = screen.getAllByText('Pizza');
    expect(pizzaCategories).toHaveLength(1);

    const cards = screen.getAllByTestId('food-card');
    expect(cards).toHaveLength(3); // Margherita, Pepperoni, Cheeseburger (no duplicates)
    expect(screen.getByText('Margherita Pizza')).toBeInTheDocument();
    expect(screen.getByText('Pepperoni Pizza')).toBeInTheDocument();
    expect(screen.getByText('Cheeseburger')).toBeInTheDocument();
  });
});
