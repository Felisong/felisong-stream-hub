const express = require('express');
const router = express.Router();
const path = require('path');


const clients = {
    catSpawner: []
};

// serves the front end html file for me at this endpoint
router.get('/cat-spawner', (req, res) => {
    res.sendFile(path.join(__dirname, '../../cat-spawner/index.html'));
})

// Cat spawner server sent events endpoint - front end will be calling here
router.get('/cat-spawner/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    
    clients.catSpawner.push(res);
    console.log(`Cat spawn client connectedion, totalL ${clients.catSpawner.length}`);

    // clear array on close.
    req.on('close', () => {
        clients.catSpawner = clients.catSpawner.filter(c => c !== res);
    })
})

// now on updates, update the data in each object coming in
function broadcastToCatSpawner(event){
    const data = `data ${JSON.stringify(event)}\n\n`
    clients.catSpawner.forEach(client => client.write(data));
}

module.exports = {router, broadcastToCatSpawner}