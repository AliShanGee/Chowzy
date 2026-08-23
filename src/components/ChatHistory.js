import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ChatHistory = ({ show, handleClose, chatHistory = [] }) => {
  return (
    <Modal show={show} onHide={handleClose} centered size="lg" aria-labelledby="chat-history-title">
      <Modal.Header closeButton>
        <Modal.Title id="chat-history-title">Chat History</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {chatHistory.length === 0 ? (
          <div className="text-center p-4">
            <div className="mb-3" style={{ fontSize: '3rem' }} role="img" aria-label="Empty chat history icon">
              💬
            </div>
            <h5 className="fw-bold mb-2">No Chat History Found</h5>
            <p className="text-muted mb-0">Your past conversations with the food assistant will appear here.</p>
          </div>
        ) : (
          chatHistory.map((message, index) => (
            <div
              key={index}
              className={`mb-2 p-3 rounded ${
                message.user ? 'bg-light text-dark border' : 'bg-primary text-white shadow-sm'
              }`}
            >
              <strong>{message.user ? 'You' : 'Bot'}:</strong> {message.message}
            </div>
          ))
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} aria-label="Close chat history modal">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChatHistory;
