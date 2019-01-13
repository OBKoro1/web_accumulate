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

function _helperFunctionName() {
  const data = _interopRequireDefault(require("@babel/helper-function-name"));

  _helperFunctionName = function _helperFunctionName() {
    return data;
  };

  return data;
}

function _pluginSyntaxClassProperties() {
  const data = _interopRequireDefault(require("@babel/plugin-syntax-class-properties"));

  _pluginSyntaxClassProperties = function _pluginSyntaxClassProperties() {
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

function _helperReplaceSupers() {
  const data = require("@babel/helper-replace-supers");

  _helperReplaceSupers = function _helperReplaceSupers() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _helperPluginUtils().declare)((api, options) => {
  api.assertVersion(7);
  const loose = options.loose;

  const findBareSupers = _core().traverse.visitors.merge([{
    Super(path) {
      const node = path.node,
            parentPath = path.parentPath;

      if (parentPath.isCallExpression({
        callee: node
      })) {
        this.push(parentPath);
      }
    }

  }, _helperReplaceSupers().environmentVisitor]);

  const referenceVisitor = {
    "TSTypeAnnotation|TypeAnnotation"(path) {
      path.skip();
    },

    ReferencedIdentifier(path) {
      if (this.scope.hasOwnBinding(path.node.name)) {
        this.scope.rename(path.node.name);
        path.skip();
      }
    }

  };

  const classFieldDefinitionEvaluationTDZVisitor = _core().traverse.visitors.merge([{
    ReferencedIdentifier(path) {
      if (this.classRef === path.scope.getBinding(path.node.name)) {
        const classNameTDZError = this.file.addHelper("classNameTDZError");

        const throwNode = _core().types.callExpression(classNameTDZError, [_core().types.stringLiteral(path.node.name)]);

        path.replaceWith(_core().types.sequenceExpression([throwNode, path.node]));
        path.skip();
      }
    }

  }, _helperReplaceSupers().environmentVisitor]);

  const buildClassPropertySpec = (ref, {
    key,
    value,
    computed
  }, scope, state) => {
    return _core().types.expressionStatement(_core().types.callExpression(state.addHelper("defineProperty"), [ref, _core().types.isIdentifier(key) && !computed ? _core().types.stringLiteral(key.name) : key, value || scope.buildUndefinedNode()]));
  };

  const buildClassPropertyLoose = (ref, {
    key,
    value,
    computed
  }, scope) => {
    return _core().template.statement`MEMBER = VALUE`({
      MEMBER: _core().types.memberExpression(_core().types.cloneNode(ref), key, computed || _core().types.isLiteral(key)),
      VALUE: value || scope.buildUndefinedNode()
    });
  };

  const buildClassProperty = loose ? buildClassPropertyLoose : buildClassPropertySpec;
  return {
    inherits: _pluginSyntaxClassProperties().default,
    visitor: {
      Class(path, state) {
        const isDerived = !!path.node.superClass;
        let constructor;
        const props = [];
        const computedPaths = [];
        const body = path.get("body");

        for (var _iterator = body.get("body"), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
          var _ref;

          if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref = _iterator[_i++];
          } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref = _i.value;
          }

          const path = _ref;

          if (path.node.computed) {
            computedPaths.push(path);
          }

          if (path.isClassProperty()) {
            props.push(path);
          } else if (path.isClassMethod({
            kind: "constructor"
          })) {
            constructor = path;
          }
        }

        if (!props.length) return;
        let ref;

        if (path.isClassExpression() || !path.node.id) {
          (0, _helperFunctionName().default)(path);
          ref = path.scope.generateUidIdentifier("class");
        } else {
          ref = path.node.id;
        }

        const computedNodes = [];
        const staticNodes = [];
        const instanceBody = [];

        for (var _i2 = 0; _i2 < computedPaths.length; _i2++) {
          const computedPath = computedPaths[_i2];
          const computedNode = computedPath.node;

          if (!computedPath.get("key").isConstantExpression()) {
            computedPath.traverse(classFieldDefinitionEvaluationTDZVisitor, {
              classRef: path.scope.getBinding(ref.name),
              file: this.file
            });
            const ident = path.scope.generateUidIdentifierBasedOnNode(computedNode.key);
            computedNodes.push(_core().types.variableDeclaration("var", [_core().types.variableDeclarator(ident, computedNode.key)]));
            computedNode.key = _core().types.cloneNode(ident);
          }
        }

        for (var _i3 = 0; _i3 < props.length; _i3++) {
          const prop = props[_i3];
          const propNode = prop.node;
          if (propNode.decorators && propNode.decorators.length > 0) continue;

          if (propNode.static) {
            staticNodes.push(buildClassProperty(ref, propNode, path.scope, state));
          } else {
            instanceBody.push(buildClassProperty(_core().types.thisExpression(), propNode, path.scope, state));
          }
        }

        if (instanceBody.length) {
          if (!constructor) {
            const newConstructor = _core().types.classMethod("constructor", _core().types.identifier("constructor"), [], _core().types.blockStatement([]));

            if (isDerived) {
              newConstructor.params = [_core().types.restElement(_core().types.identifier("args"))];
              newConstructor.body.body.push(_core().types.returnStatement(_core().types.callExpression(_core().types.super(), [_core().types.spreadElement(_core().types.identifier("args"))])));
            }

            var _body$unshiftContaine = body.unshiftContainer("body", newConstructor);

            constructor = _body$unshiftContaine[0];
          }

          const state = {
            scope: constructor.scope
          };

          for (var _i4 = 0; _i4 < props.length; _i4++) {
            const prop = props[_i4];
            if (prop.node.static) continue;
            prop.traverse(referenceVisitor, state);
          }

          if (isDerived) {
            const bareSupers = [];
            constructor.traverse(findBareSupers, bareSupers);

            for (var _i5 = 0; _i5 < bareSupers.length; _i5++) {
              const bareSuper = bareSupers[_i5];
              bareSuper.insertAfter(instanceBody);
            }
          } else {
            constructor.get("body").unshiftContainer("body", instanceBody);
          }
        }

        for (var _i6 = 0; _i6 < props.length; _i6++) {
          const prop = props[_i6];
          prop.remove();
        }

        if (computedNodes.length === 0 && staticNodes.length === 0) return;

        if (path.isClassExpression()) {
          path.scope.push({
            id: ref
          });
          path.replaceWith(_core().types.assignmentExpression("=", _core().types.cloneNode(ref), path.node));
        } else if (!path.node.id) {
          path.node.id = ref;
        }

        path.insertBefore(computedNodes);
        path.insertAfter(staticNodes);
      }

    }
  };
});

exports.default = _default;