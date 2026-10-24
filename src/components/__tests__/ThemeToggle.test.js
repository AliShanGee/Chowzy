import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThemeToggle from '../ThemeToggle';

const mockSetTheme = jest.fn();

jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'dark',
    setTheme: mockSetTheme,
  }),
}));

jest.mock('lottie-react', () => {
  return function MockLottie() {
    return <div data-testid="lottie-animation">Lottie Animation</div>;
  };
});

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders a button with proper ARIA attributes when theme is dark', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /switch to light mode/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('title', 'Switch to light mode');
  });

  it('calls setTheme with light when clicked in dark mode', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /switch to light mode/i });
    fireEvent.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });
});
