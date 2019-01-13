"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeOptions = mergeOptions;

function mergeOptions(target, source) {
  var _arr = Object.keys(source);

  for (var _i = 0; _i < _arr.length; _i++) {
    const k = _arr[_i];

    if (k === "parserOpts" && source.parserOpts) {
      const parserOpts = source.parserOpts;
      const targetObj = target.parserOpts = target.parserOpts || {};
      mergeDefaultFields(targetObj, parserOpts);
    } else if (k === "generatorOpts" && source.generatorOpts) {
      const generatorOpts = source.generatorOpts;
      const targetObj = target.generatorOpts = target.generatorOpts || {};
      mergeDefaultFields(targetObj, generatorOpts);
    } else {
      const val = source[k];
      if (val !== undefined) target[k] = val;
    }
  }
}

function mergeDefaultFields(target, source) {
  var _arr2 = Object.keys(source);

  for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
    const k = _arr2[_i2];
    const val = source[k];
    if (val !== undefined) target[k] = val;
  }
}