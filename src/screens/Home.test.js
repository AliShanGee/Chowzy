import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './Home';

// Mocks
jest.mock('lottie-react', () => () => <div data-testid="lottie-mock" />);
jest.mock('aos', () => ({ init: jest.fn() }));
jest.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light' }),
}));
jest.mock('../components/ContextReducer', () => ({
  useDispatchCart: () => jest.fn(),
  useCart: () => [],
}));
jest.mock('@smastrom/react-rating/style.css', () => ({}), { virtual: true });

beforeAll(() => {
  window.SVGElement.prototype.getBBox = () => ({ x: 0, y: 0, width: 0, height: 0 });
});

const mockCategories = [
  { _id: 'cat1', CategoryName: 'Biryani/Rice' },
  { _id: 'cat2', CategoryName: 'Pizza' },
  { _id: 'cat3', CategoryName: 'Biryani/Rice' }, // Duplicate category to test deduplication
];

const mockFoodItems = [
  {
    _id: 'item1',
    name: 'Chicken Biryani',
    CategoryName: 'Biryani/Rice',
    img: 'http://example.com/biryani.jpg',
    options: [{ half: '150', full: '300' }],
    description: 'Delicious chicken biryani',
  },
  {
    _id: 'item2',
    name: 'Veg Pizza',
    CategoryName: 'Pizza',
    img: 'http://example.com/pizza.jpg',
    options: [{ regular: '200', medium: '400' }],
    description: 'Cheesy veg pizza',
  },
  {
    _id: 'item3',
    name: 'Chicken Biryani', // Duplicate item in same category to test deduplication
    CategoryName: 'Biryani/Rice',
    img: 'http://example.com/biryani.jpg',
    options: [{ half: '150', full: '300' }],
    description: 'Delicious chicken biryani duplicate',
  },
];

describe('Home Screen Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([mockFoodItems, mockCategories]),
      })
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders categories without duplicates and displays food items', async () => {
    render(<Home />);

    expect(await screen.findByText('Chicken Biryani')).toBeInTheDocument();

    // Check that 'Biryani/Rice' header is rendered only once despite duplicate in data
    const categoryHeaders = screen.getAllByText('Biryani/Rice');
    expect(categoryHeaders).toHaveLength(1);

    // Check Pizza is rendered
    expect(screen.getByText('Pizza')).toBeInTheDocument();
    expect(screen.getByText('Veg Pizza')).toBeInTheDocument();

    // Check duplicate item is deduplicated
    const biryaniItems = screen.getAllByText('Chicken Biryani');
    expect(biryaniItems).toHaveLength(1);
  });

  it('filters food items when user searches', async () => {
    render(<Home />);

    expect(await screen.findByText('Chicken Biryani')).toBeInTheDocument();
    expect(screen.getByText('Veg Pizza')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText('What are you craving today?');
    fireEvent.change(searchInput, { target: { value: 'pizza' } });

    await waitFor(() => {
      expect(screen.queryByText('Chicken Biryani')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Veg Pizza')).toBeInTheDocument();
  });

  it('displays "No Such Data Found" when food items array is empty', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([[], mockCategories]),
      })
    );

    render(<Home />);

    await waitFor(() => {
      expect(screen.getAllByText('No Such Data Found').length).toBeGreaterThan(0);
    });
  });
});
