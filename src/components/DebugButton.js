import React from 'react';
import './DebugButton.css';

function DebugButton({ onAddPoints }) {
  return (
    <div className="debug-button-container">
      <button 
        className="debug-button" 
        onClick={onAddPoints}
        title="Adds 1 nonillion SP for testing purposes"
      >
        + 1 Nonillion SP
      </button>
    </div>
  );
}

export default DebugButton;