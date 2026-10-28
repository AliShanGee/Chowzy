import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnimatedLogo from './AnimatedLogo';

describe('AnimatedLogo component', () => {
  test('renders container with role="img" and aria-label and hides character spans from screen readers', () => {
    const { container } = render(<AnimatedLogo text="Chowzy" />);

    const logoContainer = screen.getByRole('img', { name: 'Chowzy' });
    expect(logoContainer).toBeInTheDocument();

    const charSpans = container.querySelectorAll('.animated-logo-char');
    expect(charSpans.length).toBe(6);
    charSpans.forEach((charSpan) => {
      expect(charSpan).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
