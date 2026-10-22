import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Chatbot from './Chatbot';

// Mock scrollIntoView which is not implemented in jsdom
window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe('Chatbot accessibility', () => {
  test('renders chatbot region with correct ARIA label', () => {
    render(<Chatbot />);
    const region = screen.getByRole('region', { name: /AI Food Assistant/i });
    expect(region).toBeInTheDocument();
  });

  test('renders logo with descriptive alt text', () => {
    render(<Chatbot />);
    const logo = screen.getByAltText('Food Assistant logo');
    expect(logo).toBeInTheDocument();
  });

  test('renders move left, move right, and history buttons with ARIA labels and titles', () => {
    render(<Chatbot />);
    const moveLeftBtn = screen.getByRole('button', { name: /Move chat window to left/i });
    expect(moveLeftBtn).toBeInTheDocument();
    expect(moveLeftBtn).toHaveAttribute('title', 'Move left');

    const moveRightBtn = screen.getByRole('button', { name: /Move chat window to right/i });
    expect(moveRightBtn).toBeInTheDocument();
    expect(moveRightBtn).toHaveAttribute('title', 'Move right');

    const historyBtn = screen.getByRole('button', { name: /View chat history/i });
    expect(historyBtn).toBeInTheDocument();
    expect(historyBtn).toHaveAttribute('title', 'View chat history');
  });

  test('renders prompt input and send button with explicit ARIA labels', () => {
    render(<Chatbot />);
    const input = screen.getByLabelText(/Ask food assistant a question/i);
    expect(input).toBeInTheDocument();

    const sendBtn = screen.getByRole('button', { name: /Send message to food assistant/i });
    expect(sendBtn).toBeInTheDocument();
  });
});
