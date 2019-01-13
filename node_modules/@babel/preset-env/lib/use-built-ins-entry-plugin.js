"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _debug = require("./debug");

var _utils = require("./utils");

function _default({
  types: t
}) {
  function replaceWithPolyfillImports(path, polyfills, regenerator) {
    if (regenerator) {
      (0, _utils.createImport)(path, "regenerator-runtime");
    }

    const items = Array.isArray(polyfills) ? new Set(polyfills) : polyfills;

    for (var _iterator = Array.from(items).reverse(), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      const p = _ref;
      (0, _utils.createImport)(path, p);
    }

    path.remove();
  }

  const isPolyfillImport = {
    ImportDeclaration(path, state) {
      if (path.node.specifiers.length === 0 && (0, _utils.isPolyfillSource)(path.node.source.value)) {
        this.importPolyfillIncluded = true;
        replaceWithPolyfillImports(path, state.opts.polyfills, state.opts.regenerator);
      }
    },

    Program(path, state) {
      path.get("body").forEach(bodyPath => {
        if ((0, _utils.isRequire)(t, bodyPath)) {
          replaceWithPolyfillImports(bodyPath, state.opts.polyfills, state.opts.regenerator);
        }
      });
    }

  };
  return {
    name: "transform-polyfill-require",
    visitor: isPolyfillImport,

    pre() {
      this.numPolyfillImports = 0;
      this.importPolyfillIncluded = false;
    },

    post() {
      const _this$opts = this.opts,
            debug = _this$opts.debug,
            onDebug = _this$opts.onDebug,
            polyfills = _this$opts.polyfills;

      if (debug) {
        (0, _debug.logEntryPolyfills)(this.importPolyfillIncluded, polyfills, this.file.opts.filename, onDebug);
      }
    }

  };
}