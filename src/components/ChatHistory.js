import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ChatHistory = ({ show, handleClose, chatHistory }) => {
  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Chat History</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {chatHistory.length === 0 ? (
          <div className="text-center p-4">
            <h5>No chat history found.</h5>
          </div>
        ) : (
          chatHistory.map((message, index) => (
            <div key={index} className={`mb-2 p-2 border rounded ${message.user ? 'bg-light' : 'bg-primary text-white'}`}>
              <strong>{message.user ? 'You' : 'Bot'}:</strong> {message.message}
            </div>
          ))
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChatHistory;