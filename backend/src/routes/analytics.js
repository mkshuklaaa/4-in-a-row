const router = require("express").Router();
const Analytics = require("../models/Analytics");

router.get("/", async (req, res) => {
  const data = await Analytics.find().sort({ date: -1 });
  res.json(data);
});

module.exports = router;