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

function _presetStage() {
  const data = _interopRequireDefault(require("@babel/preset-stage-3"));

  _presetStage = function _presetStage() {
    return data;
  };

  return data;
}

function _pluginProposalDecorators() {
  const data = _interopRequireDefault(require("@babel/plugin-proposal-decorators"));

  _pluginProposalDecorators = function _pluginProposalDecorators() {
    return data;
  };

  return data;
}

function _pluginProposalFunctionSent() {
  const data = _interopRequireDefault(require("@babel/plugin-proposal-function-sent"));

  _pluginProposalFunctionSent = function _pluginProposalFunctionSent() {
    return data;
  };

  return data;
}

function _pluginProposalExportNamespaceFrom() {
  const data = _interopRequireDefault(require("@babel/plugin-proposal-export-namespace-from"));

  _pluginProposalExportNamespaceFrom = function _pluginProposalExportNamespaceFrom() {
    return data;
  };

  return data;
}

function _pluginProposalNumericSeparator() {
  const data = _interopRequireDefault(require("@babel/plugin-proposal-numeric-separator"));

  _pluginProposalNumericSeparator = function _pluginProposalNumericSeparator() {
    return data;
  };

  return data;
}

function _pluginProposalThrowExpressions() {
  const data = _interopRequireDefault(require("@babel/plugin-proposal-throw-expressions"));

  _pluginProposalThrowExpressions = function _pluginProposalThrowExpressions() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _helperPluginUtils().declare)((api, opts = {}) => {
  api.assertVersion(7);
  const _opts$loose = opts.loose,
        loose = _opts$loose === void 0 ? false : _opts$loose,
        _opts$useBuiltIns = opts.useBuiltIns,
        useBuiltIns = _opts$useBuiltIns === void 0 ? false : _opts$useBuiltIns,
        _opts$decoratorsLegac = opts.decoratorsLegacy,
        decoratorsLegacy = _opts$decoratorsLegac === void 0 ? false : _opts$decoratorsLegac;

  if (typeof loose !== "boolean") {
    throw new Error("@babel/preset-stage-2 'loose' option must be a boolean.");
  }

  if (typeof useBuiltIns !== "boolean") {
    throw new Error("@babel/preset-stage-2 'useBuiltIns' option must be a boolean.");
  }

  if (typeof decoratorsLegacy !== "boolean") {
    throw new Error("@babel/preset-stage-2 'decoratorsLegacy' option must be a boolean.");
  }

  if (decoratorsLegacy !== true) {
    throw new Error("The new decorators proposal is not supported yet." + ' You must pass the `"decoratorsLegacy": true` option to' + " @babel/preset-stage-2");
  }

  return {
    presets: [[_presetStage().default, {
      loose,
      useBuiltIns
    }]],
    plugins: [[_pluginProposalDecorators().default, {
      legacy: decoratorsLegacy
    }], _pluginProposalFunctionSent().default, _pluginProposalExportNamespaceFrom().default, _pluginProposalNumericSeparator().default, _pluginProposalThrowExpressions().default]
  };
});

exports.default = _default;