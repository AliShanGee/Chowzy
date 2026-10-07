import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotFound from '../NotFound';

// Mock react-router-dom to avoid react-router v7 module resolution issues in Jest
jest.mock('react-router-dom', () => ({
    Link: ({ to, href, children, ...props }) => (
        <a href={to || href} {...props}>
            {children}
        </a>
    )
}));

describe('NotFound Component', () => {
    it('renders 404 heading, message, icon with role="img", and CTA button with aria-label', () => {
        render(<NotFound />);

        // Check 404 display and heading
        expect(screen.getByText('404')).toBeInTheDocument();
        expect(screen.getByText(/Either you typed a wrong URL/i)).toBeInTheDocument();

        // Check icon accessibility
        const icon = screen.getByRole('img', { name: /Searching for food plate/i });
        expect(icon).toBeInTheDocument();

        // React-Bootstrap Button with as={Link} explicitly renders role="button" on the anchor tag
        const buttonLink = screen.getByRole('button', { name: /Return to food menu home page/i });
        expect(buttonLink).toBeInTheDocument();
        expect(buttonLink).toHaveAttribute('href', '/');
    });
});
