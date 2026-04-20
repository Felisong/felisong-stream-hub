// hey me! I am making this to assure that no matter what state the tokens.json file is in, this should always boot upa and be working
/* 
If it doesnt even exist -> visit auth url -> authorize -> write the file -> set the refresh token timeout -> subscribe to events.
if it does exist and its EXPIRED -> refresh token timeout -> subscribe to events
if it does exis tand works -> subscribe to events and sets token timeout.
 */

// invalid auth token
// i guess im sending the file to authorize and it crashes when its not
// add try loop to catch the crash, and delete the file, then rerun start up process?
const fs = require("fs");
const WebSocket = require("ws");
const path = require("path");
const axios = require("axios");
const { broadcastToCatSpawner } = require("./routes/projects");
const { fileURLToPath } = require("url");

async function refreshAccessToken() {
  // in refresh access token, get the current token.
  const tokens = JSON.parse(
    fs.readFileSync(path.join(__dirname, "tokens.json")),
  );

  try {
    // ask for a refresh token
    const response = await axios.post(
      "https://id.twitch.tv/oauth2/token",
      null,
      {
        params: {
          client_id: process.env.TWITCH_CLIENT_ID,
          client_secret: process.env.TWITCH_CLIENT_SECRET,
          grant_type: "refresh_token",
          refresh_token: tokens.refresh_token,
        },
      },
    );

    // read the new tokens, and write in the file to update!
    const newTokens = response.data;
    newTokens.expires_at = Date.now() + tokens.expires_in * 1000;
    fs.writeFileSync(
      path.join(__dirname, "tokens.json"),
      JSON.stringify(newTokens, null, 2),
    );
    // the token... should be refreshed...
    console.log("Tokens refreshed!");
    return newTokens.access_token;
  } catch (err) {
    // console.error("Failed to refresh token:", err);
  }
}

// connect to subscription
// I will use this
function connectToMyEventSub() {
  // WEB SOCKET FOR EVENT SUB
  async function getEvents() {
    const tokens = JSON.parse(
      fs.readFileSync(path.join(__dirname, "tokens.json")),
    );

    const ws = new WebSocket("wss://eventsub.wss.twitch.tv/ws");

    ws.on("open", () => {
      console.log("Connected to Twitch EventSub!");
    });

    ws.on("message", async (data) => {
      const msg = JSON.parse(data);
      const type = msg.metadata?.message_type;

      if (type === "session_welcome") {
        const sessionId = msg.payload.session.id;
        // console.log("Session ID:", sessionId);
        await subscribeToEvents(sessionId, tokens.access_token);
      }

      if (type === "notification") {
        const event = msg.payload.event;
        const rewardTitle = msg.payload.subscription.type;
        // console.log("Event received:", rewardTitle, event);

        broadcastToCatSpawner({
          reward: event.reward,
          user: event.user_name,
          input: event.user_input,
        });
      }
    });

    ws.on("close", () => {
      console.log("EventSub disconnected, reconnecting in 5s...");
      setTimeout(getEvents, 5000);
    });
  }

  async function subscribeToEvents(sessionId, accessToken) {
    const broadcasterId = process.env.TWITCH_BROADCASTER_ID;

    await axios.post(
      "https://api.twitch.tv/helix/eventsub/subscriptions",
      {
        type: "channel.channel_points_custom_reward_redemption.add",
        version: "1",
        condition: { broadcaster_user_id: broadcasterId },
        transport: {
          method: "websocket",
          session_id: sessionId,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Client-Id": process.env.TWITCH_CLIENT_ID,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("Subscribed to channel point redemptions!");
  }
  // execute
  getEvents();
}

async function startUp() {
  // if the file exists =>
  if (fs.existsSync(path.join(__dirname, "tokens.json"))) {
    // read the contents
    const tokens = JSON.parse(
      fs.readFileSync(path.join(__dirname, "tokens.json")),
    );
    fs.writeFileSync(
      "debug.log",
      `[${Date.now()}] I make it to read the file.\n`,
      {
        flag: "a",
      },
    );

    if (tokens.expires_at && Date.now() > tokens.expires_at) {
      fs.writeFileSync(
        "debug.log",
        `[${Date.now()}] expires_at is real, and date.now\n`,
        {
          flag: "a",
        },
      );

      await refreshAccessToken();
    }

    connectToMyEventSub();
    setInterval(refreshAccessToken, 1000 * 60 * 60);
    // i never delete the file here.
  } else {
    console.log(`Please visit http://localhost:3000/auth`);
  }
}

module.exports = { refreshAccessToken, connectToMyEventSub, startUp };
