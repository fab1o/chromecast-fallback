/* global cast */
class MediaResolver {
  setup(requestData) {
    this.fallback = requestData.fallback;
  }

  getNext() {
    if (this.fallback) {
      const media = new cast.framework.messages.MediaInformation();
      media.contentId = this.fallback;
      return media;
    }

    return null;
  }
}

cast.framework.CastReceiverContext.getInstance().start();

const mediaResolver = new MediaResolver();
let requestData = null;

const playerManager = cast.framework.CastReceiverContext.getInstance().getPlayerManager();

playerManager.setMessageInterceptor(
  cast.framework.messages.MessageType.LOAD,
  onLoad.bind(this)
);
playerManager.addEventListener(
  cast.framework.events.EventType.ERROR,
  onError.bind(this)
);

let errorPrevention = false;
function onError() {
  if (errorPrevention) {
    errorPrevention = false;

    const next = mediaResolver.getNext();
    if (next) {
      requestData.media = next;
      requestData.flag = true;
      playerManager.load(requestData);
    }
  }
}

function onLoad(loadRequestData) {
  requestData = loadRequestData;

  if (requestData.flag) {
    return requestData;
  }

  mediaResolver.setup(requestData);
  errorPrevention = true;
  return requestData;
}
