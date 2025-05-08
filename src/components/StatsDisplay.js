import React from 'react';
import './StatsDisplay.css';

function StatsDisplay({ 
  shuffleCount, 
  shufflesPerSecond, 
  shufflesPerClick, 
  shufflePoints,
  logProgressPercent,
  progressPercent 
}) {
  // Format large numbers with better notation
  const formatNumber = (num) => {
    if (num < 1000) return num.toFixed(0);
    if (num < 1000000) return (num / 1000).toFixed(2) + 'K';
    if (num < 1000000000) return (num / 1000000).toFixed(2) + 'M'; 
    if (num < 1000000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num < 1000000000000000) return (num / 1000000000000).toFixed(2) + 'T';
    if (num < 1000000000000000000) return (num / 1000000000000000).toFixed(2) + 'Qa';
    if (num < 1e21) return (num / 1e18).toFixed(2) + 'Qi';
    if (num < 1e24) return (num / 1e21).toFixed(2) + 'Sx';
    if (num < 1e27) return (num / 1e24).toFixed(2) + 'Sp';
    // For extremely large numbers, use scientific notation
    return num.toExponential(2);
  };

  // Format the 52! number
  const FACTORIAL_52 = '8.07 × 10^67';

  return (
    <div className="stats-display">
      <div className="stats-row">
        <div className="stat-box">
          <h3>Total Shuffles</h3>
          <p className="stat-value">{formatNumber(shuffleCount)}</p>
        </div>
        <div className="stat-box">
          <h3>Shuffle Points</h3>
          <p className="stat-value">{formatNumber(shufflePoints)}</p>
        </div>
        <div className="stat-box">
          <h3>Per Click</h3>
          <p className="stat-value">{formatNumber(shufflesPerClick)}</p>
        </div>
        <div className="stat-box">
          <h3>Per Second</h3>
          <p className="stat-value">{formatNumber(shufflesPerSecond)}</p>
        </div>
      </div>

      <div className="progress-section">
        <h3>Progress to 52! ({FACTORIAL_52})</h3>
        
        <div className="progress-bar-container">
          <div className="progress-label">Logarithmic Progress</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.max(0.01, logProgressPercent)}%` }}></div>
          </div>
          <div className="progress-value">{logProgressPercent.toFixed(6)}%</div>
        </div>
        
        <div className="progress-bar-container">
          <div className="progress-label">Linear Progress</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.max(0.01, progressPercent)}%` }}></div>
          </div>
          <div className="progress-value">{progressPercent.toExponential(6)}%</div>
        </div>
      </div>
    </div>
  );
}

export default StatsDisplay;