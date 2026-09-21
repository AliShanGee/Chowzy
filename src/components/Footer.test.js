import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from './Footer';

jest.mock(
  'react-router-dom',
  () => ({
    Link: ({ to, children, ...props }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  }),
  { virtual: true }
);

describe('Footer Component', () => {
  test('renders GoFood brand link with correct ARIA label and text', () => {
    render(<Footer />);

    const brandLink = screen.getByRole('link', { name: /gofood home/i });
    expect(brandLink).toBeInTheDocument();
    expect(brandLink).toHaveTextContent('GoFood');
    expect(brandLink).toHaveAttribute('href', '/');
  });

  test('renders copyright notice', () => {
    render(<Footer />);

    expect(screen.getByText(/© 2025 GoFood, Inc/i)).toBeInTheDocument();
  });

  test('renders social media links with proper ARIA labels and titles', () => {
    render(<Footer />);

    const instagramLink = screen.getByRole('link', { name: /instagram/i });
    expect(instagramLink).toBeInTheDocument();
    expect(instagramLink).toHaveAttribute('href', 'https://instagram.com');
    expect(instagramLink).toHaveAttribute('title', 'Instagram');

    const facebookLink = screen.getByRole('link', { name: /facebook/i });
    expect(facebookLink).toBeInTheDocument();
    expect(facebookLink).toHaveAttribute('href', 'https://facebook.com');
    expect(facebookLink).toHaveAttribute('title', 'Facebook');
  });
});
