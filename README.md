A light weighted client side library to enable RUM(Real User Monitoring) for web applications.

## Installation

Using npm:
```shell
$ npm i --save rum-client-js
```

## Quick Start
```js
// 1. Load the script in the head section of the page
<script src="./path-to-script/rum-client-js/dist/rum-client.min.js"></script>

// 2. Add the below mentioned code after the script
let RUMObject = new TrackPerformance({
    trackUrl: `${window.location.origin}/api/track`,
    batchSize: 50,
    threshold: 3000,
    excludeHosts: [
        'fonts.googleapis.com',
        'themes.googleusercontent.com',
        'fonts.gstatic.com',
        'googletagmanager.com',
        'google-analytics.com'
    ],
    parserCb: (entry) => {
        return entry;
    },
    filterCb: (entry) => {
        return true;
    },
    addAdditionalData: () => {
        return {
            tags: {
                "user-agent": navigator.userAgent
            }
        };
    },
    excludeKeys: ['nextHopProtocol', 'initiatorType']
});
```
