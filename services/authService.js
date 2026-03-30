


// const { google } = require("googleapis");
// const fs = require("fs");
// const path = require("path");

// const CREDENTIALS_PATH = path.join(__dirname, "../config/oauth_credentials.json");
// const TOKEN_PATH = path.join(__dirname, "../config/token.json");

// let oauth2Client;

// // ✅ Check if running on GitHub Actions (use env vars) or locally (use files)
// // if (process.env.YOUTUBE_CLIENT_ID && process.env.YOUTUBE_REFRESH_TOKEN) {
// //   console.log("🔐 Using environment variables for YouTube auth");

// //   oauth2Client = new google.auth.OAuth2(
// //     process.env.YOUTUBE_CLIENT_ID,
// //     process.env.YOUTUBE_CLIENT_SECRET,
// //     "http://localhost:5000/callback"  
// //   );

// //   oauth2Client.setCredentials({
// //     refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
// //   });
// if (process.env.YOUTUBE_CLIENT_ID && process.env.YOUTUBE_CLIENT_SECRET) {
//   console.log("🔐 Using environment variables for YouTube auth");

//   oauth2Client = new google.auth.OAuth2(
//     process.env.YOUTUBE_CLIENT_ID,
//     process.env.YOUTUBE_CLIENT_SECRET,
//     "http://localhost:5000/callback"
//   );

//   if (process.env.YOUTUBE_REFRESH_TOKEN) {
//     oauth2Client.setCredentials({
//       refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
//     });
//   }

// } else {
//   console.log("🔐 Using local config files for YouTube auth");

//   const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
//   const credentialKeys = credentials.web || credentials.installed;
//   const { client_id, client_secret, redirect_uris } = credentialKeys;

//   oauth2Client = new google.auth.OAuth2(
//     client_id,
//     client_secret,
//     redirect_uris[0]
//   );

//   if (fs.existsSync(TOKEN_PATH)) {
//     const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
//     oauth2Client.setCredentials(token);
//   }
// }

// // function getAuthUrl() {
// //   return oauth2Client.generateAuthUrl({
// //     access_type: "offline",
// //     scope: ["https://www.googleapis.com/auth/youtube.upload"],
// //   });
// // }

// function getAuthUrl() {
//   return oauth2Client.generateAuthUrl({
//     access_type: "offline",
//     prompt: "consent",   // REQUIRED
//     scope: ["https://www.googleapis.com/auth/youtube.upload"],
//   });
// }

// // async function saveToken(code) {
// //   const { tokens } = await oauth2Client.getToken(code);
// //   oauth2Client.setCredentials(tokens);
// //   fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
// //   console.log("✅ Token saved to", TOKEN_PATH);
// // }
// async function saveToken(code) {
//   try {
//     console.log("Received code:", code);

//     const { tokens } = await oauth2Client.getToken(code);

//     console.log("TOKENS:", tokens);

//     oauth2Client.setCredentials(tokens);

//     // Ensure config folder exists
//     const dir = path.dirname(TOKEN_PATH);
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//     }

//     fs.writeFileSync(
//       TOKEN_PATH,
//       JSON.stringify(tokens, null, 2)
//     );

//     console.log("✅ Token saved to:", TOKEN_PATH);

//   } catch (error) {
//     console.error("❌ Error saving token:");
//     console.error(error.message);
//     console.error(error.response?.data || error);
//   }
// }

// function getOAuthClient() {
//   return oauth2Client;
// }

// module.exports = { getAuthUrl, saveToken, getOAuthClient };




// const { google } = require("googleapis");
// const fs = require("fs");
// const path = require("path");
// const { env } = require("process");


// const TOKEN_PATH = path.join(__dirname, "../config/token.json");

// let oauth2Client;

// // Always use environment variables
// console.log("🔐 Using environment variables for YouTube auth");

// oauth2Client = new google.auth.OAuth2(
//   process.env.YOUTUBE_CLIENT_ID,
//   process.env.YOUTUBE_CLIENT_SECRET,
//   "http://localhost:5000/callback"
// );

// // If refresh token exists in .env, use it
// if (process.env.YOUTUBE_REFRESH_TOKEN) {
//   oauth2Client.setCredentials({
//     refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
//   });
// }

// // Generate Google OAuth URL
// function getAuthUrl() {
//   return oauth2Client.generateAuthUrl({
//     access_type: "offline",
//     prompt: "consent",
//     scope: [
//       "https://www.googleapis.com/auth/youtube.upload",
//     ],
//   });
// }

// // Save token after user authorizes
// // async function saveToken(code) {
// //   try {
// //     const { tokens } = await oauth2Client.getToken(code);

// //     oauth2Client.setCredentials(tokens);

// //     // Save token locally
// //     fs.writeFileSync(
// //       TOKEN_PATH,
// //       JSON.stringify(tokens, null, 2)
// //     );

// //     console.log("✅ Token saved to:", TOKEN_PATH);

// //     return tokens;

// //   } catch (error) {
// //     console.error("❌ Error saving token:", error.message);
// //     throw error;
// //   }
// // }

// async function saveToken(code) {
//   try {
//     console.log("Received code:", code);

//     const { tokens } = await oauth2Client.getToken(code);

//     console.log("Tokens received:", tokens);

//     oauth2Client.setCredentials(tokens);

//     const fs = require("fs");
//     const path = require("path");

//     const TOKEN_PATH = path.join(
//       __dirname,
//       "../config/token.json"
//     );

//     fs.writeFileSync(
//       TOKEN_PATH,
//       JSON.stringify(tokens, null, 2)
//     );

//     console.log("✅ Token saved to:", TOKEN_PATH);

//     return tokens;

//   } catch (error) {
//     console.error("❌ Error saving token:");
//     console.error(error);
//     throw error;
//   }
// }
// // Return OAuth client
// function getOAuthClient() {
//   return oauth2Client;
// }

// module.exports = {
//   getAuthUrl,
//   saveToken,
//   getOAuthClient,
// };


// require("dotenv").config();

// const { google } = require("googleapis");
// const fs = require("fs");
// const path = require("path");

// /*
// ---------------------------------------
// Paths
// ---------------------------------------
// */

// const TOKEN_PATH = path.join(
//   __dirname,
//   "../config/token.json"
// );

// /*
// ---------------------------------------
// Debug logs
// ---------------------------------------
// */

// console.log("========== AUTH DEBUG ==========");

// console.log(
//   "CLIENT_ID exists:",
//   !!process.env.YOUTUBE_CLIENT_ID
// );

// console.log(
//   "CLIENT_SECRET exists:",
//   !!process.env.YOUTUBE_CLIENT_SECRET
// );

// console.log(
//   "REFRESH_TOKEN exists:",
//   !!process.env.YOUTUBE_REFRESH_TOKEN
// );

// console.log(
//   "CLIENT_ID value:",
//   process.env.YOUTUBE_CLIENT_ID
// );

// /*
// ---------------------------------------
// OAuth Client
// ---------------------------------------
// */

// console.log(
//   "🔐 Using environment variables for YouTube auth"
// );

// const oauth2Client =
//   new google.auth.OAuth2(
//     process.env.YOUTUBE_CLIENT_ID,
//     process.env.YOUTUBE_CLIENT_SECRET,
//     "http://localhost:5000/callback"
//   );

// /*
// ---------------------------------------
// If refresh token exists
// ---------------------------------------
// */

// if (process.env.YOUTUBE_REFRESH_TOKEN) {
//   oauth2Client.setCredentials({
//     refresh_token:
//       process.env.YOUTUBE_REFRESH_TOKEN,
//   });
// }

// /*
// ---------------------------------------
// Generate Auth URL
// ---------------------------------------
// */

// function getAuthUrl() {
//   console.log("Generating OAuth URL...");

//   const url =
//     oauth2Client.generateAuthUrl({
//       access_type: "offline",
//       prompt: "consent",
//       scope: [
//         "https://www.googleapis.com/auth/youtube.upload",
//       ],
//     });

//   console.log("Auth URL:", url);

//   return url;
// }

// /*
// ---------------------------------------
// Save Token
// ---------------------------------------
// */

// async function saveToken(code) {
//   try {
//     console.log(
//       "========== TOKEN DEBUG =========="
//     );

//     console.log("Received code:", code);

//     const { tokens } =
//       await oauth2Client.getToken(code);

//     console.log("Tokens received:");
//     console.log(tokens);

//     oauth2Client.setCredentials(tokens);

//     /*
//     Ensure config folder exists
//     */

//     const dir = path.dirname(
//       TOKEN_PATH
//     );

//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, {
//         recursive: true,
//       });
//     }

//     /*
//     Save token
//     */

//     fs.writeFileSync(
//       TOKEN_PATH,
//       JSON.stringify(tokens, null, 2)
//     );

//     console.log(
//       "✅ Token saved to:",
//       TOKEN_PATH
//     );

//     return tokens;

//   } catch (error) {
//     console.log(
//       "========== TOKEN ERROR =========="
//     );

//     console.error(
//       "Error message:",
//       error.message
//     );

//     if (error.response) {
//       console.error(
//         "Google response:"
//       );
//       console.error(
//         error.response.data
//       );
//     }

//     console.error("Full error:");
//     console.error(error);

//     throw error;
//   }
// }

// /*
// ---------------------------------------
// Export
// ---------------------------------------
// */

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
const fs = require("fs");
const path = require("path");

/*
---------------------------------------
DEBUG
---------------------------------------
*/

console.log("========== AUTH DEBUG ==========");

console.log(
  "CLIENT_ID:",
  process.env.YOUTUBE_CLIENT_ID
);

console.log(
  "CLIENT_SECRET exists:",
  !!process.env.YOUTUBE_CLIENT_SECRET
);

console.log(
  "REFRESH_TOKEN exists:",
  !!process.env.YOUTUBE_REFRESH_TOKEN
);

/*
---------------------------------------
OAuth Client
---------------------------------------
*/

const REDIRECT_URI =
  "http://localhost:5000/callback";

console.log(
  "REDIRECT URI:",
  REDIRECT_URI
);

const oauth2Client =
  new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    REDIRECT_URI
);

/*
---------------------------------------
Generate Auth URL
---------------------------------------
*/

function getAuthUrl() {
  try {
    console.log("Generating OAuth URL...");

    const url =
      oauth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: [
          "https://www.googleapis.com/auth/youtube.upload",
        ],
      });

    console.log(
      "Generated URL:"
    );

    console.log(url);

    return url;

  } catch (error) {
    console.error(
      "Error generating auth URL:"
    );

    console.error(error);

    throw error;
  }
}

/*
---------------------------------------
Save Token
---------------------------------------
*/

async function saveToken(code) {
  try {
    console.log("Saving token...");

    const { tokens } =
      await oauth2Client.getToken(code);

    console.log(
      "Tokens received:"
    );

    console.log(tokens);

    oauth2Client.setCredentials(tokens);

    const TOKEN_PATH =
      path.join(
        __dirname,
        "../config/token.json"
      );

    fs.writeFileSync(
      TOKEN_PATH,
      JSON.stringify(tokens, null, 2)
    );

    console.log(
      "Token saved to:",
      TOKEN_PATH
    );

  } catch (error) {
    console.error(
      "Error saving token:"
    );

    console.error(error);

    throw error;
  }
}

function getOAuthClient() {
  return oauth2Client;
}

module.exports = {
  getAuthUrl,
  saveToken,
  getOAuthClient,
};