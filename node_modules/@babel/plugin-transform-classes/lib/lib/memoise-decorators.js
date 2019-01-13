"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _core() {
  const data = require("@babel/core");

  _core = function _core() {
    return data;
  };

  return data;
}

function _default(decorators, scope) {
  for (var _iterator = decorators, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    const decorator = _ref;
    const expression = decorator.expression;
    if (!_core().types.isMemberExpression(expression)) continue;
    const temp = scope.maybeGenerateMemoised(expression.object);
    let ref;
    const nodes = [];

    if (temp) {
      ref = temp;
      nodes.push(_core().types.assignmentExpression("=", temp, expression.object));
    } else {
      ref = expression.object;
    }

    nodes.push(_core().types.callExpression(_core().types.memberExpression(_core().types.memberExpression(ref, expression.property, expression.computed), _core().types.identifier("bind")), [ref]));

    if (nodes.length === 1) {
      decorator.expression = nodes[0];
    } else {
      decorator.expression = _core().types.sequenceExpression(nodes);
    }
  }

  return decorators;
}