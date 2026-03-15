const { google } = require("googleapis");
const readline = require("readline");

const CLIENT_ID = "YOUR_CLIENT_ID";
const CLIENT_SECRET = "YOUR_CLIENT_SECRET";
const REDIRECT_URI = "urn:ietf:wg:oauth:2.0:oob";

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: ["https://www.googleapis.com/auth/youtube.upload"],
});

console.log("👉 Open this URL in your browser:");
console.log(authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("\n🔑 Enter the code from the browser: ", async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  console.log("\n✅ Your Refresh Token:");
  console.log(tokens.refresh_token);
  rl.close();
});