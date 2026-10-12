import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../Home';

jest.mock('@smastrom/react-rating/style.css', () => ({}), { virtual: true });
jest.mock('aos', () => ({
  init: jest.fn(),
}));
jest.mock('lottie-react', () => () => <div data-testid="lottie-mock" />);
jest.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'dark', setTheme: jest.fn() }),
}));

// Mock ContextReducer dispatched cart
jest.mock('../../components/ContextReducer', () => ({
  useDispatchCart: () => jest.fn(),
  useCart: () => [],
}));

describe('Home screen optimization and functionality', () => {
  beforeAll(() => {
    window.SVGElement.prototype.getBBox = () => ({ x: 0, y: 0, width: 0, height: 0 });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders categories and deduplicated food items correctly', async () => {
    const mockFoodItems = [
      {
        _id: '1',
        name: 'Paneer Pizza',
        CategoryName: 'Pizza',
        options: [{ regular: '100', medium: '200' }],
        description: 'Delicious cheesy pizza with paneer',
        img: 'https://example.com/pizza.jpg',
      },
      {
        _id: '2',
        name: 'Paneer Pizza', // Duplicate item name
        CategoryName: 'Pizza',
        options: [{ regular: '100', medium: '200' }],
        description: 'Duplicate pizza',
        img: 'https://example.com/pizza.jpg',
      },
      {
        _id: '3',
        name: 'Chicken Biryani',
        CategoryName: 'Biryani',
        options: [{ half: '150', full: '300' }],
        description: 'Spicy chicken biryani',
        img: 'https://example.com/biryani.jpg',
      },
    ];

    const mockCategories = [
      { _id: 'cat1', CategoryName: 'Pizza' },
      { _id: 'cat2', CategoryName: 'Pizza' }, // Duplicate category
      { _id: 'cat3', CategoryName: 'Biryani' },
    ];

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([mockFoodItems, mockCategories]),
      })
    );

    await act(async () => {
      render(<Home />);
    });

    expect(screen.getByText(/Explore Amazing Foods/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Pizza')).toBeInTheDocument();
      expect(screen.getByText('Biryani')).toBeInTheDocument();
    });

    // Verify paneer pizza is deduplicated to 1 instance
    const pizzaTitles = screen.getAllByText('Paneer Pizza');
    expect(pizzaTitles).toHaveLength(1);
  });
});
