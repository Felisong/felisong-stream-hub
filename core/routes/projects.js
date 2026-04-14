const express = require("express");
const router = express.Router();
const path = require("path");

const clients = {
  catSpawner: [],
};

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
  console.log(
    `Cat spawn client connectedion, total:${clients.catSpawner.length}`,
  );

  // keep connection alive
  const heartbeat = setInterval(() => {
    res.write(": ping\n\n");
  }, 15000);

  // clear array on close.
  req.on("close", () => {
    clearInterval(heartbeat);
    console.log("Client disconnected!");
    clients.catSpawner = clients.catSpawner.filter((c) => c !== res);
    console.log(`Remaining clients: ${clients.catSpawner.length}`);
  });
});

// now on updates, update the data in each object coming in
function broadcastToCatSpawner(event) {
  console.log(`broadcasting to ${clients.catSpawner.length} clients`);
  const data = `data: ${JSON.stringify(event)}\n\n`;
  clients.catSpawner.forEach((client) => client.write(data));
}

module.exports = { router, broadcastToCatSpawner };
