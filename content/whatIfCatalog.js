const { catalog, CATALOG_VERSION } = require("./systemShorts");
function findScenario(topic) {
  const entry = catalog.find(e => e.title === topic || String(e.id) === String(topic));
  if (!entry) throw new Error("Unknown Shorts topic: " + topic + ". Choose an ID from 1 to " + catalog.length + ".");
  return entry;
}
module.exports = { catalog, CATALOG_VERSION, findScenario };
