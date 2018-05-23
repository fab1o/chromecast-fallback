/* global cast */

const MESSAGE_NAMESPACE = 'urn:x-cast:ca.fabiocosta.cast.media';

class MediaResolver {
  setup(requestData) {
    this.fallback = requestData.fallback;
  }

  getFallback() {
    return this.fallback;
  }
}

const receiverContext = cast.framework.CastReceiverContext.getInstance();


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
