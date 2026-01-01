import "../App.css";
const Board = ({ game, socket }) => {
  const handleClick = (col) => {
    socket.emit("MAKE_MOVE", {
      gameId: game.gameId,
      column: col
    });
  };

  // Identify players for coloring
  const [player1, player2] = game.players || [];

  const getCellClass = (value) => {
    if (value === 0) return "cell";

    if (value === "BOT") return "cell black";

    if (value === player1) return "cell green";

    if (value === player2) return "cell red";

    return "cell";
  };

  return (
    <div className="board-wrapper">
      <div className="board-grid-full">

        {/* COLUMN ARROWS */}
        {game.board.map((_, colIndex) => (
          <button
            key={`arrow-${colIndex}`}
            className="arrow-btn"
            onClick={() => handleClick(colIndex)}
          >
            ↓
          </button>
        ))}

        {/* BOARD CELLS (TOP → BOTTOM) */}
        {[5, 4, 3, 2, 1, 0].map((row) =>
          game.board.map((col, colIndex) => (
            <div
              key={`${row}-${colIndex}`}
              className={getCellClass(col[row])}
            />
          ))
        )}
      </div>

      {/* PLAYER LEGEND */}
      <div className="player-legend">
        {player1 && (
          <span>
            <span className="legend-dot green" /> {player1}
          </span>
        )}
        {player2 && player2 !== "BOT" && (
          <span>
            <span className="legend-dot red" /> {player2}
          </span>
        )}
        {player2 === "BOT" && (
          <span>
            <span className="legend-dot black" /> BOT
          </span>
        )}
      </div>
    </div>
  );
};

export default Board;