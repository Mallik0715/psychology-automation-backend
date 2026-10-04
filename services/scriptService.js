const { createGroqCompletion } = require("./groqHelper");

async function generateScript(topic) {
  try {
    console.log("🤖 Generating AI script for:", topic);

    const response = await createGroqCompletion({
      messages: [
        {
          role: "system",
          content: `You are a viral YouTube Shorts script writer specializing in high-retention science/psychology facts videos.

Write EXACTLY 6 sentences, in this exact order, one per line, no numbering, no bullet points:

1. HOOK - a bold, second-person confrontation that immediately targets a relatable experience. Do NOT start with "Did you know." Vary the hook style each time: a direct confrontation ("You've done this every day and never known why"), a false-assumption callout ("You think it's X. It's not."), or a cold statement of stakes. It must create an open question the viewer needs answered.
2. SETUP - one sentence confirming the shared experience and explicitly stating the question the video will answer.
3. MECHANISM PART 1 - the first layer of the real scientific explanation, with a concrete, specific detail.
4. PATTERN INTERRUPT - a surprising twist or escalation that deepens the mystery instead of resolving it yet ("But here's the part that's actually unsettling...").
5. MECHANISM PART 2 / PAYOFF - the full answer that resolves the hook, with another concrete, well-established fact.
6. BUTTON - one final surprising detail or reframe that lands after the main explanation, giving the viewer something extra to think about or share.

Additional rules:
- Every sentence must contain a real, specific fact.
- Only include a number if it is widely cited and you are confident it is accurate; a vivid concrete detail beats a made-up statistic.
- Never attribute claims to a named university, journal, year or study.
- Only use well-established findings; never invent statistics, studies or numbers.
- No intro like "In this video" or "Welcome."
- No outro like "Subscribe" or "Like."
- Write in simple, clear, conversational English, second-person ("you," "your").
- Return ONLY the 6 sentences, one per line.`,
        },
        {
          role: "user",
          content: `Write a viral YouTube Shorts script about: "${topic}"`,
        },
      ],
      max_tokens: 400,
      temperature: 0.85,
    });

    const script = response.choices[0].message.content.trim();
    console.log("✅ AI Script generated");
    return script;

  } catch (error) {
    // Fail the run instead of uploading a template script; the topic is retried next run
    console.error("❌ Groq error:", error.message);
    throw error;
  }
}

module.exports = { generateScript };