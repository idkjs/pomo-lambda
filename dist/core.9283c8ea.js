// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/fp.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compose = void 0;

var compose = function compose() {
  for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return function (value) {
    return fns.reduceRight(function (acc, fn) {
      return fn(acc);
    }, value);
  };
};

exports.compose = compose;
},{}],"src/math.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isZero = exports.mod60 = void 0;

var mod = function mod(divisor) {
  return function (dividend) {
    return (dividend % divisor + divisor) % divisor;
  };
};

var mod60 = mod(60);
exports.mod60 = mod60;

var isZero = function isZero(number) {
  return number == 0;
};

exports.isZero = isZero;
},{}],"src/collection.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.second = exports.first = void 0;

var first = function first(list) {
  return list[0];
};

exports.first = first;

var second = function second(list) {
  return list[1];
};

exports.second = second;
},{}],"src/string.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toString = exports.splitByColon = void 0;

var split = function split(separator) {
  return function (text) {
    return text.split(separator);
  };
};

var splitByColon = split(':');
exports.splitByColon = splitByColon;

var toString = function toString(number) {
  return number.toString();
};

exports.toString = toString;
},{}],"src/calculation.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateNewTime = void 0;

var _fp = require("./fp.js");

var _math = require("./math.js");

var _collection = require("./collection.js");

var _string = require("./string.js");

var getHour = (0, _fp.compose)(_collection.first, _string.splitByColon);
var getMinute = (0, _fp.compose)(_collection.second, _string.splitByColon);
var singleDigitNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

var isSingleDigit = function isSingleDigit(numberText) {
  return singleDigitNumbers.includes(numberText);
};

var addPrefixDigit = function addPrefixDigit(numberText) {
  return isSingleDigit(numberText) ? "0".concat(numberText) : numberText;
};

var nextMinuteNumber = function nextMinuteNumber(number) {
  return (0, _math.mod60)(number - 1);
};

var nextHourNumber = function nextHourNumber(number) {
  return (0, _math.isZero)(number) ? number : number - 1;
};

var nextMinute = (0, _fp.compose)(addPrefixDigit, _string.toString, nextMinuteNumber, Number);
var nextHour = (0, _fp.compose)(addPrefixDigit, _string.toString, nextHourNumber, Number);

var passedOneMinute = function passedOneMinute(minute) {
  return minute == "59";
};

var calculateNewTime = function calculateNewTime(startTime) {
  var hour = getHour(startTime);
  var minute = getMinute(startTime);
  var newMinute = nextMinute(minute);
  var newHour = passedOneMinute(newMinute) ? nextHour(hour) : hour;
  return "".concat(newHour, ":").concat(newMinute);
}; // most of these are for testing purposes
// export {
//   getHour,
//   getMinute,
//   isSingleDigit,
//   addPrefixDigit,
//   nextHourNumber,
//   nextMinuteNumber,
//   nextHour,
//   nextMinute,
//   calculateNewTime
// };


exports.calculateNewTime = calculateNewTime;
},{"./fp.js":"src/fp.js","./math.js":"src/math.js","./collection.js":"src/collection.js","./string.js":"src/string.js"}],"src/core.js":[function(require,module,exports) {
"use strict";

var _calculation = require("./calculation.js");

var countdown;
var startButton = document.getElementById('start-button');
var stopButton = document.getElementById('stop-button');
var resetButton = document.getElementById('reset-button');
var initialTime = '25:00';
var finishedTime = '00:00';
var time = document.getElementById('time');

var isFinished = function isFinished(startTime) {
  return startTime === finishedTime;
};

var finishTimer = function finishTimer() {
  stopPomodoro();
  return finishedTime;
};

var updateTime = function updateTime() {
  var startTime = time.textContent;
  time.textContent = isFinished(startTime) ? finishTimer() : (0, _calculation.calculateNewTime)(startTime);
};

var startPomodoro = function startPomodoro() {
  countdown = countdown || setInterval(updateTime, 1000);
};

var stopPomodoro = function stopPomodoro() {
  clearInterval(countdown);
  countdown = undefined;
};

var resetPomodoro = function resetPomodoro() {
  stopPomodoro();
  time.textContent = initialTime;
};

startButton.addEventListener('click', startPomodoro);
stopButton.addEventListener('click', stopPomodoro);
resetButton.addEventListener('click', resetPomodoro);
},{"./calculation.js":"src/calculation.js"}],"../../.fnm/node-versions/v13.11.0/installation/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57595" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../.fnm/node-versions/v13.11.0/installation/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/core.js"], null)
//# sourceMappingURL=/core.9283c8ea.js.map