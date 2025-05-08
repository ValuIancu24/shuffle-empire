import React from 'react';
import { GiCardExchange, GiCardPlay, GiCardRandom } from 'react-icons/gi';
import './UpgradePanel.css';

function UpgradePanel({ manualUpgrades, shufflePoints, onBuyUpgrade }) {
  // Format large numbers
  const formatNumber = (num) => {
    if (num < 1000) return num.toFixed(0);
    if (num < 1000000) return (num / 1000).toFixed(2) + 'K';
    if (num < 1000000000) return (num / 1000000).toFixed(2) + 'M';
    if (num < 1000000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num < 1000000000000000) return (num / 1000000000000).toFixed(2) + 'T';
    return num.toExponential(2);
  };

  // Get current upgrade effect
  const getCurrentEffect = (upgrade, level) => {
    if (upgrade === 'technique') {
      const values = [1, 3, 5, 8, 11, 15, 20, 26, 33, 41];
      return `${level < values.length ? values[level] : values[values.length-1]} per click`;
    }
    else if (upgrade === 'cardQuality') {
      return `+${(level * 30)}% efficiency`;
    }
    else if (upgrade === 'multiDeck') {
      const multipliers = [1, 2, 3, 6, 10, 15];
      return `×${level < multipliers.length ? multipliers[level] : multipliers[multipliers.length-1]}`;
    }
  };
  
  // Get next level upgrade effect
  const getNextEffect = (upgrade, level) => {
    const nextLevel = level + 1;
    
    if (upgrade === 'technique') {
      const values = [1, 3, 5, 8, 11, 15, 20, 26, 33, 41];
      if (nextLevel >= values.length) return "MAX";
      return `${values[nextLevel]} per click`;
    }
    else if (upgrade === 'cardQuality') {
      return `+${(nextLevel * 30)}% efficiency`;
    }
    else if (upgrade === 'multiDeck') {
      const multipliers = [1, 2, 3, 6, 10, 15];
      if (nextLevel >= multipliers.length) return "MAX";
      return `×${multipliers[nextLevel]}`;
    }
  };

  // Upgrade descriptions and icons
  const upgradeDetails = {
    technique: {
      name: 'Shuffle Technique',
      description: 'Improve your shuffling technique to get more shuffles per click',
      icon: <GiCardRandom />
    },
    cardQuality: {
      name: 'Card Quality',
      description: 'Better cards means more efficient shuffling',
      icon: <GiCardPlay />
    },
    multiDeck: {
      name: 'Multi-Deck Handling',
      description: 'Learn to shuffle multiple decks at once',
      icon: <GiCardExchange />
    }
  };

  return (
    <div className="upgrade-panel">
      <h2>Manual Upgrades</h2>
      <div className="upgrades-list">
        {Object.keys(manualUpgrades).map(key => (
          <div 
            key={key} 
            className={`upgrade-item ${shufflePoints >= manualUpgrades[key].cost ? 'can-buy' : 'cannot-buy'}`}
            onClick={() => onBuyUpgrade(key)}
          >
            <div className="upgrade-icon">{upgradeDetails[key].icon}</div>
            <div className="upgrade-info">
              <h3>{upgradeDetails[key].name}</h3>
              <p className="upgrade-description">{upgradeDetails[key].description}</p>
              <div className="upgrade-details">
                <span className="upgrade-level">Level: {manualUpgrades[key].level}</span>
                <span className="upgrade-effect">
                  Current: {getCurrentEffect(key, manualUpgrades[key].level)}
                </span>
              </div>
              <div className="upgrade-details">
                <span className="upgrade-next">
                  Next: {getNextEffect(key, manualUpgrades[key].level)}
                </span>
                <span className="upgrade-cost">
                  Cost: {formatNumber(manualUpgrades[key].cost)} SP
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UpgradePanel;