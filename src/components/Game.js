import React, { useState, useEffect } from 'react';
import ShuffleArea from './ShuffleArea';
import UpgradePanel from './UpgradePanel';
import AutomationPanel from './AutomationPanel';
import StatsDisplay from './StatsDisplay';
import './Game.css';

function Game() {
  // Basic state
  const [shuffleCount, setShuffleCount] = useState(0);
  const [shufflePoints, setShufflePoints] = useState(0);
  const [shufflesPerClick, setShufflesPerClick] = useState(1);
  const [shufflesPerSecond, setShufflesPerSecond] = useState(0);
  
  // Manual upgrades with increased max levels
  const [manualUpgrades, setManualUpgrades] = useState({
    technique: { 
      level: 0, 
      cost: 10, 
      baseCost: 10, 
      maxLevel: 50,
      type: 'flat',
      description: 'Improve your shuffling technique to get more shuffles per click'
    },
    cardQuality: { 
      level: 0, 
      cost: 50, 
      baseCost: 50, 
      maxLevel: 50,
      type: 'percentage',
      description: 'Better cards means more efficient shuffling'
    },
    multiDeck: { 
      level: 0, 
      cost: 200, 
      baseCost: 200, 
      maxLevel: 50,
      type: 'multiplier',
      description: 'Learn to shuffle multiple decks at once'
    },
    // Additional upgrades - add these after basic functionality is working
    advancedTechnique: { 
      level: 0, 
      cost: 10000, 
      baseCost: 10000, 
      maxLevel: 50,
      type: 'flat',
      description: 'Advanced shuffling patterns for greater productivity'
    },
    cardEnchantment: { 
      level: 0, 
      cost: 50000, 
      baseCost: 50000, 
      maxLevel: 50,
      type: 'percentage',
      description: 'Enchanted cards that flow through your hands'
    },
    deckDimension: { 
      level: 0, 
      cost: 200000, 
      baseCost: 200000, 
      maxLevel: 50,
      type: 'multiplier',
      description: 'Access extra dimensions to store more decks'
    }
  });
  
  // Automators with increased max levels and additional tiers
  const [automators, setAutomators] = useState({
    noviceShuffler: { 
      level: 0, 
      cost: 15, 
      baseCost: 15, 
      production: 1,
      maxLevel: 50,
      type: 'flat',
      costMultiplier: 1.15,
      description: 'A beginner who can slowly shuffle cards for you'
    },
    deckEnhancer: {
      level: 0,
      cost: 100,
      baseCost: 100,
      percentage: 5,
      maxLevel: 50,
      type: 'percentage',
      costMultiplier: 1.15,
      description: 'Enhances all card shuffling operations with special materials'
    },
    cardFactory: {
      level: 0,
      cost: 500,
      baseCost: 500,
      multiplier: 1.5,
      maxLevel: 50,
      type: 'multiplier',
      costMultiplier: 1.35,
      description: 'A factory that mass-produces playing cards and handles them'
    },
    cardDealer: { 
      level: 0, 
      cost: 2500, 
      baseCost: 2500, 
      production: 8,
      maxLevel: 50,
      type: 'flat',
      costMultiplier: 1.18,
      description: 'A professional casino dealer with quick hands'
    },
    shuffleTrainer: {
      level: 0,
      cost: 12000,
      baseCost: 12000,
      percentage: 10,
      maxLevel: 50,
      type: 'percentage',
      costMultiplier: 1.2,
      description: 'Trains all your automators to work more efficiently'
    },
    shufflePortal: {
      level: 0,
      cost: 60000,
      baseCost: 60000,
      multiplier: 2.0,
      maxLevel: 50,
      type: 'multiplier',
      costMultiplier: 1.4,
      description: 'Opens a portal to another dimension where time flows differently'
    },
    shuffleMachine: { 
      level: 0, 
      cost: 300000, 
      baseCost: 300000, 
      production: 50,
      maxLevel: 50,
      type: 'flat',
      costMultiplier: 1.20,
      description: 'An automated machine that shuffles cards rapidly'
    },
    timeAccelerator: {
      level: 0,
      cost: 1500000,
      baseCost: 1500000,
      percentage: 15,
      maxLevel: 50,
      type: 'percentage',
      costMultiplier: 1.25,
      description: 'Speeds up time locally around your shuffling operations'
    },
    parallelUniverse: {
      level: 0,
      cost: 7500000,
      baseCost: 7500000,
      multiplier: 3.0,
      maxLevel: 50,
      type: 'multiplier',
      costMultiplier: 1.5,
      description: 'Access infinite parallel universes to shuffle cards simultaneously'
    },
    cardAI: { 
      level: 0, 
      cost: 40000000, 
      baseCost: 40000000, 
      production: 300,
      maxLevel: 50,
      type: 'flat',
      costMultiplier: 1.25,
      description: 'Artificial intelligence that shuffles cards virtually'
    }
  });
  
  // Last update time for automation
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  
  // Handle manual shuffle
  const handleShuffle = () => {
    setShuffleCount(prev => prev + shufflesPerClick);
    setShufflePoints(prev => prev + shufflesPerClick);
  };
  
  // Handle buying manual upgrades
  const handleBuyUpgrade = (upgrade) => {
    // Check if player has enough points
    if (shufflePoints < manualUpgrades[upgrade].cost) return;
    
    // Check if already at max level
    if (manualUpgrades[upgrade].level >= manualUpgrades[upgrade].maxLevel) return;
    
    // Create a copy of the upgrades
    const updatedUpgrades = {...manualUpgrades};
    
    // Calculate points after purchase
    const newPoints = shufflePoints - updatedUpgrades[upgrade].cost;
    
    // Increase level
    updatedUpgrades[upgrade].level += 1;
    
    // Calculate new cost - based on upgrade type
    const costMultiplier = upgrade === 'technique' || upgrade === 'advancedTechnique' ? 1.5 : 
                         upgrade === 'cardQuality' || upgrade === 'cardEnchantment' ? 1.7 : 2.0;
    
    updatedUpgrades[upgrade].cost = Math.floor(
      updatedUpgrades[upgrade].baseCost * 
      Math.pow(costMultiplier, updatedUpgrades[upgrade].level)
    );
    
    // Update the state
    setManualUpgrades(updatedUpgrades);
    setShufflePoints(newPoints);
    
    // Calculate new shuffles per click
    calculateShufflesPerClick(updatedUpgrades);
  };
  
  // Calculate shuffles per click based on upgrades
  const calculateShufflesPerClick = (upgrades) => {
    // Technique values - extended for more levels
    const techniqueValues = [1, 3, 5, 8, 11, 15, 20, 26, 33, 41, 50, 60, 72, 85, 100, 120, 
                           140, 165, 195, 230, 270, 315, 365, 420, 480, 550, 625, 710, 800, 
                           900, 1000, 1200, 1400, 1600, 1900, 2200, 2500, 2900, 3400, 3900, 
                           4500, 5200, 6000, 7000, 8000, 9000, 10000, 12000, 14000, 16000, 20000];
    
    // Advanced technique values - higher tier
    const advancedTechniqueValues = [0, 50, 100, 200, 350, 550, 800, 1200, 1700, 2500, 3500, 
                                  5000, 7000, 10000, 14000, 20000, 27000, 36000, 48000, 
                                  60000, 75000, 95000, 120000, 150000, 190000, 240000, 
                                  300000, 380000, 480000, 600000, 750000, 900000, 1100000, 
                                  1350000, 1600000, 2000000, 2500000, 3000000, 3600000, 
                                  4500000, 5500000, 7000000, 9000000, 11000000, 14000000, 
                                  18000000, 22000000, 27000000, 33000000, 40000000, 50000000];

    // Calculate base value from technique
    const techniqueLevel = upgrades.technique.level;
    const techValue = techniqueLevel < techniqueValues.length && techniqueLevel > 0 ? 
      techniqueValues[techniqueLevel] : (techniqueLevel >= techniqueValues.length ? techniqueValues[techniqueValues.length - 1] : 0);
    
    // Add advanced technique if unlocked
    const advancedLevel = upgrades.advancedTechnique.level;
    const advancedValue = advancedLevel < advancedTechniqueValues.length && advancedLevel > 0 ? 
      advancedTechniqueValues[advancedLevel] : (advancedLevel >= advancedTechniqueValues.length ? advancedTechniqueValues[advancedTechniqueValues.length - 1] : 0);
      
    const baseValue = techValue + advancedValue;
    
    // Quality and enchantment - percentage boosts
    const qualityLevel = upgrades.cardQuality.level;
    const enchantmentLevel = upgrades.cardEnchantment.level;
    const percentageBoost = (qualityLevel * 30 + enchantmentLevel * 50) / 100;
    
    // Deck multipliers
    const deckMultipliers = [1, 2, 3, 6, 10, 15, 22, 30, 40, 55, 75, 100, 135, 180, 240, 
                           320, 430, 580, 780, 1050, 1400, 1900, 2500, 3400, 4500, 6000, 
                           8000, 10500, 14000, 19000, 25000, 33000, 44000, 58000, 77000, 
                           100000, 135000, 180000, 240000, 320000, 430000, 580000, 780000, 
                           1050000, 1400000, 1900000, 2500000, 3400000, 4500000, 6000000, 8000000];
    
    // Dimension multipliers - higher tier
    const dimensionMultipliers = [1, 5, 15, 40, 100, 250, 600, 1500, 3800, 9500, 24000, 
                                60000, 150000, 380000, 950000, 2400000, 6000000, 15000000, 
                                38000000, 95000000, 240000000, 600000000, 1500000000, 
                                3800000000, 9500000000, 24000000000, 60000000000, 150000000000, 
                                380000000000, 950000000000, 2400000000000, 6000000000000, 
                                15000000000000, 38000000000000, 95000000000000, 240000000000000, 
                                600000000000000, 1500000000000000, 3800000000000000, 
                                9500000000000000, 24000000000000000, 60000000000000000, 
                                150000000000000000, 380000000000000000, 950000000000000000, 
                                2400000000000000000, 6000000000000000000, Number.MAX_SAFE_INTEGER, 
                                Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];

    const deckLevel = upgrades.multiDeck.level;
    const deckMultiplier = deckLevel < deckMultipliers.length && deckLevel > 0 ? 
      deckMultipliers[deckLevel] : (deckLevel >= deckMultipliers.length ? deckMultipliers[deckMultipliers.length - 1] : 1);
    
    const dimensionLevel = upgrades.deckDimension.level;
    const dimensionMultiplier = dimensionLevel < dimensionMultipliers.length && dimensionLevel > 0 ? 
      dimensionMultipliers[dimensionLevel] : (dimensionLevel >= dimensionMultipliers.length ? dimensionMultipliers[dimensionMultipliers.length - 1] : 1);
    
    // Calculate final value (ensure minimum of 1)
    const result = Math.max(1, baseValue * (1 + percentageBoost) * deckMultiplier * dimensionMultiplier);
    setShufflesPerClick(result);
  };
  
  // Handle buying automator upgrades
  const handleBuyAutomator = (automator) => {
    // Check if player has enough points
    if (shufflePoints < automators[automator].cost) return;
    
    // Check if already at max level
    if (automators[automator].level >= automators[automator].maxLevel) return;
    
    // Create a copy of the automators
    const updatedAutomators = {...automators};
    
    // Calculate points after purchase
    const newPoints = shufflePoints - updatedAutomators[automator].cost;
    
    // Increase level
    updatedAutomators[automator].level += 1;
    
    // Calculate new cost
    updatedAutomators[automator].cost = Math.floor(
      updatedAutomators[automator].baseCost * 
      Math.pow(updatedAutomators[automator].costMultiplier, updatedAutomators[automator].level)
    );
    
    // Update the state
    setAutomators(updatedAutomators);
    setShufflePoints(newPoints);
    
    // Calculate new shuffles per second
    calculateShufflesPerSecond(updatedAutomators);
  };
  
  // Calculate shuffles per second based on automators
  const calculateShufflesPerSecond = (autos) => {
    // Calculate base production from flat automators
    let baseProduction = 0;
    Object.keys(autos).forEach(key => {
      if (autos[key].type === 'flat' && autos[key].level > 0) {
        baseProduction += autos[key].production * autos[key].level;
      }
    });
    
    // Apply percentage boosts
    let percentageMultiplier = 1;
    Object.keys(autos).forEach(key => {
      if (autos[key].type === 'percentage' && autos[key].level > 0) {
        percentageMultiplier += (autos[key].percentage / 100) * autos[key].level;
      }
    });
    
    // Apply direct multipliers
    let totalMultiplier = 1;
    Object.keys(autos).forEach(key => {
      if (autos[key].type === 'multiplier' && autos[key].level > 0) {
        // Apply multiplier based on level
        totalMultiplier *= Math.pow(autos[key].multiplier, autos[key].level);
      }
    });
    
    // Calculate final production
    const total = baseProduction * percentageMultiplier * totalMultiplier;
    setShufflesPerSecond(total);
  };
  
  // Handle automation
  useEffect(() => {
    const interval = setInterval(() => {
      if (shufflesPerSecond > 0) {
        const now = Date.now();
        const delta = (now - lastUpdate) / 1000;
        setLastUpdate(now);
        
        const amount = shufflesPerSecond * delta;
        setShuffleCount(prev => prev + amount);
        setShufflePoints(prev => prev + amount);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [shufflesPerSecond, lastUpdate]);
  
  // Calculate progress toward 52!
  const FACTORIAL_52 = 8.0658e67;
  const progressPercent = (shuffleCount / FACTORIAL_52) * 100;
  const logProgressPercent = shuffleCount > 0 ? 
    (Math.log10(shuffleCount) / Math.log10(FACTORIAL_52)) * 100 : 0;
  
  return (
    <div className="game-container">
      <h1>Shuffle Empire</h1>
      
      <StatsDisplay 
        shuffleCount={shuffleCount} 
        shufflesPerSecond={shufflesPerSecond}
        shufflesPerClick={shufflesPerClick}
        shufflePoints={shufflePoints}
        logProgressPercent={logProgressPercent}
        progressPercent={progressPercent}
      />
      
      <ShuffleArea onShuffle={handleShuffle} />
      
      <div className="upgrade-container">
        <UpgradePanel 
          manualUpgrades={manualUpgrades}
          shufflePoints={shufflePoints}
          onBuyUpgrade={handleBuyUpgrade}
        />
        
        <AutomationPanel 
          automators={automators}
          shufflePoints={shufflePoints}
          onBuyAutomator={handleBuyAutomator}
        />
      </div>
    </div>
  );
}

export default Game;