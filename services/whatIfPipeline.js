const fs = require("fs");
const path = require("path");
const { getNextTopic, markTopicPublished } = require("./topicService");
const { catalog, findScenario } = require("../content/whatIfCatalog");
const { scenarioScenes } = require("./scriptService");
const { generateSEO } = require("./seoService");
const { generateVoice, probeDuration } = require("./voiceService");
const { generateSubtitles } = require("./subtitleService");
const { buildVideo } = require("./videoBuilderService");
const MAX_SHORT_SECONDS = 90;
async function runPipeline({ long = false, preview = false, topicId } = {}) {
  if (long) throw new Error("This branch is Shorts-only. Long-form generation is disabled.");
  if (!preview) for (const key of ["YOUTUBE_CLIENT_ID", "YOUTUBE_CLIENT_SECRET", "YOUTUBE_REFRESH_TOKEN"]) {
    if (!process.env[key]) throw new Error("Missing environment variable: " + key);
  }
  const topic = topicId !== undefined ? findScenario(topicId).title : getNextTopic();
  const entry = findScenario(topic);
  const scenes = scenarioScenes(entry);
  const script = scenes.map(s => s.text).join("\n");
  const seo = await generateSEO(topic);
  const storage = path.join(__dirname, "../storage");
  fs.mkdirSync(storage, { recursive: true });
  fs.writeFileSync(path.join(storage, "script.txt"), script + "\n");
  fs.writeFileSync(path.join(storage, "storyboard.json"), JSON.stringify({ topic, scenes, seo }, null, 2));
  console.log("Shorts topic:", topic);
  const voice = await generateVoice(script, { scenes });
  const seconds = await probeDuration(voice);
  if (seconds > MAX_SHORT_SECONDS) throw new Error("Narration exceeds this project's 90-second Shorts cap. Shorten the script before publishing.");
  const subtitles = await generateSubtitles(scenes.map(s => s.text), { scenes });
  const video = await buildVideo(scenes, voice, subtitles);
  console.log("Short duration:", seconds.toFixed(1), "seconds");
  if (preview) {
    console.log("Preview saved (no upload or progress change):", video);
    return { video, topic, seconds };
  }
  const { uploadToYouTube } = require("./uploadService");
  const url = await uploadToYouTube(video, seo.title, seo.description, seo.tags);
  markTopicPublished(topic);
  console.log("Published publicly:", url);
  return { video, topic, url, seconds };
}
function cliOptions() {
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--preview") continue;
    if (args[i] === "--topic" && /^\d+$/.test(args[i + 1] || "")) { i++; continue; }
    throw new Error("Usage: node pipeline.js [--preview] [--topic 1-" + catalog.length + "]");
  }
  const index = args.indexOf("--topic");
  return { preview: args.includes("--preview"), topicId: index >= 0 ? Number(args[index + 1]) : undefined };
}
module.exports = { runPipeline, cliOptions, MAX_SHORT_SECONDS };
