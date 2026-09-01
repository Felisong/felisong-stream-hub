const express = require("express");
const router = express.Router();
const { broadcastToCatSpawner } = require("./sseClients");

router.use(express.json());

router.post("/create-reward", (req, res) => {
  const body = req.body;
  console.log(`GOT HERE!: `, body);

  // example: push the update out to any connected cat-spawner clients
  //    broadcastToCatSpawner({
  //   reward: event.reward,
  //   user: event.user_name,
  //   input: event.user_input,
  // whatever else. This will send the event to change behavior immediately.
  // });

  res.json({
    success: true,
    message: "meow.",
  });
});

// TODO: make a refundReward function here.

router.post("/create-cat", (req, res) => {
  const body = req.body;
  console.log(`create-cat: `, body);

  res.json({
    success: true,
    message: "new cat.",
  });
});

module.exports = router;
