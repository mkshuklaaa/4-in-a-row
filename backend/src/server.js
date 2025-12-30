require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const socketHandler = require("./socket/socketHandler");
const leaderboardRoutes = require("./routes/leaderboard.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/leaderboard", leaderboardRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

socketHandler(io);

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();

  server.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
  );
})();