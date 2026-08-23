const { createGroqCompletion } = require("./groqHelper");

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
3. Each fact must be 1 to 2 sentences long, featuring real numbers, percentages, or surprising psychological details.
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
      const parsed = JSON.parse(keywordResponse.choices[0].message.content.trim());
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
    console.error("❌ Groq long script generation error:", error.message);
    const fallbackScript = `Welcome back! Today we are looking at 25 mind-blowing psychology facts about human behavior that will completely change how you see people.

Fact 1: Your brain makes decisions up to 7 seconds before you consciously realize it.
Fact 2: Over 80 percent of conversations consist of complaining or talking about other people.
Fact 3: Smiling can trick your brain into feeling happy even when you are stressed.
Fact 4: People who swear frequently are proven to be more honest and trustworthy friends.
Fact 5: Rejection triggers the exact same chemical response in the brain as physical pain.
Fact 6: Listening to high-tempo music improves workout stamina by up to 15 percent.
Fact 7: The brain treats being lonely as a physical threat to survival.
Fact 8: You remember unfinished tasks far better than completed ones.
Fact 9: People are more likely to be honest when they are physically exhausted.
Fact 10: Eye contact for more than 3 seconds with a stranger triggers either fear or attraction.
Fact 11: Holding hands with someone you love instantly lowers stress hormone levels.
Fact 12: Your mind wanders for about 30 percent of your waking day.
Fact 13: Memories are altered slightly every single time you recall them.
Fact 14: People with high IQs often struggle to fall asleep at night.
Fact 15: Your subconscious mind controls 95 percent of your daily actions.
Fact 16: Hugs lasting longer than 20 seconds release oxytocin, building deep trust.
Fact 17: We process negative memories much faster than positive ones.
Fact 18: Thinking in a foreign language makes your decisions more logical.
Fact 19: The average person tells 1 to 2 lies every single day.
Fact 20: Being in nature for 20 minutes significantly lowers cortisol levels.
Fact 21: People who talk to themselves are proven to have higher cognitive efficiency.
Fact 22: Nostalgia makes people feel warmer physically and emotionally.
Fact 23: Your brain burns about 20 percent of your total daily body calories.
Fact 24: Sarcasm requires complex brain processing and builds creative thinking.
Fact 25: Reading paper books improves memory retention compared to digital screens.

Which of these 25 facts surprised you the most? Let us know in the comments below!`;

    return {
      script: fallbackScript,
      keywords: [topic, "brain", "thinking", "psychology", "people", "emotion"]
    };
  }
}

module.exports = { generateLongScript };
