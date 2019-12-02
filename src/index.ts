export interface ITrackPerformanceOptions {
  trackUrl: string;
  threshold?: number;
  batchSize?: number;
  excludeKeys: string[];
  excludeHosts: string[];
  includeHosts: string[];
  parserCb: any;
  filterCb: any;
  addAdditionalData: any;
}

class TrackPerformance {

  static computeMetrics(entry: any) {
    entry.dnsTime = entry.domainLookupEnd - entry.domainLookupStart;

    // Total Connection time
    entry.connectionTime = entry.connectEnd - entry.connectStart;

    // TLS time
    if (entry.secureConnectionStart > 0) {
      entry.tlsTime = entry.connectEnd - entry.secureConnectionStart;
    }

    // Time to First Byte (TTFB)
    entry.ttfb = entry.responseStart - entry.requestStart;

    /*
      The fetchStart read-only property represents a timestamp immediately
      before the browser starts to fetch the resource.
    */
    entry.fetchTime = entry.responseEnd - entry.fetchStart;
    if (entry.workerStart > 0) {
      entry.workerTime = entry.responseEnd - entry.workerStart;
    }

    /*
      The requestStart read-only property returns a timestamp of the time
      immediately before the browser starts requesting the resource from the
      server, cache, or local resource
      Request plus response time (network only)
    */
    entry.totalTime = entry.responseEnd - entry.requestStart;

    // Response time only (download)
    entry.downloadTime = entry.responseEnd - entry.responseStart;

    // HTTP header size
    entry.headerSize = entry.transferSize - entry.encodedBodySize;

    // Compression ratio
    entry.compressionRatio = entry.decodedBodySize / entry.encodedBodySize;

    // Page Time
    if (entry.entryType === "navigation") {
      entry.DOMContentLoadTime = entry.domContentLoadedEventEnd - entry.startTime;
      entry.pageLoadTime = entry.loadEventEnd - entry.startTime;
    }

    return entry;
  }

  static chunk(array: any[], size: number) {
    return array.reduce((res, item, index) => {
      if (index % size === 0) {
        res.push([]);
      }
      res[res.length - 1].push(item);
      return res;
    }, []);
  }
  queuedEntries: any[];
  options: ITrackPerformanceOptions;
  intervalId: number;

  constructor({
    trackUrl,
    threshold = 6000,
    batchSize = 50,
    excludeKeys = [],
    excludeHosts = [],
    includeHosts = [],
    parserCb,
    filterCb,
    addAdditionalData
  }: ITrackPerformanceOptions) {
    this.queuedEntries = [];
    this.options = {
      trackUrl,
      threshold,
      batchSize,
      excludeKeys,
      excludeHosts,
      includeHosts,
      parserCb,
      filterCb,
      addAdditionalData
    };

    if ("performance" in window) {
      if ("PerformanceObserver" in window) {
        const perfObserver = new PerformanceObserver((list, obj) => {
          this.handleEntries(list.getEntries());
        });

        perfObserver.observe({
          entryTypes: ["resource"]
        });
      } else {
        // To-Do
      }
    }

    // tslint:disable-next-line
    console.log("Setting up setInterval to push track data");
    this.intervalId = window.setInterval(() => {
      if (this.queuedEntries.length) {
        this.sendToServer();
        this.queuedEntries = [];
      }
    }, threshold);

    window.onload = () => {
      setTimeout(() => {
        this.handleEntries(performance.getEntriesByType("navigation"));
      }, 0);
    };
  }

  handleEntries(entries: any[]) {
    const {
      trackUrl,
      excludeKeys,
      excludeHosts,
      includeHosts,
      parserCb,
      filterCb
    } = this.options;
    entries = entries.map((entry) => entry.toJSON());
    entries = entries.filter((entry) => {
      let flag = entry.name.indexOf(trackUrl) === -1;
      flag = includeHosts.length > 0 ?
        (flag && includeHosts.some((host) => entry.name.indexOf(host) > -1)) :
        (flag && !excludeHosts.some((host) => entry.name.indexOf(host) > -1));
      return flag;
    });
    entries = entries.map(TrackPerformance.computeMetrics);

    if (parserCb && typeof parserCb === "function") {
      entries = entries.map(parserCb);
    }
    if (filterCb && typeof filterCb === "function") {
      entries = entries.filter(filterCb);
    }

    if (excludeKeys.length) {
      entries = entries.map((entry) => {
        return Object.keys(entry).reduce((acc: any, key) => {
          if (excludeKeys.indexOf(key) === -1) {
            acc[key] = entry[key];
          }
          return acc;
        }, {});
      });
    }
    this.queuedEntries = this.queuedEntries.concat(entries);
  }

  sendToServer() {
    const { batchSize = 50, trackUrl, addAdditionalData } = this.options;
    const entryChunks = TrackPerformance.chunk(this.queuedEntries, batchSize);
    let promise = Promise.resolve();
    entryChunks.forEach((entryChunk: any[], index: number) => {
      promise = promise.then(() => {
        return new Promise((resolve, reject) => {
          const body = {
            data: entryChunk,
            additionalData: addAdditionalData()
          };

          fetch(trackUrl, {
            method: "post",
            headers: {
              "Accept": "application/json, text/plain, */*",
              "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
          }).then((res) => res.json())
            .then((res) => {
              return resolve();
            }).catch((error) => {
              // tslint:disable-next-line
              console.log("Error while sending data to /track: ", error, body);
              return resolve();
            });
        });
      });
    });
  }

  stop() {
    clearInterval(this.intervalId);
    this.intervalId = 0;
  }
}

// export a global variable to access later
(window as any).TrackPerformance = TrackPerformance;
export default TrackPerformance;
