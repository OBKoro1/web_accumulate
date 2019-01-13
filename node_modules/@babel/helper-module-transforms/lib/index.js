"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rewriteModuleStatementsAndPrepareHeader = rewriteModuleStatementsAndPrepareHeader;
exports.ensureStatementsHoisted = ensureStatementsHoisted;
exports.wrapInterop = wrapInterop;
exports.buildNamespaceInitStatements = buildNamespaceInitStatements;
Object.defineProperty(exports, "isModule", {
  enumerable: true,
  get: function get() {
    return _helperModuleImports().isModule;
  }
});
Object.defineProperty(exports, "hasExports", {
  enumerable: true,
  get: function get() {
    return _normalizeAndLoadMetadata.hasExports;
  }
});
Object.defineProperty(exports, "isSideEffectImport", {
  enumerable: true,
  get: function get() {
    return _normalizeAndLoadMetadata.isSideEffectImport;
  }
});

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

function _chunk() {
  const data = _interopRequireDefault(require("lodash/chunk"));

  _chunk = function _chunk() {
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

var _rewriteThis = _interopRequireDefault(require("./rewrite-this"));

var _rewriteLiveReferences = _interopRequireDefault(require("./rewrite-live-references"));

var _normalizeAndLoadMetadata = _interopRequireWildcard(require("./normalize-and-load-metadata"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function rewriteModuleStatementsAndPrepareHeader(path, {
  exportName,
  strict,
  allowTopLevelThis,
  strictMode,
  loose,
  noInterop,
  lazy,
  esNamespaceOnly
}) {
  (0, _assert().default)((0, _helperModuleImports().isModule)(path), "Cannot process module statements in a script");
  path.node.sourceType = "script";
  const meta = (0, _normalizeAndLoadMetadata.default)(path, exportName, {
    noInterop,
    loose,
    lazy,
    esNamespaceOnly
  });

  if (!allowTopLevelThis) {
    (0, _rewriteThis.default)(path);
  }

  (0, _rewriteLiveReferences.default)(path, meta);

  if (strictMode !== false) {
    const hasStrict = path.node.directives.some(directive => {
      return directive.value.value === "use strict";
    });

    if (!hasStrict) {
      path.unshiftContainer("directives", t().directive(t().directiveLiteral("use strict")));
    }
  }

  const headers = [];

  if ((0, _normalizeAndLoadMetadata.hasExports)(meta) && !strict) {
    headers.push(buildESModuleHeader(meta, loose));
  }

  const nameList = buildExportNameListDeclaration(path, meta);

  if (nameList) {
    meta.exportNameListName = nameList.name;
    headers.push(nameList.statement);
  }

  headers.push(...buildExportInitializationStatements(path, meta, loose));
  return {
    meta,
    headers
  };
}

function ensureStatementsHoisted(statements) {
  statements.forEach(header => {
    header._blockHoist = 3;
  });
}

function wrapInterop(programPath, expr, type) {
  if (type === "none") {
    return null;
  }

  let helper;

  if (type === "default") {
    helper = "interopRequireDefault";
  } else if (type === "namespace") {
    helper = "interopRequireWildcard";
  } else {
    throw new Error(`Unknown interop: ${type}`);
  }

  return t().callExpression(programPath.hub.file.addHelper(helper), [expr]);
}

function buildNamespaceInitStatements(metadata, sourceMetadata, loose = false) {
  const statements = [];
  let srcNamespace = t().identifier(sourceMetadata.name);
  if (sourceMetadata.lazy) srcNamespace = t().callExpression(srcNamespace, []);

  for (var _iterator = sourceMetadata.importsNamespace, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    const localName = _ref;
    if (localName === sourceMetadata.name) continue;
    statements.push(_template().default.statement`var NAME = SOURCE;`({
      NAME: localName,
      SOURCE: t().cloneNode(srcNamespace)
    }));
  }

  if (loose) {
    statements.push(...buildReexportsFromMeta(metadata, sourceMetadata, loose));
  }

  for (var _iterator2 = sourceMetadata.reexportNamespace, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
    var _ref2;

    if (_isArray2) {
      if (_i2 >= _iterator2.length) break;
      _ref2 = _iterator2[_i2++];
    } else {
      _i2 = _iterator2.next();
      if (_i2.done) break;
      _ref2 = _i2.value;
    }

    const exportName = _ref2;
    statements.push((sourceMetadata.lazy ? _template().default.statement`
            Object.defineProperty(EXPORTS, "NAME", {
              enumerable: true,
              get: function() {
                return NAMESPACE;
              }
            });
          ` : _template().default.statement`EXPORTS.NAME = NAMESPACE;`)({
      EXPORTS: metadata.exportName,
      NAME: exportName,
      NAMESPACE: t().cloneNode(srcNamespace)
    }));
  }

  if (sourceMetadata.reexportAll) {
    const statement = buildNamespaceReexport(metadata, t().cloneNode(srcNamespace), loose);
    statement.loc = sourceMetadata.reexportAll.loc;
    statements.push(statement);
  }

  return statements;
}

const getTemplateForReexport = loose => {
  return loose ? _template().default.statement`EXPORTS.EXPORT_NAME = NAMESPACE.IMPORT_NAME;` : _template().default`
      Object.defineProperty(EXPORTS, "EXPORT_NAME", {
        enumerable: true,
        get: function() {
          return NAMESPACE.IMPORT_NAME;
        },
      });
    `;
};

const buildReexportsFromMeta = (meta, metadata, loose) => {
  const namespace = metadata.lazy ? t().callExpression(t().identifier(metadata.name), []) : t().identifier(metadata.name);
  const templateForCurrentMode = getTemplateForReexport(loose);
  return Array.from(metadata.reexports, ([exportName, importName]) => templateForCurrentMode({
    EXPORTS: meta.exportName,
    EXPORT_NAME: exportName,
    NAMESPACE: t().cloneNode(namespace),
    IMPORT_NAME: importName
  }));
};

function buildESModuleHeader(metadata, enumerable = false) {
  return (enumerable ? _template().default.statement`
        EXPORTS.__esModule = true;
      ` : _template().default.statement`
        Object.defineProperty(EXPORTS, "__esModule", {
          value: true,
        });
      `)({
    EXPORTS: metadata.exportName
  });
}

function buildNamespaceReexport(metadata, namespace, loose) {
  return (loose ? _template().default.statement`
        Object.keys(NAMESPACE).forEach(function(key) {
          if (key === "default" || key === "__esModule") return;
          VERIFY_NAME_LIST;

          EXPORTS[key] = NAMESPACE[key];
        });
      ` : _template().default.statement`
        Object.keys(NAMESPACE).forEach(function(key) {
          if (key === "default" || key === "__esModule") return;
          VERIFY_NAME_LIST;

          Object.defineProperty(EXPORTS, key, {
            enumerable: true,
            get: function() {
              return NAMESPACE[key];
            },
          });
        });
    `)({
    NAMESPACE: namespace,
    EXPORTS: metadata.exportName,
    VERIFY_NAME_LIST: metadata.exportNameListName ? _template().default`
            if (Object.prototype.hasOwnProperty.call(EXPORTS_LIST, key)) return;
          `({
      EXPORTS_LIST: metadata.exportNameListName
    }) : null
  });
}

function buildExportNameListDeclaration(programPath, metadata) {
  const exportedVars = Object.create(null);

  for (var _iterator3 = metadata.local.values(), _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
    var _ref3;

    if (_isArray3) {
      if (_i3 >= _iterator3.length) break;
      _ref3 = _iterator3[_i3++];
    } else {
      _i3 = _iterator3.next();
      if (_i3.done) break;
      _ref3 = _i3.value;
    }

    const data = _ref3;

    for (var _iterator5 = data.names, _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
      var _ref5;

      if (_isArray5) {
        if (_i5 >= _iterator5.length) break;
        _ref5 = _iterator5[_i5++];
      } else {
        _i5 = _iterator5.next();
        if (_i5.done) break;
        _ref5 = _i5.value;
      }

      const name = _ref5;
      exportedVars[name] = true;
    }
  }

  let hasReexport = false;

  for (var _iterator4 = metadata.source.values(), _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
    var _ref4;

    if (_isArray4) {
      if (_i4 >= _iterator4.length) break;
      _ref4 = _iterator4[_i4++];
    } else {
      _i4 = _iterator4.next();
      if (_i4.done) break;
      _ref4 = _i4.value;
    }

    const data = _ref4;

    for (var _iterator6 = data.reexports.keys(), _isArray6 = Array.isArray(_iterator6), _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();;) {
      var _ref6;

      if (_isArray6) {
        if (_i6 >= _iterator6.length) break;
        _ref6 = _iterator6[_i6++];
      } else {
        _i6 = _iterator6.next();
        if (_i6.done) break;
        _ref6 = _i6.value;
      }

      const exportName = _ref6;
      exportedVars[exportName] = true;
    }

    for (var _iterator7 = data.reexportNamespace, _isArray7 = Array.isArray(_iterator7), _i7 = 0, _iterator7 = _isArray7 ? _iterator7 : _iterator7[Symbol.iterator]();;) {
      var _ref7;

      if (_isArray7) {
        if (_i7 >= _iterator7.length) break;
        _ref7 = _iterator7[_i7++];
      } else {
        _i7 = _iterator7.next();
        if (_i7.done) break;
        _ref7 = _i7.value;
      }

      const exportName = _ref7;
      exportedVars[exportName] = true;
    }

    hasReexport = hasReexport || data.reexportAll;
  }

  if (!hasReexport || Object.keys(exportedVars).length === 0) return null;
  const name = programPath.scope.generateUidIdentifier("exportNames");
  delete exportedVars.default;
  return {
    name: name.name,
    statement: t().variableDeclaration("var", [t().variableDeclarator(name, t().valueToNode(exportedVars))])
  };
}

function buildExportInitializationStatements(programPath, metadata, loose = false) {
  const initStatements = [];
  const exportNames = [];

  for (var _iterator8 = metadata.local, _isArray8 = Array.isArray(_iterator8), _i8 = 0, _iterator8 = _isArray8 ? _iterator8 : _iterator8[Symbol.iterator]();;) {
    var _ref8;

    if (_isArray8) {
      if (_i8 >= _iterator8.length) break;
      _ref8 = _iterator8[_i8++];
    } else {
      _i8 = _iterator8.next();
      if (_i8.done) break;
      _ref8 = _i8.value;
    }

    const _ref10 = _ref8,
          localName = _ref10[0],
          data = _ref10[1];

    if (data.kind === "import") {} else if (data.kind === "hoisted") {
      initStatements.push(buildInitStatement(metadata, data.names, t().identifier(localName)));
    } else {
      exportNames.push(...data.names);
    }
  }

  for (var _iterator9 = metadata.source.values(), _isArray9 = Array.isArray(_iterator9), _i9 = 0, _iterator9 = _isArray9 ? _iterator9 : _iterator9[Symbol.iterator]();;) {
    var _ref9;

    if (_isArray9) {
      if (_i9 >= _iterator9.length) break;
      _ref9 = _iterator9[_i9++];
    } else {
      _i9 = _iterator9.next();
      if (_i9.done) break;
      _ref9 = _i9.value;
    }

    const data = _ref9;

    if (!loose) {
      initStatements.push(...buildReexportsFromMeta(metadata, data, loose));
    }

    for (var _iterator10 = data.reexportNamespace, _isArray10 = Array.isArray(_iterator10), _i10 = 0, _iterator10 = _isArray10 ? _iterator10 : _iterator10[Symbol.iterator]();;) {
      var _ref11;

      if (_isArray10) {
        if (_i10 >= _iterator10.length) break;
        _ref11 = _iterator10[_i10++];
      } else {
        _i10 = _iterator10.next();
        if (_i10.done) break;
        _ref11 = _i10.value;
      }

      const exportName = _ref11;
      exportNames.push(exportName);
    }
  }

  initStatements.push(...(0, _chunk().default)(exportNames, 100).map(members => {
    return buildInitStatement(metadata, members, programPath.scope.buildUndefinedNode());
  }));
  return initStatements;
}

function buildInitStatement(metadata, exportNames, initExpr) {
  return t().expressionStatement(exportNames.reduce((acc, exportName) => _template().default.expression`EXPORTS.NAME = VALUE`({
    EXPORTS: metadata.exportName,
    NAME: exportName,
    VALUE: acc
  }), initExpr));
}