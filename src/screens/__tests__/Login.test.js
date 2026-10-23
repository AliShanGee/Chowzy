import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock(
  'react-router-dom',
  () => ({
    Link: ({ children, to, className }) => (
      <a href={to} className={className}>
        {children}
      </a>
    ),
    useNavigate: () => jest.fn(),
  }),
  { virtual: true }
);

jest.mock('lottie-react', () => () => <div data-testid="lottie-mock" />);
jest.mock('../../components/ContextReducer', () => ({
  useDispatchCart: () => jest.fn(),
  useCart: () => [],
}));

import Login from '../Login';

describe('Login component accessibility and UX', () => {
  test('renders animated title header with heading role and aria-label="Login"', () => {
    render(<Login />);

    const titleElement = screen.getByRole('heading', { name: 'Login' });
    expect(titleElement).toBeInTheDocument();
  });

  test('renders email and password inputs with correct autoComplete attributes', () => {
    render(<Login />);

    const emailInput = screen.getByPlaceholderText('Enter email');
    expect(emailInput).toHaveAttribute('autoComplete', 'email');

    const passwordInput = screen.getByPlaceholderText('Password');
    expect(passwordInput).toHaveAttribute('autoComplete', 'current-password');
  });

  test('renders password visibility toggle button with type="button" and aria-label', () => {
    render(<Login />);

    const toggleBtn = screen.getByRole('button', { name: 'Show password' });
    expect(toggleBtn).toBeInTheDocument();
    expect(toggleBtn).toHaveAttribute('type', 'button');
  });
});
