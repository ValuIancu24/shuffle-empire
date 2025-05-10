import React from 'react';
import './DebugButton.css';

function DebugButton({ onAddPoints }) {
  return (
    <div className="debug-button-container">
      <button 
        className="debug-button" 
        onClick={onAddPoints}
        title="Adds 1000K trillion SP for testing purposes"
      >
        + 1000K T SP
      </button>
    </div>
  );
}

export default DebugButton;