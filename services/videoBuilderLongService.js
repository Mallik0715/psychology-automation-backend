const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const FFMPEG = process.platform === "win32"
  ? `"C:\\Users\\malli\\Downloads\\ffmpeg-8.0.1-essentials_build\\ffmpeg-8.0.1-essentials_build\\bin\\ffmpeg.exe"`
  : "ffmpeg";

/**
 * Builds a 16:9 widescreen 1080p horizontal long video.
 */
async function buildLongVideo(clips, voicePath, subtitlePath) {
  console.log("🎬 Building 16:9 Widescreen Long Video (1920x1080)...");

  const clipsListPath = path.join(__dirname, "../storage/clips/clips_long.txt");
  const musicPath = path.join(__dirname, "../storage/music/background.mp3");
  const outputVideo = path.join(__dirname, "../storage/finalVideo_long.mp4");

  const clipsText = clips
    .map(c => `file '${c.replace(/\\/g, "/")}'`)
    .join("\n");

  fs.writeFileSync(clipsListPath, clipsText);
  console.log("📄 Clips list created for long video.");

  if (fs.existsSync(outputVideo)) {
    fs.unlinkSync(outputVideo);
  }

  const subtitleAbsolute = path.join(__dirname, "../storage/subtitles.srt");
  const ffmpegSubtitlePath = subtitleAbsolute
    .replace(/\\/g, "/")
    .replace(/^([A-Z]):/, "$1\\:");

  const hasMusic = fs.existsSync(musicPath);
  console.log(hasMusic ? "🎵 Background music found!" : "⚠️ No background music found.");

  // Subtitles filter styled for 16:9 horizontal layout (Fontsize=22, MarginV=35)
  const subtitlesFilter = `subtitles='${ffmpegSubtitlePath}':force_style='Fontname=Arial,Bold=1,Fontsize=22,PrimaryColour=&H0000FFFF,OutlineColour=&H00000000,BorderStyle=1,Outline=1.5,Shadow=1,Alignment=2,MarginV=35'`;

  let command;
  if (hasMusic) {
    command = [
      FFMPEG,
      `-y`,
      `-f concat -safe 0 -r 30`,
      `-i "${clipsListPath}"`,
      `-i "${voicePath}"`,
      `-stream_loop -1 -i "${musicPath}"`,
      `-vf "fps=30,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,${subtitlesFilter}"`,
      `-filter_complex "[1:a]volume=1.0[voice];[2:a]volume=0.12[music];[voice][music]amix=inputs=2:duration=first[aout]"`,
      `-map 0:v:0`,
      `-map "[aout]"`,
      `-c:v libx264 -preset fast -crf 22 -c:a aac`,
      `-shortest`,
      `"${outputVideo}"`
    ].join(" ");
  } else {
    command = [
      FFMPEG,
      `-y`,
      `-f concat -safe 0 -r 30`,
      `-i "${clipsListPath}"`,
      `-i "${voicePath}"`,
      `-vf "fps=30,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,${subtitlesFilter}"`,
      `-map 0:v:0 -map 1:a:0`,
      `-c:v libx264 -preset fast -crf 22 -c:a aac`,
      `-shortest`,
      `"${outputVideo}"`
    ].join(" ");
  }

  console.log("🚀 Executing FFmpeg Long Video build command...");

  return new Promise((resolve, reject) => {
    const ffmpegProcess = exec(command, { timeout: 1200000 }); // 20 minute timeout

    ffmpegProcess.stderr.on("data", (data) => {
      // Print progress dots
      process.stdout.write(".");
    });

    ffmpegProcess.on("close", (code) => {
      console.log("\n");
      if (code === 0 && fs.existsSync(outputVideo)) {
        console.log("✅ 16:9 Long Video build complete:", outputVideo);
        resolve(outputVideo);
      } else {
        reject(new Error(`FFmpeg long video build failed with code ${code}`));
      }
    });

    ffmpegProcess.on("error", (err) => {
      reject(new Error(`FFmpeg process error: ${err.message}`));
    });
  });
}

module.exports = { buildLongVideo };
