import { useState, useEffect } from "react";

function MemoryGame() {
  const [gridSize, setGridSize] = useState(4); // Track the grid size
  const [cards, setCards] = useState([]); // Hold the cards
  const [flipped, setFlipped] = useState([]); // Track flipped cards
  const [solved, setSolved] = useState([]); // Track solved cards
  const [disabled, setDisabled] = useState(false); // Disable clicks when checking
  const [won, setWon] = useState(false); // Track if the game is won

  // Handle grid size changes from input
  function handleGridSizeChange(event) {
    const finalGridSize = parseInt(event.target.value);
    if (finalGridSize >= 2 && finalGridSize <= 4) {
      setGridSize(finalGridSize); // Set grid size if it's between 2 and 4
    }
  }

  // Initialize the game board, shuffle cards, and reset states
  function initializeGame() {
    let totalCards = gridSize * gridSize;
    const pairCount = Math.floor(totalCards / 2);
    const numbers = [...Array(pairCount).keys()].map((num) => num + 1);
    const shuffledCards = [...numbers, ...numbers]
      .sort(() => Math.random() - 0.5) // Shuffle the card pairs
      .slice(0, totalCards) // Make sure the card count matches the grid
      .map((number, index) => ({ id: index, number })); // Assign unique IDs to each card

    setCards(shuffledCards); // Set the shuffled cards in state
    setFlipped([]); // Reset flipped cards
    setSolved([]); // Reset solved cards
    setWon(false); // Reset the win status
  }

  // Reinitialize the game whenever the grid size changes
  useEffect(() => {
    initializeGame();
  }, [gridSize]);

  // Handle card clicks
  function handleClick(cardID) {
    if (disabled || won) return; // Prevent clicks if the game is won or disabled

    if (flipped.length === 0) {
      setFlipped([cardID]); // Flip the first card
      return;
    }

    if (flipped.length === 1) {
      setDisabled(true); // Disable further clicks while checking

      if (cardID !== flipped[0]) {
        setFlipped([...flipped, cardID]); // Flip the second card
        checkMatch(cardID); // Check for a match
      } else {
        setFlipped([]); // Reset if the same card is clicked twice
        setDisabled(false);
      }
    }
  }

  // Check if the two flipped cards match
  function checkMatch(secondId) {
    const [firstId] = flipped;
    if (cards[firstId].number === cards[secondId].number) {
      const newSolved = [...solved, firstId, secondId];
      setSolved(newSolved); // Mark the pair as solved
      setFlipped([]); // Reset flipped cards
      setDisabled(false); // Re-enable clicking

      if (newSolved.length === cards.length) {
        setWon(true); // Set won to true when all cards are solved
      }

    } else {
      setTimeout(() => {
        setFlipped([]); // If no match, reset the flipped cards
        setDisabled(false); // Re-enable clicking
      }, 1000); // Add a delay for the reset
    }
  }

  return (
    <div className="container">
      <div className="memoryGameDiv">
        <h1>Memory Game</h1>

        {/* Grid size input */}
        <div className="gridInputDiv">
          <label htmlFor="gridSize">Grid Size (min:2 & max: 4)</label>
          <input
            type="number"
            id="gridSize"
            min={2}
            max={4}
            value={gridSize}
            onChange={handleGridSizeChange}
          />
        </div>

        {/* Game board with cards */}
        <div
          className="cardsDiv"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`, // Dynamically create the grid based on size
          }}
        >
          {cards.map((card) => {
            return (
              <div
                className={`card ${
                  solved.includes(card.id)
                    ? "solved" // If solved, apply solved class
                    : flipped.includes(card.id)
                    ? "flipped" // If flipped, apply flipped class
                    : "hidden" // Otherwise, show hidden class
                }`}
                onClick={() => handleClick(card.id)}
                key={card.id}
              >
                {flipped.includes(card.id) || solved.includes(card.id)
                  ? card.number
                  : "?"} {/* Show the number if flipped/solved, otherwise hide it */}
              </div>
            );
          })}
        </div>

        {/* Victory message */}
        {won && <div className="wonMessage">You won!</div>}

        <button className="resetBtn" onClick={initializeGame}>Reset</button>
      </div>
    </div>
  );
}

export default MemoryGame;
