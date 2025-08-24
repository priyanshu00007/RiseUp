let videos = [];
let players = [];

async function loadVideos() {
  const res = await fetch("youtube-videos-UC7iBB0bComGROocSnJ-_Xrw.json");
  const data = await res.json();
  videos = data.videos;   // ✅ use "videos" array from JSON

  const container = document.getElementById("video-container");
  container.innerHTML = "";

  videos.forEach((video, i) => {
    const div = document.createElement("div");
    div.className = "video";
    div.innerHTML = `
      <iframe id="player-${i}" 
        src="https://www.youtube.com/embed/${video.id}?enablejsapi=1"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen
        title="${video.title}">
      </iframe>
    `;
    container.appendChild(div);
  });
}

// YouTube API callback
function onYouTubeIframeAPIReady() {
  videos.forEach((video, i) => {
    players[i] = new YT.Player(`player-${i}`, {
      events: {
        onStateChange: (e) => {
          if (e.data === YT.PlayerState.ENDED) {
            autoScroll(i);
          }
        },
      },
    });
  });
}

function autoScroll(index) {
  if (index + 1 < videos.length) {
    document
      .getElementById(`player-${index + 1}`)
      .scrollIntoView({ behavior: "smooth" });
  }
}

loadVideos();
