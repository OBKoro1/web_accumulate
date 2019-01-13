"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = valueToNode;

function _isPlainObject() {
  const data = _interopRequireDefault(require("lodash/isPlainObject"));

  _isPlainObject = function _isPlainObject() {
    return data;
  };

  return data;
}

function _isRegExp() {
  const data = _interopRequireDefault(require("lodash/isRegExp"));

  _isRegExp = function _isRegExp() {
    return data;
  };

  return data;
}

var _isValidIdentifier = _interopRequireDefault(require("../validators/isValidIdentifier"));

var _generated = require("../builders/generated");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function valueToNode(value) {
  if (value === undefined) {
    return (0, _generated.identifier)("undefined");
  }

  if (value === true || value === false) {
    return (0, _generated.booleanLiteral)(value);
  }

  if (value === null) {
    return (0, _generated.nullLiteral)();
  }

  if (typeof value === "string") {
    return (0, _generated.stringLiteral)(value);
  }

  if (typeof value === "number") {
    return (0, _generated.numericLiteral)(value);
  }

  if ((0, _isRegExp().default)(value)) {
    const pattern = value.source;
    const flags = value.toString().match(/\/([a-z]+|)$/)[1];
    return (0, _generated.regExpLiteral)(pattern, flags);
  }

  if (Array.isArray(value)) {
    return (0, _generated.arrayExpression)(value.map(valueToNode));
  }

  if ((0, _isPlainObject().default)(value)) {
    const props = [];

    for (const key in value) {
      let nodeKey;

      if ((0, _isValidIdentifier.default)(key)) {
        nodeKey = (0, _generated.identifier)(key);
      } else {
        nodeKey = (0, _generated.stringLiteral)(key);
      }

      props.push((0, _generated.objectProperty)(nodeKey, valueToNode(value[key])));
    }

    return (0, _generated.objectExpression)(props);
  }

  throw new Error("don't know how to turn this value into a node");
}