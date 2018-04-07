# Chromecast Fallback

### Receiver
An implementation of the CAF receiver that attempts to fallback when an error occurs.

1. Receiver intercepts a load request
2. Attempts to load
3. Captures an error event
4. Attempts to load the fallback url


### Sender
An implementation of the Sender that provides a **fallback** option when making a load request:

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
