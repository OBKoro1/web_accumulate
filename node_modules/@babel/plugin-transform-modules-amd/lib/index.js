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

function _helperModuleTransforms() {
  const data = require("@babel/helper-module-transforms");

  _helperModuleTransforms = function _helperModuleTransforms() {
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

const buildWrapper = (0, _core().template)(`
  define(MODULE_NAME, AMD_ARGUMENTS, function(IMPORT_NAMES) {
  })
`);

var _default = (0, _helperPluginUtils().declare)((api, options) => {
  api.assertVersion(7);
  const loose = options.loose,
        allowTopLevelThis = options.allowTopLevelThis,
        strict = options.strict,
        strictMode = options.strictMode,
        noInterop = options.noInterop;
  return {
    visitor: {
      Program: {
        exit(path) {
          if (!(0, _helperModuleTransforms().isModule)(path)) return;
          let moduleName = this.getModuleName();
          if (moduleName) moduleName = _core().types.stringLiteral(moduleName);

          const _rewriteModuleStateme = (0, _helperModuleTransforms().rewriteModuleStatementsAndPrepareHeader)(path, {
            loose,
            strict,
            strictMode,
            allowTopLevelThis,
            noInterop
          }),
                meta = _rewriteModuleStateme.meta,
                headers = _rewriteModuleStateme.headers;

          const amdArgs = [];
          const importNames = [];

          if ((0, _helperModuleTransforms().hasExports)(meta)) {
            amdArgs.push(_core().types.stringLiteral("exports"));
            importNames.push(_core().types.identifier(meta.exportName));
          }

          for (var _iterator = meta.source, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
            var _ref;

            if (_isArray) {
              if (_i >= _iterator.length) break;
              _ref = _iterator[_i++];
            } else {
              _i = _iterator.next();
              if (_i.done) break;
              _ref = _i.value;
            }

            const _ref2 = _ref,
                  source = _ref2[0],
                  metadata = _ref2[1];
            amdArgs.push(_core().types.stringLiteral(source));
            importNames.push(_core().types.identifier(metadata.name));

            if (!(0, _helperModuleTransforms().isSideEffectImport)(metadata)) {
              const interop = (0, _helperModuleTransforms().wrapInterop)(path, _core().types.identifier(metadata.name), metadata.interop);

              if (interop) {
                const header = _core().types.expressionStatement(_core().types.assignmentExpression("=", _core().types.identifier(metadata.name), interop));

                header.loc = metadata.loc;
                headers.push(header);
              }
            }

            headers.push(...(0, _helperModuleTransforms().buildNamespaceInitStatements)(meta, metadata, loose));
          }

          (0, _helperModuleTransforms().ensureStatementsHoisted)(headers);
          path.unshiftContainer("body", headers);
          const _path$node = path.node,
                body = _path$node.body,
                directives = _path$node.directives;
          path.node.directives = [];
          path.node.body = [];
          const amdWrapper = path.pushContainer("body", [buildWrapper({
            MODULE_NAME: moduleName,
            AMD_ARGUMENTS: _core().types.arrayExpression(amdArgs),
            IMPORT_NAMES: importNames
          })])[0];
          const amdFactory = amdWrapper.get("expression.arguments").filter(arg => arg.isFunctionExpression())[0].get("body");
          amdFactory.pushContainer("directives", directives);
          amdFactory.pushContainer("body", body);
        }

      }
    }
  };
});

exports.default = _default;