import { useState } from 'react';

function Square({ value, onSquareClick, highlight }) {
  return (
    <button className={`square ${highlight ? 'highlight' : ''}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, winningSquares }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares, i);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner.player;
  } else if (squares.every(Boolean)) {
    status = 'Draw!';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const boardRows = [];
  for (let row = 0; row < 3; row++) {
    const boardCols = [];
    for (let col = 0; col < 3; col++) {
      const index = row * 3 + col;
      boardCols.push(
        <Square 
          key={index}
          value={squares[index]} 
          onSquareClick={() => handleClick(index)} 
          highlight={winningSquares && winningSquares.includes(index)}
        />
      );
    }
    boardRows.push(<div key={row} className="board-row">{boardCols}</div>);
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), lastMove: null }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0; 
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares, index) {
    const nextHistory = [...history.slice(0, currentMove + 1), { squares: nextSquares, lastMove: index }];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1); 
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((step, move) => {
    const col = 1 + (step.lastMove % 3);
    const row = 1 + Math.floor(step.lastMove / 3);
    const description = move ?
      `Go to move #${move} (${col}, ${row})` :
      'Go to game start';
    return (
      <li key={move}>
        <button 
          onClick={() => jumpTo(move)}
          style={{ fontWeight: move === currentMove ? 'bold' : 'normal' }}
        >
          {description}
        </button>
      </li>
    );
  });

  if (!isAscending) {
    moves.reverse();
  }

  const winner = calculateWinner(currentSquares);
  const winningSquares = winner ? winner.line : null;

  return (
    <div className="game">
      <div className="game-board">
        <Board 
          xIsNext={xIsNext} 
          squares={currentSquares} 
          onPlay={handlePlay} 
          winningSquares={winningSquares}
        />
      </div>
      <div className="game-info">
        <button onClick={() => setIsAscending(!isAscending)}>
          {isAscending ? 'Sort Descending' : 'Sort Ascending'}
        </button>
        <ol>{moves}</ol>
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
      return { player: squares[a], line: [a, b, c] };
    }
  }
  return null;
}
