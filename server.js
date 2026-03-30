
// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");

// const {
//   getAuthUrl,
//   saveToken,
// } = require("./services/authService");

// require("./workers/cronJob");

// const app = express();

// app.use(cors());
// app.use(express.json());

// /*
// -------------------------------------------------------
// Health check
// -------------------------------------------------------
// */

// app.get("/", (req, res) => {
//   res.send("Server running successfully");
// });

// /*
// -------------------------------------------------------
// Step 1 — Generate Auth URL
// -------------------------------------------------------
// */

// app.get("/auth", (req, res) => {
//   try {
//     console.log("========== AUTH REQUEST ==========");

//     const url = getAuthUrl();

//     console.log("Auth URL generated:");
//     console.log(url);

//     res.redirect(url);

//   } catch (error) {
//     console.error("Auth URL error:");
//     console.error(error);

//     res.status(500).send("Failed to generate auth URL");
//   }
// });

// /*
// -------------------------------------------------------
// Step 2 — Callback from Google
// -------------------------------------------------------
// */

// app.get("/callback", async (req, res) => {
//   try {
//     console.log("========== CALLBACK DEBUG ==========");

//     const code = req.query.code;

//     console.log("Authorization code received:");
//     console.log(code);

//     if (!code) {
//       console.log("No code received from Google");
//       return res.send("❌ No authorization code received");
//     }

//     console.log("Saving token now...");

//     await saveToken(code);

//     console.log("Token saved successfully");

//     res.send("✅ Refresh token generated and saved successfully");

//   } catch (error) {
//     console.log("========== CALLBACK ERROR ==========");

//     console.error("Error message:");
//     console.error(error.message);

//     if (error.response) {
//       console.error("Google response:");
//       console.error(error.response.data);
//     }

//     console.error("Full error:");
//     console.error(error);

//     res.send(
//       "❌ Error saving token — check terminal logs"
//     );
//   }
// });

// /*
// -------------------------------------------------------
// Start server
// -------------------------------------------------------
// */

// const PORT = 5000;

// app.listen(PORT, () => {
//   console.log(
//     `Server running on port ${PORT}`
//   );
// });

// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");

// const {
//   getAuthUrl,
//   saveToken,
// } = require("./services/authService");

// const app = express();

// app.use(cors());
// app.use(express.json());

// /*
// ---------------------------------------
// Debug — detect unexpected exit
// ---------------------------------------
// */

// process.on("exit", (code) => {
//   console.log("PROCESS EXITED with code:", code);
// });

// process.on("uncaughtException", (err) => {
//   console.log("UNCAUGHT EXCEPTION:");
//   console.error(err);
// });

// process.on("unhandledRejection", (err) => {
//   console.log("UNHANDLED REJECTION:");
//   console.error(err);
// });

// /*
// ---------------------------------------
// Health check
// ---------------------------------------
// */

// app.get("/", (req, res) => {
//   res.send("YouTube Automation Backend Running");
// });

// /*
// ---------------------------------------
// Step 1 — Start OAuth
// ---------------------------------------
// */

// app.get("/auth", (req, res) => {
//   try {
//     console.log("AUTH REQUEST RECEIVED");

//     const url = getAuthUrl();

//     console.log("Redirecting to Google...");

//     res.redirect(url);

//   } catch (error) {
//     console.error("Auth error:");
//     console.error(error);

//     res.status(500).send("Auth failed");
//   }
// });

// /*
// ---------------------------------------
// Step 2 — Google callback
// ---------------------------------------
// */

// app.get("/callback", async (req, res) => {
//   try {
//     console.log("CALLBACK RECEIVED");

//     const code = req.query.code;

//     console.log("Authorization code:", code);

//     if (!code) {
//       return res.send("No code received");
//     }

//     console.log("Saving token...");

//     await saveToken(code);

//     console.log("Token saved successfully");

//     res.send(
//       "✅ Refresh token saved successfully. You can close this window."
//     );

//   } catch (error) {
//     console.error("Error saving token:");
//     console.error(error);

//     res.status(500).send(
//       "❌ Error saving token — check terminal logs"
//     );
//   }
// });

// /*
// ---------------------------------------
// Start server
// ---------------------------------------
// */

// const PORT = 5000;

// const server = app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// /*
// ---------------------------------------
// Keep Node process alive
// ---------------------------------------
// */

// setInterval(() => {
//   // prevents Node from exiting
// }, 1000);






require("dotenv").config();

const express = require("express");
const cors = require("cors");

const {
  getAuthUrl,
  saveToken,
} = require("./services/authService");

const app = express();

app.use(cors());
app.use(express.json());

/*
---------------------------------------
GLOBAL DEBUG
---------------------------------------
*/

console.log("========== SERVER START ==========");

console.log("PORT:", 5000);

process.on("exit", (code) => {
  console.log("PROCESS EXITED:", code);
});

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION:");
  console.error(err);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION:");
  console.error(err);
});

/*
---------------------------------------
ROUTE DEBUG
---------------------------------------
*/

app.use((req, res, next) => {
  console.log(
    "REQUEST:",
    req.method,
    req.url
  );
  next();
});

/*
---------------------------------------
Health check
---------------------------------------
*/

app.get("/", (req, res) => {
  console.log("ROOT HIT");

  res.send(
    "YouTube Automation Backend Running"
  );
});

/*
---------------------------------------
AUTH ROUTE
---------------------------------------
*/

app.get("/auth", (req, res) => {
  try {
    console.log(
      "========== AUTH ROUTE =========="
    );

    const url = getAuthUrl();

    console.log("AUTH URL:");
    console.log(url);

    if (!url) {
      throw new Error(
        "Auth URL is undefined"
      );
    }

    res.redirect(url);

  } catch (error) {
    console.error(
      "AUTH ERROR:"
    );

    console.error(error);

    res.status(500).send(
      "Auth failed"
    );
  }
});

/*
---------------------------------------
CALLBACK
---------------------------------------
*/

app.get("/callback", async (req, res) => {
  try {
    console.log(
      "========== CALLBACK =========="
    );

    const code = req.query.code;

    console.log(
      "CODE RECEIVED:",
      code
    );

    if (!code) {
      return res.send(
        "No authorization code received"
      );
    }

    await saveToken(code);

    res.send(
      "✅ Token saved successfully"
    );

  } catch (error) {
    console.log(
      "CALLBACK ERROR"
    );

    console.error(error);

    res.status(500).send(
      "Error saving token"
    );
  }
});

/*
---------------------------------------
START SERVER
---------------------------------------
*/

const PORT = 5000;

const server = app.listen(
  PORT,
  () => {
    console.log(
      "Server running on port",
      PORT
    );
  }
);

/*
Keep alive
*/

setInterval(() => {}, 1000);