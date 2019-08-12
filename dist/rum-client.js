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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/rum-client.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/rum-client.ts":
/*!***************************!*\
  !*** ./src/rum-client.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
        console.log("Setting up setInterval to push track data");
        window.setInterval(function () {
            if (_this.queuedEntries.length) {
                _this.sendToServer();
                _this.queuedEntries = [];
            }
        }, threshold);
        window.onload = function () {
            setTimeout(function () {
                _this.handleEntries(performance.getEntriesByType('navigation'));
            }, 0);
        };
    }
    TrackPerformance.prototype.handleEntries = function (entries) {
        var _a = this.options, trackUrl = _a.trackUrl, excludeKeys = _a.excludeKeys, excludeHosts = _a.excludeHosts, parserCb = _a.parserCb, filterCb = _a.filterCb;
        entries = entries.map(function (entry) { return entry.toJSON(); });
        entries = entries.filter(function (entry) { return entry.name.indexOf(trackUrl) == -1 && !excludeHosts.some(function (host) { return entry.name.indexOf(host) > -1; }); });
        entries = entries.map(TrackPerformance.computeMetrics);
        (parserCb && typeof parserCb === "function") && (entries = entries.map(parserCb));
        (filterCb && typeof filterCb === "function") && (entries = entries.filter(filterCb));
        if (excludeKeys.length) {
            entries = entries.map(function (entry) {
                return Object.keys(entry).reduce(function (acc, key) {
                    if (excludeKeys.indexOf(key) == -1) {
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
                        method: 'post',
                        headers: {
                            'Accept': 'application/json, text/plain, */*',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(body)
                    }).then(function (res) { return res.json(); })
                        .then(function (res) {
                        return resolve();
                    }).catch(function (error) {
                        console.log("Error while sending data to /track: ", error, body);
                        return resolve();
                    });
                });
            });
        });
    };
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
    return TrackPerformance;
}());
// export a global variable to access later
window.TrackPerformance = TrackPerformance;


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3J1bS1jbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7OztBQ2xGYTtBQUViO0lBSUUsMEJBQVksRUFTWDtRQVRELGlCQWlEQztZQWhEQyxzQkFBUSxFQUNSLGlCQUFnQixFQUFoQixxQ0FBZ0IsRUFDaEIsaUJBQWMsRUFBZCxtQ0FBYyxFQUNkLG1CQUFnQixFQUFoQixxQ0FBZ0IsRUFDaEIsb0JBQWlCLEVBQWpCLHNDQUFpQixFQUNqQixzQkFBUSxFQUNSLHNCQUFRLEVBQ1Isd0NBQWlCO1FBRWpCLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxPQUFPLEdBQUc7WUFDYixRQUFRO1lBQ1IsU0FBUztZQUNULFNBQVM7WUFDVCxXQUFXO1lBQ1gsWUFBWTtZ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cEIsS0FBSyxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQztRQUV2RSxZQUFZO1FBQ1osSUFBSSxLQUFLLENBQUMsU0FBUyxJQUFJLFlBQVksRUFBRTtZQUNuQyxLQUFLLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFDLHdCQUF3QixHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDNUUsS0FBSyxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7U0FDM0Q7UUFFRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFTSxzQkFBSyxHQUFaLFVBQWEsS0FBSyxFQUFFLElBQUk7UUFDdEIsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLO1lBQ25DLElBQUksS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLEVBQUU7Z0JBQ3RCLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDZDtZQUNELEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMvQixPQUFPLEdBQUcsQ0FBQztRQUNiLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNULENBQUM7SUFDSCx1QkFBQztBQUFELENBQUM7QUFFRCwyQ0FBMkM7QUFFMUMsTUFBYyxDQUFDLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDIiwiZmlsZSI6InJ1bS1jbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9ydW0tY2xpZW50LnRzXCIpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmNsYXNzIFRyYWNrUGVyZm9ybWFuY2Uge1xuICBxdWV1ZWRFbnRyaWVzOiBhbnlbXTtcbiAgb3B0aW9uczogYW55O1xuXG4gIGNvbnN0cnVjdG9yKHtcbiAgICB0cmFja1VybCxcbiAgICB0aHJlc2hvbGQgPSA2MDAwLFxuICAgIGJhdGNoU2l6ZSA9IDUwLFxuICAgIGV4Y2x1ZGVLZXlzID0gW10sXG4gICAgZXhjbHVkZUhvc3RzID0gW10sXG4gICAgcGFyc2VyQ2IsXG4gICAgZmlsdGVyQ2IsXG4gICAgYWRkQWRkaXRpb25hbERhdGFcbiAgfSkge1xuICAgIHRoaXMucXVldWVkRW50cmllcyA9IFtdO1xuICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgIHRyYWNrVXJsLFxuICAgICAgdGhyZXNob2xkLFxuICAgICAgYmF0Y2hTaXplLFxuICAgICAgZXhjbHVkZUtleXMsXG4gICAgICBleGNsdWRlSG9zdHMsXG4gICAgICBwYXJzZXJDYixcbiAgICAgIGZpbHRlckNiLFxuICAgICAgYWRkQWRkaXRpb25hbERhdGFcbiAgICB9O1xuXG4gICAgaWYgKFwicGVyZm9ybWFuY2VcIiBpbiB3aW5kb3cpIHtcbiAgICAgIGlmIChcIlBlcmZvcm1hbmNlT2JzZXJ2ZXJcIiBpbiB3aW5kb3cpIHtcbiAgICAgICAgbGV0IHBlcmZPYnNlcnZlciA9IG5ldyBQZXJmb3JtYW5jZU9ic2VydmVyKChsaXN0LCBvYmopID0+IHtcbiAgICAgICAgICB0aGlzLmhhbmRsZUVudHJpZXMobGlzdC5nZXRFbnRyaWVzKCkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBwZXJmT2JzZXJ2ZXIub2JzZXJ2ZSh7XG4gICAgICAgICAgZW50cnlUeXBlczogW1wicmVzb3VyY2VcIl1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUby1Eb1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKFwiU2V0dGluZyB1cCBzZXRJbnRlcnZhbCB0byBwdXNoIHRyYWNrIGRhdGFcIik7XG4gICAgd2luZG93LnNldEludGVydmFsKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLnF1ZXVlZEVudHJpZXMubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuc2VuZFRvU2VydmVyKCk7XG4gICAgICAgIHRoaXMucXVldWVkRW50cmllcyA9IFtdO1xuICAgICAgfVxuICAgIH0sIHRocmVzaG9sZCk7XG5cbiAgICB3aW5kb3cub25sb2FkID0gKCkgPT4ge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuaGFuZGxlRW50cmllcyhwZXJmb3JtYW5jZS5nZXRFbnRyaWVzQnlUeXBlKCduYXZpZ2F0aW9uJykpO1xuICAgICAgfSwgMCk7XG4gICAgfTtcbiAgfVxuXG4gIGhhbmRsZUVudHJpZXMoZW50cmllczogYW55KSB7XG4gICAgbGV0IHtcbiAgICAgIHRyYWNrVXJsLFxuICAgICAgZXhjbHVkZUtleXMsXG4gICAgICBleGNsdWRlSG9zdHMsXG4gICAgICBwYXJzZXJDYixcbiAgICAgIGZpbHRlckNiXG4gICAgfSA9IHRoaXMub3B0aW9ucztcbiAgICBlbnRyaWVzID0gZW50cmllcy5tYXAoZW50cnkgPT4gZW50cnkudG9KU09OKCkpO1xuICAgIGVudHJpZXMgPSBlbnRyaWVzLmZpbHRlcihlbnRyeSA9PiBlbnRyeS5uYW1lLmluZGV4T2YodHJhY2tVcmwpID09IC0xICYmICFleGNsdWRlSG9zdHMuc29tZShob3N0ID0+IGVudHJ5Lm5hbWUuaW5kZXhPZihob3N0KSA+IC0xKSk7XG4gICAgZW50cmllcyA9IGVudHJpZXMubWFwKFRyYWNrUGVyZm9ybWFuY2UuY29tcHV0ZU1ldHJpY3MpO1xuICAgIChwYXJzZXJDYiAmJiB0eXBlb2YgcGFyc2VyQ2IgPT09IFwiZnVuY3Rpb25cIikgJiYgKGVudHJpZXMgPSBlbnRyaWVzLm1hcChwYXJzZXJDYikpO1xuICAgIChmaWx0ZXJDYiAmJiB0eXBlb2YgZmlsdGVyQ2IgPT09IFwiZnVuY3Rpb25cIikgJiYgKGVudHJpZXMgPSBlbnRyaWVzLmZpbHRlcihmaWx0ZXJDYikpO1xuXG4gICAgaWYgKGV4Y2x1ZGVLZXlzLmxlbmd0aCkge1xuICAgICAgZW50cmllcyA9IGVudHJpZXMubWFwKGVudHJ5ID0+IHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGVudHJ5KS5yZWR1Y2UoKGFjYywga2V5KSA9PiB7XG4gICAgICAgICAgaWYgKGV4Y2x1ZGVLZXlzLmluZGV4T2Yoa2V5KSA9PSAtMSkge1xuICAgICAgICAgICAgYWNjW2tleV0gPSBlbnRyeVtrZXldO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9LCB7fSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy5xdWV1ZWRFbnRyaWVzID0gdGhpcy5xdWV1ZWRFbnRyaWVzLmNvbmNhdChlbnRyaWVzKTtcbiAgfVxuXG4gIHNlbmRUb1NlcnZlcigpIHtcbiAgICBsZXQgeyBiYXRjaFNpemUsIHRyYWNrVXJsLCBhZGRBZGRpdGlvbmFsRGF0YSB9ID0gdGhpcy5vcHRpb25zO1xuICAgIGxldCBlbnRyeUNodW5rcyA9IFRyYWNrUGVyZm9ybWFuY2UuY2h1bmsodGhpcy5xdWV1ZWRFbnRyaWVzLCBiYXRjaFNpemUpO1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgZW50cnlDaHVua3MuZm9yRWFjaCgoZW50cnlDaHVuaywgaW5kZXgpID0+IHtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgIGxldCBib2R5ID0ge1xuICAgICAgICAgICAgZGF0YTogZW50cnlDaHVuayxcbiAgICAgICAgICAgIGFkZGl0aW9uYWxEYXRhOiBhZGRBZGRpdGlvbmFsRGF0YSgpXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGZldGNoKHRyYWNrVXJsLCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L3BsYWluLCAqLyonLFxuICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoYm9keSlcbiAgICAgICAgICB9KS50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0pLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciB3aGlsZSBzZW5kaW5nIGRhdGEgdG8gL3RyYWNrOiBcIiwgZXJyb3IsIGJvZHkpO1xuICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgY29tcHV0ZU1ldHJpY3MoZW50cnkpIHtcbiAgICBlbnRyeS5kbnNUaW1lID0gZW50cnkuZG9tYWluTG9va3VwRW5kIC0gZW50cnkuZG9tYWluTG9va3VwU3RhcnQ7XG5cbiAgICAvLyBUb3RhbCBDb25uZWN0aW9uIHRpbWVcbiAgICBlbnRyeS5jb25uZWN0aW9uVGltZSA9IGVudHJ5LmNvbm5lY3RFbmQgLSBlbnRyeS5jb25uZWN0U3RhcnQ7XG5cbiAgICAvLyBUTFMgdGltZVxuICAgIGlmIChlbnRyeS5zZWN1cmVDb25uZWN0aW9uU3RhcnQgPiAwKSB7XG4gICAgICBlbnRyeS50bHNUaW1lID0gZW50cnkuY29ubmVjdEVuZCAtIGVudHJ5LnNlY3VyZUNvbm5lY3Rpb25TdGFydDtcbiAgICB9XG5cbiAgICAvLyBUaW1lIHRvIEZpcnN0IEJ5dGUgKFRURkIpXG4gICAgZW50cnkudHRmYiA9IGVudHJ5LnJlc3BvbnNlU3RhcnQgLSBlbnRyeS5yZXF1ZXN0U3RhcnQ7XG5cbiAgICAvLyBUaGUgZmV0Y2hTdGFydCByZWFkLW9ubHkgcHJvcGVydHkgcmVwcmVzZW50cyBhIHRpbWVzdGFtcCBpbW1lZGlhdGVseSBiZWZvcmUgdGhlIGJyb3dzZXIgc3RhcnRzIHRvIGZldGNoIHRoZSByZXNvdXJjZS5cbiAgICBlbnRyeS5mZXRjaFRpbWUgPSBlbnRyeS5yZXNwb25zZUVuZCAtIGVudHJ5LmZldGNoU3RhcnQ7XG4gICAgaWYgKGVudHJ5LndvcmtlclN0YXJ0ID4gMCkge1xuICAgICAgZW50cnkud29ya2VyVGltZSA9IGVudHJ5LnJlc3BvbnNlRW5kIC0gZW50cnkud29ya2VyU3RhcnQ7XG4gICAgfVxuXG4gICAgLy8gVGhlIHJlcXVlc3RTdGFydCByZWFkLW9ubHkgcHJvcGVydHkgcmV0dXJucyBhIHRpbWVzdGFtcCBvZiB0aGUgdGltZSBpbW1lZGlhdGVseSBiZWZvcmUgdGhlIGJyb3dzZXIgc3RhcnRzIHJlcXVlc3RpbmcgdGhlIHJlc291cmNlIGZyb20gdGhlIHNlcnZlciwgY2FjaGUsIG9yIGxvY2FsIHJlc291cmNlXG4gICAgLy8gUmVxdWVzdCBwbHVzIHJlc3BvbnNlIHRpbWUgKG5ldHdvcmsgb25seSlcbiAgICBlbnRyeS50b3RhbFRpbWUgPSBlbnRyeS5yZXNwb25zZUVuZCAtIGVudHJ5LnJlcXVlc3RTdGFydDtcblxuICAgIC8vIFJlc3BvbnNlIHRpbWUgb25seSAoZG93bmxvYWQpXG4gICAgZW50cnkuZG93bmxvYWRUaW1lID0gZW50cnkucmVzcG9uc2VFbmQgLSBlbnRyeS5yZXNwb25zZVN0YXJ0O1xuXG4gICAgLy8gSFRUUCBoZWFkZXIgc2l6ZVxuICAgIGVudHJ5LmhlYWRlclNpemUgPSBlbnRyeS50cmFuc2ZlclNpemUgLSBlbnRyeS5lbmNvZGVkQm9keVNpemU7XG5cbiAgICAvLyBDb21wcmVzc2lvbiByYXRpb1xuICAgIGVudHJ5LmNvbXByZXNzaW9uUmF0aW8gPSBlbnRyeS5kZWNvZGVkQm9keVNpemUgLyBlbnRyeS5lbmNvZGVkQm9keVNpemU7XG5cbiAgICAvLyBQYWdlIFRpbWVcbiAgICBpZiAoZW50cnkuZW50cnlUeXBlID09IFwibmF2aWdhdGlvblwiKSB7XG4gICAgICBlbnRyeS5ET01Db250ZW50TG9hZFRpbWUgPSBlbnRyeS5kb21Db250ZW50TG9hZGVkRXZlbnRFbmQgLSBlbnRyeS5zdGFydFRpbWU7XG4gICAgICBlbnRyeS5wYWdlTG9hZFRpbWUgPSBlbnRyeS5sb2FkRXZlbnRFbmQgLSBlbnRyeS5zdGFydFRpbWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVudHJ5O1xuICB9XG5cbiAgc3RhdGljIGNodW5rKGFycmF5LCBzaXplKSB7XG4gICAgcmV0dXJuIGFycmF5LnJlZHVjZSgocmVzLCBpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgaWYgKGluZGV4ICUgc2l6ZSA9PT0gMCkge1xuICAgICAgICByZXMucHVzaChbXSk7XG4gICAgICB9XG4gICAgICByZXNbcmVzLmxlbmd0aCAtIDFdLnB1c2goaXRlbSk7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH0sIFtdKTtcbiAgfVxufVxuXG4vLyBleHBvcnQgYSBnbG9iYWwgdmFyaWFibGUgdG8gYWNjZXNzIGxhdGVyXG5cbih3aW5kb3cgYXMgYW55KS5UcmFja1BlcmZvcm1hbmNlID0gVHJhY2tQZXJmb3JtYW5jZTsiXSwic291cmNlUm9vdCI6IiJ9