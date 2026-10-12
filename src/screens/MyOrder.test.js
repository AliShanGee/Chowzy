import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import MyOrder from './MyOrder.js';

// Mock Footer component
jest.mock('../components/Footer.js', () => () => <div data-testid="footer-mock">Footer</div>);

// Mock react-notifications-component
jest.mock('react-notifications-component', () => ({
  Store: {
    addNotification: jest.fn(),
  },
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  Link: ({ to, children, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

describe('MyOrder Component UX & Accessibility', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve({ orderData: null, deliveredData: [] }),
      })
    );
    localStorage.clear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('renders back button with accessible ARIA label and type="button"', async () => {
    await act(async () => {
      render(<MyOrder />);
    });

    const backButton = screen.getByRole('button', { name: /go back to previous page/i });
    expect(backButton).toBeInTheDocument();
    expect(backButton).toHaveAttribute('type', 'button');
  });

  test('renders accessible empty state card and CTA link when no orders exist', async () => {
    await act(async () => {
      render(<MyOrder />);
    });

    await waitFor(() => {
      expect(screen.getByText('No Past Orders Found')).toBeInTheDocument();
    });

    const ctaLink = screen.getByRole('link', { name: /explore food menu/i });
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute('href', '/');
    expect(ctaLink).toHaveAttribute('aria-label', 'Explore food menu to place an order');
  });
});
