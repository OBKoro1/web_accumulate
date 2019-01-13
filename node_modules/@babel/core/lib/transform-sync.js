"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformSync;

var _config = _interopRequireDefault(require("./config"));

var _transformation = require("./transformation");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function transformSync(code, opts) {
  const config = (0, _config.default)(opts);
  if (config === null) return null;
  return (0, _transformation.runSync)(config, code);
}