const { spawn } = require("child_process");
const { once } = require("events");
const fs = require("fs");
const path = require("path");
const { createFrameCanvas, drawFrame } = require("./animationService");
const { probeDuration } = require("./voiceService");
const FFMPEG = process.env.FFMPEG_PATH || "ffmpeg";

async function buildVideo(scenes, voicePath, subtitlePath, options = {}) {
  const { width = 1080, height = 1920, outputName = "finalVideo.mp4", timeoutMinutes = 30, fps = 24 } = options;
  if (!scenes.length || !Number.isInteger(fps) || fps < 1 || fps > 60) throw new Error("Invalid animation scenes or frame rate");
  const duration = await probeDuration(voicePath);
  const timeline = JSON.parse(fs.readFileSync(path.join(__dirname, "../storage/audio/timings.json"), "utf8"));
  if (timeline.length !== scenes.length || timeline.some((s, i) => s.text !== scenes[i].text || !(s.end > s.start))) {
    throw new Error("Narration timings do not match this script");
  }
  const renderScenes = scenes.map((scene, i) => ({ ...scene, shots: timeline[i].shots || scene.shots }));
  // Use a denser source canvas for finer illustrated details. Captions are
  // composed at the final output resolution.
  const rw = Math.round(width * 0.75), rh = Math.round(height * 0.75);
  if (!Number.isInteger(rw) || !Number.isInteger(rh)) throw new Error("Video dimensions must be even");
  const output = path.join(__dirname, "../storage", outputName);
  const partial = output.replace(/\.mp4$/, ".partial.mp4");
  const escapedSubtitle = subtitlePath.replace(/\\/g, "/").replace(/^([A-Za-z]):/, "$1\\:");
  const args = ["-y", "-f", "rawvideo", "-pixel_format", "bgra", "-video_size", rw + "x" + rh,
    "-framerate", String(fps), "-i", "pipe:0", "-i", voicePath,
    "-filter_complex", "[0:v]scale=" + width + ":" + height + ":flags=lanczos,subtitles='" + escapedSubtitle + "'[v];[1:a]alimiter=limit=0.95:level=false[a]",
    "-map", "[v]", "-map", "[a]", "-t", String(duration), "-c:v", "libx264", "-preset", "veryfast",
    "-crf", "22", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", partial];
  const proc = spawn(FFMPEG, args, { windowsHide: true });
  let tail = "";
  proc.stderr.on("data", data => { tail = (tail + data).slice(-4000); });
  // An encoder failure can close stdin before the next write.
  let inputError;
  proc.stdin.on("error", error => { inputError = error; });
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; proc.kill(); }, timeoutMinutes * 60000);
  const finished = new Promise((resolve, reject) => {
    proc.once("error", reject);
    proc.once("close", code => code === 0 ? resolve() : reject(new Error(timedOut ? "Animation render timed out" : "FFmpeg failed: " + tail)));
  });
  finished.catch(() => {}); // observed below, including during backpressure waits
  const canvas = createFrameCanvas(rw, rh);
  const ctx = canvas.getContext("2d");
  let sceneIndex = 0;
  try {
    for (let frame = 0; frame < Math.ceil(duration * fps); frame++) {
      if (inputError) throw inputError;
      const time = frame / fps;
      while (sceneIndex < timeline.length - 1 && time >= timeline[sceneIndex].end) sceneIndex++;
      const timing = timeline[sceneIndex];
      const progress = Math.min(1, (time - timing.start) / (timing.end - timing.start));
      drawFrame(ctx, rw, rh, renderScenes[sceneIndex], time - timing.start, progress, time / duration);
      if (!proc.stdin.write(canvas.toBuffer("raw"))) {
        await Promise.race([once(proc.stdin, "drain"), finished.then(() => { throw new Error("Encoder ended before all frames were written"); })]);
      }
    }
    proc.stdin.end();
    await finished;
    fs.renameSync(partial, output);
    return output;
  } catch (error) {
    proc.stdin.destroy(); proc.kill();
    await finished.catch(() => {});
    fs.rmSync(partial, { force: true });
    throw error;
  } finally { clearTimeout(timer); }
}
module.exports = { buildVideo };
