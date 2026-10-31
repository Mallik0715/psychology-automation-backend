const { findScenario } = require("../content/whatIfCatalog");
const { planShots } = require("./storyboardService");
function scenarioScenes(entry) {
  const labels = entry.beats.length === 6
    ? ["WHAT IF?", "HOW IT WORKS", "FIRST IMPACT", "CHAIN REACTION", "THE LIMIT", "THE TAKEAWAY"]
    : ["WHAT IF?", "FIRST IMPACT", "CHAIN REACTION", "THE LIMIT", "THE TAKEAWAY"];
  return entry.beats.map(([visual, headline, text], i) => {
    const scene = { text, title: entry.title, family: entry.family, subject: entry.subject,
      topicId: entry.id, stage: i, label: labels[i], visual, headline };
    return { ...scene, shots: planShots(scene) };
  });
}
async function generateScript(topic) { return scenarioScenes(findScenario(topic)).map(s => s.text).join("\n"); }
module.exports = { generateScript, scenarioScenes };
