/* global cast */

class MediaResolver {
  setup(requestData) {
    this.fallback = requestData.fallback;
  }

  getFallback() {
    return this.fallback;
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

    const fallback = mediaResolver.getFallback();
    if (fallback) {
      requestData.media.contentId = fallback;
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
