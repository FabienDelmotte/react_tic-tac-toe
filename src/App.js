import { useState } from "react";

function Square({ value, onSquareClick, isWinningSquare }) {
  const className = "square" + (isWinningSquare ? " winning" : "");

  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, step }) {
  function handleClick(col, row) {
    const i = row * 3 + col;

    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares, { col, row });
  }

  const winnerInfo = calculateWinner(squares);
  let winner, winningLine;
  if (winnerInfo) {
    winner = winnerInfo.winner;
    winningLine = winnerInfo.line;
  }

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    if (step === 9) {
      status = "It's a draw!";
    } else {
      status = "Next player: " + (xIsNext ? "X" : "O");
    }
  }

  const boardSize = 3;
  const rows = [];
  for (let row = 0; row < boardSize; row++) {
    const columns = [];
    for (let col = 0; col < boardSize; col++) {
      const squareIndex = row * boardSize + col;
      const isWinningSquare = winningLine && winningLine.includes(squareIndex);
      columns.push(
        <Square
          value={squares[squareIndex]}
          onSquareClick={() => handleClick(col, row)}
          isWinningSquare={isWinningSquare}
          key={squareIndex}
        />
      );
    }
    rows.push(
      <div className="board-row" key={row}>
        {columns}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {rows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([
    { squares: Array(9).fill(null), location: null },
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;
  const [isAscending, setIsAscending] = useState(true);

  function handlePlay(nextSquares, location) {
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { squares: nextSquares, location },
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    const { location } = squares;
    let description;
    if (move > 0) {
      description =
        "Go to move #" +
        move +
        " (" +
        (location.row + 1) +
        ", " +
        (location.col + 1) +
        ")";
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        {currentMove === move ? (
          currentMove > 0 ? (
            "You are at move #" +
            move +
            " (" +
            (location.row + 1) +
            ", " +
            (location.col + 1) +
            ")"
          ) : (
            "You are at game start"
          )
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  function sortHistory() {
    setIsAscending(!isAscending);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          step={currentMove}
        />
      </div>
      <div className="game-info">
        <button onClick={() => sortHistory()}>
          Sort by: {isAscending ? "Descending" : "Ascending"}
        </button>
        <ol>{isAscending ? moves : moves.reverse()}</ol>
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
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}
