import React, { useState, useEffect } from 'react';
import ShuffleArea from './ShuffleArea';
import UpgradePanel from './UpgradePanel';
import AutomationPanel from './AutomationPanel';
import StatsDisplay from './StatsDisplay';
import ResetButton from './ResetButton';
import OfflineProgressModal from './OfflineProgressModal';
import DebugButton from './DebugButton';
import './Game.css';

function Game() {
  // Force reset localStorage to apply new upgrades and costs
  // localStorage.removeItem('shuffleEmpireSave'); // Uncomment this line to force a reset
  
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
  
  // Manual upgrades with increased max levels and adjusted costs/effects
  const [manualUpgrades, setManualUpgrades] = useState({
    technique: { 
      level: 0, 
      cost: 10, // Keeping original cost as requested
      baseCost: 10, 
      maxLevel: 75, // Increased max level
      type: 'flat',
      description: 'Improve your shuffling technique to get more shuffles per click'
    },
    cardQuality: { 
      level: 0, 
      cost: 500, // Higher cost
      baseCost: 500, 
      maxLevel: 75, 
      type: 'percentage',
      description: 'Better cards means more efficient shuffling'
    },
    multiDeck: { 
      level: 0, 
      cost: 5000, // Higher cost
      baseCost: 5000, 
      maxLevel: 75, 
      type: 'multiplier',
      description: 'Learn to shuffle multiple decks at once'
    },
    // Additional upgrades with adjusted costs
    advancedTechnique: { 
      level: 0, 
      cost: 100000, // Higher cost
      baseCost: 100000, 
      maxLevel: 75, 
      type: 'flat',
      description: 'Advanced shuffling patterns for greater productivity'
    },
    cardEnchantment: { 
      level: 0, 
      cost: 1000000, // Higher cost
      baseCost: 1000000, 
      maxLevel: 75, 
      type: 'percentage',
      description: 'Enchanted cards that flow through your hands'
    },
    deckDimension: { 
      level: 0, 
      cost: 10000000, // Higher cost
      baseCost: 10000000, 
      maxLevel: 75, 
      type: 'multiplier',
      description: 'Access extra dimensions to store more decks'
    },
    // New high-tier manual upgrades
    quantumTechnique: {
      level: 0,
      cost: 100000000,
      baseCost: 100000000,
      maxLevel: 75, // Changed from 50 to 75
      type: 'flat',
      description: 'Apply quantum mechanics to your shuffling technique'
    },
    cosmicCards: {
      level: 0,
      cost: 1000000000,
      baseCost: 1000000000,
      maxLevel: 75, // Changed from 50 to 75
      type: 'percentage',
      description: 'Cards made from cosmic materials that enhance shuffling efficiency'
    },
    infinityDeck: {
      level: 0,
      cost: 10000000000,
      baseCost: 10000000000,
      maxLevel: 75, // Changed from 50 to 75
      type: 'multiplier',
      description: 'Access the infinity deck containing unlimited cards'
    }
  });
  
  // Automators with increased max levels, adjusted costs, and enhanced production values
  const [automators, setAutomators] = useState({
    noviceShuffler: { 
      level: 0, 
      cost: 15, // Keeping original cost as requested
      baseCost: 15, 
      production: 1.5, // Moderate production
      maxLevel: 75, 
      type: 'flat',
      costMultiplier: 1.15,
      description: 'A beginner who can slowly shuffle cards for you'
    },
    deckEnhancer: {
      level: 0,
      cost: 1000, // Higher cost
      baseCost: 1000,
      percentage: 3, // Reduced from 8
      maxLevel: 75, 
      type: 'percentage',
      costMultiplier: 1.15,
      description: 'Enhances all card shuffling operations with special materials'
    },
    cardFactory: {
      level: 0,
      cost: 10000, // Higher cost
      baseCost: 10000,
      multiplier: 1.1, // Reduced from 1.5
      maxLevel: 75, 
      type: 'multiplier',
      costMultiplier: 1.35,
      description: 'A factory that mass-produces playing cards and handles them'
    },
    cardDealer: { 
      level: 0, 
      cost: 100000, // Higher cost
      baseCost: 100000, 
      production: 12, // Reduced from 16
      maxLevel: 75, 
      type: 'flat',
      costMultiplier: 1.18,
      description: 'A professional casino dealer with quick hands'
    },
    shuffleTrainer: {
      level: 0,
      cost: 1000000, // Higher cost
      baseCost: 1000000,
      percentage: 4, // Reduced from 15
      maxLevel: 75, 
      type: 'percentage',
      costMultiplier: 1.2,
      description: 'Trains all your automators to work more efficiently'
    },
    shufflePortal: {
      level: 0,
      cost: 10000000, // Higher cost
      baseCost: 10000000,
      multiplier: 1.2, // Reduced from 2.5
      maxLevel: 75, 
      type: 'multiplier',
      costMultiplier: 1.4,
      description: 'Opens a portal to another dimension where time flows differently'
    },
    shuffleMachine: { 
      level: 0, 
      cost: 100000000, // Higher cost
      baseCost: 100000000, 
      production: 100, // Reduced from 150
      maxLevel: 75, 
      type: 'flat',
      costMultiplier: 1.20,
      description: 'An automated machine that shuffles cards rapidly'
    },
    timeAccelerator: {
      level: 0,
      cost: 1000000000, // Higher cost
      baseCost: 1000000000,
      percentage: 5, // Reduced from 20
      maxLevel: 75, 
      type: 'percentage',
      costMultiplier: 1.25,
      description: 'Speeds up time locally around your shuffling operations'
    },
    parallelUniverse: {
      level: 0,
      cost: 10000000000, // Higher cost
      baseCost: 10000000000,
      multiplier: 1.3, // Reduced from 4.0
      maxLevel: 75, 
      type: 'multiplier',
      costMultiplier: 1.5,
      description: 'Access infinite parallel universes to shuffle cards simultaneously'
    },
    cardAI: { 
      level: 0, 
      cost: 100000000000, // Higher cost
      baseCost: 100000000000, 
      production: 800, // Reduced from 1000
      maxLevel: 75, 
      type: 'flat',
      costMultiplier: 1.25,
      description: 'Artificial intelligence that shuffles cards virtually'
    },
    // New high-tier automators
    quantumComputer: {
      level: 0,
      cost: 1000000000000,
      baseCost: 1000000000000,
      production: 4000, // Reduced from 5000
      maxLevel: 75, // Changed from 50 to 75
      type: 'flat',
      costMultiplier: 1.30,
      description: 'Quantum computer that simulates card shuffles at the quantum level'
    },
    temporalField: {
      level: 0,
      cost: 10000000000000,
      baseCost: 10000000000000,
      percentage: 6, // Reduced from 30
      maxLevel: 75, // Changed from 50 to 75
      type: 'percentage',
      costMultiplier: 1.35,
      description: 'Creates a temporal field that accelerates all shuffling operations'
    },
    realityBender: {
      level: 0,
      cost: 100000000000000,
      baseCost: 100000000000000,
      multiplier: 1.4, // Reduced from 6.0
      maxLevel: 75, // Changed from 50 to 75
      type: 'multiplier',
      costMultiplier: 1.6,
      description: 'Bends reality itself to enable impossible shuffling speeds'
    },
    universalFactory: {
      level: 0,
      cost: 1000000000000000,
      baseCost: 1000000000000000,
      production: 20000, // Reduced from 25000
      maxLevel: 75, // Changed from 50 to 75
      type: 'flat',
      costMultiplier: 1.4,
      description: 'A factory that spans across multiple universes for ultimate production'
    }
  });
  
  // Last update time for automation
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Add SP for testing purposes - INCREASED AMOUNT
  const handleAddTestPoints = () => {
    const testPoints = 10000; // Changed to 1 nonillion (10^30)
    setShufflePoints(prev => prev + testPoints);
  };

  // New function - Max all upgrades for testing
  const handleMaxAllUpgrades = () => {
    // Max out all manual upgrades
    const maxedManualUpgrades = { ...manualUpgrades };
    Object.keys(maxedManualUpgrades).forEach(key => {
      maxedManualUpgrades[key].level = maxedManualUpgrades[key].maxLevel;
      maxedManualUpgrades[key].cost = Math.floor(
        maxedManualUpgrades[key].baseCost * 
        Math.pow(key === 'technique' || key === 'advancedTechnique' || key === 'quantumTechnique' ? 1.5 : 
                key === 'cardQuality' || key === 'cardEnchantment' || key === 'cosmicCards' ? 1.7 : 2.0, 
                maxedManualUpgrades[key].maxLevel)
      );
    });
    setManualUpgrades(maxedManualUpgrades);
    
    // Max out all automators
    const maxedAutomators = { ...automators };
    Object.keys(maxedAutomators).forEach(key => {
      maxedAutomators[key].level = maxedAutomators[key].maxLevel;
      maxedAutomators[key].cost = Math.floor(
        maxedAutomators[key].baseCost * 
        Math.pow(maxedAutomators[key].costMultiplier, maxedAutomators[key].maxLevel)
      );
    });
    setAutomators(maxedAutomators);
    
    // Recalculate shuffles per click and per second
    calculateShufflesPerClick(maxedManualUpgrades);
    calculateShufflesPerSecond(maxedAutomators);
    
    console.log('All upgrades maxed out for testing');
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

  // Load game data from localStorage with upgraded handling
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
        
        // IMPORTANT: Use the current upgrades instead of loaded ones to force new costs and upgrades
        setManualUpgrades(prev => {
          const updatedUpgrades = { ...prev };
          // Only copy levels from saved data
          if (gameData.manualUpgrades) {
            Object.keys(gameData.manualUpgrades).forEach(key => {
              if (updatedUpgrades[key]) {
                updatedUpgrades[key].level = gameData.manualUpgrades[key].level || 0;
                // Recalculate cost based on level and new baseCost
                updatedUpgrades[key].cost = Math.floor(
                  updatedUpgrades[key].baseCost * 
                  Math.pow(key === 'technique' || key === 'advancedTechnique' || key === 'quantumTechnique' ? 1.5 : 
                          key === 'cardQuality' || key === 'cardEnchantment' || key === 'cosmicCards' ? 1.7 : 2.0, 
                          updatedUpgrades[key].level)
                );
              }
            });
          }
          return updatedUpgrades;
        });
        
        setAutomators(prev => {
          const updatedAutomators = { ...prev };
          // Only copy levels from saved data
          if (gameData.automators) {
            Object.keys(gameData.automators).forEach(key => {
              if (updatedAutomators[key]) {
                updatedAutomators[key].level = gameData.automators[key].level || 0;
                // Recalculate cost based on level and new baseCost
                updatedAutomators[key].cost = Math.floor(
                  updatedAutomators[key].baseCost * 
                  Math.pow(updatedAutomators[key].costMultiplier, updatedAutomators[key].level)
                );
              }
            });
          }
          return updatedAutomators;
        });
        
        setLastSaveTime(gameData.lastSaveTime || Date.now());
        
        console.log('Game loaded with UPDATED costs and upgrades:', new Date().toLocaleTimeString());
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
  
  // Force reset to apply new upgrades
  const forceReset = () => {
    if (window.confirm('This will reset your game to apply new upgrades and costs. You will keep your progress but see the new content. Continue?')) {
      localStorage.removeItem('shuffleEmpireSave');
      window.location.reload();
    }
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
    const costMultiplier = 
      upgrade === 'technique' || upgrade === 'advancedTechnique' || upgrade === 'quantumTechnique' ? 1.5 : 
      upgrade === 'cardQuality' || upgrade === 'cardEnchantment' || upgrade === 'cosmicCards' ? 1.7 : 2.0;
    
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
  
  // Calculate shuffles per click based on upgrades - REBALANCED AND FIXED MULTIPLIER LOGIC
  const calculateShufflesPerClick = (upgrades) => {
    // FLAT UPGRADES - Non-linear scaling with more moderate values
    // Base technique values - Fibonacci sequence for more natural growth
    const techniqueValues = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 
                           1597, 2584, 4181, 6765, 10946, 17711, 28657, 46368, 75025, 121393, 
                           196418, 317811, 514229, 832040, 1346269, 2178309, 3524578, 5702887, 
                           9227465, 14930352, 24157817, 39088169, 63245986, 102334155, 165580141, 
                           267914296, 433494437, 701408733, 1134903170, 1836311903, 2971215073, 
                           4807526976, 7778742049, 12586269025];
    
    // Advanced technique values - higher tier with more moderate values
    const advancedTechniqueValues = [0, 10, 20, 40, 80, 160, 320, 640, 1280, 2560, 5120, 
                                10240, 20480, 40960, 81920, 163840, 327680, 655360, 1310720, 
                                2621440, 5242880, 10485760, 20971520, 41943040, 83886080, 
                                167772160, 335544320, 671088640, 1342177280, 2684354560];
    
    // Quantum technique values - even higher tier but less extreme
    const quantumTechniqueValues = [0, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 128000, 
                                256000, 512000, 1024000, 2048000, 4096000, 8192000, 16384000, 
                                32768000, 65536000, 131072000, 262144000, 524288000, 1048576000, 
                                2097152000, 4194304000, 8388608000, 16777216000, 33554432000, 
                                67108864000, 134217728000, 268435456000];

    // Calculate base value from technique levels
    const techniqueLevel = Math.min(upgrades.technique.level, techniqueValues.length - 1);
    const techValue = techniqueValues[techniqueLevel];
    
    // Add advanced technique if unlocked
    const advancedLevel = Math.min(upgrades.advancedTechnique.level, advancedTechniqueValues.length - 1);
    const advancedValue = advancedLevel > 0 ? advancedTechniqueValues[advancedLevel] : 0;
    
    // Add quantum technique if unlocked
    const quantumLevel = upgrades.quantumTechnique ? 
      Math.min(upgrades.quantumTechnique.level, quantumTechniqueValues.length - 1) : 0;
    const quantumValue = quantumLevel > 0 ? quantumTechniqueValues[quantumLevel] : 0;
      
    // Base value - add 1 to upgrade values
    const baseValue = 1 + techValue + advancedValue + quantumValue;
    
    // PERCENTAGE UPGRADES - Apply multiplicatively with more moderate effects
    let percentageMultiplier = 1;
    
    // Apply Card Quality boost (multiplicatively) - Reduced boost to 10% per level
    const qualityLevel = upgrades.cardQuality.level;
    for (let i = 0; i < qualityLevel; i++) {
      percentageMultiplier *= 1.1; // 10% increase per level (down from 40%)
    }
    
    // Apply Card Enchantment boost (multiplicatively) - Reduced boost to 15% per level
    const enchantmentLevel = upgrades.cardEnchantment ? upgrades.cardEnchantment.level : 0;
    for (let i = 0; i < enchantmentLevel; i++) {
      percentageMultiplier *= 1.15; // 15% increase per level (down from 70%)
    }
    
    // Apply Cosmic Cards boost if unlocked - Reduced to 20% per level
    const cosmicLevel = upgrades.cosmicCards ? upgrades.cosmicCards.level : 0;
    for (let i = 0; i < cosmicLevel; i++) {
      percentageMultiplier *= 1.2; // 20% increase per level (down from 100%)
    }
    
    // MULTIPLIER UPGRADES - Using whole number integer multipliers for clarity
    // Multiplier upgrades are now true multipliers that add directly to the multiplier
    // For example, level 5 gives +5x multiplier (so 1 becomes 6)
    
    // Get multiplier values from each upgrade
    let totalMultiplierBonus = 0;
    
    // Multi-Deck multiplier - simple integer values (level = multiplier bonus)
    const deckLevel = upgrades.multiDeck ? upgrades.multiDeck.level : 0;
    totalMultiplierBonus += deckLevel;
    
    // Dimension multiplier - simple integer values (level * 2 = multiplier bonus)
    const dimensionLevel = upgrades.deckDimension ? upgrades.deckDimension.level : 0;
    totalMultiplierBonus += dimensionLevel * 2;
    
    // Infinity deck multiplier - level * 5 for higher tier
    const infinityLevel = upgrades.infinityDeck ? upgrades.infinityDeck.level : 0;
    totalMultiplierBonus += infinityLevel * 5;
    
    // Apply the multiplier: For a multiplier of 23x, baseValue becomes baseValue * (1 + 23)
    const multiplierValue = 1 + totalMultiplierBonus;
    
    // Calculate final value and ensure it's capped to prevent infinity
    // 52! is approximately 8.0658e+67, so cap at slightly lower
    const result = baseValue * percentageMultiplier * multiplierValue;
    const cappedResult = Math.min(result, 1e+67); // Cap at 10^67
    
    // Set capped value to prevent infinity
    setShufflesPerClick(cappedResult);
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
  
  // Calculate shuffles per second based on automators - FIXED MULTIPLIER LOGIC
  const calculateShufflesPerSecond = (autos) => {
    // FLAT AUTOMATORS - Non-linear scaling with more moderate values
    // More balanced automator production by level
    const getAutomatorValue = (baseValue, level, key) => {
      if (level === 0) return 0;
      
      // More moderate scaling for triangular values
      let value = 0;
      
      // Apply different scaling factors based on tier - less aggressive
      let scalingFactor = 1.0; // Default scaling
      
      // Apply higher scaling factors for higher tier automators - but more moderate
      if (key === 'cardDealer') scalingFactor = 1.05;
      else if (key === 'shuffleMachine') scalingFactor = 1.1;
      else if (key === 'cardAI') scalingFactor = 1.15;
      else if (key === 'quantumComputer' || key === 'universalFactory') scalingFactor = 1.2;
      
      // Create more moderate triangular scaling
      for (let i = 1; i <= level; i++) {
        value += i * scalingFactor;
      }
      
      return baseValue * value;
    };
    
    // Calculate base production from flat automators with more moderate values
    let baseProduction = 0;
    Object.keys(autos).forEach(key => {
      if (autos[key].type === 'flat' && autos[key].level > 0) {
        baseProduction += getAutomatorValue(autos[key].production, autos[key].level, key);
      }
    });
    
    // PERCENTAGE AUTOMATORS - Apply multiplicatively with more moderate effects
    let percentageMultiplier = 1;
    Object.keys(autos).forEach(key => {
      if (autos[key].type === 'percentage' && autos[key].level > 0) {
        // Apply each level multiplicatively with more moderate effects
        for (let i = 0; i < autos[key].level; i++) {
          // Apply more moderate boost factors
          let boostFactor = autos[key].percentage / 100;
          
          // Apply higher boost factors for higher tier automators - but more moderate
          if (key === 'shuffleTrainer') boostFactor *= 1.05;
          else if (key === 'timeAccelerator') boostFactor *= 1.1;
          else if (key === 'temporalField') boostFactor *= 1.15;
          
          percentageMultiplier *= (1 + boostFactor);
        }
      }
    });
    
    // MULTIPLIER AUTOMATORS - FIXED to use simple integer multipliers
    // Calculate total multiplier bonus from all multiplier automators
    let totalMultiplierBonus = 0;
    
    // Card Factory - level * 0.2 bonus
    const cardFactoryLevel = autos.cardFactory ? autos.cardFactory.level : 0;
    totalMultiplierBonus += cardFactoryLevel * 0.2;
    
    // Shuffle Portal - level * 0.5 bonus
    const portalLevel = autos.shufflePortal ? autos.shufflePortal.level : 0;
    totalMultiplierBonus += portalLevel * 0.5;
    
    // Parallel Universe - level * 1 bonus
    const universeLevel = autos.parallelUniverse ? autos.parallelUniverse.level : 0;
    totalMultiplierBonus += universeLevel;
    
    // Reality Bender - level * 2 bonus
    const benderLevel = autos.realityBender ? autos.realityBender.level : 0;
    totalMultiplierBonus += benderLevel * 2;
    
    // Apply total multiplier (baseProduction * (1 + totalBonus))
    const multiplierValue = 1 + totalMultiplierBonus;
    
    // Calculate final production - CAP at slightly lower than 52!
    // 52! is approximately 8.0658e+67, so cap at slightly lower
    const total = baseProduction * percentageMultiplier * multiplierValue;
    const cappedTotal = Math.min(total, 1e+66); // Cap at 10^66 (lower than per-click cap)
    
    setShufflesPerSecond(cappedTotal);
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
    if (num < 1e18) return (num / 1e15).toFixed(2) + 'Qa';
    if (num < 1e21) return (num / 1e18).toFixed(2) + 'Qi';
    if (num < 1e24) return (num / 1e21).toFixed(2) + 'Sx';
    if (num < 1e27) return (num / 1e24).toFixed(2) + 'Sp';
    return num.toExponential(2);
  };
  
  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Shuffle Empire</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* New "Max All Upgrades" button */}
          <button 
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '6px 10px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
            onClick={handleMaxAllUpgrades}
            title="Max out all upgrades instantly for testing"
          >
            Max All Upgrades
          </button>
          
          <button 
            style={{
              backgroundColor: '#ff0000',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '6px 10px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
            onClick={forceReset}
          >
            Force Reset
          </button>
        </div>
      </div>
      
      {/* Left Side - Manual Upgrades */}
      <div className="manual-upgrade-container">
        <UpgradePanel 
          manualUpgrades={manualUpgrades}
          shufflePoints={shufflePoints}
          onBuyUpgrade={handleBuyUpgrade}
        />
      </div>
      
      {/* Center - Stats and Shuffle Button */}
      <div className="center-container">
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
      </div>
      
      {/* Right Side - Automation */}
      <div className="automation-container">
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