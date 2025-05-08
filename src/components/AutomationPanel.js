import React from 'react';
import { 
  GiCardRandom 
} from 'react-icons/gi';
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

  // Get name for each automator
  const getAutomatorName = (key) => {
    switch(key) {
      case 'noviceShuffler': return 'Novice Shuffler';
      case 'cardDealer': return 'Card Dealer';
      case 'shuffleMachine': return 'Shuffle Machine';
      case 'cardAI': return 'Card Shuffling AI';
      case 'deckEnhancer': return 'Deck Enhancer';
      case 'shuffleTrainer': return 'Shuffle Trainer';
      case 'timeAccelerator': return 'Time Accelerator';
      case 'cardFactory': return 'Card Factory';
      case 'shufflePortal': return 'Shuffle Portal';
      case 'parallelUniverse': return 'Parallel Universe';
      default: return key;
    }
  };

  // Get automator effect (current value)
  const getAutomatorEffect = (key, level) => {
    const automator = automators[key];
    
    if (!automator || level === 0) return '0';
    
    if (automator.type === 'flat') {
      return formatNumber(automator.production * level);
    } else if (automator.type === 'percentage') {
      return `${automator.percentage * level}%`;
    } else if (automator.type === 'multiplier') {
      return `${formatNumber(Math.pow(automator.multiplier, level))}×`;
    }
    
    return '0';
  };

  // Get next level effect description (showing difference)
  const getNextLevelEffect = (key, level) => {
    const nextLevel = level + 1;
    const automator = automators[key];
    
    if (nextLevel > automator.maxLevel) return "MAX";
    
    if (automator.type === 'flat') {
      // Show the amount added for the next level
      return `+${formatNumber(automator.production)}`;
    } else if (automator.type === 'multiplier') {
      // Show the factor increase
      const currentMultiplier = level > 0 ? Math.pow(automator.multiplier, level) : 1;
      const nextMultiplier = Math.pow(automator.multiplier, nextLevel);
      const factor = nextMultiplier / currentMultiplier;
      return `×${factor.toFixed(2)}`;
    } else if (automator.type === 'percentage') {
      // Show the percentage increase
      return `+${automator.percentage}%`;
    }
    
    return 'Unknown';
  };

  return (
    <div className="automation-panel">
      <h2>Automation</h2>
      <div className="automators-list">
        {Object.keys(automators).map(key => {
          const automator = automators[key];
          const isMaxLevel = automator.level >= automator.maxLevel;
          
          return (
            <div 
              key={key} 
              className={`automator-item ${isMaxLevel ? 'max-level' : shufflePoints >= automator.cost ? 'can-buy' : 'cannot-buy'}`}
              onClick={() => !isMaxLevel && onBuyAutomator(key)}
            >
              <div className="automator-icon"><GiCardRandom /></div>
              <div className="automator-info">
                <div className="automator-header">
                  <h3>{getAutomatorName(key)}</h3>
                  <span className="automator-level">
                    Level: {automator.level}/{automator.maxLevel}
                  </span>
                </div>
                <p className="automator-description">{automator.description || 'No description'}</p>
                <div className="automator-details">
                  <span className="automator-production">
                    Current: {getAutomatorEffect(key, automator.level)}
                  </span>
                  {!isMaxLevel && (
                    <span className="automator-next-level">
                      Next: {getNextLevelEffect(key, automator.level)}
                    </span>
                  )}
                </div>
                {!isMaxLevel ? (
                  <div className="automator-cost">
                    Cost: {formatNumber(automator.cost)} SP
                  </div>
                ) : (
                  <div className="automator-max-level">
                    MAX LEVEL
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AutomationPanel;