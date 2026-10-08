import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThemeToggle from './ThemeToggle';
import { useTheme } from 'next-themes';

jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

jest.mock('lottie-react', () => () => <div data-testid="mock-lottie" />);

describe('ThemeToggle', () => {
  it('renders a button with correct aria-label and title for dark theme', () => {
    const mockSetTheme = jest.fn();
    useTheme.mockReturnValue({ theme: 'dark', setTheme: mockSetTheme });

    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /switch to light mode/i });
    expect(button).toBeDefined();
    expect(button.getAttribute('title')).toBe('Switch to light mode');

    fireEvent.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('renders a button with correct aria-label and title for light theme', () => {
    const mockSetTheme = jest.fn();
    useTheme.mockReturnValue({ theme: 'light', setTheme: mockSetTheme });

    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /switch to dark mode/i });
    expect(button).toBeDefined();
    expect(button.getAttribute('title')).toBe('Switch to dark mode');

    fireEvent.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });
});
