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

function _pluginSyntaxDynamicImport() {
  const data = _interopRequireDefault(require("@babel/plugin-syntax-dynamic-import"));

  _pluginSyntaxDynamicImport = function _pluginSyntaxDynamicImport() {
    return data;
  };

  return data;
}

function _pluginSyntaxImportMeta() {
  const data = _interopRequireDefault(require("@babel/plugin-syntax-import-meta"));

  _pluginSyntaxImportMeta = function _pluginSyntaxImportMeta() {
    return data;
  };

  return data;
}

function _pluginProposalAsyncGeneratorFunctions() {
  const data = _interopRequireDefault(require("@babel/plugin-proposal-async-generator-functions"));

  _pluginProposalAsyncGeneratorFunctions = function _pluginProposalAsyncGeneratorFunctions() {
    return data;
  };

  return data;
}

function _pluginProposalClassProperties() {
  const data = _interopRequireDefault(require("@babel/plugin-proposal-class-properties"));

  _pluginProposalClassProperties = function _pluginProposalClassProperties() {
    return data;
  };

  return data;
}

function _pluginProposalObjectRestSpread() {
  const data = _interopRequireDefault(require("@babel/plugin-proposal-object-rest-spread"));

  _pluginProposalObjectRestSpread = function _pluginProposalObjectRestSpread() {
    return data;
  };

  return data;
}

function _pluginProposalOptionalCatchBinding() {
  const data = _interopRequireDefault(require("@babel/plugin-proposal-optional-catch-binding"));

  _pluginProposalOptionalCatchBinding = function _pluginProposalOptionalCatchBinding() {
    return data;
  };

  return data;
}

function _pluginProposalUnicodePropertyRegex() {
  const data = _interopRequireDefault(require("@babel/plugin-proposal-unicode-property-regex"));

  _pluginProposalUnicodePropertyRegex = function _pluginProposalUnicodePropertyRegex() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _helperPluginUtils().declare)((api, opts) => {
  api.assertVersion(7);
  let loose = false;
  let useBuiltIns = false;

  if (opts !== undefined) {
    if (opts.loose !== undefined) loose = opts.loose;
    if (opts.useBuiltIns !== undefined) useBuiltIns = opts.useBuiltIns;
  }

  if (typeof loose !== "boolean") {
    throw new Error("@babel/preset-stage-3 'loose' option must be a boolean.");
  }

  if (typeof useBuiltIns !== "boolean") {
    throw new Error("@babel/preset-stage-3 'useBuiltIns' option must be a boolean.");
  }

  return {
    plugins: [_pluginSyntaxDynamicImport().default, _pluginSyntaxImportMeta().default, _pluginProposalAsyncGeneratorFunctions().default, [_pluginProposalClassProperties().default, {
      loose
    }], [_pluginProposalObjectRestSpread().default, {
      loose,
      useBuiltIns
    }], _pluginProposalOptionalCatchBinding().default, _pluginProposalUnicodePropertyRegex().default]
  };
});

exports.default = _default;