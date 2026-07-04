import React from 'react';
import Lottie from 'lottie-react';
import historyAnimation from '../animations/History.json';

const HistoryButton = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Order History"
      title="Order History"
      className="d-flex flex-column align-items-center justify-content-center focus-ring"
      style={{
        cursor: 'pointer',
        marginLeft: '15px',
        marginRight: '10px',
        border: 'none',
        backgroundColor: 'transparent',
        outline: 'none',
        padding: 0
      }}
    >
      <div style={{ width: '35px', height: '35px' }}>
        <Lottie animationData={historyAnimation} loop={true} />
      </div>
      <span style={{ fontSize: '12px', fontWeight: '600', lineHeight: '1', color: '#333' }}>My Order</span>
    </button>
  );
};

export default HistoryButton;