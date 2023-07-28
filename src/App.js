import { useState } from "react";

function Square({ value, onSquareClick, highlight }) {
  const squareStyle = {
    backgroundColor: highlight ? "yellow" : "white",
  };

  return (
    <button className="square" onClick={onSquareClick} style={squareStyle}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let winnerLine = [];

  if (winner) {
    winnerLine = winner.line;
  }

  let status;
  if (winner) {
    status = "Winner: " + winner.player;
  } else if (!squares.includes(null)) {
    status = "Stalemate";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const rows = [0, 1, 2];
  const cols = [0, 1, 2];

  return (
    <>
      <div className="status">{status}</div>

      {rows.map((row) => (
        <div key={row} className="board-row">
          {cols.map((col) => {
            const index = row * 3 + col;
            const isWinningSquare = winnerLine.includes(index);
            return (
              <Square
                key={index}
                value={squares[index]}
                onSquareClick={() => handleClick(index)}
                highlight={isWinningSquare}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handleSortToggle() {
    setIsAscending((prevIsAscending) => !prevIsAscending);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }

    const row = Math.floor(move / 3) + 1;
    const col = (move % 3) + 1;
    const location = move ? `(Row: ${row}, Col: ${col})` : "";

    if (move == currentMove) {
      return "You're on move #" + currentMove;
    } else {
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>
            {description} {location}
          </button>
        </li>
      );
    }
  });

  const sortedMoves = isAscending ? moves : moves.slice().reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div>
          <button onClick={handleSortToggle}>
            Sort Moves: {isAscending ? "Ascending" : "Descending"}
          </button>
        </div>
        <ul>{sortedMoves}</ul>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        player: squares[a],
        line: [a, b, c],
      };
    }
  }
  return null;
}
