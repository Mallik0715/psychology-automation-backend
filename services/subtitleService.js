const fs = require("fs");
const path = require("path");

function secondsToSrtTimestamp(sec) {
  const h = String(Math.floor(sec / 3600)).padStart(2, "0");
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  const s = String(Math.floor(sec % 60)).padStart(2, "0");
  const ms = String(Math.round((sec % 1) * 1000)).padStart(3, "0");
  return `${h}:${m}:${s},${ms}`;
}

function secondsToAssTimestamp(sec) {
  const h = String(Math.floor(sec / 3600)).padStart(1, "0");
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  const s = String(Math.floor(sec % 60)).padStart(2, "0");
  const cs = String(Math.round((sec % 1) * 100)).padStart(2, "0");
  return `${h}:${m}:${s}.${cs}`;
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

function matchSentencesToTimings(sentences, words) {
  if (!words || words.length === 0) return null;
  const result = [];
  let wordIndex = 0;
  for (const sentence of sentences) {
    const sentenceWords = sentence
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter(Boolean);
    let startTime = null;
    let endTime = null;
    let matched = 0;
    for (let i = wordIndex; i < words.length && matched < sentenceWords.length; i++) {
      const vttWord = words[i].word.toLowerCase().replace(/[^a-z0-9]/g, "");
      const sentWord = sentenceWords[matched].replace(/[^a-z0-9]/g, "");
      if (vttWord === sentWord || vttWord.includes(sentWord) || sentWord.includes(vttWord)) {
        if (startTime === null) startTime = words[i].start;
        endTime = words[i].end;
        matched++;
        wordIndex = i + 1;
      }
    }
    if (startTime !== null) {
      result.push({ sentence, start: startTime, end: endTime });
    }
  }
  return result;
}

function generateAssContent(subtitles) {
  const header = `[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,72,&H00FFFFFF,&H000000FF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,4,2,2,80,80,200,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

  let events = "";
  subtitles.forEach(item => {
    const words = item.sentence.split(" ");
    const chunks = [];
    for (let i = 0; i < words.length; i += 6) {
      chunks.push(words.slice(i, i + 6).join(" "));
    }
    const text = chunks.join("\\N");
    events += `Dialogue: 0,${secondsToAssTimestamp(item.start)},${secondsToAssTimestamp(item.end)},Default,,0,0,0,,${text}\n`;
  });

  return header + events;
}

async function generateSubtitles(sentences) {
  const outputAss = path.join(__dirname, "../storage/subtitles.ass");
  const outputSrt = path.join(__dirname, "../storage/subtitles.srt");
  const vttPath = path.join(__dirname, "../storage/audio/words.vtt");

  let subtitles = [];

  const words = parseVTT(vttPath);
  const timings = words ? matchSentencesToTimings(sentences, words) : null;

  if (timings && timings.length === sentences.length) {
    console.log("✅ Using real audio timings for subtitles");
    subtitles = timings;
  } else {
    console.log("⚠️ Using estimated timings for subtitles");
    let start = 0;
    sentences.forEach(sentence => {
      const wordCount = sentence.split(" ").length;
      const duration = Math.max(2, wordCount * 0.4);
      subtitles.push({ sentence, start, end: start + duration });
      start += duration;
    });
  }

  // Save ASS file
  const assContent = generateAssContent(subtitles);
  fs.writeFileSync(outputAss, assContent);
  console.log("✅ ASS subtitles generated:", outputAss);

  // Save SRT as backup
  let srtContent = "";
  subtitles.forEach((item, i) => {
    srtContent += `${i + 1}\n`;
    srtContent += `${secondsToSrtTimestamp(item.start)} --> ${secondsToSrtTimestamp(item.end)}\n`;
    srtContent += `${item.sentence}\n\n`;
  });
  fs.writeFileSync(outputSrt, srtContent);

  return outputAss; // ✅ Return ASS path
}

module.exports = { generateSubtitles };