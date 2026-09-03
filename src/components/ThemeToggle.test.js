import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'next-themes';
import ThemeToggle from './ThemeToggle';

beforeAll(() => {
  window.matchMedia = window.matchMedia || function(query) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
  };
});

jest.mock('lottie-react', () => {
  return function DummyLottie() {
    return <div data-testid="lottie-animation" />;
  };
});

describe('ThemeToggle component', () => {
  test('renders as a button with accessible aria-label and switches theme on click', () => {
    render(
      <ThemeProvider defaultTheme="light" enableSystem={false}>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button', { name: /switch to dark mode/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');

    fireEvent.click(button);

    expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeInTheDocument();
  });
});
