import React from 'react';
import { 
  GiCardRandom,
  GiUpgrade,
  GiCardPlay,
  GiCardAceSpades,
  GiCardJoker,
  GiMagicSwirl,
  GiCubes
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
    if (num >= 1000000000000000) return num.toExponential(2);
    return num.toFixed(0);
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
    if (upgrade === 'technique' || upgrade === 'advancedTechnique') {
      // Technique values - non-linear scaling with extended values beyond arrays
      if (upgrade === 'technique') {
        // Defined values for first 15 levels
        const values = [0, 1, 3, 6, 10, 15, 20, 26, 33, 41, 50, 60, 72, 85, 100, 120];
        
        // For levels within defined array, return the array value
        if (level < values.length) {
          return formatNumber(values[level]);
        }
        
        // For levels beyond array, calculate with growth factor
        let value = values[values.length - 1]; // Start with the last defined value
        const growthFactor = 1.15; // 15% growth after level 15
        
        for (let i = values.length; i <= level; i++) {
          value = Math.floor(value * growthFactor);
        }
        
        return formatNumber(value);
      } else {
        // Advanced technique values with extended progression
        const values = [0, 50, 100, 200, 350, 550, 800, 1200, 1700, 2500, 3500];
        
        if (level < values.length) {
          return formatNumber(values[level]);
        }
        
        // Growth for advanced technique is steeper
        let value = values[values.length - 1];
        const growthFactor = 1.25; // 25% growth after level 10
        
        for (let i = values.length; i <= level; i++) {
          value = Math.floor(value * growthFactor);
        }
        
        return formatNumber(value);
      }
    }
    else if (upgrade === 'cardQuality' || upgrade === 'cardEnchantment') {
      // Quality bonus is 30% per level, Enchantment is 50% per level
      const bonus = upgrade === 'cardQuality' ? 30 : 50;
      
      // Calculate multiplicative percentage increase
      const multiplier = Math.pow(1 + (bonus / 100), level);
      const percentage = (multiplier - 1) * 100;
      
      return formatPercentage(percentage);
    }
    else if (upgrade === 'multiDeck' || upgrade === 'deckDimension') {
      // For multiplier upgrades, treat them like the automators
      // Show 0 for level 0, and the actual bonus beyond that (not the total multiplier)
      if (level === 0) return '0';
      
      if (upgrade === 'multiDeck') {
        // Base multipliers for levels 1-10
        const multipliers = [0, 1, 2, 5, 9, 14, 21, 29, 39, 54, 74]; // Bonus only (not including base 1×)
        
        if (level < multipliers.length) {
          return `${formatNumber(multipliers[level])}x`;
        }
        
        // Growth for higher levels
        let value = multipliers[multipliers.length - 1];
        const growthFactor = 1.2; // 20% growth per level after level 10
        
        for (let i = multipliers.length; i <= level; i++) {
          value = Math.floor(value * growthFactor);
        }
        
        return `${formatNumber(value)}x`;
      } else {
        // Deck dimension multipliers for levels 1-10
        const multipliers = [0, 4, 14, 39, 99, 249, 599, 1499, 3799, 9499, 23999]; // Bonus only
        
        if (level < multipliers.length) {
          return `${formatNumber(multipliers[level])}x`;
        }
        
        // Growth for higher levels
        let value = multipliers[multipliers.length - 1];
        const growthFactor = 1.35; // 35% growth per level after level 10
        
        for (let i = multipliers.length; i <= level; i++) {
          value = Math.floor(value * growthFactor);
        }
        
        return `${formatNumber(value)}x`;
      }
    }
    return '0'; // Default fallback
  };
  
  // Get next level upgrade effect (difference from current)
  const getNextEffect = (upgrade, level) => {
    const nextLevel = level + 1;
    
    if (nextLevel > manualUpgrades[upgrade].maxLevel) return "MAX";
    
    if (upgrade === 'technique' || upgrade === 'advancedTechnique') {
      // Calculate raw values
      let currentValue, nextValue;
      
      if (upgrade === 'technique') {
        const values = [0, 1, 3, 6, 10, 15, 20, 26, 33, 41, 50, 60, 72, 85, 100, 120];
        
        // Get current value
        if (level < values.length) {
          currentValue = values[level];
        } else {
          currentValue = values[values.length - 1];
          const growthFactor = 1.15;
          for (let i = values.length; i <= level; i++) {
            currentValue = Math.floor(currentValue * growthFactor);
          }
        }
        
        // Get next value
        if (nextLevel < values.length) {
          nextValue = values[nextLevel];
        } else {
          nextValue = values[values.length - 1];
          const growthFactor = 1.15;
          for (let i = values.length; i <= nextLevel; i++) {
            nextValue = Math.floor(nextValue * growthFactor);
          }
        }
      } else { // advancedTechnique
        const values = [0, 50, 100, 200, 350, 550, 800, 1200, 1700, 2500, 3500];
        
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
      }
      
      // Calculate the difference and format
      const difference = nextValue - currentValue;
      return `+${formatNumber(difference)}`;
    }
    else if (upgrade === 'cardQuality' || upgrade === 'cardEnchantment') {
      // Quality bonus percentage calculation
      const bonus = upgrade === 'cardQuality' ? 30 : 50;
      
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
    else if (upgrade === 'multiDeck' || upgrade === 'deckDimension') {
      // Calculate raw multiplier values
      let currentValue, nextValue;
      
      if (upgrade === 'multiDeck') {
        const multipliers = [0, 1, 2, 5, 9, 14, 21, 29, 39, 54, 74];
        
        // Get current value
        if (level < multipliers.length) {
          currentValue = multipliers[level];
        } else {
          currentValue = multipliers[multipliers.length - 1];
          const growthFactor = 1.2;
          for (let i = multipliers.length; i <= level; i++) {
            currentValue = Math.floor(currentValue * growthFactor);
          }
        }
        
        // Get next value
        if (nextLevel < multipliers.length) {
          nextValue = multipliers[nextLevel];
        } else {
          nextValue = multipliers[multipliers.length - 1];
          const growthFactor = 1.2;
          for (let i = multipliers.length; i <= nextLevel; i++) {
            nextValue = Math.floor(nextValue * growthFactor);
          }
        }
      } else { // deckDimension
        const multipliers = [0, 4, 14, 39, 99, 249, 599, 1499, 3799, 9499, 23999];
        
        // Get current value
        if (level < multipliers.length) {
          currentValue = multipliers[level];
        } else {
          currentValue = multipliers[multipliers.length - 1];
          const growthFactor = 1.35;
          for (let i = multipliers.length; i <= level; i++) {
            currentValue = Math.floor(currentValue * growthFactor);
          }
        }
        
        // Get next value
        if (nextLevel < multipliers.length) {
          nextValue = multipliers[nextLevel];
        } else {
          nextValue = multipliers[multipliers.length - 1];
          const growthFactor = 1.35;
          for (let i = multipliers.length; i <= nextLevel; i++) {
            nextValue = Math.floor(nextValue * growthFactor);
          }
        }
      }
      
      // Calculate the difference and format
      const difference = nextValue - currentValue;
      return `+${formatNumber(difference)}x`;
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