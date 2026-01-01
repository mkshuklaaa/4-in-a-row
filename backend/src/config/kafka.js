const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "connect4-backend",
  brokers: [process.env.KAFKA_BROKER]
});

const producer = kafka.producer();

const connectKafka = async () => {
  await producer.connect();
  console.log("✅ Kafka Producer connected");
};

module.exports = { producer, connectKafka };