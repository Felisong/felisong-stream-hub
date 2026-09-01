const express = require("express");
const router = express.Router();
const { broadcastToCatSpawner } = require("./sseClients");

router.use(express.json());

router.post("/create-reward", (req, res) => {
  const body = req.body;
  console.log(`GOT HERE!: `, body);

  // example: push the update out to any connected cat-spawner clients
  // broadcastToCatSpawner({ type: "reward-created", ...body });

  res.json({
    success: true,
    message: "meow.",
  });
});

router.post("/create-cat", (req, res) => {
  const body = req.body;
  console.log(`create-cat: `, body);

  res.json({
    success: true,
    message: "new cat.",
  });
});

module.exports = router;
