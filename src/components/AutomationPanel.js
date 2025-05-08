import React from 'react';
import { GiCardRandom, GiCardDraw, GiCardDiscard, GiCardAceSpades } from 'react-icons/gi';
import './AutomationPanel.css';

function AutomationPanel({ automators, shufflePoints, onBuyAutomator }) {
  // Format large numbers
  const formatNumber = (num) => {
    if (num < 1000) return num.toFixed(0);
    if (num < 1000000) return (num / 1000).toFixed(2) + 'K';
    if (num < 1000000000) return (num / 1000000).toFixed(2) + 'M';
    if (num < 1000000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num < 1000000000000000) return (num / 1000000000000).toFixed(2) + 'T';
    return num.toExponential(2);
  };

  // Automator details and icons
  const automatorDetails = {
    noviceShuffler: {
      name: 'Novice Shuffler',
      description: 'A beginner who can slowly shuffle cards for you',
      icon: <GiCardRandom />,
      production: level => automators.noviceShuffler.production * Math.pow(1.5, level)
    },
    cardDealer: {
      name: 'Card Dealer',
      description: 'A professional casino dealer with quick hands',
      icon: <GiCardDraw />,
      production: level => automators.cardDealer.production * Math.pow(1.5, level)
    },
    shuffleMachine: {
      name: 'Shuffle Machine',
      description: 'An automated machine that shuffles cards rapidly',
      icon: <GiCardDiscard />,
      production: level => automators.shuffleMachine.production * Math.pow(1.5, level)
    }
  };

  return (
    <div className="automation-panel">
      <h2>Automation</h2>
      <div className="automators-list">
        {Object.keys(automators).map(key => (
          <div 
            key={key} 
            className={`automator-item ${shufflePoints >= automators[key].cost ? 'can-buy' : 'cannot-buy'}`}
            onClick={() => onBuyAutomator(key)}
          >
            <div className="automator-icon">{automatorDetails[key].icon}</div>
            <div className="automator-info">
              <div className="automator-header">
                <h3>{automatorDetails[key].name}</h3>
                <span className="automator-count">Owned: {automators[key].count}</span>
              </div>
              <p className="automator-description">{automatorDetails[key].description}</p>
              <div className="automator-details">
                <span className="automator-level">
                  Level: {automators[key].level}
                </span>
                <span className="automator-production">
                  Production: {formatNumber(automatorDetails[key].production(automators[key].level))}/sec
                </span>
              </div>
              <div className="automator-cost">
                Cost: {formatNumber(automators[key].cost)} SP
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AutomationPanel;