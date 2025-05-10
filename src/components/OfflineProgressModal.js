import React from 'react';
import { GiCardRandom } from 'react-icons/gi';
import './OfflineProgressModal.css';

function OfflineProgressModal({ timeAway, shufflesGained, pointsGained, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="offline-modal">
        <div className="modal-header">
          <GiCardRandom className="modal-icon" />
          <h2>Welcome Back!</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-content">
          <p>While you were away for <span className="highlight">{timeAway}</span>, your shuffle empire continued to grow!</p>
          
          <div className="progress-details">
            <div className="progress-item">
              <div className="progress-label">Shuffles Generated:</div>
              <div className="progress-value">{shufflesGained}</div>
            </div>
            
            <div className="progress-item">
              <div className="progress-label">Shuffle Points Earned:</div>
              <div className="progress-value">{pointsGained}</div>
            </div>
          </div>
        </div>
        
        <button className="collect-button" onClick={onClose}>
          Collect and Continue
        </button>
      </div>
    </div>
  );
}

export default OfflineProgressModal;