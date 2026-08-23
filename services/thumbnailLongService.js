const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");
const { createGroqCompletion } = require("./groqHelper");

async function generateThumbnailPrompt(topic) {
  const response = await createGroqCompletion({
    messages: [
      {
        role: "system",
        content: `You are a viral YouTube thumbnail concept designer for top facts channels. Return ONLY valid JSON, no markdown, no backticks.`,
      },
      {
        role: "user",
        content: `Create a high-CTR YouTube thumbnail concept for a 5-minute video compilation of "30 Mind-Blowing Facts" about: "${topic}".

Return exact JSON format:
{
  "imagePrompt": "dramatic cinematic background scene about human brain psychology, epic lighting, 4k",
  "unsplashQuery": "2-3 word search query for unsplash photo",
  "topLabel": "30 MIND FACTS",
  "mainText": "SHOCKING main text max 3 words ALL CAPS",
  "bottomText": "short curiosity hook max 5 words",
  "emoji": "🧠"
}`,
      },
    ],
    max_tokens: 300,
    temperature: 0.8,
  });

  const raw = response.choices[0].message.content.trim();
  return JSON.parse(raw);
}

// Fetch Unsplash image
async function fetchUnsplashImage(query) {
  if (!process.env.UNSPLASH_ACCESS_KEY) throw new Error("No Unsplash access key");
  console.log("🖼️ Fetching Unsplash thumbnail background for:", query);
  const response = await fetch(
    `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape`,
    {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    }
  );
  if (!response.ok) throw new Error(`Unsplash error: ${response.status}`);
  const data = await response.json();
  return loadImage(data.urls.regular);
}

// Fallback Pollinations image
async function fetchPollinationsImage(prompt) {
  const encodedPrompt = encodeURIComponent(`${prompt}, cinematic, dramatic lighting, high quality, no text`);
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=720&nologo=true&seed=${Date.now()}`;
  console.log("🎨 Fetching Pollinations thumbnail image...");
  return Promise.race([
    loadImage(url),
    new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 20000)),
  ]);
}

function drawOutlineText(ctx, text, x, y, fillColor, strokeColor, lineWidth = 10) {
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = lineWidth;
  ctx.lineJoin = "round";
  ctx.strokeText(text, x, y);
  ctx.fillStyle = fillColor;
  ctx.fillText(text, x, y);
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);
  return lines;
}

/**
 * Generates a fancy, high-CTR 16:9 thumbnail for 25-30 facts long-form videos.
 */
async function generateLongThumbnail(topic) {
  console.log("🖼️ Generating fancy 16:9 thumbnail for 25-facts video:", topic);

  const width = 1280;
  const height = 720;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  let thumbnailData;
  try {
    thumbnailData = await generateThumbnailPrompt(topic);
  } catch (err) {
    console.warn("⚠️ Groq thumbnail prompt failed, using defaults:", err.message);
    thumbnailData = {
      imagePrompt: `dramatic human brain glowing thoughts ${topic}`,
      unsplashQuery: "brain psychology",
      topLabel: "25 MIND FACTS",
      mainText: topic.toUpperCase().slice(0, 25),
      bottomText: "YOU DIDN'T KNOW THIS!",
      emoji: "🧠",
    };
  }

  // Step 1: Draw background image (Unsplash -> Pollinations -> Gradient)
  let bgImage = null;
  try {
    bgImage = await fetchUnsplashImage(thumbnailData.unsplashQuery || "brain psychology");
  } catch (err) {
    console.log("⚠️ Unsplash fallback to Pollinations...");
    try {
      bgImage = await fetchPollinationsImage(thumbnailData.imagePrompt);
    } catch (err2) {
      console.log("⚠️ Using gradient fallback for thumbnail background.");
    }
  }

  if (bgImage) {
    ctx.drawImage(bgImage, 0, 0, width, height);
  } else {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#0b091a");
    gradient.addColorStop(0.5, "#1a103c");
    gradient.addColorStop(1, "#2d0b38");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  // Step 2: Vignette / Dark Overlay for readable text
  const overlay = ctx.createLinearGradient(0, 0, 0, height);
  overlay.addColorStop(0, "rgba(0,0,0,0.65)");
  overlay.addColorStop(0.5, "rgba(0,0,0,0.35)");
  overlay.addColorStop(1, "rgba(0,0,0,0.85)");
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, width, height);

  // Step 3: Red Accent Frame Border
  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 14;
  ctx.strokeRect(0, 0, width, height);

  // Step 4: Top Badge Tag (Highlighting 25-30 FACTS)
  const badgeText = `${thumbnailData.emoji || "🔥"} ${thumbnailData.topLabel.toUpperCase()}`;
  ctx.font = "bold 28px Sans";
  const badgeW = ctx.measureText(badgeText).width + 50;
  const badgeH = 50;
  const badgeX = 40;
  const badgeY = 40;

  const badgeGrad = ctx.createLinearGradient(badgeX, 0, badgeX + badgeW, 0);
  badgeGrad.addColorStop(0, "#ef4444");
  badgeGrad.addColorStop(1, "#f59e0b");
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 25);
  ctx.fillStyle = badgeGrad;
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 26px Sans";
  ctx.textAlign = "left";
  ctx.fillText(badgeText, badgeX + 25, badgeY + 34);

  // Step 5: Main High-CTR Text (Glowing & Big)
  ctx.textAlign = "center";
  ctx.font = "bold 115px Sans";
  const lines = wrapText(ctx, thumbnailData.mainText, 1100);
  const lineHeight = 125;
  const totalH = lines.length * lineHeight;
  const startY = height / 2 - totalH / 2 + 65;

  lines.forEach((line, i) => {
    ctx.shadowColor = "#ef4444";
    ctx.shadowBlur = 30;
    drawOutlineText(ctx, line, width / 2, startY + i * lineHeight, "#ffffff", "#000000", 18);
    ctx.shadowBlur = 0;
  });

  // Step 6: Bottom Curiosity Banner
  ctx.font = "bold 36px Sans";
  ctx.textAlign = "center";
  drawOutlineText(
    ctx,
    `👇 ${(thumbnailData.bottomText || "WATCH TILL THE END").toUpperCase()}`,
    width / 2,
    height - 35,
    "#f59e0b",
    "#000000",
    8
  );

  // Save thumbnail image file
  const outputPath = path.join(__dirname, "../storage/thumbnails/thumbnail_long.jpg");
  const buffer = canvas.toBuffer("image/jpeg", { quality: 0.95 });
  fs.writeFileSync(outputPath, buffer);

  console.log("✅ Fancy 16:9 25-Facts Thumbnail saved:", outputPath);
  return outputPath;
}

module.exports = { generateLongThumbnail };
