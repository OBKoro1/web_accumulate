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

function _pluginSyntaxThrowExpressions() {
  const data = _interopRequireDefault(require("@babel/plugin-syntax-throw-expressions"));

  _pluginSyntaxThrowExpressions = function _pluginSyntaxThrowExpressions() {
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _helperPluginUtils().declare)(api => {
  api.assertVersion(7);
  return {
    inherits: _pluginSyntaxThrowExpressions().default,
    visitor: {
      UnaryExpression(path) {
        const _path$node = path.node,
              operator = _path$node.operator,
              argument = _path$node.argument;
        if (operator !== "throw") return;

        const arrow = _core().types.functionExpression(null, [_core().types.identifier("e")], _core().types.blockStatement([_core().types.throwStatement(_core().types.identifier("e"))]));

        path.replaceWith(_core().types.callExpression(arrow, [argument]));
      }

    }
  };
});

exports.default = _default;