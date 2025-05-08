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
      // Technique values
      if (upgrade === 'technique') {
        const values = [1, 3, 5, 8, 11, 15, 20, 26, 33, 41, 50, 60, 72, 85, 100, 120];
        return `${level < values.length && level > 0 ? values[level] : (level >= values.length ? values[values.length-1] : 0)}`;
      } else {
        const values = [0, 50, 100, 200, 350, 550, 800, 1200, 1700, 2500, 3500];
        return `${level < values.length && level > 0 ? values[level] : (level >= values.length ? values[values.length-1] : 0)}`;
      }
    }
    else if (upgrade === 'cardQuality' || upgrade === 'cardEnchantment') {
      // Quality bonus is 30% per level, Enchantment is 50% per level
      const bonus = upgrade === 'cardQuality' ? 30 : 50;
      return `${(level * bonus)}%`;
    }
    else if (upgrade === 'multiDeck' || upgrade === 'deckDimension') {
      if (upgrade === 'multiDeck') {
        const multipliers = [1, 2, 3, 6, 10, 15, 22, 30, 40, 55, 75];
        return `${level < multipliers.length && level > 0 ? multipliers[level] : (level >= multipliers.length ? multipliers[multipliers.length-1] : 1)}×`;
      } else {
        const multipliers = [1, 5, 15, 40, 100, 250, 600, 1500, 3800, 9500, 24000];
        return `${level < multipliers.length && level > 0 ? multipliers[level] : (level >= multipliers.length ? multipliers[multipliers.length-1] : 1)}×`;
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
        const values = [1, 3, 5, 8, 11, 15, 20, 26, 33, 41, 50, 60, 72, 85, 100, 120];
        const current = level < values.length && level > 0 ? values[level] : (level >= values.length ? values[values.length-1] : 0);
        const next = nextLevel < values.length ? values[nextLevel] : values[values.length-1];
        return `+${next - current}`;
      } else {
        const values = [0, 50, 100, 200, 350, 550, 800, 1200, 1700, 2500, 3500];
        const current = level < values.length && level > 0 ? values[level] : (level >= values.length ? values[values.length-1] : 0);
        const next = nextLevel < values.length ? values[nextLevel] : values[values.length-1];
        return `+${next - current}`;
      }
    }
    else if (upgrade === 'cardQuality' || upgrade === 'cardEnchantment') {
      // Quality bonus is 30% per level, Enchantment is 50% per level
      const bonus = upgrade === 'cardQuality' ? 30 : 50;
      return `+${bonus}%`;
    }
    else if (upgrade === 'multiDeck' || upgrade === 'deckDimension') {
      if (upgrade === 'multiDeck') {
        const multipliers = [1, 2, 3, 6, 10, 15, 22, 30, 40, 55, 75];
        const current = level < multipliers.length && level > 0 ? multipliers[level] : (level >= multipliers.length ? multipliers[multipliers.length-1] : 1);
        const next = nextLevel < multipliers.length ? multipliers[nextLevel] : multipliers[multipliers.length-1];
        return `×${(next / current).toFixed(2)}`;
      } else {
        const multipliers = [1, 5, 15, 40, 100, 250, 600, 1500, 3800, 9500, 24000];
        const current = level < multipliers.length && level > 0 ? multipliers[level] : (level >= multipliers.length ? multipliers[multipliers.length-1] : 1);
        const next = nextLevel < multipliers.length ? multipliers[nextLevel] : multipliers[multipliers.length-1];
        return `×${(next / current).toFixed(2)}`;
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