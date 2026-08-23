const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const CANDIDATE_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-70b-versatile",
  "llama-3.1-8b-instant",
  "llama3-70b-8192",
  "mixtral-8x7b-32768"
];

/**
 * Executes a Groq chat completion with automatic model fallback
 * to prevent 404 model_not_found errors across different accounts & SDK versions.
 */
async function createGroqCompletion(params) {
  let lastError = null;
  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await groq.chat.completions.create({
        ...params,
        model: model
      });
      return response;
    } catch (err) {
      lastError = err;
      if (err.status === 404 || (err.message && err.message.includes("model_not_found"))) {
        console.warn(`⚠️ Groq model "${model}" returned 404. Falling back to next candidate model...`);
        continue;
      }
      // If it's another error (like auth error or rate limit), throw immediately
      throw err;
    }
  }
  throw lastError;
}

module.exports = { createGroqCompletion, groq };
