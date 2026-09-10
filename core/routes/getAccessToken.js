const fs = require("fs/promises");
const path = require("path");

async function getCurrentAccessToken() {
  const filePath = path.join(__dirname, "../tokens.json");

  const file = await fs.readFile(filePath, "utf8");
  const tokens = JSON.parse(file);
  return tokens.access_token;
}

module.exports = getCurrentAccessToken;
