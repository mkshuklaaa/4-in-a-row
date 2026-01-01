const { producer } = require("../config/kafka");

const emitEvent = async (type, payload) => {
  await producer.send({
    topic: "game-analytics",
    messages: [
      {
        value: JSON.stringify({
          type,
          payload,
          timestamp: Date.now()
        })
      }
    ]
  });
};

module.exports = { emitEvent };