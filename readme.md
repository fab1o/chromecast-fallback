# Chromecast Fallback

### Receiver
An implementation of a CAF receiver that attempts to fallback when an error ocurrs.

1. Receiver intercepts a load request
2. Attempts to load the first stream url
3. Captures error event (Load playback fails)
4. Attempts to load the next stream url
5. Go back to 2

### Sender
An implementation of a sender that attempts to cast. It provides a **fallback** option with another URL when making a load request:

```js
const session = cast.framework.CastContext.getInstance().getCurrentSession();
const mediaInfo = new chrome.cast.media.MediaInfo('http://wrong-url-to-simulate-error');
const request = new chrome.cast.media.LoadRequest(mediaInfo);
request.fallback = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
session.loadMedia(request);
```

## Setup

1. Open the file below:
```
├── sender/
│   ├── index.html
```
2. Set the `APPLICATION_ID`
