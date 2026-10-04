const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Groq retires models regularly (all Llama 3.x / Mixtral models are gone).
// Tried in order; set GROQ_MODEL to put a specific model first.
// Check available models: GET https://api.groq.com/openai/v1/models
const CANDIDATE_MODELS = [
  process.env.GROQ_MODEL,
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
].filter(Boolean);

function isModelUnavailable(err) {
  const msg = err.message || "";
  return err.status === 404 || msg.includes("model_not_found") || msg.includes("decommissioned");
}

/**
 * Executes a Groq chat completion with automatic model fallback.
 */
async function createGroqCompletion(params) {
  const { max_tokens, ...rest } = params;
  let lastError = null;

  for (const model of CANDIDATE_MODELS) {
    const request = { ...rest, model };
    if (model.startsWith("openai/gpt-oss")) {
      // Reasoning model: keep reasoning short and leave room for the actual answer
      request.reasoning_effort = rest.reasoning_effort || "low";
      if (max_tokens) request.max_completion_tokens = max_tokens + 1000;
    } else if (max_tokens) {
      request.max_completion_tokens = max_tokens;
    }

    try {
      return await groq.chat.completions.create(request);
    } catch (err) {
      lastError = err;
      if (isModelUnavailable(err)) {
        console.warn(`⚠️ Groq model "${model}" unavailable. Trying next candidate model...`);
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

module.exports = { createGroqCompletion, groq };
