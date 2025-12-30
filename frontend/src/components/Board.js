import "./Board.css";

const Board = ({ game, socket }) => {
  const handleClick = (col) => {
    socket.emit("MAKE_MOVE", {
      gameId: game.gameId,
      column: col
    });
  };

  return (
    <div className="board-wrapper">
      <div className="board-grid-full">

        {/* ARROWS ROW */}
        {game.board.map((_, colIndex) => (
          <button
            key={`arrow-${colIndex}`}
            className="arrow-btn"
            onClick={() => handleClick(colIndex)}
          >
            ↓
          </button>
        ))}

        {/* BOARD CELLS */}
        {[5, 4, 3, 2, 1, 0].map((row) =>
          game.board.map((col, colIndex) => {
            const value = col[row];
            const className =
              value === 0
                ? "cell"
                : value === "BOT"
                ? "cell black"
                : "cell red";

            return (
              <div
                key={`${row}-${colIndex}`}
                className={className}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default Board;