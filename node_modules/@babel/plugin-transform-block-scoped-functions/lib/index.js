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

function _core() {
  const data = require("@babel/core");

  _core = function _core() {
    return data;
  };

  return data;
}

var _default = (0, _helperPluginUtils().declare)(api => {
  api.assertVersion(7);

  function statementList(key, path) {
    const paths = path.get(key);

    for (var _iterator = paths, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      const path = _ref;
      const func = path.node;
      if (!path.isFunctionDeclaration()) continue;

      const declar = _core().types.variableDeclaration("let", [_core().types.variableDeclarator(func.id, _core().types.toExpression(func))]);

      declar._blockHoist = 2;
      func.id = null;
      path.replaceWith(declar);
    }
  }

  return {
    visitor: {
      BlockStatement(path) {
        const node = path.node,
              parent = path.parent;

        if (_core().types.isFunction(parent, {
          body: node
        }) || _core().types.isExportDeclaration(parent)) {
          return;
        }

        statementList("body", path);
      },

      SwitchCase(path) {
        statementList("consequent", path);
      }

    }
  };
});

exports.default = _default;