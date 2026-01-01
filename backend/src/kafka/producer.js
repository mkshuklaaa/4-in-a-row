const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "game-backend",
  brokers: ["localhost:9092"]
});

const producer = kafka.producer();

let isConnected = false;

/**
 * Connect producer ONCE when server starts
 */
async function connectProducer() {
  if (isConnected) return;

  await producer.connect();
  isConnected = true;
  console.log("✅ Kafka Producer Connected");
}

/**
 * Send GAME_FINISHED event
 */
async function sendGameFinished(event) {
  try {
    if (!isConnected) {
      await connectProducer();
    }

    await producer.send({
      topic: "game-events",
      messages: [
        {
          value: JSON.stringify(event)
        }
      ]
    });
  } catch (err) {
    console.error("❌ Kafka send error:", err.message);
  }
}

module.exports = {
  connectProducer,
  sendGameFinished
};