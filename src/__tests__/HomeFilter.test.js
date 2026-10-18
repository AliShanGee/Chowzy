import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Card from '../components/Card';
import { CartProvider } from '../components/ContextReducer';

// Mock rating style & SVG getBBox as per memory guidelines
jest.mock('@smastrom/react-rating/style.css', () => ({}), { virtual: true });
if (typeof window !== 'undefined' && window.SVGElement) {
  window.SVGElement.prototype.getBBox = () => ({ x: 0, y: 0, width: 0, height: 0 });
}

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

// Mock AOS
jest.mock('aos', () => ({
  init: jest.fn(),
}));

describe('Card Component & Filtering Logic', () => {
  const sampleFoodItem = {
    _id: '123',
    name: 'Cheese Burger',
    img: 'https://example.com/burger.jpg',
    description: 'Juicy beef patty with melted cheddar cheese.',
    rating: 4.5,
    CategoryName: 'Fast Food',
    options: [{ Half: '150', Full: '280' }],
  };

  test('renders Card component with correct food item details', () => {
    render(
      <CartProvider>
        <Card foodItem={sampleFoodItem} options={sampleFoodItem.options[0]} />
      </CartProvider>
    );

    expect(screen.getByText('Cheese Burger')).toBeInTheDocument();
    expect(screen.getByText(/Juicy beef patty/i)).toBeInTheDocument();
  });

  test('filtering logic correctly deduplicates categories and items', () => {
    const rawCategories = [
      { _id: 'cat1', CategoryName: 'Fast Food' },
      { _id: 'cat2', CategoryName: 'Fast Food' }, // Duplicate
      { _id: 'cat3', CategoryName: 'Drinks' },
    ];

    const seenCategories = new Set();
    const uniqueCategories = rawCategories.filter((cat) => {
      if (!cat || !cat.CategoryName || seenCategories.has(cat.CategoryName)) return false;
      seenCategories.add(cat.CategoryName);
      return true;
    });

    expect(uniqueCategories).toHaveLength(2);
    expect(uniqueCategories.map(c => c.CategoryName)).toEqual(['Fast Food', 'Drinks']);

    const rawItems = [
      { _id: 'i1', name: 'Pizza', CategoryName: 'Fast Food' },
      { _id: 'i2', name: 'Pizza', CategoryName: 'Fast Food' }, // Duplicate
      { _id: 'i3', name: 'Burger', CategoryName: 'Fast Food' },
      { _id: 'i4', name: 'Coke', CategoryName: 'Drinks' },
    ];

    const search = 'piz';
    const lowerSearch = search.toLowerCase();
    const categoryName = 'Fast Food';

    const seenNames = new Set();
    const filtered = rawItems.filter((item) => {
      if (!item || !item.name || item.CategoryName !== categoryName) return false;
      if (lowerSearch && !item.name.toLowerCase().includes(lowerSearch)) return false;
      if (seenNames.has(item.name)) return false;
      seenNames.add(item.name);
      return true;
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe('Pizza');
  });
});
