import React from 'react';
import { 
  GiCardRandom,
  GiPerson,
  GiCardExchange,
  GiDiamondHard,
  GiFactoryArm,
  GiTeacher,
  GiUbisoftSun,
  GiClockwiseRotation,
  GiCardPlay,
  GiAlienStare
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

  // Format percentage values
  const formatPercentage = (value) => {
    if (value < 1000) {
      return `${value.toFixed(1)}%`;
    } else {
      return `${formatNumber(value)}%`;
    }
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
      case 'cardFactory': return 'Card Factory'; // Changed from GiCardburn to GiCardPlay
      case 'shufflePortal': return 'Shuffle Portal';
      case 'parallelUniverse': return 'Parallel Universe';
      default: return key;
    }
  };

  // Get icon for each automator
  const getAutomatorIcon = (key) => {
    switch(key) {
      case 'noviceShuffler': return <GiPerson />;
      case 'cardDealer': return <GiCardExchange />;
      case 'shuffleMachine': return <GiFactoryArm />;
      case 'cardAI': return <GiAlienStare />;
      case 'deckEnhancer': return <GiDiamondHard />;
      case 'shuffleTrainer': return <GiTeacher />;
      case 'timeAccelerator': return <GiClockwiseRotation />;
      case 'cardFactory': return <GiCardPlay />; // Changed from GiCardburn to GiCardPlay
      case 'shufflePortal': return <GiUbisoftSun />;
      case 'parallelUniverse': return <GiUbisoftSun />;
      default: return <GiCardRandom />;
    }
  };

  // Calculate non-linear value for flat automators
  const getFlatAutomatorValue = (baseValue, level) => {
    if (level === 0) return 0;
    
    // Create a triangular scaling (1, 3, 6, 10, 15...)
    let value = 0;
    for (let i = 1; i <= level; i++) {
      value += i;
    }
    return baseValue * value;
  };
  
  // Get multiplier automator value (bonus only, not total multiplier)
  const getMultiplierValue = (automator, level) => {
    if (level === 0) return 0; // Return 0 for level 0 (no bonus)
    
    // Initial bonus values for levels 1-10
    let baseValues;
    let growthFactor;
    
    if (automator === 'cardFactory') {
      // Base values (changed from [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10])
      baseValues = [0, 1, 2, 3, 4, 5, 7, 9, 11, 15]; 
      growthFactor = 1.2; // 20% growth per level after level 10
    } else if (automator === 'shufflePortal') {
      // Base values (changed from [1, 2, 3, 5, 8, 13, 21, 34, 55, 89])
      baseValues = [0, 2, 4, 8, 12, 20, 35, 55, 80, 120]; 
      growthFactor = 1.3; // 30% growth per level after level 10
    } else if (automator === 'parallelUniverse') {
      // Base values (changed from [1, 3, 9, 27, 81, 243, 729, 2187, 6561, 19683])
      baseValues = [0, 3, 10, 30, 90, 250, 750, 2200, 6500, 20000]; 
      growthFactor = 1.5; // 50% growth per level after level 10
    } else {
      // Default bonus is level itself
      return level;
    }
    
    // For levels 1-10, use the predefined values
    if (level < baseValues.length) {
      return baseValues[level];
    }
    
    // For levels above 10, calculate based on growth factor
    let value = baseValues[baseValues.length - 1];
    for (let i = baseValues.length; i <= level; i++) {
      value = Math.floor(value * growthFactor);
    }
    
    return value;
  };

  // Get automator effect (current value)
  const getAutomatorEffect = (key, level) => {
    const automator = automators[key];
    
    if (!automator || level === 0) return '0';
    
    if (automator.type === 'flat') {
      // Use non-linear scaling for flat automators
      return formatNumber(getFlatAutomatorValue(automator.production, level));
    } else if (automator.type === 'percentage') {
      // Calculate multiplicative percentage increase
      const multiplier = Math.pow(1 + (automator.percentage / 100), level);
      const percentage = (multiplier - 1) * 100;
      
      // Format the percentage value
      return formatPercentage(percentage);
    } else if (automator.type === 'multiplier') {
      // Show only the bonus (no + sign)
      return `${formatNumber(getMultiplierValue(key, level))}x`;
    }
    
    return '0';
  };

  // Get next level effect description (showing difference)
  const getNextLevelEffect = (key, level) => {
    const nextLevel = level + 1;
    const automator = automators[key];
    
    if (nextLevel > automator.maxLevel) return "MAX";
    
    if (automator.type === 'flat') {
      // Calculate the actual increase for flat automators
      const currentValue = getFlatAutomatorValue(automator.production, level);
      const nextValue = getFlatAutomatorValue(automator.production, nextLevel);
      return `+${formatNumber(nextValue - currentValue)}`;
    } else if (automator.type === 'multiplier') {
      // Calculate the bonus increase from current to next level
      const current = getMultiplierValue(key, level);
      const next = getMultiplierValue(key, nextLevel);
      return `+${formatNumber(next - current)}x`;
    } else if (automator.type === 'percentage') {
      // Quality bonus percentage calculation
      const bonus = automator.percentage;
      
      // For first level, show the direct percentage
      if (level === 0) {
        return `+${bonus}%`;
      }
      
      // For subsequent levels, calculate the actual increase
      const currentMultiplier = Math.pow(1 + (bonus / 100), level);
      const nextMultiplier = Math.pow(1 + (bonus / 100), nextLevel);
      
      // Calculate percentage increase from current to next level
      const increaseFactor = ((nextMultiplier / currentMultiplier) - 1) * 100;
      
      // Format the percentage increase
      if (increaseFactor < 1000) {
        return `+${increaseFactor.toFixed(1)}%`;
      } else {
        return `+${formatNumber(increaseFactor)}%`;
      }
    }
    
    return 'Unknown';
  };

  // Get production type label based on automator type
  const getProductionLabel = (type) => {
    switch(type) {
      case 'flat': return 'Production';
      case 'percentage': return 'Bonus';
      case 'multiplier': return 'Multiplier';
      default: return 'Effect';
    }
  };

  return (
    <div className="automation-panel">
      <h2>Automation</h2>
      <div className="automators-list">
        {Object.keys(automators).map(key => {
          const automator = automators[key];
          const isMaxLevel = automator.level >= automator.maxLevel;
          const canBuy = shufflePoints >= automator.cost;
          
          return (
            <div 
              key={key} 
              className={`automator-item automator-type-${automator.type} ${isMaxLevel ? 'max-level' : canBuy ? 'can-buy' : 'cannot-buy'}`}
              onClick={() => !isMaxLevel && canBuy && onBuyAutomator(key)}
            >
              <div className="automator-icon">{getAutomatorIcon(key)}</div>
              
              <div className="automator-info">
                <div className="automator-header">
                  <h3>{getAutomatorName(key)}</h3>
                  <span className="automator-level">
                    Lvl {automator.level}/{automator.maxLevel}
                  </span>
                </div>
                
                <p className="automator-description">{automator.description || 'No description'}</p>
                
                {!isMaxLevel ? (
                  <>
                    <div className="automator-effects">
                      <div className="effect-current">
                        <span className="effect-label">
                          <span className={`type-icon type-icon-${automator.type}`}></span>
                          {getProductionLabel(automator.type)}
                        </span>
                        <span className="effect-value">{getAutomatorEffect(key, automator.level)}</span>
                      </div>
                      
                      <span className="effect-arrow">→</span>
                      
                      <div className="effect-next">
                        <span className="effect-label">Next</span>
                        <span className="effect-value">{getNextLevelEffect(key, automator.level)}</span>
                      </div>
                    </div>
                    
                    <div className="automator-cost-wrapper">
                      <span className="cost-label">Cost:</span>
                      <span className="cost-value">{formatNumber(automator.cost)} SP</span>
                    </div>
                  </>
                ) : (
                  <div className="max-level-badge">MAXIMUM LEVEL REACHED</div>
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