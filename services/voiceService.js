



// const { exec } = require("child_process");
// const path = require("path");
// const fs = require("fs");

// async function generateVoice(script) {
//   const outputPath = path.join(__dirname, "../storage/audio/voice.mp3");
//   const wordsPath = path.join(__dirname, "../storage/audio/words.json");

//   const cleanScript = script
//     .replace(/\n/g, " ")
//     .replace(/"/g, "")
//     .trim();

//   // ✅ Also generate word boundaries file for subtitle timing
//   const command = `python -m edge_tts --voice en-US-AriaNeural --text "${cleanScript}" --write-media "${outputPath}" --write-subtitles "${wordsPath.replace(".json", ".vtt")}"`;

//   console.log("Generating voice...");
//   console.log(command);

//   return new Promise((resolve, reject) => {
//     exec(command, (error, stdout, stderr) => {
//       if (error) {
//         console.log("TTS error:", error);
//         reject(error);
//         return;
//       }

//       if (!fs.existsSync(outputPath)) {
//         reject("voice.mp3 not created");
//         return;
//       }

//       console.log("Voice generated:", outputPath);
//       resolve(outputPath);
//     });
//   });
// }

// module.exports = { generateVoice };






const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

async function generateVoiceElevenLabs(script, outputPath) {
  console.log("🎙️ Generating voice with ElevenLabs via Groq...");

  const cleanScript = script
    .replace(/\n/g, " ")
    .replace(/"/g, "")
    .trim();

  const response = await fetch("https://api.groq.com/openai/v1/audio/speech", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // model: "playai-tts",
        model: "canopylabs/orpheus-v1-english",  // ✅ new model
      input: cleanScript,
      // voice: "Celeste-PlayAI",  // Natural female voice
        voice: "tara",  // ✅ natural female voice
      response_format: "mp3",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs TTS error: ${error}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(outputPath, buffer);
  console.log("✅ ElevenLabs voice generated!");
}

async function generateVoiceEdgeTTS(script, outputPath, wordsVttPath) {
  console.log("🎙️ Falling back to edge-tts...");

  const cleanScript = script
    .replace(/\n/g, " ")
    .replace(/"/g, "")
    .trim();

  const command = `python -m edge_tts --voice en-US-AriaNeural --text "${cleanScript}" --write-media "${outputPath}" --write-subtitles "${wordsVttPath}"`;

  return new Promise((resolve, reject) => {
    exec(command, (error) => {
      if (error) {
        reject(error);
        return;
      }
      if (!fs.existsSync(outputPath)) {
        reject(new Error("voice.mp3 not created"));
        return;
      }
      console.log("✅ Edge-tts voice generated!");
      resolve();
    });
  });
}

async function generateVoice(script) {
  const outputPath = path.join(__dirname, "../storage/audio/voice.mp3");
  const wordsVttPath = path.join(__dirname, "../storage/audio/words.vtt");

  // Step 1: Try ElevenLabs via Groq first
  try {
    await generateVoiceElevenLabs(script, outputPath);
    return outputPath;
  } catch (err) {
    console.error("❌ ElevenLabs failed:", err.message);
    console.log("⚠️ Falling back to edge-tts...");
  }

  // Step 2: Fallback to edge-tts
  try {
    await generateVoiceEdgeTTS(script, outputPath, wordsVttPath);
    return outputPath;
  } catch (err) {
    console.error("❌ Edge-tts also failed:", err.message);
    throw new Error("Both TTS services failed");
  }
}

module.exports = { generateVoice };