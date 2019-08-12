/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TrackPerformance = /** @class */ (function () {
    function TrackPerformance(_a) {
        var _this = this;
        var trackUrl = _a.trackUrl, _b = _a.threshold, threshold = _b === void 0 ? 6000 : _b, _c = _a.batchSize, batchSize = _c === void 0 ? 50 : _c, _d = _a.excludeKeys, excludeKeys = _d === void 0 ? [] : _d, _e = _a.excludeHosts, excludeHosts = _e === void 0 ? [] : _e, parserCb = _a.parserCb, filterCb = _a.filterCb, addAdditionalData = _a.addAdditionalData;
        this.queuedEntries = [];
        this.options = {
            trackUrl: trackUrl,
            threshold: threshold,
            batchSize: batchSize,
            excludeKeys: excludeKeys,
            excludeHosts: excludeHosts,
            parserCb: parserCb,
            filterCb: filterCb,
            addAdditionalData: addAdditionalData
        };
        if ("performance" in window) {
            if ("PerformanceObserver" in window) {
                var perfObserver = new PerformanceObserver(function (list, obj) {
                    _this.handleEntries(list.getEntries());
                });
                perfObserver.observe({
                    entryTypes: ["resource"]
                });
            }
            else {
                // To-Do
            }
        }
        // tslint:disable-next-line
        console.log("Setting up setInterval to push track data");
        window.setInterval(function () {
            if (_this.queuedEntries.length) {
                _this.sendToServer();
                _this.queuedEntries = [];
            }
        }, threshold);
        window.onload = function () {
            setTimeout(function () {
                _this.handleEntries(performance.getEntriesByType("navigation"));
            }, 0);
        };
    }
    TrackPerformance.computeMetrics = function (entry) {
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
    };
    TrackPerformance.chunk = function (array, size) {
        return array.reduce(function (res, item, index) {
            if (index % size === 0) {
                res.push([]);
            }
            res[res.length - 1].push(item);
            return res;
        }, []);
    };
    TrackPerformance.prototype.handleEntries = function (entries) {
        var _a = this.options, trackUrl = _a.trackUrl, excludeKeys = _a.excludeKeys, excludeHosts = _a.excludeHosts, parserCb = _a.parserCb, filterCb = _a.filterCb;
        entries = entries.map(function (entry) { return entry.toJSON(); });
        entries = entries.filter(function (entry) { return entry.name.indexOf(trackUrl) === -1 &&
            !excludeHosts.some(function (host) { return entry.name.indexOf(host) > -1; }); });
        entries = entries.map(TrackPerformance.computeMetrics);
        if (parserCb && typeof parserCb === "function") {
            entries = entries.map(parserCb);
        }
        if (filterCb && typeof filterCb === "function") {
            entries = entries.filter(filterCb);
        }
        if (excludeKeys.length) {
            entries = entries.map(function (entry) {
                return Object.keys(entry).reduce(function (acc, key) {
                    if (excludeKeys.indexOf(key) === -1) {
                        acc[key] = entry[key];
                    }
                    return acc;
                }, {});
            });
        }
        this.queuedEntries = this.queuedEntries.concat(entries);
    };
    TrackPerformance.prototype.sendToServer = function () {
        var _a = this.options, batchSize = _a.batchSize, trackUrl = _a.trackUrl, addAdditionalData = _a.addAdditionalData;
        var entryChunks = TrackPerformance.chunk(this.queuedEntries, batchSize);
        var promise = Promise.resolve();
        entryChunks.forEach(function (entryChunk, index) {
            promise = promise.then(function () {
                return new Promise(function (resolve, reject) {
                    var body = {
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
                    }).then(function (res) { return res.json(); })
                        .then(function (res) {
                        return resolve();
                    }).catch(function (error) {
                        // tslint:disable-next-line
                        console.log("Error while sending data to /track: ", error, body);
                        return resolve();
                    });
                });
            });
        });
    };
    return TrackPerformance;
}());
// export a global variable to access later
window.TrackPerformance = TrackPerformance;
exports.default = TrackPerformance;


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ3ZFQTtJQStERSwwQkFBWSxFQVNlO1FBVDNCLGlCQWtEQztZQWpEQyxzQkFBUSxFQUNSLGlCQUFnQixFQUFoQixxQ0FBZ0IsRUFDaEIsaUJBQWMsRUFBZCxtQ0FBYyxFQUNkLG1CQUFnQixFQUFoQixxQ0FBZ0IsRUFDaEIsb0JBQWlCLEVBQWpCLHNDQUFpQixFQUNqQixzQkFBUSxFQUNSLHNCQUFRLEVBQ1Isd0NBQWlCO1FBRWpCLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxPQUFPLEdBQUc7WUFDYixRQUFRO1lBQ1IsU0FBUztZQUNULFNBQVM7WUFDVCxXQUFXO1lBQ1gsWUFBWTtZQUNaLFFB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SSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTtvQkFDakMsSUFBTSxJQUFJLEdBQUc7d0JBQ1gsSUFBSSxFQUFFLFVBQVU7d0JBQ2hCLGNBQWMsRUFBRSxpQkFBaUIsRUFBRTtxQkFDcEMsQ0FBQztvQkFFRixLQUFLLENBQUMsUUFBUSxFQUFFO3dCQUNkLE1BQU0sRUFBRSxNQUFNO3dCQUNkLE9BQU8sRUFBRTs0QkFDUCxRQUFRLEVBQUUsbUNBQW1DOzRCQUM3QyxjQUFjLEVBQUUsa0JBQWtCO3lCQUNuQzt3QkFDRCxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7cUJBQzNCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxHQUFHLElBQUssVUFBRyxDQUFDLElBQUksRUFBRSxFQUFWLENBQVUsQ0FBQzt5QkFDekIsSUFBSSxDQUFDLFVBQUMsR0FBRzt3QkFDUixPQUFPLE9BQU8sRUFBRSxDQUFDO29CQUNuQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBQyxLQUFLO3dCQUNiLDJCQUEyQjt3QkFDM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQ0FBc0MsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7d0JBQ2pFLE9BQU8sT0FBTyxFQUFFLENBQUM7b0JBQ25CLENBQUMsQ0FBQyxDQUFDO2dCQUNQLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDSCx1QkFBQztBQUFELENBQUM7QUFFRCwyQ0FBMkM7QUFDMUMsTUFBYyxDQUFDLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDO0FBQ3BELGtCQUFlLGdCQUFnQixDQUFDIiwiZmlsZSI6InJ1bS1jbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsImV4cG9ydCBpbnRlcmZhY2UgSVRyYWNrUGVyZm9ybWFuY2VPcHRpb25zIHtcbiAgdHJhY2tVcmw6IHN0cmluZztcbiAgdGhyZXNob2xkPzogbnVtYmVyO1xuICBiYXRjaFNpemU/OiBudW1iZXI7XG4gIGV4Y2x1ZGVLZXlzOiBzdHJpbmdbXTtcbiAgZXhjbHVkZUhvc3RzOiBzdHJpbmdbXTtcbiAgcGFyc2VyQ2I6IGFueTtcbiAgZmlsdGVyQ2I6IGFueTtcbiAgYWRkQWRkaXRpb25hbERhdGE6IGFueTtcbn1cblxuY2xhc3MgVHJhY2tQZXJmb3JtYW5jZSB7XG5cbiAgc3RhdGljIGNvbXB1dGVNZXRyaWNzKGVudHJ5OiBhbnkpIHtcbiAgICBlbnRyeS5kbnNUaW1lID0gZW50cnkuZG9tYWluTG9va3VwRW5kIC0gZW50cnkuZG9tYWluTG9va3VwU3RhcnQ7XG5cbiAgICAvLyBUb3RhbCBDb25uZWN0aW9uIHRpbWVcbiAgICBlbnRyeS5jb25uZWN0aW9uVGltZSA9IGVudHJ5LmNvbm5lY3RFbmQgLSBlbnRyeS5jb25uZWN0U3RhcnQ7XG5cbiAgICAvLyBUTFMgdGltZVxuICAgIGlmIChlbnRyeS5zZWN1cmVDb25uZWN0aW9uU3RhcnQgPiAwKSB7XG4gICAgICBlbnRyeS50bHNUaW1lID0gZW50cnkuY29ubmVjdEVuZCAtIGVudHJ5LnNlY3VyZUNvbm5lY3Rpb25TdGFydDtcbiAgICB9XG5cbiAgICAvLyBUaW1lIHRvIEZpcnN0IEJ5dGUgKFRURkIpXG4gICAgZW50cnkudHRmYiA9IGVudHJ5LnJlc3BvbnNlU3RhcnQgLSBlbnRyeS5yZXF1ZXN0U3RhcnQ7XG5cbiAgICAvKlxuICAgICAgVGhlIGZldGNoU3RhcnQgcmVhZC1vbmx5IHByb3BlcnR5IHJlcHJlc2VudHMgYSB0aW1lc3RhbXAgaW1tZWRpYXRlbHlcbiAgICAgIGJlZm9yZSB0aGUgYnJvd3NlciBzdGFydHMgdG8gZmV0Y2ggdGhlIHJlc291cmNlLlxuICAgICovXG4gICAgZW50cnkuZmV0Y2hUaW1lID0gZW50cnkucmVzcG9uc2VFbmQgLSBlbnRyeS5mZXRjaFN0YXJ0O1xuICAgIGlmIChlbnRyeS53b3JrZXJTdGFydCA+IDApIHtcbiAgICAgIGVudHJ5LndvcmtlclRpbWUgPSBlbnRyeS5yZXNwb25zZUVuZCAtIGVudHJ5LndvcmtlclN0YXJ0O1xuICAgIH1cblxuICAgIC8qXG4gICAgICBUaGUgcmVxdWVzdFN0YXJ0IHJlYWQtb25seSBwcm9wZXJ0eSByZXR1cm5zIGEgdGltZXN0YW1wIG9mIHRoZSB0aW1lXG4gICAgICBpbW1lZGlhdGVseSBiZWZvcmUgdGhlIGJyb3dzZXIgc3RhcnRzIHJlcXVlc3RpbmcgdGhlIHJlc291cmNlIGZyb20gdGhlXG4gICAgICBzZXJ2ZXIsIGNhY2hlLCBvciBsb2NhbCByZXNvdXJjZVxuICAgICAgUmVxdWVzdCBwbHVzIHJlc3BvbnNlIHRpbWUgKG5ldHdvcmsgb25seSlcbiAgICAqL1xuICAgIGVudHJ5LnRvdGFsVGltZSA9IGVudHJ5LnJlc3BvbnNlRW5kIC0gZW50cnkucmVxdWVzdFN0YXJ0O1xuXG4gICAgLy8gUmVzcG9uc2UgdGltZSBvbmx5IChkb3dubG9hZClcbiAgICBlbnRyeS5kb3dubG9hZFRpbWUgPSBlbnRyeS5yZXNwb25zZUVuZCAtIGVudHJ5LnJlc3BvbnNlU3RhcnQ7XG5cbiAgICAvLyBIVFRQIGhlYWRlciBzaXplXG4gICAgZW50cnkuaGVhZGVyU2l6ZSA9IGVudHJ5LnRyYW5zZmVyU2l6ZSAtIGVudHJ5LmVuY29kZWRCb2R5U2l6ZTtcblxuICAgIC8vIENvbXByZXNzaW9uIHJhdGlvXG4gICAgZW50cnkuY29tcHJlc3Npb25SYXRpbyA9IGVudHJ5LmRlY29kZWRCb2R5U2l6ZSAvIGVudHJ5LmVuY29kZWRCb2R5U2l6ZTtcblxuICAgIC8vIFBhZ2UgVGltZVxuICAgIGlmIChlbnRyeS5lbnRyeVR5cGUgPT09IFwibmF2aWdhdGlvblwiKSB7XG4gICAgICBlbnRyeS5ET01Db250ZW50TG9hZFRpbWUgPSBlbnRyeS5kb21Db250ZW50TG9hZGVkRXZlbnRFbmQgLSBlbnRyeS5zdGFydFRpbWU7XG4gICAgICBlbnRyeS5wYWdlTG9hZFRpbWUgPSBlbnRyeS5sb2FkRXZlbnRFbmQgLSBlbnRyeS5zdGFydFRpbWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVudHJ5O1xuICB9XG5cbiAgc3RhdGljIGNodW5rKGFycmF5OiBhbnlbXSwgc2l6ZTogbnVtYmVyKSB7XG4gICAgcmV0dXJuIGFycmF5LnJlZHVjZSgocmVzLCBpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgaWYgKGluZGV4ICUgc2l6ZSA9PT0gMCkge1xuICAgICAgICByZXMucHVzaChbXSk7XG4gICAgICB9XG4gICAgICByZXNbcmVzLmxlbmd0aCAtIDFdLnB1c2goaXRlbSk7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH0sIFtdKTtcbiAgfVxuICBxdWV1ZWRFbnRyaWVzOiBhbnlbXTtcbiAgb3B0aW9uczogSVRyYWNrUGVyZm9ybWFuY2VPcHRpb25zO1xuXG4gIGNvbnN0cnVjdG9yKHtcbiAgICB0cmFja1VybCxcbiAgICB0aHJlc2hvbGQgPSA2MDAwLFxuICAgIGJhdGNoU2l6ZSA9IDUwLFxuICAgIGV4Y2x1ZGVLZXlzID0gW10sXG4gICAgZXhjbHVkZUhvc3RzID0gW10sXG4gICAgcGFyc2VyQ2IsXG4gICAgZmlsdGVyQ2IsXG4gICAgYWRkQWRkaXRpb25hbERhdGFcbiAgfTogSVRyYWNrUGVyZm9ybWFuY2VPcHRpb25zKSB7XG4gICAgdGhpcy5xdWV1ZWRFbnRyaWVzID0gW107XG4gICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgdHJhY2tVcmwsXG4gICAgICB0aHJlc2hvbGQsXG4gICAgICBiYXRjaFNpemUsXG4gICAgICBleGNsdWRlS2V5cyxcbiAgICAgIGV4Y2x1ZGVIb3N0cyxcbiAgICAgIHBhcnNlckNiLFxuICAgICAgZmlsdGVyQ2IsXG4gICAgICBhZGRBZGRpdGlvbmFsRGF0YVxuICAgIH07XG5cbiAgICBpZiAoXCJwZXJmb3JtYW5jZVwiIGluIHdpbmRvdykge1xuICAgICAgaWYgKFwiUGVyZm9ybWFuY2VPYnNlcnZlclwiIGluIHdpbmRvdykge1xuICAgICAgICBjb25zdCBwZXJmT2JzZXJ2ZXIgPSBuZXcgUGVyZm9ybWFuY2VPYnNlcnZlcigobGlzdCwgb2JqKSA9PiB7XG4gICAgICAgICAgdGhpcy5oYW5kbGVFbnRyaWVzKGxpc3QuZ2V0RW50cmllcygpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcGVyZk9ic2VydmVyLm9ic2VydmUoe1xuICAgICAgICAgIGVudHJ5VHlwZXM6IFtcInJlc291cmNlXCJdXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVG8tRG9cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbiAgICBjb25zb2xlLmxvZyhcIlNldHRpbmcgdXAgc2V0SW50ZXJ2YWwgdG8gcHVzaCB0cmFjayBkYXRhXCIpO1xuICAgIHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5xdWV1ZWRFbnRyaWVzLmxlbmd0aCkge1xuICAgICAgICB0aGlzLnNlbmRUb1NlcnZlcigpO1xuICAgICAgICB0aGlzLnF1ZXVlZEVudHJpZXMgPSBbXTtcbiAgICAgIH1cbiAgICB9LCB0aHJlc2hvbGQpO1xuXG4gICAgd2luZG93Lm9ubG9hZCA9ICgpID0+IHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLmhhbmRsZUVudHJpZXMocGVyZm9ybWFuY2UuZ2V0RW50cmllc0J5VHlwZShcIm5hdmlnYXRpb25cIikpO1xuICAgICAgfSwgMCk7XG4gICAgfTtcbiAgfVxuXG4gIGhhbmRsZUVudHJpZXMoZW50cmllczogYW55W10pIHtcbiAgICBjb25zdCB7XG4gICAgICB0cmFja1VybCxcbiAgICAgIGV4Y2x1ZGVLZXlzLFxuICAgICAgZXhjbHVkZUhvc3RzLFxuICAgICAgcGFyc2VyQ2IsXG4gICAgICBmaWx0ZXJDYlxuICAgIH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgZW50cmllcyA9IGVudHJpZXMubWFwKChlbnRyeSkgPT4gZW50cnkudG9KU09OKCkpO1xuICAgIGVudHJpZXMgPSBlbnRyaWVzLmZpbHRlcigoZW50cnkpID0+IGVudHJ5Lm5hbWUuaW5kZXhPZih0cmFja1VybCkgPT09IC0xICYmXG4gICAgICAhZXhjbHVkZUhvc3RzLnNvbWUoKGhvc3QpID0+IGVudHJ5Lm5hbWUuaW5kZXhPZihob3N0KSA+IC0xKSk7XG4gICAgZW50cmllcyA9IGVudHJpZXMubWFwKFRyYWNrUGVyZm9ybWFuY2UuY29tcHV0ZU1ldHJpY3MpO1xuXG4gICAgaWYgKHBhcnNlckNiICYmIHR5cGVvZiBwYXJzZXJDYiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBlbnRyaWVzID0gZW50cmllcy5tYXAocGFyc2VyQ2IpO1xuICAgIH1cbiAgICBpZiAoZmlsdGVyQ2IgJiYgdHlwZW9mIGZpbHRlckNiID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIGVudHJpZXMgPSBlbnRyaWVzLmZpbHRlcihmaWx0ZXJDYik7XG4gICAgfVxuXG4gICAgaWYgKGV4Y2x1ZGVLZXlzLmxlbmd0aCkge1xuICAgICAgZW50cmllcyA9IGVudHJpZXMubWFwKChlbnRyeSkgPT4ge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMoZW50cnkpLnJlZHVjZSgoYWNjOiBhbnksIGtleSkgPT4ge1xuICAgICAgICAgIGlmIChleGNsdWRlS2V5cy5pbmRleE9mKGtleSkgPT09IC0xKSB7XG4gICAgICAgICAgICBhY2Nba2V5XSA9IGVudHJ5W2tleV07XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIHt9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLnF1ZXVlZEVudHJpZXMgPSB0aGlzLnF1ZXVlZEVudHJpZXMuY29uY2F0KGVudHJpZXMpO1xuICB9XG5cbiAgc2VuZFRvU2VydmVyKCkge1xuICAgIGNvbnN0IHsgYmF0Y2hTaXplLCB0cmFja1VybCwgYWRkQWRkaXRpb25hbERhdGEgfSA9IHRoaXMub3B0aW9ucztcbiAgICBjb25zdCBlbnRyeUNodW5rcyA9IFRyYWNrUGVyZm9ybWFuY2UuY2h1bmsodGhpcy5xdWV1ZWRFbnRyaWVzLCBiYXRjaFNpemUpO1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgZW50cnlDaHVua3MuZm9yRWFjaCgoZW50cnlDaHVuazogYW55W10sIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGJvZHkgPSB7XG4gICAgICAgICAgICBkYXRhOiBlbnRyeUNodW5rLFxuICAgICAgICAgICAgYWRkaXRpb25hbERhdGE6IGFkZEFkZGl0aW9uYWxEYXRhKClcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgZmV0Y2godHJhY2tVcmwsIHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJwb3N0XCIsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgIFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvbiwgdGV4dC9wbGFpbiwgKi8qXCIsXG4gICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoYm9keSlcbiAgICAgICAgICB9KS50aGVuKChyZXMpID0+IHJlcy5qc29uKCkpXG4gICAgICAgICAgICAudGhlbigocmVzKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgICAgICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3Igd2hpbGUgc2VuZGluZyBkYXRhIHRvIC90cmFjazogXCIsIGVycm9yLCBib2R5KTtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG5cbi8vIGV4cG9ydCBhIGdsb2JhbCB2YXJpYWJsZSB0byBhY2Nlc3MgbGF0ZXJcbih3aW5kb3cgYXMgYW55KS5UcmFja1BlcmZvcm1hbmNlID0gVHJhY2tQZXJmb3JtYW5jZTtcbmV4cG9ydCBkZWZhdWx0IFRyYWNrUGVyZm9ybWFuY2U7XG4iXSwic291cmNlUm9vdCI6IiJ9