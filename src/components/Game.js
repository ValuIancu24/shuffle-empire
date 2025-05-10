import React, { useState, useEffect } from 'react';
import ShuffleArea from './ShuffleArea';
import UpgradePanel from './UpgradePanel';
import AutomationPanel from './AutomationPanel';
import StatsDisplay from './StatsDisplay';
import ResetButton from './ResetButton';
import OfflineProgressModal from './OfflineProgressModal';
import DebugButton from './DebugButton'; // Import the new DebugButton component
import './Game.css';

function Game() {
  // Basic state
  const [shuffleCount, setShuffleCount] = useState(0);
  const [shufflePoints, setShufflePoints] = useState(0);
  const [shufflesPerClick, setShufflesPerClick] = useState(1);
  const [shufflesPerSecond, setShufflesPerSecond] = useState(0);
  
  // Save/load related state
  const [lastSaveTime, setLastSaveTime] = useState(Date.now());
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [offlineProgress, setOfflineProgress] = useState({
    timeAway: 0,
    shufflesGained: 0,
    pointsGained: 0
  });
  
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

  // Add 1000K trillion SP for testing purposes
  const handleAddTestPoints = () => {
    const thousand_thousand_trillion = 1000000000000000000; // 1000K trillion (10^18)
    setShufflePoints(prev => prev + thousand_thousand_trillion);
  };

  // Load saved game when component mounts
  useEffect(() => {
    loadGame();
  }, []);
  
  // Save game periodically
  useEffect(() => {
    const saveInterval = setInterval(() => {
      saveGame();
    }, 30000); // Save every 30 seconds
    
    return () => clearInterval(saveInterval);
  }, [shuffleCount, shufflePoints, shufflesPerClick, shufflesPerSecond, manualUpgrades, automators]);

  // Save game when user leaves/refreshes the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveGame();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [shuffleCount, shufflePoints, shufflesPerClick, shufflesPerSecond, manualUpgrades, automators]);

  // Save game data to localStorage
  const saveGame = () => {
    const gameData = {
      shuffleCount,
      shufflePoints,
      shufflesPerClick,
      shufflesPerSecond,
      manualUpgrades,
      automators,
      lastSaveTime: Date.now()
    };
    
    localStorage.setItem('shuffleEmpireSave', JSON.stringify(gameData));
    console.log('Game saved:', new Date().toLocaleTimeString());
  };

  // Load game data from localStorage
  const loadGame = () => {
    try {
      const savedGame = localStorage.getItem('shuffleEmpireSave');
      
      if (savedGame) {
        const gameData = JSON.parse(savedGame);
        
        // Calculate offline progress
        const currentTime = Date.now();
        const savedTime = gameData.lastSaveTime || currentTime;
        const timeAway = (currentTime - savedTime) / 1000; // in seconds
        
        // Only process offline time if it's been more than 5 seconds 
        // and there's actual production happening
        if (timeAway > 5 && gameData.shufflesPerSecond > 0) {
          // Cap offline time to 3 days to prevent excessive gains
          const cappedTimeAway = Math.min(timeAway, 259200); // 3 days in seconds
          const offlineShuffles = gameData.shufflesPerSecond * cappedTimeAway;
          
          // Update game data with offline progress
          gameData.shuffleCount += offlineShuffles;
          gameData.shufflePoints += offlineShuffles;
          
          // Set offline progress to show in modal
          setOfflineProgress({
            timeAway: cappedTimeAway,
            shufflesGained: offlineShuffles,
            pointsGained: offlineShuffles
          });
          
          // Show offline progress modal
          setShowOfflineModal(true);
        }
        
        // Update all state variables with saved data
        setShuffleCount(gameData.shuffleCount || 0);
        setShufflePoints(gameData.shufflePoints || 0);
        setShufflesPerClick(gameData.shufflesPerClick || 1);
        setShufflesPerSecond(gameData.shufflesPerSecond || 0);
        setManualUpgrades(gameData.manualUpgrades || manualUpgrades);
        setAutomators(gameData.automators || automators);
        setLastSaveTime(gameData.lastSaveTime || Date.now());
        
        console.log('Game loaded:', new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error('Error loading game:', error);
    }
  };

  // Reset game progress (clears localStorage and resets all state)
  const resetGame = () => {
    // Clear localStorage
    localStorage.removeItem('shuffleEmpireSave');
    
    // Reset all state variables to default values
    setShuffleCount(0);
    setShufflePoints(0);
    setShufflesPerClick(1);
    setShufflesPerSecond(0);
    
    // Reset all upgrades
    const resetUpgrades = { ...manualUpgrades };
    Object.keys(resetUpgrades).forEach(key => {
      resetUpgrades[key].level = 0;
      resetUpgrades[key].cost = resetUpgrades[key].baseCost;
    });
    setManualUpgrades(resetUpgrades);
    
    // Reset all automators
    const resetAutomators = { ...automators };
    Object.keys(resetAutomators).forEach(key => {
      resetAutomators[key].level = 0;
      resetAutomators[key].cost = resetAutomators[key].baseCost;
    });
    setAutomators(resetAutomators);
    
    // Reset timestamps
    setLastUpdate(Date.now());
    setLastSaveTime(Date.now());
    
    console.log('Game reset:', new Date().toLocaleTimeString());
  };
  
  // Handle closing the offline progress modal
  const handleCloseOfflineModal = () => {
    setShowOfflineModal(false);
  };

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
    // FLAT UPGRADES - Non-linear scaling
    // Technique values - extended for more levels
    const techniqueValues = [0, 1, 3, 6, 10, 15, 20, 26, 33, 41, 50, 60, 72, 85, 100, 120, 
                           140, 165, 195, 230, 270, 315, 365, 420, 480, 550, 625, 710, 800, 
                           900, 1000, 1200, 1400, 1600, 1900, 2200, 2500, 2900, 3400, 3900, 
                           4500, 5200, 6000, 7000, 8000, 9000, 10000, 12000, 14000, 16000, 20000];
    
    // Advanced technique values - higher tier, non-linear scaling
    const advancedTechniqueValues = [0, 50, 100, 200, 350, 550, 800, 1200, 1700, 2500, 3500, 
                                  5000, 7000, 10000, 14000, 20000, 27000, 36000, 48000, 
                                  60000, 75000, 95000, 120000, 150000, 190000, 240000, 
                                  300000, 380000, 480000, 600000, 750000, 900000, 1100000, 
                                  1350000, 1600000, 2000000, 2500000, 3000000, 3600000, 
                                  4500000, 5500000, 7000000, 9000000, 11000000, 14000000, 
                                  18000000, 22000000, 27000000, 33000000, 40000000, 50000000];

    // Calculate base value from technique
    const techniqueLevel = upgrades.technique.level;
    const techValue = techniqueLevel < techniqueValues.length ? 
      techniqueValues[techniqueLevel] : techniqueValues[techniqueValues.length - 1];
    
    // Add advanced technique if unlocked
    const advancedLevel = upgrades.advancedTechnique.level;
    const advancedValue = advancedLevel < advancedTechniqueValues.length ? 
      advancedTechniqueValues[advancedLevel] : advancedTechniqueValues[advancedTechniqueValues.length - 1];
      
    // Base value - add 1 to upgrade values (THIS IS THE FIXED LINE)
    const baseValue = 1 + techValue + advancedValue;
    
    // PERCENTAGE UPGRADES - Apply multiplicatively
    let percentageMultiplier = 1;
    
    // Apply Card Quality boost (multiplicatively)
    const qualityLevel = upgrades.cardQuality.level;
    for (let i = 0; i < qualityLevel; i++) {
      percentageMultiplier *= 1.3; // 30% increase per level
    }
    
    // Apply Card Enchantment boost (multiplicatively)
    const enchantmentLevel = upgrades.cardEnchantment.level;
    for (let i = 0; i < enchantmentLevel; i++) {
      percentageMultiplier *= 1.5; // 50% increase per level
    }
    
    // MULTIPLIER UPGRADES - Use predefined values from arrays
    // Deck multipliers - using array values directly (including base 1×)
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
    const deckMultiplier = deckLevel < deckMultipliers.length ? 
      deckMultipliers[deckLevel] : deckMultipliers[deckMultipliers.length - 1];
    
    const dimensionLevel = upgrades.deckDimension.level;
    const dimensionMultiplier = dimensionLevel < dimensionMultipliers.length ? 
      dimensionMultipliers[dimensionLevel] : dimensionMultipliers[dimensionMultipliers.length - 1];
    
    // Calculate final value
    const result = baseValue * percentageMultiplier * deckMultiplier * dimensionMultiplier;
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
    
    // Reset last update time to now to prevent large initial production
    setLastUpdate(Date.now());
    
    // Calculate new shuffles per second
    calculateShufflesPerSecond(updatedAutomators);
  };
  
  // Calculate shuffles per second based on automators
  const calculateShufflesPerSecond = (autos) => {
    // FLAT AUTOMATORS - Non-linear scaling
    // Values for automator production by level
    const getAutomatorValue = (baseValue, level) => {
      if (level === 0) return 0;
      
      // Create a triangular scaling (1, 3, 6, 10, 15...)
      let value = 0;
      for (let i = 1; i <= level; i++) {
        value += i;
      }
      return baseValue * value;
    };
    
    // Calculate base production from flat automators
    let baseProduction = 0;
    Object.keys(autos).forEach(key => {
      if (autos[key].type === 'flat' && autos[key].level > 0) {
        baseProduction += getAutomatorValue(autos[key].production, autos[key].level);
      }
    });
    
    // PERCENTAGE AUTOMATORS - Apply multiplicatively
    let percentageMultiplier = 1;
    Object.keys(autos).forEach(key => {
      if (autos[key].type === 'percentage' && autos[key].level > 0) {
        // Apply each level multiplicatively
        for (let i = 0; i < autos[key].level; i++) {
          percentageMultiplier *= (1 + autos[key].percentage / 100);
        }
      }
    });
    
    // MULTIPLIER AUTOMATORS - Use fixed arrays with growth for levels beyond array size
    // Define fixed multiplier values for each automator type with growth factors
    const getMultiplierValue = (automator, level) => {
      if (level === 0) return 1; // Base multiplier is 1× when not upgraded
      
      // Initial bonus values for levels 1-10
      let baseValues;
      let growthFactor;
      
      if (automator === 'cardFactory') {
        // Base values for cardFactory
        baseValues = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16];
        growthFactor = 1.2; // 20% growth per level after level 10
      } else if (automator === 'shufflePortal') {
        // Base values for shufflePortal
        baseValues = [1, 3, 5, 9, 13, 21, 36, 56, 81, 121];
        growthFactor = 1.3; // 30% growth per level after level 10
      } else if (automator === 'parallelUniverse') {
        // Base values for parallelUniverse
        baseValues = [1, 4, 11, 31, 91, 251, 751, 2201, 6501, 20001];
        growthFactor = 1.5; // 50% growth per level after level 10
      } else {
        // Default multiplier is level + 1
        return level + 1;
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
    
    // Apply multipliers
    let totalMultiplier = 1;
    Object.keys(autos).forEach(key => {
      if (autos[key].type === 'multiplier' && autos[key].level > 0) {
        totalMultiplier *= getMultiplierValue(key, autos[key].level);
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
  
  // Format time for display (for offline progress)
  const formatTime = (seconds) => {
    if (seconds < 60) return `${Math.floor(seconds)} seconds`;
    if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
    }
    if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return `${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`;
  };
  
  // Format large numbers for display
  const formatNumber = (num) => {
    if (num < 1000) return num.toFixed(0);
    if (num < 1000000) return (num / 1000).toFixed(2) + 'K';
    if (num < 1000000000) return (num / 1000000).toFixed(2) + 'M';
    if (num < 1000000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num < 1000000000000000) return (num / 1000000000000).toFixed(2) + 'T';
    return num.toExponential(2);
  };
  
  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Shuffle Empire</h1>
      </div>
      
      <div className="stats-section">
        <StatsDisplay 
          shuffleCount={shuffleCount} 
          shufflesPerSecond={shufflesPerSecond}
          shufflesPerClick={shufflesPerClick}
          shufflePoints={shufflePoints}
          logProgressPercent={logProgressPercent}
          progressPercent={progressPercent}
        />
      </div>
      
      <div className="shuffle-section">
        <ShuffleArea onShuffle={handleShuffle} />
      </div>
      
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
      
      <div className="reset-container">
        <ResetButton onReset={resetGame} />
      </div>
      
      {/* Debug Button */}
      <DebugButton onAddPoints={handleAddTestPoints} />
      
      {/* Offline Progress Modal */}
      {showOfflineModal && (
        <OfflineProgressModal 
          timeAway={formatTime(offlineProgress.timeAway)}
          shufflesGained={formatNumber(offlineProgress.shufflesGained)}
          pointsGained={formatNumber(offlineProgress.pointsGained)}
          onClose={handleCloseOfflineModal}
        />
      )}
    </div>
  );
}

export default Game;