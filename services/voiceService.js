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
async function generateOfflineVoice(script, { scenes = script.split(/\n+/).filter(Boolean).map(text => ({ text })) } = {}) {
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
function voiceConfig(env = process.env) {
  const provider = env.TTS_PROVIDER || "edge";
  if (!["edge", "offline"].includes(provider)) throw new Error("TTS_PROVIDER must be edge or offline");
  const voice = env.TTS_VOICE || (provider === "edge" ? "en-US-AndrewMultilingualNeural" : "");
  const rate = env.TTS_RATE || "+8%";
  if (provider === "edge" && !voice.endsWith("Neural")) throw new Error("TTS_VOICE must name a supported neural voice");
  if (!/^[+-]\d+%$/.test(rate)) throw new Error("TTS_RATE must look like +8% or -5%");
  return { provider, voice, rate };
}

function offsetWords(words, offset, duration) {
  if (!Array.isArray(words) || !words.length) throw new Error("Neural narration has no word timings");
  let last = -Infinity;
  return words.map(word => {
    if (!word.text?.trim() || !Number.isFinite(word.start) || !Number.isFinite(word.end) || word.start < 0 || word.start < last || word.end <= word.start || word.start >= duration) {
      throw new Error("Neural narration returned invalid word timing");
    }
    last = word.start;
    return { text: word.text, start: offset + word.start, end: offset + Math.min(duration, word.end) };
  });
}

function alignShots(scene, words, offset, duration) {
  if (!scene.shots?.length) return { shots: scene.shots, shotTiming: "none" };
  const normalize = text => text.normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
  const source = scene.text.split(/\s+/).map(normalize);
  if (source.join("") !== words.map(w => normalize(w.text)).join("")) {
    return { shots: scene.shots, shotTiming: "estimated" };
  }
  const wordEnds = []; let length = 0;
  for (const word of words) { length += normalize(word.text).length; wordEnds.push(length); }
  const starts = scene.shots.map((shot, i) => {
    if (i === 0) return 0;
    const chars = source.slice(0, shot.wordStart).join("").length;
    const index = wordEnds.findIndex(end => end > chars);
    return (words[index].start - offset) / duration;
  });
  return {
    shots: scene.shots.map((shot, i) => ({ ...shot, from: starts[i], to: starts[i + 1] ?? 1 })),
    shotTiming: "service",
  };
}

async function generateNeuralVoice(script, { scenes = script.split(/\n+/).filter(Boolean).map(text => ({ text })) } = {}) {
  const config = voiceConfig();
  if (!scenes.length || scenes.some(s => !s.text?.trim())) throw new Error("Narration needs non-empty scenes");
  if (script !== scenes.map(s => s.text).join("\n")) throw new Error("Narration scenes do not match the script");
  const dir = path.join(__dirname, "../storage/audio");
  fs.mkdirSync(dir, { recursive: true });
  for (const name of ["words.vtt", "timings.json", "voice.mp3", "voice-info.json"]) fs.rmSync(path.join(dir, name), { force: true });
  const outputPath = path.join(dir, "voice.mp3");
  const segments = scenes.map((scene, i) => ({
    text: scene.text, file: path.join(dir, `neural-${i}.mp3`), wordsFile: path.join(dir, `neural-${i}.words.json`),
  }));
  const manifest = path.join(dir, "neural-manifest.json");
  fs.writeFileSync(manifest, JSON.stringify({ ...config, segments }));
  console.log(`Neural narration: ${config.voice}, rate ${config.rate}`);
  try {
    await run(process.env.PYTHON_PATH || "python", [path.join(__dirname, "../scripts/neural-speech.py"), manifest], {
      timeout: 15 * 60 * 1000, windowsHide: true, maxBuffer: 1024 * 1024,
    });
  } catch (error) {
    throw new Error("Neural narration failed. Install requirements-voice.txt and check the speech-service connection. " + (error.stderr || error.message).trim().split("\n").at(-1));
  }
  const timeline = [];
  const pcmFiles = [];
  let time = 0;
  for (let i = 0; i < segments.length; i++) {
    const pcm = path.join(dir, `neural-${i}.wav`);
    await run(FFMPEG, ["-y", "-i", segments[i].file, "-ar", "44100", "-ac", "1", pcm], { timeout: 60000 });
    pcmFiles.push(pcm);
    const duration = await probeDuration(pcm);
    const words = offsetWords(JSON.parse(fs.readFileSync(segments[i].wordsFile, "utf8")), time, duration);
    timeline.push({ ...scenes[i], ...alignShots(scenes[i], words, time, duration), start: time, end: time + duration, words });
    time += duration;
  }
  const list = path.join(dir, "neural-segments.txt");
  fs.writeFileSync(list, pcmFiles.map(file => "file '" + path.basename(file) + "'").join("\n"));
  // Consistent narration loudness; this filter changes gain, not duration.
  await run(FFMPEG, ["-y", "-f", "concat", "-safe", "0", "-i", list,
    "-af", "loudnorm=I=-16:TP=-1.5:LRA=9", "-ar", "44100", "-c:a", "libmp3lame", "-b:a", "192k", outputPath], { timeout: 300000 });
  fs.writeFileSync(path.join(dir, "timings.json"), JSON.stringify(timeline, null, 2));
  fs.writeFileSync(path.join(dir, "voice-info.json"), JSON.stringify({ ...config, wordTiming: "service", duration: time }, null, 2));
  return outputPath;
}

async function generateVoice(script, options) {
  if (voiceConfig().provider === "offline") return generateOfflineVoice(script, options);
  return generateNeuralVoice(script, options);
}
module.exports = { generateVoice, probeDuration, voiceConfig, offsetWords, alignShots };
