import React from 'react';
import { GiCardRandom } from 'react-icons/gi';
import './ShuffleArea.css';

function ShuffleArea({ onShuffle }) {
  return (
    <div className="shuffle-area">
      <button className="shuffle-button" onClick={onShuffle}>
        <GiCardRandom className="card-icon" />
        <span>Shuffle Deck</span>
      </button>
    </div>
  );
}

export default ShuffleArea;