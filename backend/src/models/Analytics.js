const mongoose = require("mongoose");

const AnalyticsSchema = new mongoose.Schema({
  date: { type: String, unique: true }, // YYYY-MM-DD
  totalGames: { type: Number, default: 0 },
  totalDuration: { type: Number, default: 0 },
  wins: { type: Map, of: Number }, // username -> wins
  gamesPerHour: { type: Map, of: Number } // hour -> count
});

module.exports = mongoose.model("Analytics", AnalyticsSchema);