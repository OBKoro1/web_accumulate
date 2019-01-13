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

function _pluginSyntaxDecorators() {
  const data = _interopRequireDefault(require("@babel/plugin-syntax-decorators"));

  _pluginSyntaxDecorators = function _pluginSyntaxDecorators() {
    return data;
  };

  return data;
}

var _transformer = _interopRequireDefault(require("./transformer"));

var _transformerLegacy = _interopRequireDefault(require("./transformer-legacy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _helperPluginUtils().declare)((api, options) => {
  api.assertVersion(7);
  const _options$legacy = options.legacy,
        legacy = _options$legacy === void 0 ? false : _options$legacy;

  if (typeof legacy !== "boolean") {
    throw new Error("'legacy' must be a boolean.");
  }

  if (legacy !== true) {
    throw new Error("The new decorators proposal is not supported yet." + ' You must pass the `"legacy": true` option to' + " @babel/plugin-proposal-decorators");
  }

  return {
    inherits: _pluginSyntaxDecorators().default,
    visitor: legacy ? _transformerLegacy.default : _transformer.default
  };
});

exports.default = _default;