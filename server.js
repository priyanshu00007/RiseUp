const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration to allow your frontend to make requests
const corsOptions = {
  origin: 'https://riseup-z79e.onrender.com', // Your frontend's live URL
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Serve static files from the 'public' directory
app.use(express.static('public'));

let shortVideos = [];

// Function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Function to load, filter, and shuffle video data
const loadVideoData = async () => {
  try {
    const dataPath = path.join(__dirname, 'public', 'youtube-videos-UC7iBB0bComGROocSnJ-_Xrw.json');
    const data = await fs.readFile(dataPath, 'utf8');
    const jsonData = JSON.parse(data);
    
    shortVideos = jsonData.videos.filter(video => video.isShort);
    shuffleArray(shortVideos); // Randomize the video order

    console.log(`✅ Successfully loaded and shuffled ${shortVideos.length} short videos.`);
  } catch (error) {
    console.error('❌ Failed to load video data:', error);
    process.exit(1);
  }
};

// API endpoint to serve the shuffled videos
app.get('/api/videos', (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = 5;
  const startIndex = page * limit;
  const endIndex = startIndex + limit;

  const results = shortVideos.slice(startIndex, endIndex);

  res.json({
    videos: results,
    hasMore: endIndex < shortVideos.length,
  });
});

// Start the server
app.listen(PORT, async () => {
  await loadVideoData();
  console.log(`🚀 Server is running on port ${PORT}`);
});
