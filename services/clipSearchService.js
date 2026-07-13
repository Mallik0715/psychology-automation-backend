
// const axios = require("axios");

// const API_KEY = process.env.PIXABAY_API_KEY;

// async function searchClips(topic) {

//   try {

//     const query = topic.split(" ").pop().toLowerCase();

//     const response = await axios.get(
//       `https://pixabay.com/api/videos/?key=${API_KEY}&q=${query}&per_page=5`
//     );

//     const videos = response.data.hits;

//     if (!videos || videos.length === 0) return [];

//     const clips = videos.map(video => video.videos.medium.url);

//     return clips;

//   } catch (error) {

//     console.log("Pixabay error:", error.message);
//     return [];

//   }

// }

// module.exports = { searchClips };

const axios = require("axios");

const API_KEY = process.env.PIXABAY_API_KEY;

async function searchClips(topic) {
  // Generate multiple search queries to try
  const words = topic.split(" ").filter(w => w.length > 3);
  
  const queries = [
    words.slice(0, 2).join(" "),      // first 2 words
    words[0],                          // first word
    words[words.length - 1],           // last word
    words[Math.floor(words.length/2)], // middle word
    "people",                          // ultimate fallback
  ];

  for (const query of queries) {
    try {
      console.log(`🔍 Searching Pixabay for: "${query}"`);
      const response = await axios.get(
        `https://pixabay.com/api/videos/?key=${API_KEY}&q=${encodeURIComponent(query)}&per_page=5`
      );

      const videos = response.data.hits;

      if (videos && videos.length > 0) {
        console.log(`✅ Found ${videos.length} clips for: "${query}"`);
        return videos.map(video => video.videos.medium.url);
      }

      console.log(`⚠️ No clips for "${query}", trying next...`);
    } catch (error) {
      console.log("Pixabay error:", error.message);
    }
  }

  console.log("❌ No clips found for any query!");
  return [];
}

module.exports = { searchClips };