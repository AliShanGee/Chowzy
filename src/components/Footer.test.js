import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from './Footer';

jest.mock('react-router-dom', () => ({
  Link: ({ to, children, 'aria-label': ariaLabel, className }) => (
    <a href={to} aria-label={ariaLabel} className={className}>
      {children}
    </a>
  ),
}));

describe('Footer Component', () => {
  test('renders home link with proper branding and accessible ARIA label', () => {
    render(<Footer />);

    const homeLink = screen.getByRole('link', { name: /GoFood Home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
    expect(homeLink).toHaveTextContent('GoFood');
  });

  test('renders social links with appropriate labels and title attributes', () => {
    render(<Footer />);

    const instagramLink = screen.getByRole('link', { name: /Instagram/i });
    expect(instagramLink).toBeInTheDocument();
    expect(instagramLink).toHaveAttribute('title', 'Instagram');

    const facebookLink = screen.getByRole('link', { name: /Facebook/i });
    expect(facebookLink).toBeInTheDocument();
    expect(facebookLink).toHaveAttribute('title', 'Facebook');
  });
});
