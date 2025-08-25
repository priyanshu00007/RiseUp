let players = [];
let currentPage = 0;
let isLoading = false;
let hasMore = true;
let currentIndex = 0;
const feed = document.getElementById("feed");
const loader = document.getElementById("loader");

async function fetchVideos(page) {
  if (isLoading || !hasMore) return;
  isLoading = true;
  loader.style.display = 'block';

  try {
    const res = await fetch(`https://RiseUp.onrender.com/api/videos?page=${page}`);
    const data = await res.json();

    if (data.videos.length > 0) {
      data.videos.forEach(video => {
        const container = document.createElement("div");
        container.className = "video-container";
        container.innerHTML = `
          <div id="player-${video.id}"></div>
          <div class="overlay"></div>
          <div class="video-info"><h2>${video.title}</h2></div>
          <div class="actions">
            <div class="action"><i class="fas fa-heart"></i><span>Like</span></div>
            <div class="action"><i class="fas fa-comment"></i><span>Comment</span></div>
            <div class="action"><i class="fas fa-share"></i><span>Share</span></div>
          </div>
          <div class="progress-bar"><div class="progress" id="progress-${video.id}"></div></div>
        `;
        feed.appendChild(container);
        createPlayer(video);
      });
      currentPage++;
    }
    hasMore = data.hasMore;
  } catch (error) {
    console.error('Failed to fetch videos:', error);
  } finally {
    isLoading = false;
    loader.style.display = 'none';
  }
}

function onYouTubeIframeAPIReady() {
  fetchVideos(currentPage);
}

function createPlayer(video) {
  const player = new YT.Player(`player-${video.id}`, {
    videoId: video.id,
    playerVars: {
      autoplay: 0,
      controls: 0,
      modestbranding: 1,
      loop: 1,
      playlist: video.id,
      playsinline: 1
    },
    events: {
      onReady: (e) => {
        if (players.length === 1) {
          e.target.playVideo();
        }
      },
      onStateChange: onPlayerStateChange
    }
  });
  players.push(player);
}

function onPlayerStateChange(event) {
  const videoContainers = document.querySelectorAll('.video-container');
  const targetPlayer = event.target;
  let playingIndex = -1;

  for (let i = 0; i < players.length; i++) {
    if (players[i] === targetPlayer) {
      playingIndex = i;
      break;
    }
  }

  if (playingIndex === -1) return;

  if (event.data === YT.PlayerState.PLAYING) {
    // Pause other videos
    players.forEach((p, idx) => {
      if (idx !== playingIndex && p.getPlayerState() === YT.PlayerState.PLAYING) {
        p.pauseVideo();
      }
    });
  }
}

feed.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = feed;
  
  // Detect which video is in view
  const newIndex = Math.round(scrollTop / clientHeight);
  
  if (newIndex !== currentIndex) {
    players[currentIndex].pauseVideo();
    currentIndex = newIndex;
    if (players[currentIndex]) {
      players[currentIndex].playVideo();
    }
  }

  // Load more videos when near the bottom
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    fetchVideos(currentPage);
  }
});
