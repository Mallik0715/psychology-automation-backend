const { createGroqCompletion } = require("./groqHelper");
const { parseLLMJson } = require("./jsonHelper");

/**
 * Generates a 5-minute compilation script of 25-30 rapid-fire psychology/science facts.
 */
async function generateLongScript(topic) {
  try {
    console.log("🤖 Generating 5-minute compilation script (25-30 Facts) for:", topic);

    const response = await createGroqCompletion({
      messages: [
        {
          role: "system",
          content: `You are an elite YouTube narrator specializing in rapid-fire "Top Facts" compilation videos.

Write a compelling ~650 to 750 word script for a 5-minute YouTube video based on the compilation theme: "${topic}".

Format and Structure Rules:
1. START with a 15-second high-energy intro hook welcoming the viewer to 25-30 unbelievable facts.
2. Provide EXACTLY 25 to 30 distinct, numbered, rapid-fire facts (e.g. "Fact 1...", "Fact 2...").
3. Each fact must be 1 to 2 sentences long, featuring surprising, well-established psychological findings. Only use real numbers you are confident are accurate; never invent statistics or studies. Never attribute claims to a named university, journal, year or study.
4. END with a 15-second closing takeaway asking viewers which fact shocked them the most.
5. Tone: Fast-paced, engaging, clear, and intriguing.
6. DO NOT include stage directions like [Music Fades] or [Cut to Video]. Write ONLY spoken narration.`,
        },
        {
          role: "user",
          content: `Write a 5-minute narration containing 25-30 rapid-fire psychology facts for: "${topic}"`,
        },
      ],
      max_tokens: 1800,
      temperature: 0.8,
    });

    const scriptText = response.choices[0].message.content.trim();
    console.log("✅ 25-30 Facts Compilation Script generated (~" + scriptText.split(/\s+/).length + " words)");

    // Generate visual B-roll keywords across different fact themes
    const keywordResponse = await createGroqCompletion({
      messages: [
        {
          role: "system",
          content: `You are a video stock footage researcher. Return ONLY valid JSON, no markdown, no backticks.`,
        },
        {
          role: "user",
          content: `For a 25-facts compilation video about "${topic}", provide 6 distinct 1-2 word search queries for stock video clips (Pixabay/Pexels) matching different themes (e.g. human brain, person smiling, stressed face, sleeping person, crowd, money).

Return format:
{
  "queries": ["query1", "query2", "query3", "query4", "query5", "query6"]
}`,
        },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    let keywords = [topic, "brain", "thinking", "people", "science", "emotion"];
    try {
      const parsed = parseLLMJson(keywordResponse.choices[0].message.content);
      if (parsed.queries && Array.isArray(parsed.queries) && parsed.queries.length > 0) {
        keywords = parsed.queries;
      }
    } catch (e) {
      console.warn("⚠️ Failed to parse B-roll keywords, using fallback defaults.");
    }

    return {
      script: scriptText,
      keywords: keywords
    };

  } catch (error) {
    // Fail the run instead of uploading the same template script every week
    console.error("❌ Groq long script generation error:", error.message);
    throw error;
  }
}

module.exports = { generateLongScript };
