import React, { useState } from 'react';
import './ResetButton.css';

function ResetButton({ onReset }) {
  const [showConfirm, setShowConfirm] = useState(false);
  
  const handleReset = () => {
    setShowConfirm(true);
  };
  
  const confirmReset = () => {
    onReset();
    setShowConfirm(false);
  };
  
  const cancelReset = () => {
    setShowConfirm(false);
  };
  
  return (
    <div className="reset-container">
      {!showConfirm ? (
        <button className="reset-button" onClick={handleReset}>
          Reset Game
        </button>
      ) : (
        <div className="confirm-dialog">
          <p>Are you sure you want to reset all progress? This cannot be undone!</p>
          <div className="confirm-buttons">
            <button className="confirm-yes" onClick={confirmReset}>
              Yes, Reset Everything
            </button>
            <button className="confirm-no" onClick={cancelReset}>
              No, Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResetButton;