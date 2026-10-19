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
  return function DummyLottie() {
    return <div data-testid="lottie-animation">Lottie Animation</div>;
  };
});

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
    mockCurrentTheme = 'light';
  });

  it('renders a button with correct aria-label and title for light theme', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /switch to dark mode/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('title', 'Switch to dark mode');
  });

  it('renders a button with correct aria-label and title for dark theme', () => {
    mockCurrentTheme = 'dark';
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /switch to light mode/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('title', 'Switch to light mode');
  });

  it('calls setTheme when clicked', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /switch to dark mode/i });
    fireEvent.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });
});
