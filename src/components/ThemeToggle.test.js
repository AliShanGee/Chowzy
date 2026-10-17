import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThemeToggle from './ThemeToggle';
import { useTheme } from 'next-themes';

jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

jest.mock('lottie-react', () => () => <div data-testid="lottie-animation" />);

describe('ThemeToggle', () => {
  it('renders as a semantic button with proper ARIA label and toggles theme', () => {
    const setThemeMock = jest.fn();
    useTheme.mockReturnValue({
      theme: 'dark',
      setTheme: setThemeMock,
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /switch to light mode/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');

    fireEvent.click(button);
    expect(setThemeMock).toHaveBeenCalledWith('light');
  });
});
