const { runPipeline } = require("../services/whatIfPipeline");
function ciOptions(env = process.env) {
  const raw = (env.TOPIC_ID || "").trim();
  if (raw && (!/^\d+$/.test(raw) || Number(raw) < 1 || Number(raw) > 100)) throw new Error("TOPIC_ID must be an integer from 1 to 100.");
  // Only an exact true publishes. Push and pull-request checks always render.
  return { preview: env.PUBLISH_SHORT !== "true", topicId: raw ? Number(raw) : undefined };
}
if (require.main === module) {
  Promise.resolve().then(() => runPipeline(ciOptions())).catch(error => { console.error(error); process.exitCode = 1; });
}
module.exports = { ciOptions };
