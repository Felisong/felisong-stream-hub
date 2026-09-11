const express = require("express");
const axios = require("axios");
const router = express.Router();
const { broadcastToCatSpawner } = require("./sseClients");
const getCurrentAccessToken = require("./getAccessToken");

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

router.post("/refund-reward", async (req, res) => {
  const body = req.body;
  const accessToken = await getCurrentAccessToken();
  try {
    const response = await axios.patch(
      `https://api.twitch.tv/helix/channel_points/custom_rewards/redemptions`,
      {
        status: "CANCELED",
      },
      {
        params: {
          broadcaster_id: process.env.TWITCH_BROADCASTER_ID,
          reward_id: body.rewardId,
          id: body.redemptionId,
        },
        headers: {
          "Client-Id": process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (response.status !== 200) {
      throw new Error("refund reward response not ok: " + response);
    }
    // finish error handling for this
    res.status(200).json({
      success: true,
      message: "Reward has been refunded.",
    });
  } catch (err) {
    console.log("Twitch refund failed");

    console.log("status:", err);

    res.status(err.response?.status || 500).json({
      success: false,
      message: err.response?.data?.message || "Failed to refund reward.",
    });
  }
});

router.post("/send-chat-message", async (req, res) => {
  const chatMessage = req.body.message;
  console.log(`message: `, chatMessage);
  const accessToken = await getCurrentAccessToken();
  console.log(`access token is not missing?: `, accessToken);
  try {
    let response = await axios.post(
      "https://api.twitch.tv/helix/chat/messages",

      {
        broadcaster_id: process.env.TWITCH_BROADCASTER_ID,
        sender_id: process.env.TWITCH_BROADCASTER_ID,
        message: chatMessage,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Client-Id": process.env.TWITCH_CLIENT_ID,
          "Content-Type": "application/json",
        },
      },
    );
    const data = response.data;
    if (response.status != 200) {
      throw new Error(
        `failed in sending a chat message backend: `,
        data.status,
      );
    }
    res.status(200).json({
      success: true,
      message: "message should have sent: " + data.message,
    });
  } catch (err) {
    console.log("Twitch send message failed");

    console.log("status:", err);

    res.status(err.response?.status || 500).json({
      success: false,
      message: err.response?.data?.message || "Failed to send message.",
    });
  }
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
