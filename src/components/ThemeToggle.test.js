import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from 'next-themes';

jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

jest.mock('lottie-react', () => () => <div data-testid="mock-lottie" />);

describe('ThemeToggle component', () => {
  const mockSetTheme = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useTheme.mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
    });
  });

  it('renders a semantic button element with accessible ARIA label and title', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /switch to light mode/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('title', 'Switch to light mode');
  });

  it('calls setTheme with light mode when clicked in dark mode', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /switch to light mode/i });
    fireEvent.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('renders accessible label for switching to dark mode when currently in light mode', () => {
    useTheme.mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /switch to dark mode/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('title', 'Switch to dark mode');
  });
});
