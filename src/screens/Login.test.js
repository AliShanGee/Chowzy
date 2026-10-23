import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

const mockNavigate = jest.fn();

// Mock react-router-dom completely to avoid v7 CJS resolution issues in Jest
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  Link: ({ to, children, className }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
  MemoryRouter: ({ children }) => <div>{children}</div>,
}));

// Mock other dependencies
jest.mock('lottie-react', () => () => <div data-testid="mock-lottie" />);
jest.mock('sweetalert2', () => ({
  fire: jest.fn().mockResolvedValue({ isConfirmed: true }),
}));

jest.mock('../components/ContextReducer', () => ({
  useDispatchCart: () => jest.fn(),
}));

jest.mock('../store/useUserStore', () => ({
  __esModule: true,
  default: (selector) => {
    const store = { setUser: jest.fn() };
    return selector ? selector(store) : store;
  },
}));

import Login from './Login';

describe('Login Component UX & Accessibility', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders email and password inputs with proper autocomplete attributes', () => {
    render(<Login />);

    const emailInput = screen.getByPlaceholderText('Enter email');
    const passwordInput = screen.getByPlaceholderText('Password');

    expect(emailInput).toHaveAttribute('autocomplete', 'email');
    expect(passwordInput).toHaveAttribute('autocomplete', 'current-password');
  });

  test('toggles password visibility and updates ARIA label', () => {
    render(<Login />);

    const toggleBtn = screen.getByRole('button', { name: 'Show password' });
    expect(toggleBtn).toBeInTheDocument();

    fireEvent.click(toggleBtn);
    expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(screen.getByRole('button', { name: 'Show password' })).toBeInTheDocument();
  });

  test('displays loading spinner and disables submit button during login request', async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              ok: true,
              json: async () => ({ success: true, authToken: 'fake-token', user: { email: 'test@example.com' } }),
            }),
          100
        )
      )
    );

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Enter email'), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

    const submitBtn = screen.getByRole('button', { name: 'Login' });
    fireEvent.click(submitBtn);

    expect(screen.getByRole('button', { name: /logging in\.\.\./i })).toBeDisabled();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/login'),
        expect.anything()
      );
    });
  });
});
