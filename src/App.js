import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [isAppLoading, setIsAppLoading] = useState(true); // For the initial preloader
  const [isScreenLoading, setIsScreenLoading] = useState(false); // For the "Start Game" preloader
  const [gameState, setGameState] = useState("menu"); // menu, game, highScores
  const [difficulty, setDifficulty] = useState("");
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentScore, setCurrentScore] = useState(0);
  const [highScores, setHighScores] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
  });
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [xColor, setXColor] = useState("#FF5733"); // Default X color
  const [oColor, setOColor] = useState("#3498DB"); // Default O color

  const randomColor = () =>
    `#${Math.floor(Math.random() * 16777215).toString(16)}`;

  useEffect(() => {
    // Simulate the app's initial loading
    setTimeout(() => {
      setIsAppLoading(false);
    }, 2000); // Change the duration as needed (2 seconds here)
  }, []);

  useEffect(() => {
    const savedScores = JSON.parse(localStorage.getItem("ticTacToeHighScores"));
    if (savedScores) {
      setHighScores(savedScores);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("ticTacToeHighScores", JSON.stringify(highScores));
  }, [highScores]);

  const resetHighScores = () => {
    const resetScores = { easy: 0, medium: 0, hard: 0 };
    setHighScores(resetScores);
    localStorage.setItem("ticTacToeHighScores", JSON.stringify(resetScores));
  };

  const computerMove = () => {
    const availableMoves = board
      .map((cell, index) => (cell === null ? index : null))
      .filter((val) => val !== null);

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

  const handleClick = (index) => {
    if (board[index] || winner || !isXNext) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    setIsXNext(false);
  };

  useEffect(() => {
    if (winner === "X") {
      if (currentScore > highScores[difficulty]) {
        setHighScores((prevHighScores) => ({
          ...prevHighScores,
          [difficulty]: currentScore,
        }));
      }
    }
  }, [winner, currentScore, highScores, difficulty]);

  const retryLevel = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  const nextLevel = () => {
    setCurrentLevel((prevLevel) => prevLevel + 1);
    setCurrentScore((prevScore) => prevScore + 10);
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setXColor(randomColor()); // Change X color
    setOColor(randomColor()); // Change O color
  };

  const startGame = () => {
    setIsScreenLoading(true); // Show the second preloader
    setTimeout(() => {
      setIsScreenLoading(false);
      setGameState("difficulty");
    }, 2000); // 2-second loading time before showing difficulty selection
  };

  const renderMenu = () => (
    <div className="menu">
      <h1 className="title">Tic Tac Toe</h1>
      <button onClick={startGame}>Start Game</button>
      <button onClick={() => setGameState("highScores")}>View High Scores</button>
    </div>
  );

  const renderDifficultySelection = () => (
    <div className="difficulty-selection">
      <h2>Select Difficulty</h2>
      <button onClick={() => selectDifficulty("easy")}>Easy</button>
      <button onClick={() => selectDifficulty("medium")}>Medium</button>
      <button onClick={() => selectDifficulty("hard")}>Hard</button>
      <button className="back-button" onClick={() => setGameState("menu")}>
        Back to Main Menu
      </button>
    </div>
  );

  const selectDifficulty = (level) => {
    setDifficulty(level);
    setGameState("game");
  };

  const renderHighScores = () => (
    <div className="high-scores">
      <h2>High Scores</h2>
      <ul>
        <li>Easy: {highScores.easy}</li>
        <li>Medium: {highScores.medium}</li>
        <li>Hard: {highScores.hard}</li>
      </ul>
      <button onClick={resetHighScores} className="reset-button">
        Reset High Scores
      </button>
      <button className="back-button" onClick={() => setGameState("menu")}>
        Back to Main Menu
      </button>
    </div>
  );

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
            style={{ color: cell === "X" ? xColor : cell === "O" ? oColor : "" }}
          >
            {cell}
          </div>
        ))}
      </div>
      {winner && (
        <div className="result">
          {winner === "draw" ? (
            <h3>It's a draw! Retry the same level...</h3>
          ) : (
            <h3>Congratulations! You won!</h3>
          )}
          <button onClick={retryLevel}>Retry Level</button>
          {winner !== "draw" && <button onClick={nextLevel}>Next Level</button>}
        </div>
      )}
      <button className="back-button" onClick={() => setGameState("menu")}>
        Back to Main Menu
      </button>
    </div>
  );

  return (
    <div className="app dark-mode">
      {isAppLoading ? (
        <div className="loader">
          <img src="/preloader1.gif" alt="Loading..." />
        </div>
      ) : isScreenLoading ? (
        <div className="loader">
          <img src="/preloader2.gif" alt="Loading..." />
        </div>
      ) : (
        <>
          {gameState === "menu" && renderMenu()}
          {gameState === "difficulty" && renderDifficultySelection()}
          {gameState === "game" && renderGame()}
          {gameState === "highScores" && renderHighScores()}
        </>
      )}
    </div>
  );
};

export default App;
