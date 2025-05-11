import React from 'react';
import { 
  GiCardRandom,
  GiUpgrade,
  GiCardPlay,
  GiCardAceSpades,
  GiCardJoker,
  GiMagicSwirl,
  GiCubes,
  GiAtom,
  GiSpaceNeedle,
  GiEternalLove
} from 'react-icons/gi';
import './UpgradePanel.css';

function UpgradePanel({ manualUpgrades, shufflePoints, onBuyUpgrade }) {
  // Format large numbers with scientific notation
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

  // Format decimal values for multipliers
  const formatDecimal = (num) => {
    if (num === 0) return '0';
    if (num < 0.1) return num.toFixed(2);
    if (num < 1) return num.toFixed(1);
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

  // Get current upgrade effect (absolute value)
  const getCurrentEffect = (upgrade, level) => {
    if (upgrade === 'technique' || upgrade === 'advancedTechnique' || upgrade === 'quantumTechnique') {
      // Technique values - non-linear scaling with more moderate values
      if (upgrade === 'technique') {
        // More moderate values for technique (Fibonacci sequence)
        const values = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 
                      1597, 2584, 4181, 6765, 10946];
        
        // For levels within defined array, return the array value
        if (level < values.length) {
          return formatNumber(values[level]);
        }
        
        // For levels beyond array, calculate with Fibonacci growth
        let prev = values[values.length - 2];
        let curr = values[values.length - 1];
        
        for (let i = values.length; i <= level; i++) {
          const next = prev + curr;
          prev = curr;
          curr = next;
        }
        
        return formatNumber(curr);
      } else if (upgrade === 'advancedTechnique') {
        // More moderate values for advanced technique
        const values = [0, 10, 20, 40, 80, 160, 320, 640, 1280, 2560, 5120]; 
        
        if (level < values.length) {
          return formatNumber(values[level]);
        }
        
        // Growth for advanced technique is more moderate
        let value = values[values.length - 1];
        const growthFactor = 1.25; // 25% growth after level 10
        
        for (let i = values.length; i <= level; i++) {
          value = Math.floor(value * growthFactor);
        }
        
        return formatNumber(value);
      } else { // quantumTechnique
        // Quantum technique values - high values but more moderate
        const values = [0, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 128000, 256000, 512000];
                       
        if (level < values.length) {
          return formatNumber(values[level]);
        }
        
        // Growth for quantum technique is still high but more moderate
        let value = values[values.length - 1];
        const growthFactor = 1.5; // 50% growth per level
        
        for (let i = values.length; i <= level; i++) {
          value = Math.floor(value * growthFactor);
        }
        
        return formatNumber(value);
      }
    }
    else if (upgrade === 'cardQuality' || upgrade === 'cardEnchantment' || upgrade === 'cosmicCards') {
      // More moderate percentage bonuses
      const bonus = upgrade === 'cardQuality' ? 10 : // 10% per level (down from 40%)
                  upgrade === 'cardEnchantment' ? 15 : // 15% per level (down from 70%)
                  20; // 20% per level for cosmic cards (down from 100%)
      
      // Calculate multiplicative percentage increase
      const multiplier = Math.pow(1 + (bonus / 100), level);
      const percentage = (multiplier - 1) * 100;
      
      return formatPercentage(percentage);
    }
    else if (upgrade === 'multiDeck' || upgrade === 'deckDimension' || upgrade === 'infinityDeck') {
      // For multiplier upgrades - SIMPLIFIED TO MATCH GAME.JS LOGIC
      // Each level adds directly to the multiplier
      
      if (upgrade === 'multiDeck') {
        // Each level adds 1x (level 5 = +5x multiplier)
        return `${level}x`;
      } else if (upgrade === 'deckDimension') {
        // Each level adds 2x (level 5 = +10x multiplier)
        return `${level * 2}x`;
      } else { // infinityDeck
        // Each level adds 5x (level 5 = +25x multiplier)
        return `${level * 5}x`;
      }
    }
    return '0'; // Default fallback
  };
  
  // Get next level upgrade effect (difference from current)
  const getNextEffect = (upgrade, level) => {
    const nextLevel = level + 1;
    
    if (nextLevel > manualUpgrades[upgrade].maxLevel) return "MAX";
    
    if (upgrade === 'technique' || upgrade === 'advancedTechnique' || upgrade === 'quantumTechnique') {
      // Calculate raw values
      let currentValue, nextValue;
      
      if (upgrade === 'technique') {
        // Fibonacci sequence for technique
        const values = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 
                      1597, 2584, 4181, 6765, 10946];
        
        // Get current value
        if (level < values.length) {
          currentValue = values[level];
        } else {
          // Calculate Fibonacci number for current level
          let a = values[values.length - 2];
          let b = values[values.length - 1];
          for (let i = values.length; i <= level; i++) {
            const temp = a + b;
            a = b;
            b = temp;
          }
          currentValue = b;
        }
        
        // Get next value
        if (nextLevel < values.length) {
          nextValue = values[nextLevel];
        } else {
          // Calculate Fibonacci number for next level
          let a = values[values.length - 2];
          let b = values[values.length - 1];
          for (let i = values.length; i <= nextLevel; i++) {
            const temp = a + b;
            a = b;
            b = temp;
          }
          nextValue = b;
        }
      } else if (upgrade === 'advancedTechnique') {
        const values = [0, 10, 20, 40, 80, 160, 320, 640, 1280, 2560, 5120];
        
        // Get current value
        if (level < values.length) {
          currentValue = values[level];
        } else {
          currentValue = values[values.length - 1];
          const growthFactor = 1.25;
          for (let i = values.length; i <= level; i++) {
            currentValue = Math.floor(currentValue * growthFactor);
          }
        }
        
        // Get next value
        if (nextLevel < values.length) {
          nextValue = values[nextLevel];
        } else {
          nextValue = values[values.length - 1];
          const growthFactor = 1.25;
          for (let i = values.length; i <= nextLevel; i++) {
            nextValue = Math.floor(nextValue * growthFactor);
          }
        }
      } else { // quantumTechnique
        const values = [0, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 128000, 256000, 512000];
        
        // Get current value
        if (level < values.length) {
          currentValue = values[level];
        } else {
          currentValue = values[values.length - 1];
          const growthFactor = 1.5;
          for (let i = values.length; i <= level; i++) {
            currentValue = Math.floor(currentValue * growthFactor);
          }
        }
        
        // Get next value
        if (nextLevel < values.length) {
          nextValue = values[nextLevel];
        } else {
          nextValue = values[values.length - 1];
          const growthFactor = 1.5;
          for (let i = values.length; i <= nextLevel; i++) {
            nextValue = Math.floor(nextValue * growthFactor);
          }
        }
      }
      
      // Calculate the difference and format
      const difference = nextValue - currentValue;
      return `+${formatNumber(difference)}`;
    }
    else if (upgrade === 'cardQuality' || upgrade === 'cardEnchantment' || upgrade === 'cosmicCards') {
      // Quality bonus percentage calculation with more moderate values
      const bonus = upgrade === 'cardQuality' ? 10 : // 10% per level
                  upgrade === 'cardEnchantment' ? 15 : // 15% per level
                  20; // 20% per level for cosmic cards
      
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
    else if (upgrade === 'multiDeck' || upgrade === 'deckDimension' || upgrade === 'infinityDeck') {
      // For multiplier upgrades - SIMPLIFIED TO MATCH GAME.JS LOGIC
      // Fixed increment per level
      
      if (upgrade === 'multiDeck') {
        // Each level adds 1x
        return `+1x`; 
      } else if (upgrade === 'deckDimension') {
        // Each level adds 2x
        return `+2x`;
      } else { // infinityDeck
        // Each level adds 5x
        return `+5x`;
      }
    }
    return '0'; // Default fallback
  };

  // Get upgrade name (formatted)
  const getUpgradeName = (key) => {
    switch(key) {
      case 'technique': return 'Shuffle Technique';
      case 'cardQuality': return 'Card Quality';
      case 'multiDeck': return 'Multi-Deck Handling';
      case 'advancedTechnique': return 'Advanced Technique';
      case 'cardEnchantment': return 'Card Enchantment';
      case 'deckDimension': return 'Deck Dimension';
      case 'quantumTechnique': return 'Quantum Technique';
      case 'cosmicCards': return 'Cosmic Cards';
      case 'infinityDeck': return 'Infinity Deck';
      default: return key;
    }
  };

  // Get icon for each upgrade
  const getUpgradeIcon = (key) => {
    switch(key) {
      case 'technique': return <GiCardPlay />;
      case 'cardQuality': return <GiCardAceSpades />;
      case 'multiDeck': return <GiCardJoker />;
      case 'advancedTechnique': return <GiUpgrade />;
      case 'cardEnchantment': return <GiMagicSwirl />;
      case 'deckDimension': return <GiCubes />;
      case 'quantumTechnique': return <GiAtom />;
      case 'cosmicCards': return <GiSpaceNeedle />;
      case 'infinityDeck': return <GiEternalLove />;
      default: return <GiCardRandom />;
    }
  };

  // Get type label based on upgrade type
  const getTypeLabel = (type) => {
    switch(type) {
      case 'flat': return 'Value';
      case 'percentage': return 'Bonus';
      case 'multiplier': return 'Multiplier';
      default: return 'Effect';
    }
  };

  return (
    <div className="upgrade-panel">
      <h2>Manual Upgrades</h2>
      <div className="upgrades-list">
        {Object.keys(manualUpgrades).map(key => {
          const upgrade = manualUpgrades[key];
          const isMaxLevel = upgrade.level >= upgrade.maxLevel;
          const canBuy = shufflePoints >= upgrade.cost;
          
          return (
            <div 
              key={key} 
              className={`upgrade-item upgrade-type-${upgrade.type} ${isMaxLevel ? 'max-level' : canBuy ? 'can-buy' : 'cannot-buy'}`}
              onClick={() => !isMaxLevel && canBuy && onBuyUpgrade(key)}
            >
              <div className="upgrade-icon">{getUpgradeIcon(key)}</div>
              
              <div className="upgrade-info">
                <div className="upgrade-header">
                  <h3>{getUpgradeName(key)}</h3>
                  <span className="upgrade-level">
                    Lvl {upgrade.level}/{upgrade.maxLevel}
                  </span>
                </div>
                
                <p className="upgrade-description">{upgrade.description}</p>
                
                {!isMaxLevel ? (
                  <>
                    <div className="upgrade-effects">
                      <div className="effect-current">
                        <span className="effect-label">
                          <span className={`type-icon type-icon-${upgrade.type}`}></span>
                          {getTypeLabel(upgrade.type)}
                        </span>
                        <span className="effect-value">{getCurrentEffect(key, upgrade.level)}</span>
                      </div>
                      
                      <span className="effect-arrow">→</span>
                      
                      <div className="effect-next">
                        <span className="effect-label">Next</span>
                        <span className="effect-value">{getNextEffect(key, upgrade.level)}</span>
                      </div>
                    </div>
                    
                    <div className="upgrade-cost">
                      <span className="cost-label">Cost:</span>
                      <span className="cost-value">{formatNumber(upgrade.cost)} SP</span>
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

export default UpgradePanel;