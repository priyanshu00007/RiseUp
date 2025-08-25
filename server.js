const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Allow requests only from your frontend domain for better security
const allowedOrigins = ['https://riseup-z79e.onrender.com'];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl) or from allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: Not allowed by CORS'));
    }
  },
  methods: ['GET'],
  optionsSuccessStatus: 200,
};

// Apply CORS middleware globally with options
app.use(cors(corsOptions));

// Serve static files (like your frontend files and JSON data) from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

let shortVideos = [];

// Load and cache video data at startup
const loadVideoData = async () => {
  try {
    const dataPath = path.join(__dirname, 'public', 'youtube-videos-UC7iBB0bComGROocSnJ-_Xrw.json');
    const data = await fs.readFile(dataPath, 'utf8');
    const jsonData = JSON.parse(data);
    shortVideos = jsonData.videos.filter(video => video.isShort);
    console.log(`✅ Loaded ${shortVideos.length} short videos.`);
  } catch (err) {
    console.error('❌ Error loading video data:', err);
    process.exit(1);
  }
};

// API route to get paginated list of short videos
app.get('/api/videos', (req, res) => {
  const page = parseInt(req.query.page, 10) || 0;
  const limit = 5; // videos per page
  const startIndex = page * limit;
  const paginatedVideos = shortVideos.slice(startIndex, startIndex + limit);

  res.json({
    videos: paginatedVideos,
    hasMore: startIndex + limit < shortVideos.length,
  });
});

app.listen(PORT, async () => {
  await loadVideoData();
  console.log(`🚀 Server listening on port ${PORT}`);
});


// const express = require('express');
// const cors = require('cors');
// const fs = require('fs').promises;
// const path = require('path');

// const app = express();
// const PORT = 3000;

// app.use(cors());

// // --- FIX ---
// // This middleware serves all files from the 'public' directory.
// // When you go to http://localhost:3000, it will automatically find and serve index.html.
// app.use(express.static('public'));

// let shortVideos = [];

// const loadVideoData = async () => {
//     try {
//         // The path to the JSON file is now relative to the server's location
//         const dataPath = path.join(__dirname, 'public', 'youtube-videos-UC7iBB0bComGROocSnJ-_Xrw.json');
//         const data = await fs.readFile(dataPath, 'utf8');
//         const jsonData = JSON.parse(data);
        
//         shortVideos = jsonData.videos.filter(video => video.isShort);
//         console.log(`✅ Successfully loaded and filtered ${shortVideos.length} short videos.`);
//     } catch (error) {
//         console.error('❌ Failed to load video data:', error);
//         process.exit(1);
//     }
// };

// app.get('/api/videos', (req, res) => {
//     const page = parseInt(req.query.page) || 0;
//     const limit = 5;
//     const startIndex = page * limit;
//     const endIndex = startIndex + limit;

//     const results = shortVideos.slice(startIndex, endIndex);

//     res.json({
//         videos: results,
//         hasMore: endIndex < shortVideos.length,
//     });
// });

// app.listen(PORT, async () => {
//     await loadVideoData();
//     console.log(`🚀 Server is running on http://localhost:${PORT}`);
//     console.log('Access the application at http://localhost:3000');
// });
