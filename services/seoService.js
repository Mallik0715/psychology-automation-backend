const { findScenario } = require("../content/whatIfCatalog");
async function generateSEO(topic) {
  const entry = findScenario(topic);
  return {
    title: (topic + " #Shorts").slice(0, 100),
    description: [
      topic, entry.first,
      "An animated What if thought experiment about everyday systems. The narration defines the assumptions and limits; these are hypothetical consequences, not a prediction of an actual outage.",
      entry.sources.length ? "Background reading:\n" + entry.sources.join("\n") : "",
      "#Shorts #WhatIf #Technology #EverydaySystems",
    ].filter(Boolean).join("\n\n"),
    tags: ["what if", "shorts", "everyday systems", "animated explainer", entry.subject],
  };
}
module.exports = { generateSEO };
