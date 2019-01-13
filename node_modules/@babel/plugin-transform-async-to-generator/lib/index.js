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

function _helperRemapAsyncToGenerator() {
  const data = _interopRequireDefault(require("@babel/helper-remap-async-to-generator"));

  _helperRemapAsyncToGenerator = function _helperRemapAsyncToGenerator() {
    return data;
  };

  return data;
}

function _helperModuleImports() {
  const data = require("@babel/helper-module-imports");

  _helperModuleImports = function _helperModuleImports() {
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

var _default = (0, _helperPluginUtils().declare)((api, options) => {
  api.assertVersion(7);
  const method = options.method,
        module = options.module;

  if (method && module) {
    return {
      visitor: {
        Function(path, state) {
          if (!path.node.async || path.node.generator) return;
          let wrapAsync = state.methodWrapper;

          if (wrapAsync) {
            wrapAsync = _core().types.cloneNode(wrapAsync);
          } else {
            wrapAsync = state.methodWrapper = (0, _helperModuleImports().addNamed)(path, method, module);
          }

          (0, _helperRemapAsyncToGenerator().default)(path, {
            wrapAsync
          });
        }

      }
    };
  }

  return {
    visitor: {
      Function(path, state) {
        if (!path.node.async || path.node.generator) return;
        (0, _helperRemapAsyncToGenerator().default)(path, {
          wrapAsync: state.addHelper("asyncToGenerator")
        });
      }

    }
  };
});

exports.default = _default;