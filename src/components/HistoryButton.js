import React from 'react';
import Lottie from 'lottie-react';
import historyAnimation from '../animations/History.json';

const HistoryButton = ({ onClick }) => {
  return (
    <div 
      onClick={onClick} 
      title="Order History"
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ cursor: 'pointer', marginLeft: '15px', marginRight: '10px' }}
    >
      <div style={{ width: '35px', height: '35px' }}>
        <Lottie animationData={historyAnimation} loop={true} />
      </div>
      <span style={{ fontSize: '12px', fontWeight: '600', lineHeight: '1', color: '#333' }}>My Order</span>
    </div>
  );
};

export default HistoryButton;