import React from 'react';
import { 
  GiCardRandom
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

  // Get current upgrade effect (absolute value)
  const getCurrentEffect = (upgrade, level) => {
    if (upgrade === 'technique' || upgrade === 'advancedTechnique') {
      // Technique values - non-linear scaling
      if (upgrade === 'technique') {
        const values = [0, 1, 3, 6, 10, 15, 20, 26, 33, 41, 50, 60, 72, 85, 100, 120];
        return `${level < values.length ? values[level] : (level >= values.length ? values[values.length-1] : 0)}`;
      } else {
        const values = [0, 50, 100, 200, 350, 550, 800, 1200, 1700, 2500, 3500];
        return `${level < values.length ? values[level] : (level >= values.length ? values[values.length-1] : 0)}`;
      }
    }
    else if (upgrade === 'cardQuality' || upgrade === 'cardEnchantment') {
      // Quality bonus is 30% per level, Enchantment is 50% per level
      const bonus = upgrade === 'cardQuality' ? 30 : 50;
      
      // Calculate multiplicative percentage increase
      const multiplier = Math.pow(1 + (bonus / 100), level);
      const percentage = (multiplier - 1) * 100;
      
      return `${percentage.toFixed(1)}%`;
    }
    else if (upgrade === 'multiDeck' || upgrade === 'deckDimension') {
      // For multiplier upgrades, treat them like the automators
      // Show 0 for level 0, and the actual bonus beyond that (not the total multiplier)
      if (level === 0) return '0';
      
      if (upgrade === 'multiDeck') {
        const multipliers = [0, 1, 2, 5, 9, 14, 21, 29, 39, 54, 74]; // Bonus only (not including base 1×)
        return `${level < multipliers.length ? multipliers[level] : (level >= multipliers.length ? multipliers[multipliers.length-1] : 0)}`;
      } else {
        const multipliers = [0, 4, 14, 39, 99, 249, 599, 1499, 3799, 9499, 23999]; // Bonus only
        return `${level < multipliers.length ? multipliers[level] : (level >= multipliers.length ? multipliers[multipliers.length-1] : 0)}`;
      }
    }
    return '0'; // Default fallback
  };
  
  // Get next level upgrade effect (difference from current)
  const getNextEffect = (upgrade, level) => {
    const nextLevel = level + 1;
    
    if (nextLevel > manualUpgrades[upgrade].maxLevel) return "MAX";
    
    if (upgrade === 'technique' || upgrade === 'advancedTechnique') {
      if (upgrade === 'technique') {
        // Special case for level 0 of technique
        if (level === 0) {
          return '+1'; // Show +1 for first level
        }
        
        const values = [0, 1, 3, 6, 10, 15, 20, 26, 33, 41, 50, 60, 72, 85, 100, 120];
        const current = level < values.length ? values[level] : (level >= values.length ? values[values.length-1] : 0);
        const next = nextLevel < values.length ? values[nextLevel] : values[values.length-1];
        return `+${next - current}`;
      } else {
        const values = [0, 50, 100, 200, 350, 550, 800, 1200, 1700, 2500, 3500];
        const current = level < values.length ? values[level] : (level >= values.length ? values[values.length-1] : 0);
        const next = nextLevel < values.length ? values[nextLevel] : values[values.length-1];
        return `+${next - current}`;
      }
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
      
      return `+${increaseFactor.toFixed(1)}%`;
    }
    else if (upgrade === 'multiDeck' || upgrade === 'deckDimension') {
      // Get multiplier arrays (bonus values only, not including base 1×)
      let bonusValues;
      if (upgrade === 'multiDeck') {
        bonusValues = [0, 1, 2, 5, 9, 14, 21, 29, 39, 54, 74]; 
      } else {
        bonusValues = [0, 4, 14, 39, 99, 249, 599, 1499, 3799, 9499, 23999];
      }
      
      // Get current and next bonus value
      const current = level < bonusValues.length ? bonusValues[level] : bonusValues[bonusValues.length-1];
      const next = nextLevel < bonusValues.length ? bonusValues[nextLevel] : bonusValues[bonusValues.length-1];
      
      // Show the absolute increase
      return `+${next - current}`;
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

  return (
    <div className="upgrade-panel">
      <h2>Manual Upgrades</h2>
      <div className="upgrades-list">
        {Object.keys(manualUpgrades).map(key => {
          const isMaxLevel = manualUpgrades[key].level >= manualUpgrades[key].maxLevel;
          return (
            <div 
              key={key} 
              className={`upgrade-item ${isMaxLevel ? 'max-level' : shufflePoints >= manualUpgrades[key].cost ? 'can-buy' : 'cannot-buy'}`}
              onClick={() => !isMaxLevel && onBuyUpgrade(key)}
            >
              <div className="upgrade-icon"><GiCardRandom /></div>
              <div className="upgrade-info">
                <h3>{getUpgradeName(key)}</h3>
                <p className="upgrade-description">{manualUpgrades[key].description}</p>
                <div className="upgrade-details">
                  <span className="upgrade-level">
                    Level: {manualUpgrades[key].level}/{manualUpgrades[key].maxLevel}
                  </span>
                  <span className="upgrade-effect">
                    Current: {getCurrentEffect(key, manualUpgrades[key].level)}
                  </span>
                </div>
                {!isMaxLevel ? (
                  <div className="upgrade-details">
                    <span className="upgrade-next">
                      Next: {getNextEffect(key, manualUpgrades[key].level)}
                    </span>
                    <span className="upgrade-cost">
                      Cost: {formatNumber(manualUpgrades[key].cost)} SP
                    </span>
                  </div>
                ) : (
                  <div className="upgrade-details">
                    <span className="upgrade-next">MAX LEVEL</span>
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

export default UpgradePanel;