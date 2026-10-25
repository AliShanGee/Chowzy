import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Modal from './Modal';

describe('Modal component', () => {
  test('renders children and has dialog accessibility attributes', () => {
    const handleClose = jest.fn();
    render(
      <Modal onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.getByText('Modal Content')).toBeInTheDocument();

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  test('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    render(
      <Modal onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );

    const closeButton = screen.getByRole('button', { name: /close modal/i });
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveAttribute('type', 'button');
    expect(closeButton).toHaveAttribute('title', 'Close modal');

    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when backdrop overlay is clicked', () => {
    const handleClose = jest.fn();
    render(
      <Modal onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    // Backdrop is the previous sibling of the dialog container in the portal
    const backdrop = dialog.previousSibling;
    expect(backdrop).toBeInTheDocument();
    fireEvent.click(backdrop);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
