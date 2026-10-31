require("dotenv").config();
const { runPipeline, cliOptions } = require("./services/whatIfPipeline");
if (require.main === module) {
  Promise.resolve().then(() => runPipeline(cliOptions())).catch(error => { console.error(error); process.exitCode = 1; });
}
module.exports = { runPipeline };
