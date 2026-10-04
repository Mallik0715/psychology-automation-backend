const path = require("path");
const fs = require("fs");
const { execFile } = require("child_process");

const PYTHON = process.env.PYTHON_PATH || "python";
const FFMPEG = process.env.FFMPEG_PATH || "ffmpeg";
const EDGE_ATTEMPTS = 3;

// Groq's Orpheus TTS only returns WAV and truncates long input (~15s of audio per request),
// so the script is sent in short sentence-sized chunks and the audio is joined afterwards.
const GROQ_CHUNK_CHARS = 180;

function run(cmd, args, timeoutMs) {
  return new Promise((resolve, reject) => {
    execFile(cmd, args, { timeout: timeoutMs }, (error, stdout, stderr) => {
      if (error) {
        // Keep just the last line (e.g. Python's "NoAudioReceived: ..."), not the whole traceback
        reject(new Error((stderr || error.message).trim().split("\n").pop()));
      } else {
        resolve();
      }
    });
  });
}

function splitIntoChunks(text, maxChars) {
  const pieces = text.split(/(?<=[.!?;,])\s+/);
  const chunks = [];
  let current = "";
  for (const piece of pieces) {
    if (current && (current + " " + piece).length > maxChars) {
      chunks.push(current);
      current = piece;
    } else {
      current = current ? `${current} ${piece}` : piece;
    }
  }
  if (current) chunks.push(current);
  // A single very long clause still has to fit: hard-split it on word boundaries
  return chunks.flatMap(chunk => {
    if (chunk.length <= maxChars) return [chunk];
    const words = chunk.split(" ");
    const out = [];
    let line = "";
    for (const word of words) {
      if (line && (line + " " + word).length > maxChars) {
        out.push(line);
        line = word;
      } else {
        line = line ? `${line} ${word}` : word;
      }
    }
    if (line) out.push(line);
    return out;
  });
}

// Fallback TTS: Groq-hosted Orpheus (no word timings, so subtitles use estimated timing)
async function generateVoiceGroq(script, outputPath) {
  console.log("🎙️ Generating voice with Groq Orpheus TTS...");

  const chunks = splitIntoChunks(script, GROQ_CHUNK_CHARS);
  // Absolute paths: the concat list resolves entries relative to the list file's own folder
  const dir = path.dirname(path.resolve(outputPath));
  const partFiles = [];

  for (let i = 0; i < chunks.length; i++) {
    const response = await fetch("https://api.groq.com/openai/v1/audio/speech", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "canopylabs/orpheus-v1-english",
        input: chunks[i],
        voice: "autumn",
        response_format: "wav",
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq TTS error: ${await response.text()}`);
    }

    const partFile = path.join(dir, `groq_part_${i}.wav`);
    fs.writeFileSync(partFile, Buffer.from(await response.arrayBuffer()));
    partFiles.push(partFile);
  }

  // Join the parts into one mp3
  const listFile = path.join(dir, "groq_parts.txt");
  fs.writeFileSync(listFile, partFiles.map(f => `file '${f.replace(/\\/g, "/")}'`).join("\n"));
  await run(FFMPEG, ["-y", "-f", "concat", "-safe", "0", "-i", listFile, "-c:a", "libmp3lame", "-q:a", "3", outputPath], 5 * 60 * 1000);

  for (const f of [...partFiles, listFile]) fs.rmSync(f, { force: true });
  console.log(`✅ Groq TTS voice generated (${chunks.length} chunks)`);
}

// Primary TTS: edge-tts. Arguments are passed directly (no shell), so $, backticks
// and quotes in the script are spoken as-is instead of being interpreted by bash.
async function generateVoiceEdgeTTS(script, outputPath, wordsVttPath) {
  const args = [
    "-m", "edge_tts",
    "--voice", process.env.TTS_VOICE || "en-US-ChristopherNeural",
    "--rate=+5%",
    "--text", script.replace(/\s+/g, " ").trim(),
    "--write-media", outputPath,
    "--write-subtitles", wordsVttPath,
  ];

  // edge-tts uses an unofficial Microsoft endpoint that intermittently returns no audio
  for (let attempt = 1; attempt <= EDGE_ATTEMPTS; attempt++) {
    try {
      console.log("🎙️ Generating voice with edge-tts...");
      await run(PYTHON, args, 10 * 60 * 1000);
      if (!fs.existsSync(outputPath)) throw new Error("voice.mp3 not created");
      console.log("✅ Edge-tts voice generated!");
      return;
    } catch (err) {
      if (attempt === EDGE_ATTEMPTS) throw err;
      console.warn(`⚠️ edge-tts failed (${err.message}) - retrying (${attempt}/${EDGE_ATTEMPTS - 1})...`);
      await new Promise(res => setTimeout(res, attempt * 5000));
    }
  }
}

async function generateVoice(script) {
  const outputPath = path.join(__dirname, "../storage/audio/voice.mp3");
  const wordsVttPath = path.join(__dirname, "../storage/audio/words.vtt");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  // Remove outputs from a previous run so stale audio or timings are never reused
  for (const file of [outputPath, wordsVttPath]) {
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }

  try {
    await generateVoiceEdgeTTS(script, outputPath, wordsVttPath);
    return outputPath;
  } catch (err) {
    console.error("❌ Edge-tts failed:", err.message);
    // Partial timings from a failed attempt must not be used with the fallback audio
    fs.rmSync(wordsVttPath, { force: true });
  }

  try {
    await generateVoiceGroq(script, outputPath);
    return outputPath;
  } catch (err) {
    console.error("❌ Groq TTS also failed:", err.message);
    throw new Error("Both TTS services failed");
  }
}

module.exports = { generateVoice, generateVoiceGroq };
