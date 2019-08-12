"use strict";

class TrackPerformance {
  queuedEntries: any[];
  options: any;

  constructor({
    trackUrl,
    threshold = 6000,
    batchSize = 50,
    excludeKeys = [],
    excludeHosts = [],
    parserCb,
    filterCb,
    addAdditionalData
  }) {
    this.queuedEntries = [];
    this.options = {
      trackUrl,
      threshold,
      batchSize,
      excludeKeys,
      excludeHosts,
      parserCb,
      filterCb,
      addAdditionalData
    };

    if ("performance" in window) {
      if ("PerformanceObserver" in window) {
        let perfObserver = new PerformanceObserver((list, obj) => {
          this.handleEntries(list.getEntries());
        });

        perfObserver.observe({
          entryTypes: ["resource"]
        });
      } else {
        // To-Do
      }
    }

    console.log("Setting up setInterval to push track data");
    window.setInterval(() => {
      if (this.queuedEntries.length) {
        this.sendToServer();
        this.queuedEntries = [];
      }
    }, threshold);

    window.onload = () => {
      setTimeout(() => {
        this.handleEntries(performance.getEntriesByType('navigation'));
      }, 0);
    };
  }

  handleEntries(entries: any) {
    let {
      trackUrl,
      excludeKeys,
      excludeHosts,
      parserCb,
      filterCb
    } = this.options;
    entries = entries.map(entry => entry.toJSON());
    entries = entries.filter(entry => entry.name.indexOf(trackUrl) == -1 && !excludeHosts.some(host => entry.name.indexOf(host) > -1));
    entries = entries.map(TrackPerformance.computeMetrics);
    (parserCb && typeof parserCb === "function") && (entries = entries.map(parserCb));
    (filterCb && typeof filterCb === "function") && (entries = entries.filter(filterCb));

    if (excludeKeys.length) {
      entries = entries.map(entry => {
        return Object.keys(entry).reduce((acc, key) => {
          if (excludeKeys.indexOf(key) == -1) {
            acc[key] = entry[key];
          }
          return acc;
        }, {});
      });
    }
    this.queuedEntries = this.queuedEntries.concat(entries);
  }

  sendToServer() {
    let { batchSize, trackUrl, addAdditionalData } = this.options;
    let entryChunks = TrackPerformance.chunk(this.queuedEntries, batchSize);
    let promise = Promise.resolve();
    entryChunks.forEach((entryChunk, index) => {
      promise = promise.then(() => {
        return new Promise((resolve, reject) => {
          let body = {
            data: entryChunk,
            additionalData: addAdditionalData()
          };

          fetch(trackUrl, {
            method: 'post',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
          }).then(res => res.json())
            .then(res => {
              return resolve();
            }).catch(error => {
              console.log("Error while sending data to /track: ", error, body);
              return resolve();
            });
        });
      });
    });
  }

  static computeMetrics(entry) {
    entry.dnsTime = entry.domainLookupEnd - entry.domainLookupStart;

    // Total Connection time
    entry.connectionTime = entry.connectEnd - entry.connectStart;

    // TLS time
    if (entry.secureConnectionStart > 0) {
      entry.tlsTime = entry.connectEnd - entry.secureConnectionStart;
    }

    // Time to First Byte (TTFB)
    entry.ttfb = entry.responseStart - entry.requestStart;

    // The fetchStart read-only property represents a timestamp immediately before the browser starts to fetch the resource.
    entry.fetchTime = entry.responseEnd - entry.fetchStart;
    if (entry.workerStart > 0) {
      entry.workerTime = entry.responseEnd - entry.workerStart;
    }

    // The requestStart read-only property returns a timestamp of the time immediately before the browser starts requesting the resource from the server, cache, or local resource
    // Request plus response time (network only)
    entry.totalTime = entry.responseEnd - entry.requestStart;

    // Response time only (download)
    entry.downloadTime = entry.responseEnd - entry.responseStart;

    // HTTP header size
    entry.headerSize = entry.transferSize - entry.encodedBodySize;

    // Compression ratio
    entry.compressionRatio = entry.decodedBodySize / entry.encodedBodySize;

    // Page Time
    if (entry.entryType == "navigation") {
      entry.DOMContentLoadTime = entry.domContentLoadedEventEnd - entry.startTime;
      entry.pageLoadTime = entry.loadEventEnd - entry.startTime;
    }

    return entry;
  }

  static chunk(array, size) {
    return array.reduce((res, item, index) => {
      if (index % size === 0) {
        res.push([]);
      }
      res[res.length - 1].push(item);
      return res;
    }, []);
  }
}

// export a global variable to access later

(window as any).TrackPerformance = TrackPerformance;