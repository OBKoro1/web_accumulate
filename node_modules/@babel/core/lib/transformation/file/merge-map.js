"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = mergeSourceMap;

function _sourceMap() {
  const data = _interopRequireDefault(require("source-map"));

  _sourceMap = function _sourceMap() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function mergeSourceMap(inputMap, map) {
  const input = buildMappingData(inputMap);
  const output = buildMappingData(map);
  const mergedGenerator = new (_sourceMap().default.SourceMapGenerator)();

  for (var _iterator = input.sources, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref2;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref2 = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref2 = _i.value;
    }

    const _ref = _ref2;
    const source = _ref.source;

    if (typeof source.content === "string") {
      mergedGenerator.setSourceContent(source.path, source.content);
    }
  }

  if (output.sources.length === 1) {
    const defaultSource = output.sources[0];
    const insertedMappings = new Map();
    eachInputGeneratedRange(input, (generated, original, source) => {
      eachOverlappingGeneratedOutputRange(defaultSource, generated, item => {
        const key = makeMappingKey(item);
        if (insertedMappings.has(key)) return;
        insertedMappings.set(key, item);
        mergedGenerator.addMapping({
          source: source.path,
          original: {
            line: original.line,
            column: original.columnStart
          },
          generated: {
            line: item.line,
            column: item.columnStart
          },
          name: original.name
        });
      });
    });

    for (var _iterator2 = insertedMappings.values(), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref3;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref3 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref3 = _i2.value;
      }

      const item = _ref3;

      if (item.columnEnd === Infinity) {
        continue;
      }

      const clearItem = {
        line: item.line,
        columnStart: item.columnEnd
      };
      const key = makeMappingKey(clearItem);

      if (insertedMappings.has(key)) {
        continue;
      }

      mergedGenerator.addMapping({
        generated: {
          line: clearItem.line,
          column: clearItem.columnStart
        }
      });
    }
  }

  const result = mergedGenerator.toJSON();

  if (typeof input.sourceRoot === "string") {
    result.sourceRoot = input.sourceRoot;
  }

  return result;
}

function makeMappingKey(item) {
  return JSON.stringify([item.line, item.columnStart]);
}

function eachOverlappingGeneratedOutputRange(outputFile, inputGeneratedRange, callback) {
  const overlappingOriginal = filterApplicableOriginalRanges(outputFile, inputGeneratedRange);

  for (var _iterator3 = overlappingOriginal, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
    var _ref5;

    if (_isArray3) {
      if (_i3 >= _iterator3.length) break;
      _ref5 = _iterator3[_i3++];
    } else {
      _i3 = _iterator3.next();
      if (_i3.done) break;
      _ref5 = _i3.value;
    }

    const _ref4 = _ref5;
    const generated = _ref4.generated;

    for (var _iterator4 = generated, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
      var _ref6;

      if (_isArray4) {
        if (_i4 >= _iterator4.length) break;
        _ref6 = _iterator4[_i4++];
      } else {
        _i4 = _iterator4.next();
        if (_i4.done) break;
        _ref6 = _i4.value;
      }

      const item = _ref6;
      callback(item);
    }
  }
}

function filterApplicableOriginalRanges({
  mappings
}, {
  line,
  columnStart,
  columnEnd
}) {
  return filterSortedArray(mappings, ({
    original: outOriginal
  }) => {
    if (line > outOriginal.line) return -1;
    if (line < outOriginal.line) return 1;
    if (columnStart >= outOriginal.columnEnd) return -1;
    if (columnEnd <= outOriginal.columnStart) return 1;
    return 0;
  });
}

function eachInputGeneratedRange(map, callback) {
  for (var _iterator5 = map.sources, _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
    var _ref8;

    if (_isArray5) {
      if (_i5 >= _iterator5.length) break;
      _ref8 = _iterator5[_i5++];
    } else {
      _i5 = _iterator5.next();
      if (_i5.done) break;
      _ref8 = _i5.value;
    }

    const _ref7 = _ref8;
    const source = _ref7.source,
          mappings = _ref7.mappings;

    for (var _iterator6 = mappings, _isArray6 = Array.isArray(_iterator6), _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();;) {
      var _ref10;

      if (_isArray6) {
        if (_i6 >= _iterator6.length) break;
        _ref10 = _iterator6[_i6++];
      } else {
        _i6 = _iterator6.next();
        if (_i6.done) break;
        _ref10 = _i6.value;
      }

      const _ref9 = _ref10;
      const original = _ref9.original,
            generated = _ref9.generated;

      for (var _iterator7 = generated, _isArray7 = Array.isArray(_iterator7), _i7 = 0, _iterator7 = _isArray7 ? _iterator7 : _iterator7[Symbol.iterator]();;) {
        var _ref11;

        if (_isArray7) {
          if (_i7 >= _iterator7.length) break;
          _ref11 = _iterator7[_i7++];
        } else {
          _i7 = _iterator7.next();
          if (_i7.done) break;
          _ref11 = _i7.value;
        }

        const item = _ref11;
        callback(item, original, source);
      }
    }
  }
}

function buildMappingData(map) {
  const consumer = new (_sourceMap().default.SourceMapConsumer)(Object.assign({}, map, {
    sourceRoot: null
  }));
  const sources = new Map();
  const mappings = new Map();
  let last = null;
  consumer.computeColumnSpans();
  consumer.eachMapping(m => {
    if (m.originalLine === null) return;
    let source = sources.get(m.source);

    if (!source) {
      source = {
        path: m.source,
        content: consumer.sourceContentFor(m.source, true)
      };
      sources.set(m.source, source);
    }

    let sourceData = mappings.get(source);

    if (!sourceData) {
      sourceData = {
        source,
        mappings: []
      };
      mappings.set(source, sourceData);
    }

    const obj = {
      line: m.originalLine,
      columnStart: m.originalColumn,
      columnEnd: Infinity,
      name: m.name
    };

    if (last && last.source === source && last.mapping.line === m.originalLine) {
      last.mapping.columnEnd = m.originalColumn;
    }

    last = {
      source,
      mapping: obj
    };
    sourceData.mappings.push({
      original: obj,
      generated: consumer.allGeneratedPositionsFor({
        source: m.source,
        line: m.originalLine,
        column: m.originalColumn
      }).map(item => ({
        line: item.line,
        columnStart: item.column,
        columnEnd: item.lastColumn + 1
      }))
    });
  }, null, _sourceMap().default.SourceMapConsumer.ORIGINAL_ORDER);
  return {
    file: map.file,
    sourceRoot: map.sourceRoot,
    sources: Array.from(mappings.values())
  };
}

function findInsertionLocation(array, callback) {
  let left = 0;
  let right = array.length;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    const item = array[mid];
    const result = callback(item);

    if (result === 0) {
      left = mid;
      break;
    }

    if (result >= 0) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }

  let i = left;

  if (i < array.length) {
    while (i > 0 && callback(array[i]) >= 0) {
      i--;
    }

    return i + 1;
  }

  return i;
}

function filterSortedArray(array, callback) {
  const start = findInsertionLocation(array, callback);
  const results = [];

  for (let i = start; i < array.length && callback(array[i]) === 0; i++) {
    results.push(array[i]);
  }

  return results;
}