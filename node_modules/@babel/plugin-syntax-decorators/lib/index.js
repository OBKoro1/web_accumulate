"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _helperPluginUtils() {
  const data = require("@babel/helper-plugin-utils");

  _helperPluginUtils = function _helperPluginUtils() {
    return data;
  };

  return data;
}

var _default = (0, _helperPluginUtils().declare)((api, options) => {
  api.assertVersion(7);
  const _options$legacy = options.legacy,
        legacy = _options$legacy === void 0 ? false : _options$legacy;

  if (typeof legacy !== "boolean") {
    throw new Error("'legacy' must be a boolean.");
  }

  return {
    manipulateOptions(opts, parserOpts) {
      parserOpts.plugins.push(legacy ? "decorators-legacy" : "decorators");
    }

  };
});

exports.default = _default;