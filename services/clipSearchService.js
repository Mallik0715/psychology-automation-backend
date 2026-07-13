
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
  try {
    const query = topic.split(" ").pop().toLowerCase();
    const response = await axios.get(
      `https://pixabay.com/api/videos/?key=${API_KEY}&q=${query}&per_page=5`
    );

    const videos = response.data.hits;

    if (!videos || videos.length === 0) return [];

    const clips = videos.map(video => video.videos.medium.url);

    return clips;

  } catch (error) {

    console.log("Pixabay error:", error.message);
    return [];

  }
}

module.exports = { searchClips };