const fs = require("fs");
const path = require("path");
const { catalog, CATALOG_VERSION } = require("../content/whatIfCatalog");
const topics = catalog.map(e => e.title);
const PROGRESS_FILE = path.join(__dirname, "topic_progress.json");
function loadIndex(file, length = topics.length) {
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    return data.catalog === CATALOG_VERSION && Number.isInteger(data.index) && data.index >= 0
      ? data.index % length : 0;
  } catch { return 0; }
}
function getNextTopic() { return topics[loadIndex(PROGRESS_FILE)]; }
function markTopicPublished(topic) {
  const index = topics.indexOf(topic);
  if (index < 0) throw new Error("Cannot mark an unknown topic as published");
  fs.writeFileSync(PROGRESS_FILE + ".tmp", JSON.stringify({ catalog: CATALOG_VERSION, index: (index + 1) % topics.length }) + "\n");
  fs.renameSync(PROGRESS_FILE + ".tmp", PROGRESS_FILE);
}
module.exports = { getNextTopic, markTopicPublished, topics, loadIndex, CATALOG_VERSION };
