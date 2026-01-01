const mongoose = require("mongoose");
const { Kafka } = require("kafkajs");

mongoose.connect(process.env.MONGO_URI);

const Analytics = mongoose.model(
  "Analytics",
  new mongoose.Schema({
    date: { type: String, unique: true },
    totalGames: { type: Number, default: 0 },
    totalDuration: { type: Number, default: 0 },
    wins: { type: Object, default: {} },
    gamesPerHour: { type: Object, default: {} }
  })
);

const kafka = new Kafka({
  clientId: "analytics-service",
  brokers: [process.env.KAFKA_BROKER]
});

const consumer = kafka.consumer({ groupId: "analytics-group" });

async function start() {
  await consumer.connect();
  await consumer.subscribe({ topic: "game-events" });

  console.log("📊 Analytics Consumer Running");

  await consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value.toString());
      if (event.type !== "GAME_FINISHED") return;

      const date = new Date(event.timestamp).toISOString().slice(0, 10);
      const hour = new Date(event.timestamp).getHours();

      let doc = await Analytics.findOne({ date });
      if (!doc) {
        doc = new Analytics({ date });
      }

      doc.totalGames += 1;
      doc.totalDuration += event.duration;

      if (event.winner !== "DRAW") {
        doc.wins[event.winner] =
          (doc.wins[event.winner] || 0) + 1;
      }

      doc.gamesPerHour[hour] =
        (doc.gamesPerHour[hour] || 0) + 1;

      await doc.save();
      console.log("📈 Analytics updated for", date);
    }
  });
}

start();
