import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThemeToggle from './ThemeToggle';

const mockSetTheme = jest.fn();

jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: mockSetTheme,
  }),
}));

// Mock lottie-react
jest.mock('lottie-react', () => {
  return function DummyLottie() {
    return <div data-testid="lottie-animation" />;
  };
});

describe('ThemeToggle component', () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
  });

  test('renders semantic button with aria-label and handles click', () => {
    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /switch to dark mode/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');

    fireEvent.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });
});
