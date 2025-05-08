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
  
  // Upgrades state
  const [manualUpgrades, setManualUpgrades] = useState({
    technique: { level: 0, cost: 10, baseCost: 10 },
    cardQuality: { level: 0, cost: 50, baseCost: 50 },
    multiDeck: { level: 0, cost: 200, baseCost: 200 }
  });
  
  // Automators state
  const [automators, setAutomators] = useState({
    noviceShuffler: { level: 0, count: 0, cost: 15, baseCost: 15, production: 1 },
    cardDealer: { level: 0, count: 0, cost: 100, baseCost: 100, production: 8 },
    shuffleMachine: { level: 0, count: 0, cost: 1100, baseCost: 1100, production: 47 }
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
    
    // Create a copy of the upgrades
    const updatedUpgrades = {...manualUpgrades};
    
    // Calculate points after purchase
    const newPoints = shufflePoints - updatedUpgrades[upgrade].cost;
    
    // Increase level
    updatedUpgrades[upgrade].level += 1;
    
    // Calculate new cost
    const costMultiplier = upgrade === 'technique' ? 1.5 : 
                          upgrade === 'cardQuality' ? 1.7 : 2.0;
    
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
    // Technique values
    const techniqueValues = [1, 3, 5, 8, 11, 15, 20, 26, 33, 41];
    const techniqueLevel = upgrades.technique.level;
    const baseValue = techniqueLevel < techniqueValues.length ? 
      techniqueValues[techniqueLevel] : techniqueValues[techniqueValues.length - 1];
    
    // Quality multiplier
    const qualityLevel = upgrades.cardQuality.level;
    const qualityBonus = qualityLevel * 0.3; // 30% per level
    
    // Deck multiplier
    const deckMultipliers = [1, 2, 3, 6, 10, 15];
    const deckLevel = upgrades.multiDeck.level;
    const deckMultiplier = deckLevel < deckMultipliers.length ? 
      deckMultipliers[deckLevel] : deckMultipliers[deckMultipliers.length - 1];
    
    // Calculate final value
    const result = baseValue * (1 + qualityBonus) * deckMultiplier;
    setShufflesPerClick(result);
  };
  
  // Handle buying automators
  const handleBuyAutomator = (automator) => {
    // Check if player has enough points
    if (shufflePoints < automators[automator].cost) return;
    
    // Create a copy of the automators
    const updatedAutomators = {...automators};
    
    // Calculate points after purchase
    const newPoints = shufflePoints - updatedAutomators[automator].cost;
    
    // Increase count
    updatedAutomators[automator].count += 1;
    
    // Calculate new cost
    updatedAutomators[automator].cost = Math.floor(
      updatedAutomators[automator].baseCost * 
      Math.pow(1.15, updatedAutomators[automator].count)
    );
    
    // Update the state
    setAutomators(updatedAutomators);
    setShufflePoints(newPoints);
    
    // Calculate new shuffles per second
    calculateShufflesPerSecond(updatedAutomators);
  };
  
  // Calculate shuffles per second based on automators
  const calculateShufflesPerSecond = (autos) => {
    let total = 0;
    Object.keys(autos).forEach(key => {
      total += autos[key].count * autos[key].production * Math.pow(1.5, autos[key].level);
    });
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