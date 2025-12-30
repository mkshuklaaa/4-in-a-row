const BOT_NAME = "BOT";

function getValidRow(board, col) {
  for (let r = 0; r < 6; r++) {
    if (board[col][r] === 0) return r;
  }
  return -1;
}

function simulateMove(board, col, player) {
  const row = getValidRow(board, col);
  if (row === -1) return null;

  const copy = board.map(c => [...c]);
  copy[col][row] = player;
  return { board: copy, row };
}

function botMove(game, checkWin) {
  const board = game.board;
  const human = game.players.find(p => p !== BOT_NAME);

  // 1️⃣ Try to WIN
  for (let c = 0; c < 7; c++) {
    const sim = simulateMove(board, c, BOT_NAME);
    if (sim && checkWin(sim.board, c, sim.row, BOT_NAME)) {
      return c;
    }
  }

  // 2️⃣ BLOCK opponent
  for (let c = 0; c < 7; c++) {
    const sim = simulateMove(board, c, human);
    if (sim && checkWin(sim.board, c, sim.row, human)) {
      return c;
    }
  }

  // 3️⃣ Prefer center
  const preference = [3, 2, 4, 1, 5, 0, 6];
  for (const c of preference) {
    if (getValidRow(board, c) !== -1) return c;
  }

  return null;
}

module.exports = { BOT_NAME, botMove };