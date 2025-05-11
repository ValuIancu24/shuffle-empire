import React from 'react';
import { 
  GiCardRandom,
  GiPerson,
  GiCardExchange,
  GiDiamondHard,
  GiFactoryArm,
  GiTeacher,
  GiRingedPlanet,
  GiClockwiseRotation,
  GiCardPlay,
  GiAlienStare,
  GiAtom,
  GiTimeTrap,
  GiSpaceShuttle,
  GiFactory
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
    if (num < 1e18) return (num / 1e15).toFixed(2) + 'Qa';
    if (num < 1e21) return (num / 1e18).toFixed(2) + 'Qi';
    if (num < 1e24) return (num / 1e21).toFixed(2) + 'Sx';
    if (num < 1e27) return (num / 1e24).toFixed(2) + 'Sp';
    return num.toExponential(2);
  };

  // Format decimal values for multipliers - IMPROVED FOR BETTER DISPLAY
  const formatDecimal = (num) => {
    if (num === 0) return '0';
    // Always show at least 1 decimal place for multipliers
    if (num < 10) return num.toFixed(1);
    return formatNumber(num);
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
      case 'cardFactory': return 'Card Factory';
      case 'shufflePortal': return 'Shuffle Portal';
      case 'parallelUniverse': return 'Parallel Universe';
      case 'quantumComputer': return 'Quantum Computer';
      case 'temporalField': return 'Temporal Field';
      case 'realityBender': return 'Reality Bender';
      case 'universalFactory': return 'Universal Factory';
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
      case 'cardFactory': return <GiCardPlay />;
      case 'shufflePortal': return <GiRingedPlanet />;
      case 'parallelUniverse': return <GiRingedPlanet />;
      case 'quantumComputer': return <GiAtom />;
      case 'temporalField': return <GiTimeTrap />;
      case 'realityBender': return <GiSpaceShuttle />;
      case 'universalFactory': return <GiFactory />;
      default: return <GiCardRandom />;
    }
  };

  // Calculate non-linear value for flat automators with more moderate scaling
  const getFlatAutomatorValue = (baseValue, level, key) => {
    if (level === 0) return 0;
    
    // Apply more moderate scaling factors
    let scalingFactor = 1.0; // Default scaling
    
    // Apply higher scaling factors for higher tier automators - but more moderate
    if (key === 'cardDealer') scalingFactor = 1.05;
    else if (key === 'shuffleMachine') scalingFactor = 1.1;
    else if (key === 'cardAI') scalingFactor = 1.15;
    else if (key === 'quantumComputer' || key === 'universalFactory') scalingFactor = 1.2;
    
    // Create more moderate triangular scaling
    let value = 0;
    for (let i = 1; i <= level; i++) {
      value += i * scalingFactor;
    }
    
    return baseValue * value;
  };
  
  // Get multiplier automator value (bonus only, not total multiplier) - SIMPLIFIED TO MATCH GAME.JS
  const getMultiplierValue = (automator, level) => {
    if (level === 0) return 0; // Return 0 for level 0 (no bonus)
    
    // For consistency with Game.js - simple fixed values per level
    if (automator === 'cardFactory') {
      // Each level adds 0.2x
      return level * 0.2;
    } else if (automator === 'shufflePortal') {
      // Each level adds 0.5x
      return level * 0.5;
    } else if (automator === 'parallelUniverse') {
      // Each level adds 1.0x
      return level * 1.0;
    } else if (automator === 'realityBender') {
      // Each level adds 2.0x
      return level * 2.0;
    } else {
      // Default bonus is 0.1 * level
      return level * 0.1;
    }
  };

  // Get automator effect (current value)
  const getAutomatorEffect = (key, level) => {
    const automator = automators[key];
    
    if (!automator || level === 0) return '0';
    
    if (automator.type === 'flat') {
      // Use non-linear scaling for flat automators
      return formatNumber(getFlatAutomatorValue(automator.production, level, key));
    } else if (automator.type === 'percentage') {
      // Calculate multiplicative percentage increase with more moderate boosts
      let boostFactor = automator.percentage / 100;
      
      // Apply higher boost factors for higher tier automators - but more moderate
      if (key === 'shuffleTrainer') boostFactor *= 1.05;
      else if (key === 'timeAccelerator') boostFactor *= 1.1;
      else if (key === 'temporalField') boostFactor *= 1.15;
      
      const multiplier = Math.pow(1 + boostFactor, level);
      const percentage = (multiplier - 1) * 100;
      
      // Format the percentage value
      return formatPercentage(percentage);
    } else if (automator.type === 'multiplier') {
      // FIXED: Always use formatDecimal for all multiplier values to show proper decimals
      return `${formatDecimal(getMultiplierValue(key, level))}x`;
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
      const currentValue = getFlatAutomatorValue(automator.production, level, key);
      const nextValue = getFlatAutomatorValue(automator.production, nextLevel, key);
      return `+${formatNumber(nextValue - currentValue)}`;
    } else if (automator.type === 'multiplier') {
      // FIXED - calculate the bonus increase from current to next level with proper formatting
      // For fixed level multipliers, simply return the increment
      if (key === 'cardFactory') {
        return `+0.2x`;
      } else if (key === 'shufflePortal') {
        return `+0.5x`;
      } else if (key === 'parallelUniverse') {
        return `+1.0x`;
      } else if (key === 'realityBender') {
        return `+2.0x`;
      } else {
        return `+0.1x`;
      }
    } else if (automator.type === 'percentage') {
      // Quality bonus percentage calculation with more moderate values
      let boostFactor = automator.percentage / 100;
      
      // Apply higher boost factors for higher tier automators - but more moderate
      if (key === 'shuffleTrainer') boostFactor *= 1.05;
      else if (key === 'timeAccelerator') boostFactor *= 1.1;
      else if (key === 'temporalField') boostFactor *= 1.15;
      
      // For first level, show the direct percentage
      if (level === 0) {
        return `+${(boostFactor * 100).toFixed(1)}%`;
      }
      
      // For subsequent levels, calculate the actual increase
      const currentMultiplier = Math.pow(1 + boostFactor, level);
      const nextMultiplier = Math.pow(1 + boostFactor, nextLevel);
      
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