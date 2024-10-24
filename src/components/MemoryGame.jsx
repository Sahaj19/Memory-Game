import { useState } from "react";

function MemoryGame() {
  const [gridSize, setGridSize] = useState(4);
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [won, setWon] = useState(false);



  return <div className="container">
    <div className="memoryGameDiv">
      <h1>Memory Game</h1>
    </div>
  </div>
}

export default MemoryGame;