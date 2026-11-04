import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './Home';

// Mocks
jest.mock('aos', () => ({
  init: jest.fn(),
}));

jest.mock('lottie-react', () => () => <div data-testid="lottie-animation" />);

jest.mock('../components/Footer.js', () => () => <div data-testid="footer">Footer</div>);

jest.mock('../components/Card.js', () => ({ foodItem }) => (
  <div data-testid={`card-${foodItem.name}`}>{foodItem.name}</div>
));

jest.mock('../components/Pagination.js', () => ({ totalPages, currentPage, onPageChange }) => (
  <div data-testid="pagination">
    <span>Page {currentPage} of {totalPages}</span>
    <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
  </div>
));

jest.mock('../components/SearchBar.js', () => ({ onSearch }) => (
  <input
    placeholder="Search food"
    onChange={(e) => onSearch(e.target.value)}
    data-testid="search-bar"
  />
));

jest.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

describe('Home Screen Component', () => {
  const mockCategories = [
    { _id: 'cat1', CategoryName: 'Pizza' },
    { _id: 'cat2', CategoryName: 'Pizza' }, // Duplicate category
    { _id: 'cat3', CategoryName: 'Burger' },
  ];

  const mockFoodItems = [
    { _id: 'item1', name: 'Margherita Pizza', CategoryName: 'Pizza', options: [{ regular: 200 }] },
    { _id: 'item2', name: 'Margherita Pizza', CategoryName: 'Pizza', options: [{ regular: 200 }] }, // Duplicate item
    { _id: 'item3', name: 'Pepperoni Pizza', CategoryName: 'Pizza', options: [{ regular: 350 }] },
    { _id: 'item4', name: 'Veggie Burger', CategoryName: 'Burger', options: [{ regular: 150 }] },
  ];

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([mockFoodItems, mockCategories]),
      })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders unique categories and deduplicated food items', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Pizza')).toBeInTheDocument();
    });

    expect(screen.getByText('Burger')).toBeInTheDocument();
    expect(screen.getAllByText('Pizza')).toHaveLength(1);

    expect(screen.getByTestId('card-Margherita Pizza')).toBeInTheDocument();
    expect(screen.getAllByTestId('card-Margherita Pizza')).toHaveLength(1);
    expect(screen.getByTestId('card-Pepperoni Pizza')).toBeInTheDocument();
    expect(screen.getByTestId('card-Veggie Burger')).toBeInTheDocument();
  });

  it('filters food items correctly on search input', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByTestId('card-Margherita Pizza')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('search-bar');
    fireEvent.change(searchInput, { target: { value: 'pepp' } });

    expect(screen.getByTestId('card-Pepperoni Pizza')).toBeInTheDocument();
    expect(screen.queryByTestId('card-Margherita Pizza')).not.toBeInTheDocument();
    expect(screen.queryByTestId('card-Veggie Burger')).not.toBeInTheDocument();
  });
});
