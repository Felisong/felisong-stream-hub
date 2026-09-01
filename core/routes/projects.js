const express = require("express");
const router = express.Router();
const path = require("path");
const { clients, broadcastToCatSpawner } = require("./sseClients");
const catFetches = require("./catFetches");

router.use(express.json());

// serves the front end html file for me at this endpoint
router.use(
  "/cat-spawner",
  express.static(path.join(__dirname, "../../cat-spawner")),
);

// Cat spawner server sent events endpoint - front end will be calling here
router.get("/cat-spawner/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();
  res.write('data: {"connected": true}\n\n');

  clients.catSpawner.push(res);
  console.log(`Cat spawn client connected, total:${clients.catSpawner.length}`);

  const heartbeat = setInterval(() => {
    res.write(": ping\n\n");
  }, 15000);

  req.on("close", () => {
    clearInterval(heartbeat);
    console.log("Client disconnected!");
    clients.catSpawner = clients.catSpawner.filter((c) => c !== res);
    console.log(`Remaining clients: ${clients.catSpawner.length}`);
  });
});

// all /cats/* routes live in catFetches.js
router.use("/cats", catFetches);

module.exports = { router, broadcastToCatSpawner };
