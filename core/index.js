require("dotenv").config();
const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { startUp } = require("./startupHelper");
const { router } = require("./routes/projects");
const app = express();
const PORT = process.env.PORT || 3000;

const SCOPES = [
  "channel:read:redemptions",
  "channel:manage:redemptions",
  "chat:read",
  "chat:edit",
  "channel:read:subscriptions",
  "channel:read:hype_train",
  "moderator:read:followers",
  "bits:read",
  "channel:manage:raids",
].join(" ");

app.use("/projects", router);
app.use(
  "/cat-spawner",
  express.static(path.join(__dirname, "../assets/cat-spawner")),
);

app.get("/", (req, res) => {
  res.send.JSON({
    status: "healthy",
    informationNeeded: { unknown: "no notes!" },
  });
});
// redirect to twitch login
app.get("/auth", (req, res) => {
  const url = `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.TWITCH_CLIENT_ID}&redirect_uri=${process.env.TWITCH_REDIRECT_URI}&response_type=code&scope=${SCOPES}`;
  res.redirect(url);
});

// twitch sends us back here with a code
app.get("/auth/callback", async (req, res) => {
  const code = req.query.code;

  try {
    const response = await axios.post(
      "https://id.twitch.tv/oauth2/token",
      null,
      {
        params: {
          client_id: process.env.TWITCH_CLIENT_ID,
          client_secret: process.env.TWITCH_CLIENT_SECRET,
          code,
          grant_type: "authorization_code",
          redirect_uri: process.env.TWITCH_REDIRECT_URI,
        },
      },
    );
    const tokens = response.data;
    tokens.expires_at = Date.now() + tokens.expires_in * 1000;
    fs.writeFileSync(
      path.join(__dirname, "tokens.json"),
      JSON.stringify(tokens, null, 2),
    );
    console.log("Tokens saved!");
    res.send("Auth complete! You can close this tab.");
  } catch (err) {
    console.error(err);
    res.send("Something went wrong during retrieving data");
  }
});



// On start handler depending on the existence of the token.json
startUp();

// listener
app.listen(PORT, () => {
  console.log(`Stream hub is running on http://localhost:${PORT}`);
  console.log(`Authorize at http://localhost:${PORT}/auth`);
});
