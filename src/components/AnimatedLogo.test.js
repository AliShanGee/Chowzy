import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnimatedLogo from './AnimatedLogo';

describe('AnimatedLogo Component', () => {
  test('renders logo container with role="img" and proper aria-label', () => {
    render(<AnimatedLogo text="Chowzy" />);

    const logoElement = screen.getByRole('img', { name: 'Chowzy' });
    expect(logoElement).toBeInTheDocument();
    expect(logoElement).toHaveAttribute('aria-label', 'Chowzy');
  });

  test('sets aria-hidden="true" on individual character spans', () => {
    const { container } = render(<AnimatedLogo text="Test" />);

    const charSpans = container.querySelectorAll('.animated-logo-char');
    expect(charSpans.length).toBe(4);
    charSpans.forEach(span => {
      expect(span).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
