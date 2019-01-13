"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rewriteLiveReferences;

function _assert() {
  const data = _interopRequireDefault(require("assert"));

  _assert = function _assert() {
    return data;
  };

  return data;
}

function t() {
  const data = _interopRequireWildcard(require("@babel/types"));

  t = function t() {
    return data;
  };

  return data;
}

function _template() {
  const data = _interopRequireDefault(require("@babel/template"));

  _template = function _template() {
    return data;
  };

  return data;
}

function _helperSimpleAccess() {
  const data = _interopRequireDefault(require("@babel/helper-simple-access"));

  _helperSimpleAccess = function _helperSimpleAccess() {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function rewriteLiveReferences(programPath, metadata) {
  const imported = new Map();
  const exported = new Map();

  const requeueInParent = path => {
    programPath.requeue(path);
  };

  for (var _iterator = metadata.source, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    const _ref3 = _ref,
          source = _ref3[0],
          data = _ref3[1];

    for (var _iterator3 = data.imports, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
      var _ref4;

      if (_isArray3) {
        if (_i3 >= _iterator3.length) break;
        _ref4 = _iterator3[_i3++];
      } else {
        _i3 = _iterator3.next();
        if (_i3.done) break;
        _ref4 = _i3.value;
      }

      const _ref6 = _ref4,
            localName = _ref6[0],
            importName = _ref6[1];
      imported.set(localName, [source, importName, null]);
    }

    for (var _iterator4 = data.importsNamespace, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
      var _ref5;

      if (_isArray4) {
        if (_i4 >= _iterator4.length) break;
        _ref5 = _iterator4[_i4++];
      } else {
        _i4 = _iterator4.next();
        if (_i4.done) break;
        _ref5 = _i4.value;
      }

      const localName = _ref5;
      imported.set(localName, [source, null, localName]);
    }
  }

  for (var _iterator2 = metadata.local, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
    var _ref2;

    if (_isArray2) {
      if (_i2 >= _iterator2.length) break;
      _ref2 = _iterator2[_i2++];
    } else {
      _i2 = _iterator2.next();
      if (_i2.done) break;
      _ref2 = _i2.value;
    }

    const _ref7 = _ref2,
          local = _ref7[0],
          data = _ref7[1];
    let exportMeta = exported.get(local);

    if (!exportMeta) {
      exportMeta = [];
      exported.set(local, exportMeta);
    }

    exportMeta.push(...data.names);
  }

  programPath.traverse(rewriteBindingInitVisitor, {
    metadata,
    requeueInParent,
    scope: programPath.scope,
    exported
  });
  (0, _helperSimpleAccess().default)(programPath, new Set([...Array.from(imported.keys()), ...Array.from(exported.keys())]));
  programPath.traverse(rewriteReferencesVisitor, {
    seen: new WeakSet(),
    metadata,
    requeueInParent,
    scope: programPath.scope,
    imported,
    exported,
    buildImportReference: ([source, importName, localName], identNode) => {
      const meta = metadata.source.get(source);

      if (localName) {
        if (meta.lazy) identNode = t().callExpression(identNode, []);
        return identNode;
      }

      let namespace = t().identifier(meta.name);
      if (meta.lazy) namespace = t().callExpression(namespace, []);
      return t().memberExpression(namespace, t().identifier(importName));
    }
  });
}

const rewriteBindingInitVisitor = {
  ClassProperty(path) {
    path.skip();
  },

  Function(path) {
    path.skip();
  },

  ClassDeclaration(path) {
    const requeueInParent = this.requeueInParent,
          exported = this.exported,
          metadata = this.metadata;
    const id = path.node.id;
    if (!id) throw new Error("Expected class to have a name");
    const localName = id.name;
    const exportNames = exported.get(localName) || [];

    if (exportNames.length > 0) {
      const statement = t().expressionStatement(buildBindingExportAssignmentExpression(metadata, exportNames, t().identifier(localName)));
      statement._blockHoist = path.node._blockHoist;
      requeueInParent(path.insertAfter(statement)[0]);
    }
  },

  VariableDeclaration(path) {
    const requeueInParent = this.requeueInParent,
          exported = this.exported,
          metadata = this.metadata;
    Object.keys(path.getOuterBindingIdentifiers()).forEach(localName => {
      const exportNames = exported.get(localName) || [];

      if (exportNames.length > 0) {
        const statement = t().expressionStatement(buildBindingExportAssignmentExpression(metadata, exportNames, t().identifier(localName)));
        statement._blockHoist = path.node._blockHoist;
        requeueInParent(path.insertAfter(statement)[0]);
      }
    });
  }

};

const buildBindingExportAssignmentExpression = (metadata, exportNames, localExpr) => {
  return (exportNames || []).reduce((expr, exportName) => {
    return t().assignmentExpression("=", t().memberExpression(t().identifier(metadata.exportName), t().identifier(exportName)), expr);
  }, localExpr);
};

const buildImportThrow = localName => {
  return _template().default.expression.ast`
    (function() {
      throw new Error('"' + '${localName}' + '" is read-only.');
    })()
  `;
};

const rewriteReferencesVisitor = {
  ReferencedIdentifier(path) {
    const seen = this.seen,
          buildImportReference = this.buildImportReference,
          scope = this.scope,
          imported = this.imported,
          requeueInParent = this.requeueInParent;
    if (seen.has(path.node)) return;
    seen.add(path.node);
    const localName = path.node.name;
    const localBinding = path.scope.getBinding(localName);
    const rootBinding = scope.getBinding(localName);
    if (rootBinding !== localBinding) return;
    const importData = imported.get(localName);

    if (importData) {
      const ref = buildImportReference(importData, path.node);
      ref.loc = path.node.loc;

      if (path.parentPath.isCallExpression({
        callee: path.node
      }) && t().isMemberExpression(ref)) {
        path.replaceWith(t().sequenceExpression([t().numericLiteral(0), ref]));
      } else if (path.isJSXIdentifier() && t().isMemberExpression(ref)) {
        const object = ref.object,
              property = ref.property;
        path.replaceWith(t().JSXMemberExpression(t().JSXIdentifier(object.name), t().JSXIdentifier(property.name)));
      } else {
        path.replaceWith(ref);
      }

      requeueInParent(path);
      path.skip();
    }
  },

  AssignmentExpression: {
    exit(path) {
      const scope = this.scope,
            seen = this.seen,
            imported = this.imported,
            exported = this.exported,
            requeueInParent = this.requeueInParent,
            buildImportReference = this.buildImportReference;
      if (seen.has(path.node)) return;
      seen.add(path.node);
      const left = path.get("left");

      if (left.isIdentifier()) {
        const localName = left.node.name;

        if (scope.getBinding(localName) !== path.scope.getBinding(localName)) {
          return;
        }

        const exportedNames = exported.get(localName) || [];
        const importData = imported.get(localName);

        if (exportedNames.length > 0 || importData) {
          (0, _assert().default)(path.node.operator === "=", "Path was not simplified");
          const assignment = path.node;

          if (importData) {
            assignment.left = buildImportReference(importData, assignment.left);
            assignment.right = t().sequenceExpression([assignment.right, buildImportThrow(localName)]);
          }

          path.replaceWith(buildBindingExportAssignmentExpression(this.metadata, exportedNames, assignment));
          requeueInParent(path);
        }
      } else if (left.isMemberExpression()) {} else {
        const ids = left.getOuterBindingIdentifiers();
        const id = Object.keys(ids).filter(localName => imported.has(localName)).pop();

        if (id) {
          path.node.right = t().sequenceExpression([path.node.right, buildImportThrow(id)]);
        }

        const items = [];
        Object.keys(ids).forEach(localName => {
          if (scope.getBinding(localName) !== path.scope.getBinding(localName)) {
            return;
          }

          const exportedNames = exported.get(localName) || [];

          if (exportedNames.length > 0) {
            items.push(buildBindingExportAssignmentExpression(this.metadata, exportedNames, t().identifier(localName)));
          }
        });

        if (items.length > 0) {
          let node = t().sequenceExpression(items);

          if (path.parentPath.isExpressionStatement()) {
            node = t().expressionStatement(node);
            node._blockHoist = path.parentPath.node._blockHoist;
          }

          const statement = path.insertAfter(node)[0];
          requeueInParent(statement);
        }
      }
    }

  }
};