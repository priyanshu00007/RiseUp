const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());

// --- FIX ---
// This middleware serves all files from the 'public' directory.
// When you go to http://localhost:3000, it will automatically find and serve index.html.
app.use(express.static('public'));

let shortVideos = [];

const loadVideoData = async () => {
    try {
        // The path to the JSON file is now relative to the server's location
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
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log('Access the application at http://localhost:3000');
});


// const express = require('express');
// const cors = require('cors');
// const fs = require('fs').promises;
// const path = require('path');

// const app = express();
// const PORT = 3000;

// // Middleware
// app.use(cors({
//   origin: "https://riseup-z79e.onrender.com", // frontend domain
//   methods: ["GET", "POST"],
//   allowedHeaders: ["Content-Type"]
// }));

// // Example route
// app.get("/api/videos", (req, res) => {
//   res.json({ msg: "CORS working now" });
// });

// let shortVideos = [];

// // Function to load and filter video data from the JSON file
// const loadVideoData = async () => {
//   try {
//     const dataPath = path.join(__dirname, 'public', 'youtube-videos-UC7iBB0bComGROocSnJ-_Xrw.json');
//     const data = await fs.readFile(dataPath, 'utf8');
//     const jsonData = JSON.parse(data);
    
//     // Filter for short videos and store them
//     shortVideos = jsonData.videos.filter(video => video.isShort);
//     console.log(`✅ Successfully loaded and filtered ${shortVideos.length} short videos.`);
//   } catch (error) {
//     console.error('❌ Failed to load video data:', error);
//     process.exit(1); // Exit the process if the essential data can't be loaded
//   }
// };

// // API endpoint to serve videos with pagination
// app.get('/api/videos', (req, res) => {
//   const page = parseInt(req.query.page) || 0;
//   const limit = 5; // Number of videos to send per request
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
//   await loadVideoData(); // Load data before the server is fully ready
//   console.log(`🚀 Server is running on http://localhost:${PORT}`);
// });
