require("dotenv").config();
const fs = require("fs");
const path = require("path");

console.log("========== LONG-FORM VIDEO PIPELINE START ==========");

/*
-------------------------------------------------------
Global Safety Handlers
-------------------------------------------------------
*/
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:");
  console.error(err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:");
  console.error(err);
  process.exit(1);
});

/*
-------------------------------------------------------
Validate Required Environment Variables
-------------------------------------------------------
*/
const requiredEnv = [
  "YOUTUBE_CLIENT_ID",
  "YOUTUBE_CLIENT_SECRET",
  "YOUTUBE_REFRESH_TOKEN",
  "GROQ_API_KEY",
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`❌ Missing environment variable: ${key}`);
    process.exit(1);
  }
}

console.log("✅ Environment variables validated");

/*
-------------------------------------------------------
Create Storage Folders
-------------------------------------------------------
*/
const dirs = [
  "./storage",
  "./storage/clips",
  "./storage/audio",
  "./storage/music",
  "./storage/output",
  "./storage/thumbnails",
];

dirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created folder: ${dir}`);
  }
});

/*
-------------------------------------------------------
Import Services
-------------------------------------------------------
*/
const { getNextLongTopic } = require("./services/topicService");
const { generateLongScript } = require("./services/scriptLongService");
const { generateLongSEO } = require("./services/seoLongService");
const { splitIntoSentences } = require("./services/sentenceService");
const { searchLongClips } = require("./services/clipSearchLongService");
const { downloadClip } = require("./services/clipDownloadService");
const { generateVoice } = require("./services/voiceService");
const { generateSubtitles } = require("./services/subtitleService");
const { buildLongVideo } = require("./services/videoBuilderLongService");
const { generateLongThumbnail } = require("./services/thumbnailLongService");
const { uploadToYouTube } = require("./services/uploadService");

/*
-------------------------------------------------------
Main Long-Form Pipeline
-------------------------------------------------------
*/
async function runLongPipeline() {
  try {
    console.log("🚀 Starting 5-minute weekly long video pipeline...");

    // 1. Topic
    const topic = getNextLongTopic();
    console.log("🎯 Long Video Topic:", topic);

    // 2. Script
    const { script, keywords } = await generateLongScript(topic);
    console.log("📝 Long script generated");

    // 3. High-CTR SEO & Hashtags
    const seo = await generateLongSEO(topic, script);
    console.log("🔍 High-CTR Title generated:", seo.title);

    // 4. Sentences & Subtitles
    const sentences = splitIntoSentences(script);
    console.log("📄 Sentences:", sentences.length);
    const subtitlePath = await generateSubtitles(sentences);
    console.log("🎬 Subtitles generated:", subtitlePath);

    // 5. B-Roll Stock Footage (20-30 Clips)
    const clips = await searchLongClips(topic, keywords);
    console.log(`🎥 Downloadable B-roll clips found: ${clips.length}`);

    const downloadedClips = [];
    for (let i = 0; i < clips.length; i++) {
      try {
        const savedPath = await downloadClip(clips[i], i + 1);
        downloadedClips.push(savedPath);
      } catch (err) {
        console.warn(`⚠️ Failed to download clip ${i + 1}: ${err.message}`);
      }
    }
    console.log(`⬇️ Successfully downloaded ${downloadedClips.length} clips.`);

    // 6. Voice Audio Generation
    const voicePath = await generateVoice(script);
    console.log("🔊 Voice narration generated:", voicePath);

    // 7. Video Build (16:9 Widescreen 1920x1080)
    const finalVideo = await buildLongVideo(
      downloadedClips,
      voicePath,
      subtitlePath
    );
    console.log("✅ Widescreen 1080p Video built:", finalVideo);

    // 8. Visually Appealing High-CTR Thumbnail
    const thumbnailPath = await generateLongThumbnail(topic);
    console.log("🖼️ Fancy 16:9 Thumbnail generated:", thumbnailPath);

    // 9. Upload to YouTube
    const youtubeUrl = await uploadToYouTube(
      finalVideo,
      seo.title,
      seo.description,
      seo.tags,
      thumbnailPath
    );

    console.log("🎉 SUCCESS! 5-Minute Long Video uploaded:", youtubeUrl);
    console.log("========== LONG-FORM PIPELINE COMPLETE ==========");

    process.exit(0);

  } catch (error) {
    console.error("❌ Long-form pipeline error:", error);
    process.exit(1);
  }
}

runLongPipeline();
