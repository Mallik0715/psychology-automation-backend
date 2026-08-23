const axios = require("axios");

const API_KEY = process.env.PIXABAY_API_KEY;
const FALLBACK_QUERIES = ["brain", "science", "thinking", "people", "abstract"];

async function pixabaySearch(query, perPage = 10) {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/videos/?key=${API_KEY}&q=${encodeURIComponent(query)}&per_page=${perPage}`
    );
    const videos = response.data.hits;
    if (!videos || videos.length === 0) return [];
    return videos.map(video => video.videos.medium.url);
  } catch (error) {
    console.log(`Pixabay error for query "${query}":`, error.message);
    return [];
  }
}

/**
 * Searches and collects 20–30 stock clips across multiple keywords for 5-minute videos.
 */
async function searchLongClips(topic, keywords = []) {
  console.log("🎥 Searching multi-topic B-roll clips for 5-minute video...");

  const searchQueries = Array.from(new Set([topic, ...keywords, "psychology brain", "human mind", "thinking focus"]));
  let allClips = [];

  for (const query of searchQueries) {
    console.log(`🔍 Searching Pixabay for query: "${query}"`);
    const clips = await pixabaySearch(query, 6);
    allClips.push(...clips);

    if (allClips.length >= 25) break; // Collect up to 25-30 unique clips
  }

  // If still less than 15 clips, fetch fallbacks
  if (allClips.length < 15) {
    for (const fallback of FALLBACK_QUERIES) {
      console.log(`⚠️ Adding fallback clips for: "${fallback}"`);
      const fallbackClips = await pixabaySearch(fallback, 5);
      allClips.push(...fallbackClips);
      if (allClips.length >= 25) break;
    }
  }

  // Deduplicate URLs
  const uniqueClips = Array.from(new Set(allClips));
  console.log(`✅ Total unique B-roll clips found for 5-min video: ${uniqueClips.length}`);
  return uniqueClips;
}

module.exports = { searchLongClips };
