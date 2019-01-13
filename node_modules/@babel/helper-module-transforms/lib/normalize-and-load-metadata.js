"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasExports = hasExports;
exports.isSideEffectImport = isSideEffectImport;
exports.default = normalizeModuleAndLoadMetadata;

function _path() {
  const data = require("path");

  _path = function _path() {
    return data;
  };

  return data;
}

function _helperSplitExportDeclaration() {
  const data = _interopRequireDefault(require("@babel/helper-split-export-declaration"));

  _helperSplitExportDeclaration = function _helperSplitExportDeclaration() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function hasExports(metadata) {
  const local = metadata.local,
        source = metadata.source;
  return local.size > 0 || Array.from(source).some(([, meta]) => {
    return meta.reexports.size > 0 || meta.reexportNamespace.size > 0 || !!meta.reexportAll;
  });
}

function isSideEffectImport(source) {
  return source.imports.size === 0 && source.importsNamespace.size === 0 && source.reexports.size === 0 && source.reexportNamespace.size === 0 && !source.reexportAll;
}

function normalizeModuleAndLoadMetadata(programPath, exportName, {
  noInterop = false,
  loose = false,
  lazy = false,
  esNamespaceOnly = false
} = {}) {
  if (!exportName) {
    exportName = programPath.scope.generateUidIdentifier("exports").name;
  }

  nameAnonymousExports(programPath);

  const _getModuleMetadata = getModuleMetadata(programPath, {
    loose,
    lazy
  }),
        local = _getModuleMetadata.local,
        source = _getModuleMetadata.source;

  removeModuleDeclarations(programPath);

  for (var _iterator = source, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
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
          metadata = _ref2[1];

    if (metadata.importsNamespace.size > 0) {
      metadata.name = metadata.importsNamespace.values().next().value;
    }

    if (noInterop) metadata.interop = "none";else if (esNamespaceOnly) {
      if (metadata.interop === "namespace") {
        metadata.interop = "default";
      }
    }
  }

  return {
    exportName,
    exportNameListName: null,
    local,
    source
  };
}

function getModuleMetadata(programPath, {
  loose,
  lazy
}) {
  const localData = getLocalExportMetadata(programPath, loose);
  const sourceData = new Map();

  const getData = sourceNode => {
    const source = sourceNode.value;
    let data = sourceData.get(source);

    if (!data) {
      data = {
        name: programPath.scope.generateUidIdentifier((0, _path().basename)(source, (0, _path().extname)(source))).name,
        interop: "none",
        loc: null,
        imports: new Map(),
        importsNamespace: new Set(),
        reexports: new Map(),
        reexportNamespace: new Set(),
        reexportAll: null,
        lazy: false
      };
      sourceData.set(source, data);
    }

    return data;
  };

  programPath.get("body").forEach(child => {
    if (child.isImportDeclaration()) {
      const data = getData(child.node.source);
      if (!data.loc) data.loc = child.node.loc;
      child.get("specifiers").forEach(spec => {
        if (spec.isImportDefaultSpecifier()) {
          const localName = spec.get("local").node.name;
          data.imports.set(localName, "default");
          const reexport = localData.get(localName);

          if (reexport) {
            localData.delete(localName);
            reexport.names.forEach(name => {
              data.reexports.set(name, "default");
            });
          }
        } else if (spec.isImportNamespaceSpecifier()) {
          const localName = spec.get("local").node.name;
          data.importsNamespace.add(localName);
          const reexport = localData.get(localName);

          if (reexport) {
            localData.delete(localName);
            reexport.names.forEach(name => {
              data.reexportNamespace.add(name);
            });
          }
        } else if (spec.isImportSpecifier()) {
          const importName = spec.get("imported").node.name;
          const localName = spec.get("local").node.name;
          data.imports.set(localName, importName);
          const reexport = localData.get(localName);

          if (reexport) {
            localData.delete(localName);
            reexport.names.forEach(name => {
              data.reexports.set(name, importName);
            });
          }
        }
      });
    } else if (child.isExportAllDeclaration()) {
      const data = getData(child.node.source);
      if (!data.loc) data.loc = child.node.loc;
      data.reexportAll = {
        loc: child.node.loc
      };
    } else if (child.isExportNamedDeclaration() && child.node.source) {
      const data = getData(child.node.source);
      if (!data.loc) data.loc = child.node.loc;
      child.get("specifiers").forEach(spec => {
        if (!spec.isExportSpecifier()) {
          throw spec.buildCodeFrameError("Unexpected export specifier type");
        }

        const importName = spec.get("local").node.name;
        const exportName = spec.get("exported").node.name;
        data.reexports.set(exportName, importName);

        if (exportName === "__esModule") {
          throw exportName.buildCodeFrameError('Illegal export "__esModule".');
        }
      });
    }
  });

  for (var _iterator2 = sourceData.values(), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
    var _ref3;

    if (_isArray2) {
      if (_i2 >= _iterator2.length) break;
      _ref3 = _iterator2[_i2++];
    } else {
      _i2 = _iterator2.next();
      if (_i2.done) break;
      _ref3 = _i2.value;
    }

    const metadata = _ref3;

    if (metadata.importsNamespace.size > 0) {
      metadata.interop = "namespace";
      continue;
    }

    let needsDefault = false;
    let needsNamed = false;

    for (var _iterator4 = metadata.imports.values(), _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
      var _ref5;

      if (_isArray4) {
        if (_i4 >= _iterator4.length) break;
        _ref5 = _iterator4[_i4++];
      } else {
        _i4 = _iterator4.next();
        if (_i4.done) break;
        _ref5 = _i4.value;
      }

      const importName = _ref5;
      if (importName === "default") needsDefault = true;else needsNamed = true;
    }

    for (var _iterator5 = metadata.reexports.values(), _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
      var _ref6;

      if (_isArray5) {
        if (_i5 >= _iterator5.length) break;
        _ref6 = _iterator5[_i5++];
      } else {
        _i5 = _iterator5.next();
        if (_i5.done) break;
        _ref6 = _i5.value;
      }

      const importName = _ref6;
      if (importName === "default") needsDefault = true;else needsNamed = true;
    }

    if (needsDefault && needsNamed) {
      metadata.interop = "namespace";
    } else if (needsDefault) {
      metadata.interop = "default";
    }
  }

  for (var _iterator3 = sourceData, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
    var _ref4;

    if (_isArray3) {
      if (_i3 >= _iterator3.length) break;
      _ref4 = _iterator3[_i3++];
    } else {
      _i3 = _iterator3.next();
      if (_i3.done) break;
      _ref4 = _i3.value;
    }

    const _ref7 = _ref4,
          source = _ref7[0],
          metadata = _ref7[1];

    if (lazy !== false && !(isSideEffectImport(metadata) || metadata.reexportAll)) {
      if (lazy === true) {
        metadata.lazy = !/\./.test(source);
      } else if (Array.isArray(lazy)) {
        metadata.lazy = lazy.indexOf(source);
      } else if (typeof lazy === "function") {
        metadata.lazy = lazy(source);
      } else {
        throw new Error(`.lazy must be a boolean, string array, or function`);
      }
    }
  }

  return {
    local: localData,
    source: sourceData
  };
}

function getLocalExportMetadata(programPath, loose) {
  const bindingKindLookup = new Map();
  programPath.get("body").forEach(child => {
    let kind;

    if (child.isImportDeclaration()) {
      kind = "import";
    } else {
      if (child.isExportDefaultDeclaration()) child = child.get("declaration");

      if (child.isExportNamedDeclaration()) {
        if (child.node.declaration) {
          child = child.get("declaration");
        } else if (loose && child.node.source && child.get("source").isStringLiteral()) {
          child.node.specifiers.forEach(specifier => {
            bindingKindLookup.set(specifier.local.name, "block");
          });
          return;
        }
      }

      if (child.isFunctionDeclaration()) {
        kind = "hoisted";
      } else if (child.isClassDeclaration()) {
        kind = "block";
      } else if (child.isVariableDeclaration({
        kind: "var"
      })) {
        kind = "var";
      } else if (child.isVariableDeclaration()) {
        kind = "block";
      } else {
        return;
      }
    }

    Object.keys(child.getOuterBindingIdentifiers()).forEach(name => {
      bindingKindLookup.set(name, kind);
    });
  });
  const localMetadata = new Map();

  const getLocalMetadata = idPath => {
    const localName = idPath.node.name;
    let metadata = localMetadata.get(localName);

    if (!metadata) {
      const kind = bindingKindLookup.get(localName);

      if (kind === undefined) {
        throw idPath.buildCodeFrameError(`Exporting local "${localName}", which is not declared.`);
      }

      metadata = {
        names: [],
        kind
      };
      localMetadata.set(localName, metadata);
    }

    return metadata;
  };

  programPath.get("body").forEach(child => {
    if (child.isExportNamedDeclaration() && (loose || !child.node.source)) {
      if (child.node.declaration) {
        const declaration = child.get("declaration");
        const ids = declaration.getOuterBindingIdentifierPaths();
        Object.keys(ids).forEach(name => {
          if (name === "__esModule") {
            throw declaration.buildCodeFrameError('Illegal export "__esModule".');
          }

          getLocalMetadata(ids[name]).names.push(name);
        });
      } else {
        child.get("specifiers").forEach(spec => {
          const local = spec.get("local");
          const exported = spec.get("exported");

          if (exported.node.name === "__esModule") {
            throw exported.buildCodeFrameError('Illegal export "__esModule".');
          }

          getLocalMetadata(local).names.push(exported.node.name);
        });
      }
    } else if (child.isExportDefaultDeclaration()) {
      const declaration = child.get("declaration");

      if (declaration.isFunctionDeclaration() || declaration.isClassDeclaration()) {
        getLocalMetadata(declaration.get("id")).names.push("default");
      } else {
        throw declaration.buildCodeFrameError("Unexpected default expression export.");
      }
    }
  });
  return localMetadata;
}

function nameAnonymousExports(programPath) {
  programPath.get("body").forEach(child => {
    if (!child.isExportDefaultDeclaration()) return;
    (0, _helperSplitExportDeclaration().default)(child);
  });
}

function removeModuleDeclarations(programPath) {
  programPath.get("body").forEach(child => {
    if (child.isImportDeclaration()) {
      child.remove();
    } else if (child.isExportNamedDeclaration()) {
      if (child.node.declaration) {
        child.node.declaration._blockHoist = child.node._blockHoist;
        child.replaceWith(child.node.declaration);
      } else {
        child.remove();
      }
    } else if (child.isExportDefaultDeclaration()) {
      const declaration = child.get("declaration");

      if (declaration.isFunctionDeclaration() || declaration.isClassDeclaration()) {
        declaration._blockHoist = child.node._blockHoist;
        child.replaceWith(declaration);
      } else {
        throw declaration.buildCodeFrameError("Unexpected default expression export.");
      }
    } else if (child.isExportAllDeclaration()) {
      child.remove();
    }
  });
}