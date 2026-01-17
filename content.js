chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzeVideo") {
    const video = document.querySelector("video");

    if (!video) {
      sendResponse({ result: "No se encontró ningún video." });
      return;
    }

    // Heurística básica
    const duration = video.duration;
    const frameRate = video.getVideoPlaybackQuality?.().totalVideoFrames;

    let probability = "Baja";

    if (duration < 10 || frameRate > 1000) {
      probability = "Media";
    }

    sendResponse({
      result: `Probabilidad de IA: ${probability}`
    });
  }
});