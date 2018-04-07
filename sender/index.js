/* globals chrome, cast */

const APPLICATION_ID = '';

var remotePlayer;
var remotePlayerController;

window['__onGCastApiAvailable'] = function(isAvailable) {
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
      console.log('IS_CONNECTED_CHANGED', e);

      if (e.value) {
        makeRequest();
        addListeners();
      }
    }
  );
}

function makeRequest() {
  const session = cast.framework.CastContext.getInstance().getCurrentSession();
  const mediaInfo = new chrome.cast.media.MediaInfo(
    'http://wrong-url-to-simulate-error'
  );
  const request = new chrome.cast.media.LoadRequest(mediaInfo);
  request.fallback =
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  session.loadMedia(request);
}

function addListeners() {
  document.getElementById('play').addEventListener('click', function() {
    console.log('remotePlayerController.playOrPause();');
    remotePlayerController.playOrPause();
  });
  document.getElementById('status').addEventListener('click', function() {
    console.log('remotePlayer.playerState ' + remotePlayer.playerState);
      if (remotePlayer.playerState) {
          alert(remotePlayer.playerState);
      }  
  });
}
