import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatHistory from './ChatHistory';

describe('ChatHistory component', () => {
  it('renders safely when chatHistory prop is undefined', () => {
    render(React.createElement(ChatHistory, { show: true, handleClose: () => {} }));
    expect(screen.getByText('No Chat History Found')).toBeInTheDocument();
    expect(screen.getByText('Your past conversations with the food assistant will appear here.')).toBeInTheDocument();
  });

  it('renders chat messages correctly when provided', () => {
    const history = [
      { user: true, message: 'Hello bot' },
      { user: false, message: 'Hello! How can I help you?' }
    ];
    render(React.createElement(ChatHistory, { show: true, handleClose: () => {}, chatHistory: history }));
    expect(screen.getByText('Hello bot')).toBeInTheDocument();
    expect(screen.getByText('Hello! How can I help you?')).toBeInTheDocument();
  });
});
