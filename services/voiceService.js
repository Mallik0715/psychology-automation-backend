const path = require("path");
const fs = require("fs");
const { execFile } = require("child_process");
const { promisify } = require("util");
const run = promisify(execFile);
const FFMPEG = process.env.FFMPEG_PATH || "ffmpeg";
const FFPROBE = process.env.FFPROBE_PATH || FFMPEG.replace(/ffmpeg(\.exe)?$/i, "ffprobe$1");
async function probeDuration(file) {
  const { stdout } = await run(FFPROBE, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]);
  const duration = Number(stdout.trim());
  if (!Number.isFinite(duration) || duration <= 0) throw new Error("Invalid audio duration: " + file);
  return duration;
}
async function generateVoice(script, { scenes = script.split(/\n+/).filter(Boolean).map(text => ({ text })) } = {}) {
  const dir = path.join(__dirname, "../storage/audio");
  fs.mkdirSync(dir, { recursive: true });
  const outputPath = path.join(dir, "voice.mp3");
  for (const name of ["words.vtt", "timings.json", "voice.mp3"]) fs.rmSync(path.join(dir, name), { force: true });
  if (!scenes.length || scenes.some(s => !s.text?.trim())) throw new Error("Narration needs non-empty scenes");
  const segments = scenes.map((scene, i) => ({ text: scene.text, file: path.join(dir, "segment-" + String(i).padStart(3, "0") + ".wav") }));
  try {
    if (process.platform === "win32") {
      const manifestPath = path.join(dir, "speech-manifest.json");
      fs.writeFileSync(manifestPath, JSON.stringify({ voice: process.env.TTS_VOICE || "", segments }));
      // Invoke the .NET speech API directly; no system execution-policy changes.
      // The path is supplied as an environment value, never interpolated into code.
      const command = `
        $ErrorActionPreference = 'Stop'
        Add-Type -AssemblyName System.Speech
        $manifest = Get-Content -LiteralPath $env:WHATIF_SPEECH_MANIFEST -Raw -Encoding UTF8 | ConvertFrom-Json
        $speaker = New-Object System.Speech.Synthesis.SpeechSynthesizer
        try {
          if ($manifest.voice) { $speaker.SelectVoice($manifest.voice) }
          $speaker.Rate = 0
          foreach ($segment in $manifest.segments) {
            $speaker.SetOutputToWaveFile($segment.file)
            $speaker.Speak($segment.text)
            $speaker.SetOutputToNull()
          }
        } finally { $speaker.Dispose() }
      `;
      await run("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", command], {
        timeout: 20 * 60 * 1000, windowsHide: true,
        env: { ...process.env, WHATIF_SPEECH_MANIFEST: manifestPath },
      });
    } else {
      for (const segment of segments) {
        const textPath = segment.file + ".txt";
        fs.writeFileSync(textPath, segment.text);
        await run(process.env.ESPEAK_PATH || "espeak-ng", ["-v", process.env.TTS_VOICE || "en-us", "-s", "165", "-w", segment.file, "-f", textPath], { timeout: 120000 });
      }
    }
  } catch (error) {
    throw new Error("Offline narration failed. Windows needs a System.Speech voice; Linux/macOS needs espeak-ng (or ESPEAK_PATH). " + error.message);
  }
  const timeline = [];
  let time = 0;
  for (let i = 0; i < segments.length; i++) {
    const duration = await probeDuration(segments[i].file);
    timeline.push({ ...scenes[i], start: time, end: time + duration });
    time += duration;
  }
  const list = path.join(dir, "segments.txt");
  fs.writeFileSync(list, segments.map(s => "file '" + path.basename(s.file) + "'").join("\n"));
  await run(FFMPEG, ["-y", "-f", "concat", "-safe", "0", "-i", list, "-c:a", "libmp3lame", "-q:a", "3", outputPath], { timeout: 300000 });
  fs.writeFileSync(path.join(dir, "timings.json"), JSON.stringify(timeline, null, 2));
  return outputPath;
}
module.exports = { generateVoice, probeDuration };
