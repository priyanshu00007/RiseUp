const express = require('express');
const cors = require('cors'); // You already have this installed
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// --- FIX FOR CORS ---
// Define the specific URL of your frontend application
const allowedOrigins = ['https://riseup-z79e.onrender.com'];

const corsOptions = {
  origin: function (origin, callback) {
    // Check if the incoming origin is in our list of allowed origins
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

// Use the configured CORS options
app.use(cors(corsOptions));

// This part serves your static files (HTML, etc.)
app.use(express.static('public'));

let shortVideos = [];

// The rest of your server code remains the same...
const loadVideoData = async () => {
    try {
        const dataPath = path.join(__dirname, 'public', 'youtube-videos-UC7iBB0bComGROocSnJ-_Xrw.json');
        const data = await fs.readFile(dataPath, 'utf8');
        const jsonData = JSON.parse(data);
        
        shortVideos = jsonData.videos.filter(video => video.isShort);
        console.log(`✅ Successfully loaded and filtered ${shortVideos.length} short videos.`);
    } catch (error) {
        console.error('❌ Failed to load video data:', error);
        process.exit(1);
    }
};

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

app.listen(PORT, async () => {
    await loadVideoData();
    console.log(`🚀 Server is running on port ${PORT}`);
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
