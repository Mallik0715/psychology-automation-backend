const { createGroqCompletion } = require("./groqHelper");

// Same interface as the other channels' groqClient, backed by groqHelper's model fallback
function chat(params) {
  return createGroqCompletion(params);
}

module.exports = { chat };
