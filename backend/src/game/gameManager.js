const { v4: uuidv4 } = require("uuid");

const waitingQueue = new Map();      // username -> socket
const activeGames = new Map();       // gameId -> gameState
const userToGame = new Map();        // username -> gameId

// create empty 7x6 board
const createBoard = () => {
  return Array.from({ length: 7 }, () => Array(6).fill(0));
};

const createGame = (player1, player2) => {
  const gameId = uuidv4();

  const game = {
    gameId,
    board: createBoard(),
    players: [player1, player2],
    sockets: {},
    currentTurn: player1, // 🔥 FIRST PLAYER STARTS
    status: "ACTIVE",
    createdAt: Date.now(),
    lastActive: Date.now()
  };

  activeGames.set(gameId, game);
  userToGame.set(player1, gameId);
  userToGame.set(player2, gameId);

  return game;
};

module.exports = {
  waitingQueue,
  activeGames,
  userToGame,
  createGame
};