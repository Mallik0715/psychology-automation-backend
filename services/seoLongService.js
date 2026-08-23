const { createGroqCompletion } = require("./groqHelper");

/**
 * Generates high-CTR SEO Title, description, and hashtags for a 25-30 facts compilation video.
 */
async function generateLongSEO(topic, script) {
  try {
    console.log("🔍 Generating high-CTR SEO metadata for 25-facts compilation video:", topic);

    const response = await createGroqCompletion({
      messages: [
        {
          role: "system",
          content: `You are a YouTube SEO and CTR optimization expert. Return ONLY valid JSON, no markdown, no backticks.`,
        },
        {
          role: "user",
          content: `Create YouTube SEO metadata for a 5-minute video compilation of "25-30 Mind-Blowing Facts" about: "${topic}".

Rules:
1. Title MUST be HIGH-CTR, featuring numbers and curiosity hooks (e.g. "30 Mind-Blowing Psychology Facts That Will Change How You See People", "25 Dark Psychology Facts About Human Nature"). Max 65 chars.
2. Description must outline the video highlights with timestamps/chapters (0:00 Intro, 1:00 Brain Facts, 2:30 Human Behavior, 4:00 Mind Tricks).
3. Tags must be 12-15 high volume search terms (array of strings).
4. Hashtags must be 4-5 trending hashtags starting with # (array of strings).

Return exact JSON format:
{
  "title": "30 Mind-Blowing Psychology Facts You Didn't Know",
  "description": "DETAILED DESCRIPTION HERE",
  "tags": ["tag1", "tag2", "tag3"],
  "hashtags": ["#psychology", "#facts", "#brainfacts"]
}`,
        },
      ],
      max_tokens: 600,
      temperature: 0.8,
    });

    const raw = response.choices[0].message.content.trim();
    const seoData = JSON.parse(raw);

    const fullDescription = `${seoData.description}\n\n${(seoData.hashtags || []).join(" ")}\n\n#psychology #facts #brainfacts #mindset #education`;

    console.log("✅ High-CTR 25-Facts SEO generated:", seoData.title);
    return {
      title: seoData.title,
      description: fullDescription,
      tags: seoData.tags || [topic, "psychology facts", "brain facts", "25 facts", "human behavior"]
    };

  } catch (error) {
    console.error("❌ Groq SEO error:", error.message);
    const cleanTopic = topic.replace(/^(25|30)\s+/i, "");
    const fallbackTitle = `25 Mind-Blowing Psychology Facts About ${cleanTopic}`;
    const fallbackDesc = `Here are 25 incredible and surprising psychology facts about human behavior, brain chemistry, and human nature.\n\n0:00 Introduction\n1:00 Mind & Brain Facts\n2:30 Human Behavior Facts\n4:00 Final Takeaways\n\n#psychology #facts #brainfacts`;
    return {
      title: fallbackTitle,
      description: fallbackDesc,
      tags: [topic, "psychology facts", "brain facts", "25 facts", "human nature"]
    };
  }
}

module.exports = { generateLongSEO };
