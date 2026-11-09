import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThemeToggle from './ThemeToggle';

const mockSetTheme = jest.fn();
let mockCurrentTheme = 'light';

jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: mockCurrentTheme,
    setTheme: mockSetTheme,
  }),
}));

jest.mock('lottie-react', () => {
  return function MockLottie() {
    return <div data-testid="lottie-animation" />;
  };
});

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
    mockCurrentTheme = 'light';
  });

  it('renders a button with accessible label and title for dark mode switch when theme is light', () => {
    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /switch to dark mode/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('title', 'Switch to dark mode');
  });

  it('renders a button with accessible label and title for light mode switch when theme is dark', () => {
    mockCurrentTheme = 'dark';
    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /switch to light mode/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('title', 'Switch to light mode');
  });

  it('calls setTheme with toggled theme on click', () => {
    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /switch to dark mode/i });
    fireEvent.click(button);

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });
});
