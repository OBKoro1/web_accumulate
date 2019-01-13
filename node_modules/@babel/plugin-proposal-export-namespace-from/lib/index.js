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

function _pluginSyntaxExportNamespaceFrom() {
  const data = _interopRequireDefault(require("@babel/plugin-syntax-export-namespace-from"));

  _pluginSyntaxExportNamespaceFrom = function _pluginSyntaxExportNamespaceFrom() {
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
    inherits: _pluginSyntaxExportNamespaceFrom().default,
    visitor: {
      ExportNamedDeclaration(path) {
        const node = path.node,
              scope = path.scope;
        const specifiers = node.specifiers;
        const index = _core().types.isExportDefaultSpecifier(specifiers[0]) ? 1 : 0;
        if (!_core().types.isExportNamespaceSpecifier(specifiers[index])) return;
        const nodes = [];

        if (index === 1) {
          nodes.push(_core().types.exportNamedDeclaration(null, [specifiers.shift()], node.source));
        }

        const specifier = specifiers.shift();
        const exported = specifier.exported;
        const uid = scope.generateUidIdentifier(exported.name);
        nodes.push(_core().types.importDeclaration([_core().types.importNamespaceSpecifier(uid)], _core().types.cloneNode(node.source)), _core().types.exportNamedDeclaration(null, [_core().types.exportSpecifier(_core().types.cloneNode(uid), exported)]));

        if (node.specifiers.length >= 1) {
          nodes.push(node);
        }

        path.replaceWithMultiple(nodes);
      }

    }
  };
});

exports.default = _default;