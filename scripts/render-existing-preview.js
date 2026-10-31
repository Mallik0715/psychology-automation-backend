const fs = require("fs");
const path = require("path");
const { findScenario } = require("../content/whatIfCatalog");
const { scenarioScenes } = require("../services/scriptService");
const { generateSubtitles } = require("../services/subtitleService");
const { buildVideo } = require("../services/videoBuilderService");
const { probeDuration } = require("../services/voiceService");
const { MAX_SHORT_SECONDS } = require("../services/whatIfPipeline");
async function renderExistingPreview() {
  const storage = path.join(__dirname, "../storage");
  const previous = JSON.parse(fs.readFileSync(path.join(storage, "storyboard.json"), "utf8"));
  const scenes = scenarioScenes(findScenario(previous.topic));
  const voice = path.join(storage, "audio/voice.mp3");
  if (await probeDuration(voice) > MAX_SHORT_SECONDS) throw new Error("Existing audio exceeds the Shorts duration cap.");
  const subtitles = await generateSubtitles(scenes.map(s => s.text), { scenes });
  const video = await buildVideo(scenes, voice, subtitles, { outputName: "finalVideo_polished.mp4" });
  fs.writeFileSync(path.join(storage, "storyboard-story.json"), JSON.stringify({ ...previous, scenes }, null, 2));
  console.log("Shorts preview saved (no upload):", video);
  return video;
}
if (require.main === module) renderExistingPreview().catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { renderExistingPreview };
