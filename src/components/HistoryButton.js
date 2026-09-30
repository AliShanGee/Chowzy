import React from 'react';
import Lottie from 'lottie-react';
import historyAnimation from '../animations/History.json';

const HistoryButton = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick} 
      title="View order history"
      aria-label="View order history"
      className="d-flex flex-column align-items-center justify-content-center border-0 bg-transparent p-0"
      style={{ cursor: 'pointer', marginLeft: '15px', marginRight: '10px' }}
    >
      <div style={{ width: '35px', height: '35px', pointerEvents: 'none' }}>
        <Lottie animationData={historyAnimation} loop={true} />
      </div>
      <span style={{ fontSize: '12px', fontWeight: '600', lineHeight: '1', color: 'inherit' }}>My Order</span>
    </button>
  );
};

export default HistoryButton;