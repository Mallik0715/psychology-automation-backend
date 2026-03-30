


// require("dotenv").config();

// const { google } = require("googleapis");
// const fs = require("fs");
// const path = require("path");

// /*
// ---------------------------------------
// DEBUG
// ---------------------------------------
// */

// console.log("========== AUTH DEBUG ==========");

// console.log(
//   "CLIENT_ID:",
//   process.env.YOUTUBE_CLIENT_ID
// );

// console.log(
//   "CLIENT_SECRET exists:",
//   !!process.env.YOUTUBE_CLIENT_SECRET
// );

// console.log(
//   "REFRESH_TOKEN exists:",
//   !!process.env.YOUTUBE_REFRESH_TOKEN
// );

// /*
// ---------------------------------------
// OAuth Client
// ---------------------------------------
// */

// const REDIRECT_URI =
//   "http://localhost:5000/callback";

// console.log(
//   "REDIRECT URI:",
//   REDIRECT_URI
// );

// const oauth2Client =
//   new google.auth.OAuth2(
//     process.env.YOUTUBE_CLIENT_ID,
//     process.env.YOUTUBE_CLIENT_SECRET,
//     REDIRECT_URI
// );

// /*
// ---------------------------------------
// Generate Auth URL
// ---------------------------------------
// */

// function getAuthUrl() {
//   try {
//     console.log("Generating OAuth URL...");

//     const url =
//       oauth2Client.generateAuthUrl({
//         access_type: "offline",
//         prompt: "consent",
//         scope: [
//           "https://www.googleapis.com/auth/youtube.upload",
//         ],
//       });

//     console.log(
//       "Generated URL:"
//     );

//     console.log(url);

//     return url;

//   } catch (error) {
//     console.error(
//       "Error generating auth URL:"
//     );

//     console.error(error);

//     throw error;
//   }
// }

// /*
// ---------------------------------------
// Save Token
// ---------------------------------------
// */

// async function saveToken(code) {
//   try {
//     console.log("Saving token...");

//     const { tokens } =
//       await oauth2Client.getToken(code);

//     console.log(
//       "Tokens received:"
//     );

//     console.log(tokens);

//     oauth2Client.setCredentials(tokens);

//     const TOKEN_PATH =
//       path.join(
//         __dirname,
//         "../config/token.json"
//       );

//     fs.writeFileSync(
//       TOKEN_PATH,
//       JSON.stringify(tokens, null, 2)
//     );

//     console.log(
//       "Token saved to:",
//       TOKEN_PATH
//     );

//   } catch (error) {
//     console.error(
//       "Error saving token:"
//     );

//     console.error(error);

//     throw error;
//   }
// }

// function getOAuthClient() {
//   return oauth2Client;
// }

// module.exports = {
//   getAuthUrl,
//   saveToken,
//   getOAuthClient,
// };


require("dotenv").config();

const { google } = require("googleapis");

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  "http://localhost:5000/callback"
);

console.log(
  "REFRESH TOKEN EXISTS:",
  !!process.env.YOUTUBE_REFRESH_TOKEN
);

// 🔴 CRITICAL — always set credentials
oauth2Client.setCredentials({
  refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
});

function getOAuthClient() {
  return oauth2Client;
}

module.exports = {
  getOAuthClient,
};