const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema({
  username: String,
  wins: Number
});

module.exports = mongoose.model("Leaderboard", leaderboardSchema);