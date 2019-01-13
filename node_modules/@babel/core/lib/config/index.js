"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadOptions = loadOptions;
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function get() {
    return _full.default;
  }
});
Object.defineProperty(exports, "loadPartialConfig", {
  enumerable: true,
  get: function get() {
    return _partial.loadPartialConfig;
  }
});
exports.OptionManager = void 0;

var _full = _interopRequireDefault(require("./full"));

var _partial = require("./partial");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loadOptions(opts) {
  const config = (0, _full.default)(opts);
  return config ? config.options : null;
}

class OptionManager {
  init(opts) {
    return loadOptions(opts);
  }

}

exports.OptionManager = OptionManager;