import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from './ThemeToggle';

const mockSetTheme = jest.fn();

jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: mockSetTheme,
  }),
}));

jest.mock('lottie-react', () => {
  return function DummyLottie() {
    return <div data-testid="lottie-animation" />;
  };
});

describe('ThemeToggle component', () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
  });

  test('renders semantic button with proper ARIA label and title', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /switch to dark mode/i });
    expect(button).toBeDefined();
    expect(button.getAttribute('type')).toBe('button');
    expect(button.getAttribute('title')).toBe('Switch to dark mode');
  });

  test('calls setTheme when clicked', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /switch to dark mode/i });
    fireEvent.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });
});
