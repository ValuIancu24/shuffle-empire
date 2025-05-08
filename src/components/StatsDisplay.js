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
  // Format large numbers
  const formatNumber = (num) => {
    if (num < 1000) return num.toFixed(0);
    if (num < 1000000) return (num / 1000).toFixed(2) + 'K';
    if (num < 1000000000) return (num / 1000000).toFixed(2) + 'M';
    if (num < 1000000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num < 1000000000000000) return (num / 1000000000000).toFixed(2) + 'T';
    return num.toExponential(2);
  };

  // Format the 52! number
  const FACTORIAL_52 = '80,658,175,170,943,878,571,660,636,856,403,766,975,289,505,440,883,277,824,000,000,000,000';

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