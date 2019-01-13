"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformFromAstSync;

var _config = _interopRequireDefault(require("./config"));

var _transformation = require("./transformation");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function transformFromAstSync(ast, code, opts) {
  const config = (0, _config.default)(opts);
  if (config === null) return null;
  if (!ast) throw new Error("No AST given");
  return (0, _transformation.runSync)(config, code, ast);
}