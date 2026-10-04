const { buildVideo } = require("./videoBuilderService");

/**
 * Builds a 16:9 widescreen 1080p long video: same shot-based builder as the Shorts,
 * with longer shots (calmer pacing for a 5-minute video).
 */
function buildLongVideo(clips, voicePath, subtitlePath) {
  return buildVideo(clips, voicePath, subtitlePath, {
    width: 1920,
    height: 1080,
    shotSeconds: 6,
    outputName: "finalVideo_long.mp4",
    timeoutMinutes: 25,
  });
}

module.exports = { buildLongVideo };
