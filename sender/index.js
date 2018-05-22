/* globals chrome, cast */
const APPLICATION_ID = "";

var isFallbackEnabled;
var remotePlayer;
var remotePlayerController;

const FALLBACK_MEDIA_URL =
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

window["__onGCastApiAvailable"] = function(isAvailable) {
  if (isAvailable) {
    initializeCastApi();
  }
};
function initializeCastApi() {
  cast.framework.CastContext.getInstance().setOptions({
    receiverApplicationId: APPLICATION_ID,
    autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
  });

  remotePlayer = new cast.framework.RemotePlayer();
  remotePlayerController = new cast.framework.RemotePlayerController(
    remotePlayer
  );

  remotePlayerController.addEventListener(
    cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
    function(e) {
      console.log("IS_CONNECTED_CHANGED", e);

      if (e.value) {
        makeRequest();
        addListeners();
      }
    }
  );

  remotePlayerController.addEventListener(
    cast.framework.RemotePlayerEventType.PLAYER_STATE_CHANGED,
    function(e) {
      console.log(e.value, e);
    }
  );
}

function makeRequest() {
  const session = cast.framework.CastContext.getInstance().getCurrentSession();
  const mediaInfo = new chrome.cast.media.MediaInfo();
  mediaInfo.streamType = chrome.cast.media.StreamType.BUFFERED;
  mediaInfo.contentType = "video/mp4";
  mediaInfo.duration = 596;

  if (isFallbackEnabled) {
    mediaInfo.contentId = "http://wrong-url-to-simulate-error";
  } else {
    mediaInfo.contentId = FALLBACK_MEDIA_URL;
  }

  mediaInfo.metadata = new chrome.cast.media.MovieMediaMetadata();
  mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.MOVIE;
  mediaInfo.metadata.title = "Big Buck Bunny";
  mediaInfo.metadata.images = [
    {
      url:
        "http://www.kidsworldfun.com/images/movies/animated-movie-big-buck-bunny.jpg"
    }
  ];

  console.log("MediaInfo", mediaInfo);

  const request = new chrome.cast.media.LoadRequest(mediaInfo);
  request.currentTime = 0;

  if (isFallbackEnabled) {
    request.fallback = FALLBACK_MEDIA_URL;
  }

  session.loadMedia(request);

  console.log("LoadRequest", request);
}

function playOrPause() {
  remotePlayerController.playOrPause();
}

function alertStatus() {
  if (remotePlayer.playerState) {
    alert(remotePlayer.playerState);
  }
}

function disableFallback() {
  isFallbackEnabled = false;
}

function enableFallback() {
  isFallbackEnabled = true;
}
