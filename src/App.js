import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [gameState, setGameState] = useState("menu"); // menu, game, highScores
  const [difficulty, setDifficulty] = useState("");
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentScore, setCurrentScore] = useState(0);
  const [highScores, setHighScores] = useState({ easy: 0, medium: 0, hard: 0 });
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);

  // AI opponent for computer's move
  const computerMove = () => {
    const availableMoves = board
      .map((cell, index) => (cell === null ? index : null))
      .filter((val) => val !== null);

    // Simple AI: Random move
    if (availableMoves.length > 0) {
      const randomIndex =
        availableMoves[Math.floor(Math.random() * availableMoves.length)];
      const newBoard = [...board];
      newBoard[randomIndex] = "O";
      setBoard(newBoard);
      setIsXNext(true);
    }
  };

  useEffect(() => {
    if (!isXNext && !winner) {
      setTimeout(computerMove, 500); // Delay for better user experience
    }
  }, [isXNext, winner]);

  // Determine the winner
  useEffect(() => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        return;
      }
    }

    if (!board.includes(null)) {
      setWinner("draw");
    }
  }, [board]);

  // Handle player move
  const handleClick = (index) => {
    if (board[index] || winner || !isXNext) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    setIsXNext(false);
  };

  // Handle winning and level progression
  useEffect(() => {
    if (winner === "X") {
      setTimeout(() => {
        setCurrentLevel((prevLevel) => prevLevel + 1);
        setCurrentScore((prevScore) => prevScore + 10); // Add 10 points for each win
        resetGame();
      }, 2000); // 2 seconds delay to show the result
    } else if (winner === "draw") {
      setTimeout(() => {
        resetGame(); // Reset the same level
      }, 2000); // 2 seconds delay
    }
  }, [winner]);

  // Handle game over and update high score
  useEffect(() => {
    if (currentScore > highScores[difficulty]) {
      setHighScores((prevHighScores) => ({
        ...prevHighScores,
        [difficulty]: currentScore,
      }));
    }
  }, [currentScore, difficulty]);

  // Reset game
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  // Start a new game
  const startNewGame = () => {
    setCurrentScore(0);
    setCurrentLevel(1);
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsXNext(true);
    setGameState("difficulty");
  };

  // Render Menu
  const renderMenu = () => (
    <div className="menu">
      <h1 className="title">Tic Tac Toe</h1>
      <button onClick={() => setGameState("difficulty")}>Start Game</button>
      <button onClick={() => setGameState("highScores")}>View High Scores</button>
    </div>
  );

  // Render Difficulty Selection
  const renderDifficultySelection = () => (
    <div className="difficulty-selection">
      <h2>Select Difficulty</h2>
      <button onClick={() => selectDifficulty("easy")}>Easy</button>
      <button onClick={() => selectDifficulty("medium")}>Medium</button>
      <button onClick={() => selectDifficulty("hard")}>Hard</button>
    </div>
  );

  const selectDifficulty = (level) => {
    setDifficulty(level);
    setGameState("game");
  };

  // Render Game Board
  const renderGame = () => (
    <div className="game">
      <h2>
        Difficulty: {difficulty} | Level: {currentLevel} | Score: {currentScore}
      </h2>
      <div className="board">
        {board.map((cell, index) => (
          <div
            key={index}
            className={`cell ${cell}`}
            onClick={() => handleClick(index)}
          >
            {cell}
          </div>
        ))}
      </div>
      {winner && (
        <div className="result">
          {winner === "draw" ? (
            <h3>It's a draw! Restarting the same level...</h3>
          ) : (
            <h3>Congratulations! Moving to Level {currentLevel + 1}...</h3>
          )}
        </div>
      )}
    </div>
  );

  // Render High Scores
  const renderHighScores = () => (
    <div className="high-scores">
      <h2>High Scores</h2>
      <ul>
        <li>Easy: {highScores.easy}</li>
        <li>Medium: {highScores.medium}</li>
        <li>Hard: {highScores.hard}</li>
      </ul>
      <button onClick={() => setGameState("menu")}>Back to Menu</button>
    </div>
  );

  // Render based on game state
  return (
    <div className="app dark-mode">
      {gameState === "menu" && renderMenu()}
      {gameState === "difficulty" && renderDifficultySelection()}
      {gameState === "game" && renderGame()}
      {gameState === "highScores" && renderHighScores()}
    </div>
  );
};

export default App;