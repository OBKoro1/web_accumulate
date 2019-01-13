"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "definitions", {
  enumerable: true,
  get: function get() {
    return _definitions.default;
  }
});
exports.default = void 0;

function _helperPluginUtils() {
  const data = require("@babel/helper-plugin-utils");

  _helperPluginUtils = function _helperPluginUtils() {
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

var _definitions = _interopRequireDefault(require("./definitions"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _helperPluginUtils().declare)((api, options) => {
  api.assertVersion(7);
  const helpers = options.helpers,
        _options$moduleName = options.moduleName,
        moduleName = _options$moduleName === void 0 ? "@babel/runtime" : _options$moduleName,
        polyfill = options.polyfill,
        regenerator = options.regenerator,
        useBuiltIns = options.useBuiltIns,
        useESModules = options.useESModules;
  const regeneratorEnabled = regenerator !== false;
  const notPolyfillOrDoesUseBuiltIns = polyfill === false || useBuiltIns;
  const isPolyfillAndUseBuiltIns = polyfill && useBuiltIns;
  const baseHelpersDir = useBuiltIns ? "helpers/builtin" : "helpers";
  const helpersDir = useESModules ? `${baseHelpersDir}/es6` : baseHelpersDir;

  function has(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  const HEADER_HELPERS = ["interopRequireWildcard", "interopRequireDefault"];
  return {
    pre(file) {
      if (helpers !== false) {
        file.set("helperGenerator", name => {
          const isInteropHelper = HEADER_HELPERS.indexOf(name) !== -1;
          const blockHoist = isInteropHelper && !(0, _helperModuleImports().isModule)(file.path) ? 4 : undefined;
          return this.addDefaultImport(`${moduleName}/${helpersDir}/${name}`, name, blockHoist);
        });
      }

      if (isPolyfillAndUseBuiltIns) {
        throw new Error("The polyfill option conflicts with useBuiltIns; use one or the other");
      }

      this.moduleName = moduleName;
      const cache = new Map();

      this.addDefaultImport = (source, nameHint, blockHoist) => {
        const cacheKey = (0, _helperModuleImports().isModule)(file.path);
        const key = `${source}:${nameHint}:${cacheKey || ""}`;
        let cached = cache.get(key);

        if (cached) {
          cached = _core().types.cloneNode(cached);
        } else {
          cached = (0, _helperModuleImports().addDefault)(file.path, source, {
            importedInterop: "uncompiled",
            nameHint,
            blockHoist
          });
          cache.set(key, cached);
        }

        return cached;
      };
    },

    visitor: {
      ReferencedIdentifier(path) {
        const node = path.node,
              parent = path.parent,
              scope = path.scope;

        if (node.name === "regeneratorRuntime" && regeneratorEnabled) {
          path.replaceWith(this.addDefaultImport(`${this.moduleName}/regenerator`, "regeneratorRuntime"));
          return;
        }

        if (notPolyfillOrDoesUseBuiltIns) return;
        if (_core().types.isMemberExpression(parent)) return;
        if (!has(_definitions.default.builtins, node.name)) return;
        if (scope.getBindingIdentifier(node.name)) return;
        path.replaceWith(this.addDefaultImport(`${moduleName}/core-js/${_definitions.default.builtins[node.name]}`, node.name));
      },

      CallExpression(path) {
        if (notPolyfillOrDoesUseBuiltIns) return;
        if (path.node.arguments.length) return;
        const callee = path.node.callee;
        if (!_core().types.isMemberExpression(callee)) return;
        if (!callee.computed) return;

        if (!path.get("callee.property").matchesPattern("Symbol.iterator")) {
          return;
        }

        path.replaceWith(_core().types.callExpression(this.addDefaultImport(`${moduleName}/core-js/get-iterator`, "getIterator"), [callee.object]));
      },

      BinaryExpression(path) {
        if (notPolyfillOrDoesUseBuiltIns) return;
        if (path.node.operator !== "in") return;
        if (!path.get("left").matchesPattern("Symbol.iterator")) return;
        path.replaceWith(_core().types.callExpression(this.addDefaultImport(`${moduleName}/core-js/is-iterable`, "isIterable"), [path.node.right]));
      },

      MemberExpression: {
        enter(path) {
          if (notPolyfillOrDoesUseBuiltIns) return;
          if (!path.isReferenced()) return;
          const node = path.node;
          const obj = node.object;
          const prop = node.property;
          if (!_core().types.isReferenced(obj, node)) return;
          if (node.computed) return;
          if (!has(_definitions.default.methods, obj.name)) return;
          const methods = _definitions.default.methods[obj.name];
          if (!has(methods, prop.name)) return;
          if (path.scope.getBindingIdentifier(obj.name)) return;

          if (obj.name === "Object" && prop.name === "defineProperty" && path.parentPath.isCallExpression()) {
            const call = path.parentPath.node;

            if (call.arguments.length === 3 && _core().types.isLiteral(call.arguments[1])) {
              return;
            }
          }

          path.replaceWith(this.addDefaultImport(`${moduleName}/core-js/${methods[prop.name]}`, `${obj.name}$${prop.name}`));
        },

        exit(path) {
          if (notPolyfillOrDoesUseBuiltIns) return;
          if (!path.isReferenced()) return;
          const node = path.node;
          const obj = node.object;
          if (!has(_definitions.default.builtins, obj.name)) return;
          if (path.scope.getBindingIdentifier(obj.name)) return;
          path.replaceWith(_core().types.memberExpression(this.addDefaultImport(`${moduleName}/core-js/${_definitions.default.builtins[obj.name]}`, obj.name), node.property, node.computed));
        }

      }
    }
  };
});

exports.default = _default;