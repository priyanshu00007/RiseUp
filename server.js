const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
// Render provides the PORT environment variable
const PORT = process.env.PORT || 3000;

// --- CORS FIX ---
// Allow both frontend and backend domains
const corsOptions = {
  origin: [  // your frontend
    'https://riseup.onrender.com'        // your backend (in case frontend is served from here too)
  ],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
// ----------------

// Serve static files (HTML, CSS, JS, JSON)
app.use(express.static('public'));

let shortVideos = [];

// Shuffle videos randomly
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Load JSON video data
const loadVideoData = async () => {
  try {
    const dataPath = path.join(__dirname, 'public', 'youtube-videos-UC7iBB0bComGROocSnJ-_Xrw.json');
    const data = await fs.readFile(dataPath, 'utf8');
    const jsonData = JSON.parse(data);

    shortVideos = jsonData.videos.filter(video => video.isShort);
    shuffleArray(shortVideos);

    console.log(`✅ Successfully loaded and shuffled ${shortVideos.length} short videos.`);
  } catch (error) {
    console.error('❌ Failed to load video data:', error);
    process.exit(1);
  }
};

// API endpoint with pagination
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

// Start server
app.listen(PORT, async () => {
  await loadVideoData();
  console.log(`🚀 Server is running on port ${PORT}`);
});

// const express = require('express');
// const cors = require('cors');
// const fs = require('fs').promises;
// const path = require('path');

// const app = express();
// // Render provides the PORT environment variable; fall back to 3000 for local dev
// const PORT = process.env.PORT || 3000;

// // --- CORS Configuration for Production ---
// // This is the crucial fix that allows your frontend to talk to your backend.
// const corsOptions = {
//   origin: 'https://riseup-z79e.onrender.com', // Your frontend's live URL
//   optionsSuccessStatus: 200
// };

// app.use(cors(corsOptions));
// // -----------------------------------------

// // Serve all static files (HTML, CSS, JS, JSON) from the 'public' directory
// app.use(express.static('public'));

// let shortVideos = [];

// // Function to load and filter video data from the JSON file
// const loadVideoData = async () => {
//   try {
//     const dataPath = path.join(__dirname, 'public', 'youtube-videos-UC7iBB0bComGROocSnJ-_Xrw.json');
//     const data = await fs.readFile(dataPath, 'utf8');
//     const jsonData = JSON.parse(data);
    
//     // Filter for only the short videos
//     shortVideos = jsonData.videos.filter(video => video.isShort);
//     console.log(`✅ Successfully loaded and filtered ${shortVideos.length} short videos.`);
//   } catch (error) {
//     console.error('❌ Failed to load video data:', error);
//     process.exit(1); // Stop the server if data can't be loaded
//   }
// };

// // API endpoint to serve videos with pagination
// app.get('/api/videos', (req, res) => {
//   const page = parseInt(req.query.page) || 0;
//   const limit = 5; // Send 5 videos per request
//   const startIndex = page * limit;
//   const endIndex = startIndex + limit;

//   const results = shortVideos.slice(startIndex, endIndex);

//   res.json({
//     videos: results,
//     hasMore: endIndex < shortVideos.length,
//   });
// });

// // Start the server
// app.listen(PORT, async () => {
//   await loadVideoData();
//   console.log(`🚀 Server is running on http://localhost:${PORT}`);
// });
