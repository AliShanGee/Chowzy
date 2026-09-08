import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThemeToggle from './ThemeToggle';
import { useTheme } from 'next-themes';

jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

jest.mock('lottie-react', () => () => <div data-testid="lottie-mock" />);

describe('ThemeToggle', () => {
  const mockSetTheme = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useTheme.mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });
  });

  test('renders as an accessible button with aria-label and aria-pressed', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /switch to dark theme/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  test('toggles theme when clicked', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /switch to dark theme/i });
    fireEvent.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  test('updates aria-label and aria-pressed when theme is dark', () => {
    useTheme.mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
    });
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /switch to light theme/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });
});
