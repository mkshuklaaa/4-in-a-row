const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  gameId: String,
  players: [String],
  winner: String,
  movesCount: Number,
  duration: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Game", gameSchema);