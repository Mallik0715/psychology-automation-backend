

// const Groq = require("groq-sdk");

// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY,
// });

// async function generateScript(topic) {
//   try {
//     console.log("🤖 Generating AI script for:", topic);

//     const response = await groq.chat.completions.create({
//       model: "llama-3.3-70b-versatile", // free + high quality
//       messages: [
//         {
//           role: "system",
//           content: `You are a YouTube script writer for a facts channel.
// Rules:
// - Exactly 5 sentences
// - Each sentence is one amazing, specific, real fact
// - No intro like "In this video" or "Welcome"
// - No outro like "Subscribe" or "Like"
// - Each fact must be surprising and specific with real numbers or details
// - Write in simple, clear English
// - Return ONLY the 5 sentences, one per line, no numbering, no bullet points`,
//         },
//         {
//           role: "user",
//           content: `Write a short YouTube script about: "${topic}"`,
//         },
//       ],
//       max_tokens: 500,
//       temperature: 0.8,
//     });

//     const script = response.choices[0].message.content.trim();
//     console.log("✅ AI Script generated");
//     return script;

//   } catch (error) {
//     console.error("❌ Groq error:", error.message);

//     return `${topic} is one of the most fascinating subjects in the world.
// Scientists continue to make incredible discoveries about ${topic} every year.
// Many of these discoveries completely change how we understand our universe.
// Researchers have found surprising connections between ${topic} and everyday life.
// These amazing facts about ${topic} will completely change the way you see the world.`;
//   }
// }

// module.exports = { generateScript };

const Groq = require("groq-sdk");
 
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
 
async function generateScript(topic) {
  try {
    console.log("🤖 Generating AI script for:", topic);
 
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a viral YouTube Shorts script writer specializing in high-retention science/psychology facts videos.
 
Write EXACTLY 6 sentences, in this exact order, one per line, no numbering, no bullet points:
 
1. HOOK - a bold, second-person confrontation that immediately targets a relatable experience. Do NOT start with "Did you know." Vary the hook style each time: a direct confrontation ("You've done this every day and never known why"), a false-assumption callout ("You think it's X. It's not."), or a cold statement of stakes. It must create an open question the viewer needs answered.
2. SETUP - one sentence confirming the shared experience and explicitly stating the question the video will answer.
3. MECHANISM PART 1 - the first layer of the real scientific explanation, using a specific real number, percentage, or statistic.
4. PATTERN INTERRUPT - a surprising twist or escalation that deepens the mystery instead of resolving it yet ("But here's the part that's actually unsettling...").
5. MECHANISM PART 2 / PAYOFF - the full answer that resolves the hook, with another specific real number or fact.
6. BUTTON - one final surprising detail or reframe that lands after the main explanation, giving the viewer something extra to think about or share.
 
Additional rules:
- Every sentence must contain a real, specific, shocking fact - use real numbers and percentages throughout, not just in one sentence.
- Make it sound unbelievable but true.
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
    console.error("❌ Groq error:", error.message);
    return `You've experienced ${topic} more times than you realize.
Most people think it just happens randomly - it doesn't.
Scientists found a specific, measurable mechanism behind ${topic}.
But here's the part that's actually unsettling about it.
The real reason connects to something most people never think to question.
And once you know it, you'll notice it every single time.`;
  }
}
 
module.exports = { generateScript };