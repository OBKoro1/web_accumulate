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

function _helperHoistVariables() {
  const data = _interopRequireDefault(require("@babel/helper-hoist-variables"));

  _helperHoistVariables = function _helperHoistVariables() {
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

const buildTemplate = (0, _core().template)(`
  SYSTEM_REGISTER(MODULE_NAME, SOURCES, function (EXPORT_IDENTIFIER, CONTEXT_IDENTIFIER) {
    "use strict";
    BEFORE_BODY;
    return {
      setters: SETTERS,
      execute: function () {
        BODY;
      }
    };
  });
`);
const buildExportAll = (0, _core().template)(`
  for (var KEY in TARGET) {
    if (KEY !== "default" && KEY !== "__esModule") EXPORT_OBJ[KEY] = TARGET[KEY];
  }
`);
const TYPE_IMPORT = "Import";

var _default = (0, _helperPluginUtils().declare)((api, options) => {
  api.assertVersion(7);
  const _options$systemGlobal = options.systemGlobal,
        systemGlobal = _options$systemGlobal === void 0 ? "System" : _options$systemGlobal;
  const IGNORE_REASSIGNMENT_SYMBOL = Symbol();
  const reassignmentVisitor = {
    "AssignmentExpression|UpdateExpression"(path) {
      if (path.node[IGNORE_REASSIGNMENT_SYMBOL]) return;
      path.node[IGNORE_REASSIGNMENT_SYMBOL] = true;
      const arg = path.get(path.isAssignmentExpression() ? "left" : "argument");
      if (!arg.isIdentifier()) return;
      const name = arg.node.name;
      if (this.scope.getBinding(name) !== path.scope.getBinding(name)) return;
      const exportedNames = this.exports[name];
      if (!exportedNames) return;
      let node = path.node;
      const isPostUpdateExpression = path.isUpdateExpression({
        prefix: false
      });

      if (isPostUpdateExpression) {
        node = _core().types.binaryExpression(node.operator[0], _core().types.unaryExpression("+", _core().types.cloneNode(node.argument)), _core().types.numericLiteral(1));
      }

      for (var _iterator = exportedNames, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        const exportedName = _ref;
        node = this.buildCall(exportedName, node).expression;
      }

      if (isPostUpdateExpression) {
        node = _core().types.sequenceExpression([node, path.node]);
      }

      path.replaceWith(node);
    }

  };
  return {
    visitor: {
      CallExpression(path, state) {
        if (path.node.callee.type === TYPE_IMPORT) {
          path.replaceWith(_core().types.callExpression(_core().types.memberExpression(_core().types.identifier(state.contextIdent), _core().types.identifier("import")), path.node.arguments));
        }
      },

      ReferencedIdentifier(path, state) {
        if (path.node.name == "__moduleName" && !path.scope.hasBinding("__moduleName")) {
          path.replaceWith(_core().types.memberExpression(_core().types.identifier(state.contextIdent), _core().types.identifier("id")));
        }
      },

      Program: {
        enter(path, state) {
          state.contextIdent = path.scope.generateUid("context");
        },

        exit(path, state) {
          const exportIdent = path.scope.generateUid("export");
          const contextIdent = state.contextIdent;
          const exportNames = Object.create(null);
          const modules = [];
          let beforeBody = [];
          const setters = [];
          const sources = [];
          const variableIds = [];
          const removedPaths = [];

          function addExportName(key, val) {
            exportNames[key] = exportNames[key] || [];
            exportNames[key].push(val);
          }

          function pushModule(source, key, specifiers) {
            let module;
            modules.forEach(function (m) {
              if (m.key === source) {
                module = m;
              }
            });

            if (!module) {
              modules.push(module = {
                key: source,
                imports: [],
                exports: []
              });
            }

            module[key] = module[key].concat(specifiers);
          }

          function buildExportCall(name, val) {
            return _core().types.expressionStatement(_core().types.callExpression(_core().types.identifier(exportIdent), [_core().types.stringLiteral(name), val]));
          }

          const body = path.get("body");
          let canHoist = true;

          for (var _iterator2 = body, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
            var _ref2;

            if (_isArray2) {
              if (_i2 >= _iterator2.length) break;
              _ref2 = _iterator2[_i2++];
            } else {
              _i2 = _iterator2.next();
              if (_i2.done) break;
              _ref2 = _i2.value;
            }

            let path = _ref2;
            if (path.isExportDeclaration()) path = path.get("declaration");

            if (path.isVariableDeclaration() && path.node.kind !== "var") {
              canHoist = false;
              break;
            }
          }

          for (var _iterator3 = body, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
            var _ref3;

            if (_isArray3) {
              if (_i3 >= _iterator3.length) break;
              _ref3 = _iterator3[_i3++];
            } else {
              _i3 = _iterator3.next();
              if (_i3.done) break;
              _ref3 = _i3.value;
            }

            const path = _ref3;

            if (canHoist && path.isFunctionDeclaration()) {
              beforeBody.push(path.node);
              removedPaths.push(path);
            } else if (path.isImportDeclaration()) {
              const source = path.node.source.value;
              pushModule(source, "imports", path.node.specifiers);

              for (const name in path.getBindingIdentifiers()) {
                path.scope.removeBinding(name);
                variableIds.push(_core().types.identifier(name));
              }

              path.remove();
            } else if (path.isExportAllDeclaration()) {
              pushModule(path.node.source.value, "exports", path.node);
              path.remove();
            } else if (path.isExportDefaultDeclaration()) {
              const declar = path.get("declaration");

              if (declar.isClassDeclaration() || declar.isFunctionDeclaration()) {
                const id = declar.node.id;
                const nodes = [];

                if (id) {
                  nodes.push(declar.node);
                  nodes.push(buildExportCall("default", _core().types.cloneNode(id)));
                  addExportName(id.name, "default");
                } else {
                  nodes.push(buildExportCall("default", _core().types.toExpression(declar.node)));
                }

                if (!canHoist || declar.isClassDeclaration()) {
                  path.replaceWithMultiple(nodes);
                } else {
                  beforeBody = beforeBody.concat(nodes);
                  removedPaths.push(path);
                }
              } else {
                path.replaceWith(buildExportCall("default", declar.node));
              }
            } else if (path.isExportNamedDeclaration()) {
              const declar = path.get("declaration");

              if (declar.node) {
                path.replaceWith(declar);
                const nodes = [];
                let bindingIdentifiers;

                if (path.isFunction()) {
                  const node = declar.node;
                  const name = node.id.name;

                  if (canHoist) {
                    addExportName(name, name);
                    beforeBody.push(node);
                    beforeBody.push(buildExportCall(name, _core().types.cloneNode(node.id)));
                    removedPaths.push(path);
                  } else {
                    bindingIdentifiers = {
                      [name]: node.id
                    };
                  }
                } else {
                  bindingIdentifiers = declar.getBindingIdentifiers();
                }

                for (const name in bindingIdentifiers) {
                  addExportName(name, name);
                  nodes.push(buildExportCall(name, _core().types.identifier(name)));
                }

                path.insertAfter(nodes);
              } else {
                const specifiers = path.node.specifiers;

                if (specifiers && specifiers.length) {
                  if (path.node.source) {
                    pushModule(path.node.source.value, "exports", specifiers);
                    path.remove();
                  } else {
                    const nodes = [];

                    for (var _iterator6 = specifiers, _isArray6 = Array.isArray(_iterator6), _i7 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();;) {
                      var _ref6;

                      if (_isArray6) {
                        if (_i7 >= _iterator6.length) break;
                        _ref6 = _iterator6[_i7++];
                      } else {
                        _i7 = _iterator6.next();
                        if (_i7.done) break;
                        _ref6 = _i7.value;
                      }

                      const specifier = _ref6;
                      nodes.push(buildExportCall(specifier.exported.name, specifier.local));
                      addExportName(specifier.local.name, specifier.exported.name);
                    }

                    path.replaceWithMultiple(nodes);
                  }
                }
              }
            }
          }

          modules.forEach(function (specifiers) {
            const setterBody = [];
            const target = path.scope.generateUid(specifiers.key);

            for (var _iterator4 = specifiers.imports, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
              var _ref4;

              if (_isArray4) {
                if (_i4 >= _iterator4.length) break;
                _ref4 = _iterator4[_i4++];
              } else {
                _i4 = _iterator4.next();
                if (_i4.done) break;
                _ref4 = _i4.value;
              }

              let specifier = _ref4;

              if (_core().types.isImportNamespaceSpecifier(specifier)) {
                setterBody.push(_core().types.expressionStatement(_core().types.assignmentExpression("=", specifier.local, _core().types.identifier(target))));
              } else if (_core().types.isImportDefaultSpecifier(specifier)) {
                specifier = _core().types.importSpecifier(specifier.local, _core().types.identifier("default"));
              }

              if (_core().types.isImportSpecifier(specifier)) {
                setterBody.push(_core().types.expressionStatement(_core().types.assignmentExpression("=", specifier.local, _core().types.memberExpression(_core().types.identifier(target), specifier.imported))));
              }
            }

            if (specifiers.exports.length) {
              const exportObj = path.scope.generateUid("exportObj");
              setterBody.push(_core().types.variableDeclaration("var", [_core().types.variableDeclarator(_core().types.identifier(exportObj), _core().types.objectExpression([]))]));

              for (var _iterator5 = specifiers.exports, _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
                var _ref5;

                if (_isArray5) {
                  if (_i5 >= _iterator5.length) break;
                  _ref5 = _iterator5[_i5++];
                } else {
                  _i5 = _iterator5.next();
                  if (_i5.done) break;
                  _ref5 = _i5.value;
                }

                const node = _ref5;

                if (_core().types.isExportAllDeclaration(node)) {
                  setterBody.push(buildExportAll({
                    KEY: path.scope.generateUidIdentifier("key"),
                    EXPORT_OBJ: _core().types.identifier(exportObj),
                    TARGET: _core().types.identifier(target)
                  }));
                } else if (_core().types.isExportSpecifier(node)) {
                  setterBody.push(_core().types.expressionStatement(_core().types.assignmentExpression("=", _core().types.memberExpression(_core().types.identifier(exportObj), node.exported), _core().types.memberExpression(_core().types.identifier(target), node.local))));
                } else {}
              }

              setterBody.push(_core().types.expressionStatement(_core().types.callExpression(_core().types.identifier(exportIdent), [_core().types.identifier(exportObj)])));
            }

            sources.push(_core().types.stringLiteral(specifiers.key));
            setters.push(_core().types.functionExpression(null, [_core().types.identifier(target)], _core().types.blockStatement(setterBody)));
          });
          let moduleName = this.getModuleName();
          if (moduleName) moduleName = _core().types.stringLiteral(moduleName);

          if (canHoist) {
            (0, _helperHoistVariables().default)(path, id => variableIds.push(id));
          }

          if (variableIds.length) {
            beforeBody.unshift(_core().types.variableDeclaration("var", variableIds.map(id => _core().types.variableDeclarator(id))));
          }

          path.traverse(reassignmentVisitor, {
            exports: exportNames,
            buildCall: buildExportCall,
            scope: path.scope
          });

          for (var _i6 = 0; _i6 < removedPaths.length; _i6++) {
            const path = removedPaths[_i6];
            path.remove();
          }

          path.node.body = [buildTemplate({
            SYSTEM_REGISTER: _core().types.memberExpression(_core().types.identifier(systemGlobal), _core().types.identifier("register")),
            BEFORE_BODY: beforeBody,
            MODULE_NAME: moduleName,
            SETTERS: _core().types.arrayExpression(setters),
            SOURCES: _core().types.arrayExpression(sources),
            BODY: path.node.body,
            EXPORT_IDENTIFIER: _core().types.identifier(exportIdent),
            CONTEXT_IDENTIFIER: _core().types.identifier(contextIdent)
          })];
        }

      }
    }
  };
});

exports.default = _default;