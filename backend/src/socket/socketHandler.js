const {
  waitingQueue,
  activeGames,
  userToGame,
  createGame
} = require("../game/gameManager");

const { BOT_NAME, botMove } = require("../game/bot");
const { checkWin } = require("../game/winChecker");
const Game = require("../models/Game");
const User = require("../models/User");

// 🔥 Track bot fallback timers to avoid race conditions
const botTimeouts = new Map(); // username -> timeoutId

function getValidRow(board, col) {
  for (let r = 0; r < 6; r++) {
    if (board[col][r] === 0) return r;
  }
  return -1;
}

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Connected:", socket.id);

    // ================= JOIN GAME =================
    socket.on("JOIN_GAME", (username) => {
      socket.username = username;

      // 🔁 REJOIN ACTIVE GAME
      if (userToGame.has(username)) {
        const gameId = userToGame.get(username);
        const game = activeGames.get(gameId);

        if (game && game.status === "ACTIVE") {
          game.sockets[username] = socket.id;
          socket.join(gameId);
          socket.emit("REJOIN_SUCCESS", game);
          return;
        }
      }

      // 🧍‍♂️ PvP MATCH FOUND
      if (waitingQueue.size > 0) {
        const [opponentName, opponentSocket] =
          waitingQueue.entries().next().value;

        waitingQueue.delete(opponentName);

        // ❌ Cancel bot timeout for opponent
        if (botTimeouts.has(opponentName)) {
          clearTimeout(botTimeouts.get(opponentName));
          botTimeouts.delete(opponentName);
        }

        const game = createGame(opponentName, username);

        game.sockets[opponentName] = opponentSocket.id;
        game.sockets[username] = socket.id;

        socket.join(game.gameId);
        opponentSocket.join(game.gameId);

        io.to(game.gameId).emit("GAME_STARTED", game);
        return;
      }

      // ⏳ WAITING → BOT FALLBACK
      waitingQueue.set(username, socket);

      const timeoutId = setTimeout(() => {
        // If user already matched, do nothing
        if (!waitingQueue.has(username)) return;

        waitingQueue.delete(username);

        const game = createGame(username, BOT_NAME);
        game.sockets[username] = socket.id;

        socket.join(game.gameId);
        socket.emit("GAME_STARTED", game);

        botTimeouts.delete(username);
      }, 10000);

      botTimeouts.set(username, timeoutId);
    });

    // ================= MAKE MOVE =================
    socket.on("MAKE_MOVE", async ({ gameId, column }) => {
      const game = activeGames.get(gameId);
      if (!game || game.status !== "ACTIVE") return;

      const player = socket.username;
      if (player !== game.currentTurn) return;

      const row = getValidRow(game.board, column);
      if (row === -1) return;

      // 🧍‍♂️ HUMAN MOVE
      game.board[column][row] = player;

      if (checkWin(game.board, column, row, player)) {
        await finishGame(io, game, player);
        return;
      }

      if (game.board.every(col => col.every(cell => cell !== 0))) {
        await finishGame(io, game, "DRAW");
        return;
      }

      // 🔁 SWITCH TURN
      const opponent = game.players.find(p => p !== player);
      game.currentTurn = opponent;

      io.to(game.gameId).emit("BOARD_UPDATE", game);

      // 🤖 BOT MOVE (ONLY IF BOT GAME)
      if (opponent === BOT_NAME) {
        setTimeout(async () => {
          const botCol = botMove(game, checkWin);
          if (botCol === null) return;

          const botRow = getValidRow(game.board, botCol);
          game.board[botCol][botRow] = BOT_NAME;

          if (checkWin(game.board, botCol, botRow, BOT_NAME)) {
            await finishGame(io, game, BOT_NAME);
            return;
          }

          game.currentTurn = player;
          io.to(game.gameId).emit("BOARD_UPDATE", game);
        }, 500);
      }
    });

    // ================= DISCONNECT =================
    socket.on("disconnect", () => {
      const username = socket.username;
      if (!username) return;

      waitingQueue.delete(username);

      if (botTimeouts.has(username)) {
        clearTimeout(botTimeouts.get(username));
        botTimeouts.delete(username);
      }
    });
  });
};

// ================= FINISH GAME =================
async function finishGame(io, game, winner) {
  game.status = "FINISHED";

  await Game.create({
    gameId: game.gameId,
    players: game.players,
    winner,
    movesCount: game.board.flat().filter(v => v !== 0).length,
    duration: Math.floor((Date.now() - game.createdAt) / 1000)
  });

  if (winner !== "DRAW") {
    await User.findOneAndUpdate(
      { username: winner },
      { $inc: { wins: 1, gamesPlayed: 1 } },
      { upsert: true }
    );
  }

  game.players.forEach(p => userToGame.delete(p));
  activeGames.delete(game.gameId);

  io.to(game.gameId).emit("GAME_END", { winner });
}