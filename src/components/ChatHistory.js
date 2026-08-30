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
            <span role="img" aria-label="Decorative speech bubbles icon" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '10px' }}>
              💬
            </span>
            <h5 className="fw-semibold">No chat history found</h5>
            <p className="text-muted small mb-0">
              Start a conversation with the Food Assistant to see your message history here.
            </p>
          </div>
        ) : (
          chatHistory.map((message, index) => (
            <div key={index} className={`mb-2 p-2 border rounded ${message.user ? 'bg-light text-dark' : 'bg-primary text-white'}`}>
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