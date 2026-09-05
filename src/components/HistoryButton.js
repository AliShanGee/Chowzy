import React from 'react';
import Lottie from 'lottie-react';
import historyAnimation from '../animations/History.json';

const HistoryButton = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="View order history"
      title="Order History"
      className="d-flex flex-column align-items-center justify-content-center"
      style={{
        cursor: 'pointer',
        marginLeft: '15px',
        marginRight: '10px',
        border: 'none',
        background: 'transparent',
        padding: 0
      }}
    >
      <div style={{ width: '35px', height: '35px', pointerEvents: 'none' }}>
        <Lottie animationData={historyAnimation} loop={true} />
      </div>
      <span style={{ fontSize: '12px', fontWeight: '600', lineHeight: '1', color: '#333' }}>My Order</span>
    </button>
  );
};

export default HistoryButton;