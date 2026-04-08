require('dotenv').config()

const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');
const {router, broadcastToCatSpawner} = require('./routes/projects');
const app = express();
const PORT = process.env.PORT || 3000;

const SCOPES = [
  'channel:read:redemptions',
  'channel:manage:redemptions',
  'chat:read',
  'chat:edit',
  'channel:read:subscriptions',
  'channel:read:hype_train',
  'moderator:read:followers',
  'bits:read',
  'channel:manage:raids'
].join(' ')

app.use('/projects', router);
app.use('/cat-spawner', express.static(path.join(__dirname, '../assets/cat-spawner')))

app.get('/', (req, res) => {
  res.send.JSON({status: 'healthy', informationNeeded: {unknown: "no notes!"}});
})
// redirect to twitch login
app.get('/auth', (req, res) => {
   console.log(`test i should make it here`, process.env.TWITCH_CLIENT_ID);
    const url =  `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.TWITCH_CLIENT_ID}&redirect_uri=${process.env.TWITCH_REDIRECT_URI}&response_type=code&scope=${SCOPES}`;
    res.redirect(url);
})

// twitch sends us back here with a code
app.get('/auth/callback', async (req, res) => {
    const code = req.query.code;
   

    try {
        const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
            params: {
                client_id: process.env.TWITCH_CLIENT_ID,
                client_secret: process.env.TWITCH_CLIENT_SECRET,
                code,
                grant_type: 'authorization_code',
                redirect_uri: process.env.TWITCH_REDIRECT_URI
            }
        })

        const tokens = response.data;
        console.log(`tokens: `, JSON.stringify(tokens, null, 2));
        fs.writeFileSync(path.join(__dirname, 'tokens.json'), JSON.stringify(tokens, null, 2));        
        console.log('Tokens saved!')
        res.send('Auth complete! You can close this tab.');

    } catch (err){
        console.error(err);
        res.send('Something went wrong during retrieving data');
    }
})



// REFRESH TOKEN LOGIC
async function refreshAccessToken(){
    const tokens = json.parse(fs.readFileSync(path.join(__dirname + 'tokens.json')));

  try {
    const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
      params: {
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: tokens.refresh_token
      }
    })

    const newTokens = response.data
    fs.writeFileSync(path.join(__dirname, 'tokens.json'), JSON.stringify(newTokens, null, 2))
    console.log('Tokens refreshed!')
    return newTokens.access_token

  } catch (err) {
    console.error('Failed to refresh token:', err)
}}

// WEB SOCKET FOR EVENT SUB
async function connectEventSub() {
  const tokens = JSON.parse(fs.readFileSync(path.join(__dirname, 'tokens.json')))
  const ws = new WebSocket('wss://eventsub.wss.twitch.tv/ws')

  ws.on('open', () => {
    console.log('Connected to Twitch EventSub!')
  })

  ws.on('message', async (data) => {
    const msg = JSON.parse(data)
    const type = msg.metadata?.message_type

    if (type === 'session_welcome') {
      const sessionId = msg.payload.session.id
      console.log('Session ID:', sessionId)
      await subscribeToEvents(sessionId, tokens.access_token)
    }

    if (type === 'notification') {
      const event = msg.payload.event
      const rewardTitle = msg.payload.subscription.type
      console.log('Event received:', rewardTitle, event)

      broadcastToCatSpawner({reward: event.reward, user: event.user_name, input: event.user_input});
    }
  })

  ws.on('close', () => {
    console.log('EventSub disconnected, reconnecting in 5s...')
    setTimeout(connectEventSub, 5000)
  })
}

async function subscribeToEvents(sessionId, accessToken) {
  const broadcasterId = process.env.TWITCH_BROADCASTER_ID

  await axios.post('https://api.twitch.tv/helix/eventsub/subscriptions', {
    type: 'channel.channel_points_custom_reward_redemption.add',
    version: '1',
    condition: { broadcaster_user_id: broadcasterId },
    transport: {
      method: 'websocket',
      session_id: sessionId
    }
  }, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Client-Id': process.env.TWITCH_CLIENT_ID,
      'Content-Type': 'application/json'
    }
  })

  console.log('Subscribed to channel point redemptions!')
}

connectEventSub()


// listener
app.listen(PORT, () => {
  console.log(`Stream hub is running on http://localhost:${PORT}`);
  console.log(`Authorize at http://localhost:${PORT}/auth`);
})

setInterval(refreshAccessToken, 1000 * 60 * 60);