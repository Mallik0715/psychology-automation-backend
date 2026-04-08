

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
          content: `You are a YouTube Shorts script writer for a viral facts channel.

Rules:
- Exactly 5 sentences
- The FIRST sentence must be a very strong hook that creates curiosity or surprise
- The first sentence must be under 10 words
- Each remaining sentence is one amazing, specific, real fact
- Use short, punchy sentences
- Each sentence must be under 12 words
- Avoid phrases like "Did you know"
- No intro like "In this video" or "Welcome"
- No outro like "Subscribe" or "Like"
- Facts must be surprising and include real numbers or details
- Write in simple, clear English
- Make the pacing fast for YouTube Shorts
- Return ONLY the 5 sentences, one per line, no numbering, no bullet points

Example:
This animal has three hearts.
Octopuses pump blue blood through their bodies.
They change color in less than one second.
They can solve complex puzzles in laboratories.
They squeeze through holes the size of a coin.`,
        },
        {
          role: "user",
          content: `Write a viral YouTube Shorts script about: "${topic}"`,
        },
      ],

      max_tokens: 200,
      temperature: 0.9,
    });

    const script = response.choices[0].message.content.trim();

    console.log("✅ AI Script generated");
    return script;

  } catch (error) {
    console.error("❌ Groq error:", error.message);

    // Fallback script
    return `This will shock you.
${topic} has surprising facts scientists still study.
Researchers discovered unusual patterns in recent years.
These discoveries changed how experts understand nature.
Many people still don't know these facts.`;
  }
}

module.exports = { generateScript };