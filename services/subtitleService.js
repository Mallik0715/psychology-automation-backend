// const fs = require("fs");
// const path = require("path");

// function secondsToTimestamp(sec) {
//   const h = String(Math.floor(sec / 3600)).padStart(2, "0");
//   const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
//   const s = String(Math.floor(sec % 60)).padStart(2, "0");
//   const ms = "000";
//   return `${h}:${m}:${s},${ms}`;
// }

// function generateSubtitles(sentences) {
//   const output = path.join(__dirname, "../storage/subtitles.srt");

//   let start = 0;
//   const duration = 4; // seconds per sentence

//   let content = "";

//   sentences.forEach((sentence, i) => {
//     const end = start + duration;

//     content += `${i + 1}\n`;
//     content += `${secondsToTimestamp(start)} --> ${secondsToTimestamp(end)}\n`;
//     content += `${sentence}\n\n`;

//     start = end;
//   });

//   fs.writeFileSync(output, content);

//   return output;
// }

// module.exports = { generateSubtitles };




const fs = require("fs");
const path = require("path");

function secondsToSrtTimestamp(sec) {
  const h = String(Math.floor(sec / 3600)).padStart(2, "0");
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  const s = String(Math.floor(sec % 60)).padStart(2, "0");
  const ms = String(Math.round((sec % 1) * 1000)).padStart(3, "0");
  return `${h}:${m}:${s},${ms}`;
}

function vttTimeToSeconds(time) {
  const parts = time.split(":");
  let seconds = 0;
  if (parts.length === 3) {
    seconds = parseFloat(parts[0]) * 3600 + parseFloat(parts[1]) * 60 + parseFloat(parts[2]);
  } else if (parts.length === 2) {
    seconds = parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
  }
  return seconds;
}

function parseVTT(vttPath) {
  if (!fs.existsSync(vttPath)) return null;

  const content = fs.readFileSync(vttPath, "utf8");
  const blocks = content.split("\n\n").filter(b => b.trim() && !b.startsWith("WEBVTT"));

  const words = [];
  for (const block of blocks) {
    const lines = block.trim().split("\n");
    const timeLine = lines.find(l => l.includes("-->"));
    const textLine = lines[lines.length - 1];

    if (timeLine && textLine) {
      const [startStr, endStr] = timeLine.split("-->").map(t => t.trim());
      words.push({
        start: vttTimeToSeconds(startStr),
        end: vttTimeToSeconds(endStr),
        word: textLine.trim()
      });
    }
  }
  return words;
}

async function generateSubtitles(sentences) {
  const output = path.join(__dirname, "../storage/subtitles.srt");
  const vttPath = path.join(__dirname, "../storage/audio/words.vtt");

  let content = "";
  const words = parseVTT(vttPath);

  if (words && words.length > 0) {
    console.log("✅ Using real audio timings for stylish 2-word subtitles");
    let chunkCount = 1;
    for (let i = 0; i < words.length; i += 2) {
      const w1 = words[i];
      const w2 = i + 1 < words.length ? words[i + 1] : null;
      
      const start = w1.start;
      const end = w2 ? w2.end : w1.end;
      const text = w2 ? `${w1.word} ${w2.word}` : w1.word;

      content += `${chunkCount}\n`;
      content += `${secondsToSrtTimestamp(start)} --> ${secondsToSrtTimestamp(end)}\n`;
      content += `${text.toUpperCase()}\n\n`;
      chunkCount++;
    }
  } else {
    console.log("⚠️ Using estimated timings for stylish 2-word subtitles");
    let chunkCount = 1;
    let start = 0;
    
    sentences.forEach((sentence) => {
      const sentenceWords = sentence.split(" ").filter(w => w.trim());
      for (let i = 0; i < sentenceWords.length; i += 2) {
        const w1 = sentenceWords[i];
        const w2 = i + 1 < sentenceWords.length ? sentenceWords[i + 1] : null;
        
        const text = w2 ? `${w1} ${w2}` : w1;
        const wordCount = w2 ? 2 : 1;
        // Estimate 0.35s per word for short punchy shorts
        const duration = wordCount * 0.35; 
        const end = start + duration;

        content += `${chunkCount}\n`;
        content += `${secondsToSrtTimestamp(start)} --> ${secondsToSrtTimestamp(end)}\n`;
        content += `${text.toUpperCase()}\n\n`;
        
        start = end;
        chunkCount++;
      }
    });
  }

  fs.writeFileSync(output, content);
  return output;
}

module.exports = { generateSubtitles };

