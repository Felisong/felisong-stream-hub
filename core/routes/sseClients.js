const clients = {
  catSpawner: [],
};

function broadcastToCatSpawner(event) {
  console.log(`broadcasting to ${clients.catSpawner.length} clients`);
  const data = `data: ${JSON.stringify(event)}\n\n`;
  clients.catSpawner.forEach((client) => client.write(data));
}

module.exports = { clients, broadcastToCatSpawner };