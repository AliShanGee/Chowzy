import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Modal from './Modal';

describe('Modal component', () => {
  it('renders children and accessibility attributes correctly', () => {
    const handleClose = jest.fn();
    render(
      <Modal onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog', { name: /modal dialog/i });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('triggers onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    render(
      <Modal onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );

    const closeButton = screen.getByRole('button', { name: /close modal/i });
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveAttribute('type', 'button');

    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('triggers onClose when overlay backdrop is clicked', () => {
    const handleClose = jest.fn();
    render(
      <Modal onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );

    // Overlay is rendered into target portal body
    const overlay = document.querySelector('[aria-hidden="true"]');
    expect(overlay).not.toBeNull();

    fireEvent.click(overlay);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
