"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = generateCode;

function _convertSourceMap() {
  const data = _interopRequireDefault(require("convert-source-map"));

  _convertSourceMap = function _convertSourceMap() {
    return data;
  };

  return data;
}

function _generator() {
  const data = _interopRequireDefault(require("@babel/generator"));

  _generator = function _generator() {
    return data;
  };

  return data;
}

var _mergeMap = _interopRequireDefault(require("./merge-map"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generateCode(pluginPasses, file) {
  const opts = file.opts,
        ast = file.ast,
        shebang = file.shebang,
        code = file.code,
        inputMap = file.inputMap;
  const results = [];

  for (var _iterator = pluginPasses, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    const plugins = _ref;

    for (var _iterator2 = plugins, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref2;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref2 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref2 = _i2.value;
      }

      const plugin = _ref2;
      const generatorOverride = plugin.generatorOverride;

      if (generatorOverride) {
        const result = generatorOverride(ast, opts.generatorOpts, code, _generator().default);
        if (result !== undefined) results.push(result);
      }
    }
  }

  let result;

  if (results.length === 0) {
    result = (0, _generator().default)(ast, opts.generatorOpts, code);
  } else if (results.length === 1) {
    result = results[0];

    if (typeof result.then === "function") {
      throw new Error(`You appear to be using an async parser plugin, ` + `which your current version of Babel does not support. ` + `If you're using a published plugin, ` + `you may need to upgrade your @babel/core version.`);
    }
  } else {
    throw new Error("More than one plugin attempted to override codegen.");
  }

  let _result = result,
      outputCode = _result.code,
      outputMap = _result.map;

  if (shebang) {
    outputCode = `${shebang}\n${outputCode}`;
  }

  if (outputMap && inputMap) {
    outputMap = (0, _mergeMap.default)(inputMap.toObject(), outputMap);
  }

  if (opts.sourceMaps === "inline" || opts.sourceMaps === "both") {
    outputCode += "\n" + _convertSourceMap().default.fromObject(outputMap).toComment();
  }

  if (opts.sourceMaps === "inline") {
    outputMap = null;
  }

  return {
    outputCode,
    outputMap
  };
}