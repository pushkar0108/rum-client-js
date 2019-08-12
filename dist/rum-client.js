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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRmE7QUFFYjtJQUlFLDBCQUFZLEVBU1g7UUFURCxpQkFpREM7WUFoREMsc0JBQVEsRUFDUixpQkFBZ0IsRUFBaEIscUNBQWdCLEVBQ2hCLGlCQUFjLEVBQWQsbUNBQWMsRUFDZCxtQkFBZ0IsRUFBaEIscUNBQWdCLEVBQ2hCLG9CQUFpQixFQUFqQixzQ0FBaUIsRUFDakIsc0JBQVEsRUFDUixzQkFBUSxFQUNSLHdDQUFpQjtRQUVqQixJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMsT0FBTyxHQUFHO1lBQ2IsUUFBUTtZQUNSLFNBQVM7WUFDVCxTQUFTO1lBQ1QsV0FBVztZQUNYLFlBQVk7WUFDWixR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QUssQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUM7UUFFdkUsWUFBWTtRQUNaLElBQUksS0FBSyxDQUFDLFNBQVMsSUFBSSxZQUFZLEVBQUU7WUFDbkMsS0FBSyxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQyx3QkFBd0IsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQzVFLEtBQUssQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1NBQzNEO1FBRUQsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRU0sc0JBQUssR0FBWixVQUFhLEtBQUssRUFBRSxJQUFJO1FBQ3RCLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSztZQUNuQyxJQUFJLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxFQUFFO2dCQUN0QixHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQ2Q7WUFDRCxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDL0IsT0FBTyxHQUFHLENBQUM7UUFDYixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDVCxDQUFDO0lBQ0gsdUJBQUM7QUFBRCxDQUFDO0FBRUQsMkNBQTJDO0FBRTFDLE1BQWMsQ0FBQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQyIsImZpbGUiOiJydW0tY2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuY2xhc3MgVHJhY2tQZXJmb3JtYW5jZSB7XG4gIHF1ZXVlZEVudHJpZXM6IGFueVtdO1xuICBvcHRpb25zOiBhbnk7XG5cbiAgY29uc3RydWN0b3Ioe1xuICAgIHRyYWNrVXJsLFxuICAgIHRocmVzaG9sZCA9IDYwMDAsXG4gICAgYmF0Y2hTaXplID0gNTAsXG4gICAgZXhjbHVkZUtleXMgPSBbXSxcbiAgICBleGNsdWRlSG9zdHMgPSBbXSxcbiAgICBwYXJzZXJDYixcbiAgICBmaWx0ZXJDYixcbiAgICBhZGRBZGRpdGlvbmFsRGF0YVxuICB9KSB7XG4gICAgdGhpcy5xdWV1ZWRFbnRyaWVzID0gW107XG4gICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgdHJhY2tVcmwsXG4gICAgICB0aHJlc2hvbGQsXG4gICAgICBiYXRjaFNpemUsXG4gICAgICBleGNsdWRlS2V5cyxcbiAgICAgIGV4Y2x1ZGVIb3N0cyxcbiAgICAgIHBhcnNlckNiLFxuICAgICAgZmlsdGVyQ2IsXG4gICAgICBhZGRBZGRpdGlvbmFsRGF0YVxuICAgIH07XG5cbiAgICBpZiAoXCJwZXJmb3JtYW5jZVwiIGluIHdpbmRvdykge1xuICAgICAgaWYgKFwiUGVyZm9ybWFuY2VPYnNlcnZlclwiIGluIHdpbmRvdykge1xuICAgICAgICBsZXQgcGVyZk9ic2VydmVyID0gbmV3IFBlcmZvcm1hbmNlT2JzZXJ2ZXIoKGxpc3QsIG9iaikgPT4ge1xuICAgICAgICAgIHRoaXMuaGFuZGxlRW50cmllcyhsaXN0LmdldEVudHJpZXMoKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHBlcmZPYnNlcnZlci5vYnNlcnZlKHtcbiAgICAgICAgICBlbnRyeVR5cGVzOiBbXCJyZXNvdXJjZVwiXVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRvLURvXG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coXCJTZXR0aW5nIHVwIHNldEludGVydmFsIHRvIHB1c2ggdHJhY2sgZGF0YVwiKTtcbiAgICB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMucXVldWVkRW50cmllcy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5zZW5kVG9TZXJ2ZXIoKTtcbiAgICAgICAgdGhpcy5xdWV1ZWRFbnRyaWVzID0gW107XG4gICAgICB9XG4gICAgfSwgdGhyZXNob2xkKTtcblxuICAgIHdpbmRvdy5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5oYW5kbGVFbnRyaWVzKHBlcmZvcm1hbmNlLmdldEVudHJpZXNCeVR5cGUoJ25hdmlnYXRpb24nKSk7XG4gICAgICB9LCAwKTtcbiAgICB9O1xuICB9XG5cbiAgaGFuZGxlRW50cmllcyhlbnRyaWVzOiBhbnkpIHtcbiAgICBsZXQge1xuICAgICAgdHJhY2tVcmwsXG4gICAgICBleGNsdWRlS2V5cyxcbiAgICAgIGV4Y2x1ZGVIb3N0cyxcbiAgICAgIHBhcnNlckNiLFxuICAgICAgZmlsdGVyQ2JcbiAgICB9ID0gdGhpcy5vcHRpb25zO1xuICAgIGVudHJpZXMgPSBlbnRyaWVzLm1hcChlbnRyeSA9PiBlbnRyeS50b0pTT04oKSk7XG4gICAgZW50cmllcyA9IGVudHJpZXMuZmlsdGVyKGVudHJ5ID0+IGVudHJ5Lm5hbWUuaW5kZXhPZih0cmFja1VybCkgPT0gLTEgJiYgIWV4Y2x1ZGVIb3N0cy5zb21lKGhvc3QgPT4gZW50cnkubmFtZS5pbmRleE9mKGhvc3QpID4gLTEpKTtcbiAgICBlbnRyaWVzID0gZW50cmllcy5tYXAoVHJhY2tQZXJmb3JtYW5jZS5jb21wdXRlTWV0cmljcyk7XG4gICAgKHBhcnNlckNiICYmIHR5cGVvZiBwYXJzZXJDYiA9PT0gXCJmdW5jdGlvblwiKSAmJiAoZW50cmllcyA9IGVudHJpZXMubWFwKHBhcnNlckNiKSk7XG4gICAgKGZpbHRlckNiICYmIHR5cGVvZiBmaWx0ZXJDYiA9PT0gXCJmdW5jdGlvblwiKSAmJiAoZW50cmllcyA9IGVudHJpZXMuZmlsdGVyKGZpbHRlckNiKSk7XG5cbiAgICBpZiAoZXhjbHVkZUtleXMubGVuZ3RoKSB7XG4gICAgICBlbnRyaWVzID0gZW50cmllcy5tYXAoZW50cnkgPT4ge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMoZW50cnkpLnJlZHVjZSgoYWNjLCBrZXkpID0+IHtcbiAgICAgICAgICBpZiAoZXhjbHVkZUtleXMuaW5kZXhPZihrZXkpID09IC0xKSB7XG4gICAgICAgICAgICBhY2Nba2V5XSA9IGVudHJ5W2tleV07XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIHt9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLnF1ZXVlZEVudHJpZXMgPSB0aGlzLnF1ZXVlZEVudHJpZXMuY29uY2F0KGVudHJpZXMpO1xuICB9XG5cbiAgc2VuZFRvU2VydmVyKCkge1xuICAgIGxldCB7IGJhdGNoU2l6ZSwgdHJhY2tVcmwsIGFkZEFkZGl0aW9uYWxEYXRhIH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgbGV0IGVudHJ5Q2h1bmtzID0gVHJhY2tQZXJmb3JtYW5jZS5jaHVuayh0aGlzLnF1ZXVlZEVudHJpZXMsIGJhdGNoU2l6ZSk7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBlbnRyeUNodW5rcy5mb3JFYWNoKChlbnRyeUNodW5rLCBpbmRleCkgPT4ge1xuICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgbGV0IGJvZHkgPSB7XG4gICAgICAgICAgICBkYXRhOiBlbnRyeUNodW5rLFxuICAgICAgICAgICAgYWRkaXRpb25hbERhdGE6IGFkZEFkZGl0aW9uYWxEYXRhKClcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgZmV0Y2godHJhY2tVcmwsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24sIHRleHQvcGxhaW4sICovKicsXG4gICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShib2R5KVxuICAgICAgICAgIH0pLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gICAgICAgICAgICAudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIHdoaWxlIHNlbmRpbmcgZGF0YSB0byAvdHJhY2s6IFwiLCBlcnJvciwgYm9keSk7XG4gICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBjb21wdXRlTWV0cmljcyhlbnRyeSkge1xuICAgIGVudHJ5LmRuc1RpbWUgPSBlbnRyeS5kb21haW5Mb29rdXBFbmQgLSBlbnRyeS5kb21haW5Mb29rdXBTdGFydDtcblxuICAgIC8vIFRvdGFsIENvbm5lY3Rpb24gdGltZVxuICAgIGVudHJ5LmNvbm5lY3Rpb25UaW1lID0gZW50cnkuY29ubmVjdEVuZCAtIGVudHJ5LmNvbm5lY3RTdGFydDtcblxuICAgIC8vIFRMUyB0aW1lXG4gICAgaWYgKGVudHJ5LnNlY3VyZUNvbm5lY3Rpb25TdGFydCA+IDApIHtcbiAgICAgIGVudHJ5LnRsc1RpbWUgPSBlbnRyeS5jb25uZWN0RW5kIC0gZW50cnkuc2VjdXJlQ29ubmVjdGlvblN0YXJ0O1xuICAgIH1cblxuICAgIC8vIFRpbWUgdG8gRmlyc3QgQnl0ZSAoVFRGQilcbiAgICBlbnRyeS50dGZiID0gZW50cnkucmVzcG9uc2VTdGFydCAtIGVudHJ5LnJlcXVlc3RTdGFydDtcblxuICAgIC8vIFRoZSBmZXRjaFN0YXJ0IHJlYWQtb25seSBwcm9wZXJ0eSByZXByZXNlbnRzIGEgdGltZXN0YW1wIGltbWVkaWF0ZWx5IGJlZm9yZSB0aGUgYnJvd3NlciBzdGFydHMgdG8gZmV0Y2ggdGhlIHJlc291cmNlLlxuICAgIGVudHJ5LmZldGNoVGltZSA9IGVudHJ5LnJlc3BvbnNlRW5kIC0gZW50cnkuZmV0Y2hTdGFydDtcbiAgICBpZiAoZW50cnkud29ya2VyU3RhcnQgPiAwKSB7XG4gICAgICBlbnRyeS53b3JrZXJUaW1lID0gZW50cnkucmVzcG9uc2VFbmQgLSBlbnRyeS53b3JrZXJTdGFydDtcbiAgICB9XG5cbiAgICAvLyBUaGUgcmVxdWVzdFN0YXJ0IHJlYWQtb25seSBwcm9wZXJ0eSByZXR1cm5zIGEgdGltZXN0YW1wIG9mIHRoZSB0aW1lIGltbWVkaWF0ZWx5IGJlZm9yZSB0aGUgYnJvd3NlciBzdGFydHMgcmVxdWVzdGluZyB0aGUgcmVzb3VyY2UgZnJvbSB0aGUgc2VydmVyLCBjYWNoZSwgb3IgbG9jYWwgcmVzb3VyY2VcbiAgICAvLyBSZXF1ZXN0IHBsdXMgcmVzcG9uc2UgdGltZSAobmV0d29yayBvbmx5KVxuICAgIGVudHJ5LnRvdGFsVGltZSA9IGVudHJ5LnJlc3BvbnNlRW5kIC0gZW50cnkucmVxdWVzdFN0YXJ0O1xuXG4gICAgLy8gUmVzcG9uc2UgdGltZSBvbmx5IChkb3dubG9hZClcbiAgICBlbnRyeS5kb3dubG9hZFRpbWUgPSBlbnRyeS5yZXNwb25zZUVuZCAtIGVudHJ5LnJlc3BvbnNlU3RhcnQ7XG5cbiAgICAvLyBIVFRQIGhlYWRlciBzaXplXG4gICAgZW50cnkuaGVhZGVyU2l6ZSA9IGVudHJ5LnRyYW5zZmVyU2l6ZSAtIGVudHJ5LmVuY29kZWRCb2R5U2l6ZTtcblxuICAgIC8vIENvbXByZXNzaW9uIHJhdGlvXG4gICAgZW50cnkuY29tcHJlc3Npb25SYXRpbyA9IGVudHJ5LmRlY29kZWRCb2R5U2l6ZSAvIGVudHJ5LmVuY29kZWRCb2R5U2l6ZTtcblxuICAgIC8vIFBhZ2UgVGltZVxuICAgIGlmIChlbnRyeS5lbnRyeVR5cGUgPT0gXCJuYXZpZ2F0aW9uXCIpIHtcbiAgICAgIGVudHJ5LkRPTUNvbnRlbnRMb2FkVGltZSA9IGVudHJ5LmRvbUNvbnRlbnRMb2FkZWRFdmVudEVuZCAtIGVudHJ5LnN0YXJ0VGltZTtcbiAgICAgIGVudHJ5LnBhZ2VMb2FkVGltZSA9IGVudHJ5LmxvYWRFdmVudEVuZCAtIGVudHJ5LnN0YXJ0VGltZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZW50cnk7XG4gIH1cblxuICBzdGF0aWMgY2h1bmsoYXJyYXksIHNpemUpIHtcbiAgICByZXR1cm4gYXJyYXkucmVkdWNlKChyZXMsIGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICBpZiAoaW5kZXggJSBzaXplID09PSAwKSB7XG4gICAgICAgIHJlcy5wdXNoKFtdKTtcbiAgICAgIH1cbiAgICAgIHJlc1tyZXMubGVuZ3RoIC0gMV0ucHVzaChpdGVtKTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfSwgW10pO1xuICB9XG59XG5cbi8vIGV4cG9ydCBhIGdsb2JhbCB2YXJpYWJsZSB0byBhY2Nlc3MgbGF0ZXJcblxuKHdpbmRvdyBhcyBhbnkpLlRyYWNrUGVyZm9ybWFuY2UgPSBUcmFja1BlcmZvcm1hbmNlOyJdLCJzb3VyY2VSb290IjoiIn0=