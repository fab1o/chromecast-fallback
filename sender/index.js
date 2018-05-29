/* globals chrome, cast */
const APPLICATION_ID = "";
const MESSAGE_NAMESPACE = "urn:x-cast:ca.fabiocosta.cast.media";

var isFallbackEnabled;
var remotePlayer;
var remotePlayerController;
var castContext;

const FALLBACK_MEDIA_URL =
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

window["__onGCastApiAvailable"] = function(isAvailable) {
  if (isAvailable) {
    initializeCastApi();
  }
};

function initializeCastApi() {
  castContext = cast.framework.CastContext.getInstance();

  castContext.addEventListener(
    cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
    e => {
      console.log(e.sessionState, e);
    }
  );

  castContext.addEventListener(
    cast.framework.CastContextEventType.CAST_STATE_CHANGED,
    e => {
      console.log(e.castState, e);
    }
  );

  castContext.setOptions({
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
  const session = castContext.getCurrentSession();
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
  if (remotePlayerController) {
    remotePlayerController.playOrPause();
  }
}

function alertStatus() {
  if (remotePlayer) {
    alert(remotePlayer.playerState);
  }
}

function disableFallback() {
  isFallbackEnabled = false;
}

function enableFallback() {
  isFallbackEnabled = true;
}

function endCurrentSession() {
  if (castContext) {
    castContext.endCurrentSession(true);
  }
}

function sendMessage() {
  if (castContext) {
    const session = castContext.getCurrentSession();
    if (session) {
      session.addMessageListener(MESSAGE_NAMESPACE, (namespace, data) => {
        console.log(data);
        session.removeMessageListener(MESSAGE_NAMESPACE);
      });

      session.sendMessage(MESSAGE_NAMESPACE, {
        message: "Hi"
      });
      console.log(MESSAGE_NAMESPACE, "Hi");
    }
  }
}
