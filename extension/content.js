let timer = null;
let attachedVideo = null;
let lastVideoTime = 0;

function startTimer() {
  if (timer) return;

  timer = setInterval(() => {
    const video = document.querySelector("video");
    if (!video) return;

    // Count only if video is really advancing
    if (!video.paused && !video.ended && !video.seeking && video.currentTime > lastVideoTime) {
      chrome.storage.local.get(["youtubeTime"], (data) => {
        const total = data.youtubeTime || 0;
        chrome.storage.local.set({ youtubeTime: total + 1 });
      });
    }

    lastVideoTime = video.currentTime;
  }, 1000);
}

function stopTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function attachToVideo() {
  const video = document.querySelector("video");
  if (!video || video === attachedVideo) return;

  if (attachedVideo) {
    stopTimer();
  }

  attachedVideo = video;
  lastVideoTime = video.currentTime;

  video.addEventListener("play", startTimer);
  video.addEventListener("pause", stopTimer);
  video.addEventListener("ended", stopTimer);
  video.addEventListener("waiting", stopTimer);   // buffering starts
  video.addEventListener("stalled", stopTimer);   // network stall
  video.addEventListener("seeking", stopTimer);   // user scrubbing
  video.addEventListener("playing", startTimer);  // actual playback resumes
}

function applyFocusMode(enabled) {
  const related = document.querySelector("#related");
  const comments = document.querySelector("#comments");
  const shorts = document.querySelector("ytd-reel-shelf-renderer");
  const secondary = document.querySelector("#secondary");
  const richGrid = document.querySelector("ytd-rich-grid-renderer");

  if (related) related.style.display = enabled ? "none" : "";
  if (comments) comments.style.display = enabled ? "none" : "";
  if (shorts) shorts.style.display = enabled ? "none" : "";
  if (secondary) secondary.style.display = enabled ? "none" : "";
  if (richGrid && window.location.pathname === "/") {
    richGrid.style.display = enabled ? "none" : "";
  }
}

function checkFocusMode() {
  chrome.storage.local.get(["focusMode"], (data) => {
    applyFocusMode(data.focusMode || false);
  });
}

setInterval(() => {
  attachToVideo();
  checkFocusMode();
}, 2000);

attachToVideo();
checkFocusMode();
