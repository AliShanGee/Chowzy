import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from './Card';
import { CartProvider } from './ContextReducer';

const mockFoodItem = {
    _id: "1",
    name: "Pizza",
    img: "pizza.jpg",
    description: "Yummy Pizza",
    options: [{ regular: "100", medium: "200" }]
};

describe('Card Component', () => {
    test('renders food item details', () => {
        render(
            <CartProvider>
                <Card foodItem={mockFoodItem} options={mockFoodItem.options[0]} />
            </CartProvider>
        );
        expect(screen.getByText('Pizza')).toBeInTheDocument();
        expect(screen.getByText('Yummy Pizza')).toBeInTheDocument();
    });

    test('calculates final price correctly', () => {
        render(
            <CartProvider>
                <Card foodItem={mockFoodItem} options={mockFoodItem.options[0]} />
            </CartProvider>
        );
        const priceElement = screen.getByText(/PKR100\/-/);
        expect(priceElement).toBeInTheDocument();
    });
});
