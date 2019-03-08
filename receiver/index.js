/* global cast */

const MESSAGE_NAMESPACE = 'urn:x-cast:ca.fabiocosta.cast.media';

const receiverContext = cast.framework.CastReceiverContext.getInstance();
const playerManager = receiverContext.getPlayerManager();

var errorPrevention = false, requestData = null;

class MediaResolver {
  setup(requestData) {
    this.fallback = requestData.fallback;
  }

  getFallback() {
    return this.fallback;
  }
}
const mediaResolver = new MediaResolver();

const customNamespaces = new Map();
customNamespaces.set(MESSAGE_NAMESPACE, cast.framework.system.MessageType.JSON);

receiverContext.addCustomMessageListener(MESSAGE_NAMESPACE, e => {
  console.log(MESSAGE_NAMESPACE, e.data);
  receiverContext.sendCustomMessage(MESSAGE_NAMESPACE, undefined, {
    message: 'Hello'
  });
});

receiverContext.start({
  customNamespaces
});

playerManager.setMessageInterceptor(
  cast.framework.messages.MessageType.LOAD,
  onLoad.bind(this)
);

playerManager.addEventListener(
  cast.framework.events.EventType.ERROR,
  onError.bind(this)
);

function onError() {
  if (errorPrevention) {
    errorPrevention = false;

    const fallback = mediaResolver.getFallback();
    if (fallback) {
      requestData.media.contentId = fallback;
      requestData._flag = true;
      playerManager.load(requestData);
    }
  }
}

function onLoad(loadRequestData) {
  requestData = loadRequestData;

  if (requestData._flag) {
    return requestData;
  }

  mediaResolver.setup(requestData);
  errorPrevention = true;
  
  return requestData;
}
