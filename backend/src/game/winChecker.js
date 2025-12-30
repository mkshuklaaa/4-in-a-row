const ROWS = 6;
const COLS = 7;

const directions = [
  [1, 0],   // horizontal
  [0, 1],   // vertical
  [1, 1],   // diagonal \
  [1, -1]   // diagonal /
];

function checkWin(board, col, row, player) {
  for (const [dx, dy] of directions) {
    let count = 1;

    count += countDir(board, col, row, dx, dy, player);
    count += countDir(board, col, row, -dx, -dy, player);

    if (count >= 4) return true;
  }
  return false;
}

function countDir(board, col, row, dx, dy, player) {
  let c = 0;
  let x = col + dx;
  let y = row + dy;

  while (
    x >= 0 && x < COLS &&
    y >= 0 && y < ROWS &&
    board[x][y] === player
  ) {
    c++;
    x += dx;
    y += dy;
  }
  return c;
}

module.exports = { checkWin };