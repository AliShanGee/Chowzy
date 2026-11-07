import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThemeToggle from './ThemeToggle';
import { useTheme } from 'next-themes';

jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

jest.mock('lottie-react', () => {
  return function MockLottie() {
    return <div data-testid="lottie-animation" />;
  };
});

describe('ThemeToggle', () => {
  const setThemeMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders button with accessible label in light mode and handles click to toggle to dark', () => {
    useTheme.mockReturnValue({ theme: 'light', setTheme: setThemeMock });

    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: 'Switch to dark mode' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('title', 'Switch to dark mode');

    fireEvent.click(button);
    expect(setThemeMock).toHaveBeenCalledWith('dark');
  });

  test('renders button with accessible label in dark mode and handles click to toggle to light', () => {
    useTheme.mockReturnValue({ theme: 'dark', setTheme: setThemeMock });

    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: 'Switch to light mode' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('title', 'Switch to light mode');

    fireEvent.click(button);
    expect(setThemeMock).toHaveBeenCalledWith('light');
  });
});
