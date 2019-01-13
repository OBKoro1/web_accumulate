"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = normalizeOptions;

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function _path() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function normalizeOptions(config) {
  const _config$options = config.options,
        filename = _config$options.filename,
        cwd = _config$options.cwd,
        _config$options$filen = _config$options.filenameRelative,
        filenameRelative = _config$options$filen === void 0 ? typeof filename === "string" ? _path().default.relative(cwd, filename) : "unknown" : _config$options$filen,
        _config$options$sourc = _config$options.sourceType,
        sourceType = _config$options$sourc === void 0 ? "module" : _config$options$sourc,
        inputSourceMap = _config$options.inputSourceMap,
        _config$options$sourc2 = _config$options.sourceMaps,
        sourceMaps = _config$options$sourc2 === void 0 ? !!inputSourceMap : _config$options$sourc2,
        moduleRoot = _config$options.moduleRoot,
        _config$options$sourc3 = _config$options.sourceRoot,
        sourceRoot = _config$options$sourc3 === void 0 ? moduleRoot : _config$options$sourc3,
        _config$options$sourc4 = _config$options.sourceFileName,
        sourceFileName = _config$options$sourc4 === void 0 ? _path().default.basename(filenameRelative) : _config$options$sourc4,
        _config$options$comme = _config$options.comments,
        comments = _config$options$comme === void 0 ? true : _config$options$comme,
        _config$options$compa = _config$options.compact,
        compact = _config$options$compa === void 0 ? "auto" : _config$options$compa;
  const opts = config.options;
  const options = Object.assign({}, opts, {
    parserOpts: Object.assign({
      sourceType: _path().default.extname(filenameRelative) === ".mjs" ? "module" : sourceType,
      sourceFileName: filename,
      plugins: []
    }, opts.parserOpts),
    generatorOpts: Object.assign({
      filename,
      auxiliaryCommentBefore: opts.auxiliaryCommentBefore,
      auxiliaryCommentAfter: opts.auxiliaryCommentAfter,
      retainLines: opts.retainLines,
      comments,
      shouldPrintComment: opts.shouldPrintComment,
      compact,
      minified: opts.minified,
      sourceMaps,
      sourceRoot,
      sourceFileName
    }, opts.generatorOpts)
  });

  for (var _iterator = config.passes, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
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

      if (plugin.manipulateOptions) {
        plugin.manipulateOptions(options, options.parserOpts);
      }
    }
  }

  return options;
}