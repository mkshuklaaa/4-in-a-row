require("dotenv").config();
const express = require("express");
const { connectProducer } = require("./kafka/producer");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const socketHandler = require("./socket/socketHandler");
const leaderboardRoutes = require("./routes/leaderboard.routes");
const { connectKafka } = require("./config/kafka");


const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/analytics", require("./routes/analytics"));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

socketHandler(io);

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  await connectProducer();

  server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

  try {
    await connectKafka();
  } catch (err) {
    console.warn("⚠️ Kafka not running, continuing without analytics");
  }
})();
