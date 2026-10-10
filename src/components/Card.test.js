import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('@smastrom/react-rating/style.css', () => ({}), { virtual: true });

if (typeof window !== 'undefined' && window.SVGElement) {
    window.SVGElement.prototype.getBBox = () => ({ x: 0, y: 0, width: 0, height: 0 });
}

import Card from './Card';
import { CartProvider } from './ContextReducer';

const mockFoodItem = {
    _id: '123',
    name: 'Spicy Burger',
    description: 'A delicious spicy burger with fresh veggies and cheese.',
    img: 'https://via.placeholder.com/150',
    rating: 4.5
};

const mockOptions = {
    half: '150',
    full: '300'
};

describe('Card Component', () => {
    test('renders food item details correctly', () => {
        render(
            <CartProvider>
                <Card foodItem={mockFoodItem} options={mockOptions} />
            </CartProvider>
        );

        expect(screen.getByText('Spicy Burger')).toBeInTheDocument();
        expect(screen.getByText(/A delicious spicy burger/i)).toBeInTheDocument();
        expect(screen.getByText('half')).toBeInTheDocument();
        expect(screen.getByText('full')).toBeInTheDocument();
    });
});
