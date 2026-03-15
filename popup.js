function formatTime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hrs = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (days > 0) {
    return `${days}d ${hrs}h ${mins}m ${secs}s`;
  }

  if (hrs > 0) {
    return `${hrs}h ${mins}m ${secs}s`;
  }

  return `${mins}m ${secs}s`;
}

function updateTime() {
  chrome.storage.local.get(["youtubeTime"], (data) => {
    const seconds = data.youtubeTime || 0;
    document.getElementById("time").innerText = formatTime(seconds);
  });
}

function updateFocusUI() {
  chrome.storage.local.get(["focusMode"], (data) => {
    const enabled = data.focusMode || false;

    const button = document.getElementById("toggleFocus");
    const badge = document.getElementById("statusBadge");

    button.innerText = enabled ? "Disable Focus Mode" : "Enable Focus Mode";
    button.classList.toggle("focus-on", enabled);

    badge.innerText = enabled ? "ON" : "OFF";
    badge.className = enabled ? "badge on" : "badge off";
  });
}

document.getElementById("reset").addEventListener("click", () => {
  chrome.storage.local.set({ youtubeTime: 0 }, () => {
    updateTime();
  });
});

document.getElementById("toggleFocus").addEventListener("click", () => {
  chrome.storage.local.get(["focusMode"], (data) => {
    const newValue = !(data.focusMode || false);
    chrome.storage.local.set({ focusMode: newValue }, () => {
      updateFocusUI();
    });
  });
});

updateTime();
updateFocusUI();
setInterval(updateTime, 1000);