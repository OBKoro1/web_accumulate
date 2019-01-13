"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _includes() {
  const data = _interopRequireDefault(require("lodash/includes"));

  _includes = function _includes() {
    return data;
  };

  return data;
}

function _repeat() {
  const data = _interopRequireDefault(require("lodash/repeat"));

  _repeat = function _repeat() {
    return data;
  };

  return data;
}

var _renamer = _interopRequireDefault(require("./lib/renamer"));

var _index = _interopRequireDefault(require("../index"));

function _defaults() {
  const data = _interopRequireDefault(require("lodash/defaults"));

  _defaults = function _defaults() {
    return data;
  };

  return data;
}

var _binding = _interopRequireDefault(require("./binding"));

function _globals() {
  const data = _interopRequireDefault(require("globals"));

  _globals = function _globals() {
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

var _cache = require("../cache");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function gatherNodeParts(node, parts) {
  if (t().isModuleDeclaration(node)) {
    if (node.source) {
      gatherNodeParts(node.source, parts);
    } else if (node.specifiers && node.specifiers.length) {
      var _arr = node.specifiers;

      for (var _i = 0; _i < _arr.length; _i++) {
        const specifier = _arr[_i];
        gatherNodeParts(specifier, parts);
      }
    } else if (node.declaration) {
      gatherNodeParts(node.declaration, parts);
    }
  } else if (t().isModuleSpecifier(node)) {
    gatherNodeParts(node.local, parts);
  } else if (t().isMemberExpression(node)) {
    gatherNodeParts(node.object, parts);
    gatherNodeParts(node.property, parts);
  } else if (t().isIdentifier(node)) {
    parts.push(node.name);
  } else if (t().isLiteral(node)) {
    parts.push(node.value);
  } else if (t().isCallExpression(node)) {
    gatherNodeParts(node.callee, parts);
  } else if (t().isObjectExpression(node) || t().isObjectPattern(node)) {
    var _arr2 = node.properties;

    for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
      const prop = _arr2[_i2];
      gatherNodeParts(prop.key || prop.argument, parts);
    }
  } else if (t().isPrivateName(node)) {
    gatherNodeParts(node.id, parts);
  } else if (t().isThisExpression(node)) {
    parts.push("this");
  } else if (t().isSuper(node)) {
    parts.push("super");
  }
}

const collectorVisitor = {
  For(path) {
    var _arr3 = t().FOR_INIT_KEYS;

    for (var _i3 = 0; _i3 < _arr3.length; _i3++) {
      const key = _arr3[_i3];
      const declar = path.get(key);

      if (declar.isVar()) {
        const parentScope = path.scope.getFunctionParent() || path.scope.getProgramParent();
        parentScope.registerBinding("var", declar);
      }
    }
  },

  Declaration(path) {
    if (path.isBlockScoped()) return;

    if (path.isExportDeclaration() && path.get("declaration").isDeclaration()) {
      return;
    }

    const parent = path.scope.getFunctionParent() || path.scope.getProgramParent();
    parent.registerDeclaration(path);
  },

  ReferencedIdentifier(path, state) {
    state.references.push(path);
  },

  ForXStatement(path, state) {
    const left = path.get("left");

    if (left.isPattern() || left.isIdentifier()) {
      state.constantViolations.push(path);
    }
  },

  ExportDeclaration: {
    exit(path) {
      const node = path.node,
            scope = path.scope;
      const declar = node.declaration;

      if (t().isClassDeclaration(declar) || t().isFunctionDeclaration(declar)) {
        const id = declar.id;
        if (!id) return;
        const binding = scope.getBinding(id.name);
        if (binding) binding.reference(path);
      } else if (t().isVariableDeclaration(declar)) {
        var _arr4 = declar.declarations;

        for (var _i4 = 0; _i4 < _arr4.length; _i4++) {
          const decl = _arr4[_i4];
          const ids = t().getBindingIdentifiers(decl);

          for (const name in ids) {
            const binding = scope.getBinding(name);
            if (binding) binding.reference(path);
          }
        }
      }
    }

  },

  LabeledStatement(path) {
    path.scope.getProgramParent().addGlobal(path.node);
    path.scope.getBlockParent().registerDeclaration(path);
  },

  AssignmentExpression(path, state) {
    state.assignments.push(path);
  },

  UpdateExpression(path, state) {
    state.constantViolations.push(path);
  },

  UnaryExpression(path, state) {
    if (path.node.operator === "delete") {
      state.constantViolations.push(path);
    }
  },

  BlockScoped(path) {
    let scope = path.scope;
    if (scope.path === path) scope = scope.parent;
    scope.getBlockParent().registerDeclaration(path);
  },

  ClassDeclaration(path) {
    const id = path.node.id;
    if (!id) return;
    const name = id.name;
    path.scope.bindings[name] = path.scope.getBinding(name);
  },

  Block(path) {
    const paths = path.get("body");
    var _arr5 = paths;

    for (var _i5 = 0; _i5 < _arr5.length; _i5++) {
      const bodyPath = _arr5[_i5];

      if (bodyPath.isFunctionDeclaration()) {
        path.scope.getBlockParent().registerDeclaration(bodyPath);
      }
    }
  }

};
let uid = 0;

class Scope {
  constructor(path) {
    const node = path.node;

    const cached = _cache.scope.get(node);

    if (cached && cached.path === path) {
      return cached;
    }

    _cache.scope.set(node, this);

    this.uid = uid++;
    this.block = node;
    this.path = path;
    this.labels = new Map();
  }

  get parent() {
    const parent = this.path.findParent(p => p.isScope());
    return parent && parent.scope;
  }

  get parentBlock() {
    return this.path.parent;
  }

  get hub() {
    return this.path.hub;
  }

  traverse(node, opts, state) {
    (0, _index.default)(node, opts, this, state, this.path);
  }

  generateDeclaredUidIdentifier(name) {
    const id = this.generateUidIdentifier(name);
    this.push({
      id
    });
    return t().cloneNode(id);
  }

  generateUidIdentifier(name) {
    return t().identifier(this.generateUid(name));
  }

  generateUid(name = "temp") {
    name = t().toIdentifier(name).replace(/^_+/, "").replace(/[0-9]+$/g, "");
    let uid;
    let i = 0;

    do {
      uid = this._generateUid(name, i);
      i++;
    } while (this.hasLabel(uid) || this.hasBinding(uid) || this.hasGlobal(uid) || this.hasReference(uid));

    const program = this.getProgramParent();
    program.references[uid] = true;
    program.uids[uid] = true;
    return uid;
  }

  _generateUid(name, i) {
    let id = name;
    if (i > 1) id += i;
    return `_${id}`;
  }

  generateUidBasedOnNode(parent, defaultName) {
    let node = parent;

    if (t().isAssignmentExpression(parent)) {
      node = parent.left;
    } else if (t().isVariableDeclarator(parent)) {
      node = parent.id;
    } else if (t().isObjectProperty(node) || t().isObjectMethod(node)) {
      node = node.key;
    }

    const parts = [];
    gatherNodeParts(node, parts);
    let id = parts.join("$");
    id = id.replace(/^_/, "") || defaultName || "ref";
    return this.generateUid(id.slice(0, 20));
  }

  generateUidIdentifierBasedOnNode(parent, defaultName) {
    return t().identifier(this.generateUidBasedOnNode(parent, defaultName));
  }

  isStatic(node) {
    if (t().isThisExpression(node) || t().isSuper(node)) {
      return true;
    }

    if (t().isIdentifier(node)) {
      const binding = this.getBinding(node.name);

      if (binding) {
        return binding.constant;
      } else {
        return this.hasBinding(node.name);
      }
    }

    return false;
  }

  maybeGenerateMemoised(node, dontPush) {
    if (this.isStatic(node)) {
      return null;
    } else {
      const id = this.generateUidIdentifierBasedOnNode(node);

      if (!dontPush) {
        this.push({
          id
        });
        return t().cloneNode(id);
      }

      return id;
    }
  }

  checkBlockScopedCollisions(local, kind, name, id) {
    if (kind === "param") return;
    if (local.kind === "local") return;
    if (kind === "hoisted" && local.kind === "let") return;
    const duplicate = kind === "let" || local.kind === "let" || local.kind === "const" || local.kind === "module" || local.kind === "param" && (kind === "let" || kind === "const");

    if (duplicate) {
      throw this.hub.file.buildCodeFrameError(id, `Duplicate declaration "${name}"`, TypeError);
    }
  }

  rename(oldName, newName, block) {
    const binding = this.getBinding(oldName);

    if (binding) {
      newName = newName || this.generateUidIdentifier(oldName).name;
      return new _renamer.default(binding, oldName, newName).rename(block);
    }
  }

  _renameFromMap(map, oldName, newName, value) {
    if (map[oldName]) {
      map[newName] = value;
      map[oldName] = null;
    }
  }

  dump() {
    const sep = (0, _repeat().default)("-", 60);
    console.log(sep);
    let scope = this;

    do {
      console.log("#", scope.block.type);

      for (const name in scope.bindings) {
        const binding = scope.bindings[name];
        console.log(" -", name, {
          constant: binding.constant,
          references: binding.references,
          violations: binding.constantViolations.length,
          kind: binding.kind
        });
      }
    } while (scope = scope.parent);

    console.log(sep);
  }

  toArray(node, i) {
    const file = this.hub.file;

    if (t().isIdentifier(node)) {
      const binding = this.getBinding(node.name);

      if (binding && binding.constant && binding.path.isGenericType("Array")) {
        return node;
      }
    }

    if (t().isArrayExpression(node)) {
      return node;
    }

    if (t().isIdentifier(node, {
      name: "arguments"
    })) {
      return t().callExpression(t().memberExpression(t().memberExpression(t().memberExpression(t().identifier("Array"), t().identifier("prototype")), t().identifier("slice")), t().identifier("call")), [node]);
    }

    let helperName;
    const args = [node];

    if (i === true) {
      helperName = "toConsumableArray";
    } else if (i) {
      args.push(t().numericLiteral(i));
      helperName = "slicedToArray";
    } else {
      helperName = "toArray";
    }

    return t().callExpression(file.addHelper(helperName), args);
  }

  hasLabel(name) {
    return !!this.getLabel(name);
  }

  getLabel(name) {
    return this.labels.get(name);
  }

  registerLabel(path) {
    this.labels.set(path.node.label.name, path);
  }

  registerDeclaration(path) {
    if (path.isFlow()) return;

    if (path.isLabeledStatement()) {
      this.registerLabel(path);
    } else if (path.isFunctionDeclaration()) {
      this.registerBinding("hoisted", path.get("id"), path);
    } else if (path.isVariableDeclaration()) {
      const declarations = path.get("declarations");
      var _arr6 = declarations;

      for (var _i6 = 0; _i6 < _arr6.length; _i6++) {
        const declar = _arr6[_i6];
        this.registerBinding(path.node.kind, declar);
      }
    } else if (path.isClassDeclaration()) {
      this.registerBinding("let", path);
    } else if (path.isImportDeclaration()) {
      const specifiers = path.get("specifiers");
      var _arr7 = specifiers;

      for (var _i7 = 0; _i7 < _arr7.length; _i7++) {
        const specifier = _arr7[_i7];
        this.registerBinding("module", specifier);
      }
    } else if (path.isExportDeclaration()) {
      const declar = path.get("declaration");

      if (declar.isClassDeclaration() || declar.isFunctionDeclaration() || declar.isVariableDeclaration()) {
        this.registerDeclaration(declar);
      }
    } else {
      this.registerBinding("unknown", path);
    }
  }

  buildUndefinedNode() {
    if (this.hasBinding("undefined")) {
      return t().unaryExpression("void", t().numericLiteral(0), true);
    } else {
      return t().identifier("undefined");
    }
  }

  registerConstantViolation(path) {
    const ids = path.getBindingIdentifiers();

    for (const name in ids) {
      const binding = this.getBinding(name);
      if (binding) binding.reassign(path);
    }
  }

  registerBinding(kind, path, bindingPath = path) {
    if (!kind) throw new ReferenceError("no `kind`");

    if (path.isVariableDeclaration()) {
      const declarators = path.get("declarations");

      for (var _iterator = declarators, _isArray = Array.isArray(_iterator), _i8 = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i8 >= _iterator.length) break;
          _ref = _iterator[_i8++];
        } else {
          _i8 = _iterator.next();
          if (_i8.done) break;
          _ref = _i8.value;
        }

        const declar = _ref;
        this.registerBinding(kind, declar);
      }

      return;
    }

    const parent = this.getProgramParent();
    const ids = path.getBindingIdentifiers(true);

    for (const name in ids) {
      var _arr8 = ids[name];

      for (var _i9 = 0; _i9 < _arr8.length; _i9++) {
        const id = _arr8[_i9];
        const local = this.getOwnBinding(name);

        if (local) {
          if (local.identifier === id) continue;
          this.checkBlockScopedCollisions(local, kind, name, id);
        }

        parent.references[name] = true;

        if (local) {
          this.registerConstantViolation(bindingPath);
        } else {
          this.bindings[name] = new _binding.default({
            identifier: id,
            scope: this,
            path: bindingPath,
            kind: kind
          });
        }
      }
    }
  }

  addGlobal(node) {
    this.globals[node.name] = node;
  }

  hasUid(name) {
    let scope = this;

    do {
      if (scope.uids[name]) return true;
    } while (scope = scope.parent);

    return false;
  }

  hasGlobal(name) {
    let scope = this;

    do {
      if (scope.globals[name]) return true;
    } while (scope = scope.parent);

    return false;
  }

  hasReference(name) {
    let scope = this;

    do {
      if (scope.references[name]) return true;
    } while (scope = scope.parent);

    return false;
  }

  isPure(node, constantsOnly) {
    if (t().isIdentifier(node)) {
      const binding = this.getBinding(node.name);
      if (!binding) return false;
      if (constantsOnly) return binding.constant;
      return true;
    } else if (t().isClass(node)) {
      if (node.superClass && !this.isPure(node.superClass, constantsOnly)) {
        return false;
      }

      return this.isPure(node.body, constantsOnly);
    } else if (t().isClassBody(node)) {
      for (var _iterator2 = node.body, _isArray2 = Array.isArray(_iterator2), _i10 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        var _ref2;

        if (_isArray2) {
          if (_i10 >= _iterator2.length) break;
          _ref2 = _iterator2[_i10++];
        } else {
          _i10 = _iterator2.next();
          if (_i10.done) break;
          _ref2 = _i10.value;
        }

        const method = _ref2;
        if (!this.isPure(method, constantsOnly)) return false;
      }

      return true;
    } else if (t().isBinary(node)) {
      return this.isPure(node.left, constantsOnly) && this.isPure(node.right, constantsOnly);
    } else if (t().isArrayExpression(node)) {
      var _arr9 = node.elements;

      for (var _i11 = 0; _i11 < _arr9.length; _i11++) {
        const elem = _arr9[_i11];
        if (!this.isPure(elem, constantsOnly)) return false;
      }

      return true;
    } else if (t().isObjectExpression(node)) {
      var _arr10 = node.properties;

      for (var _i12 = 0; _i12 < _arr10.length; _i12++) {
        const prop = _arr10[_i12];
        if (!this.isPure(prop, constantsOnly)) return false;
      }

      return true;
    } else if (t().isClassMethod(node)) {
      if (node.computed && !this.isPure(node.key, constantsOnly)) return false;
      if (node.kind === "get" || node.kind === "set") return false;
      return true;
    } else if (t().isProperty(node)) {
      if (node.computed && !this.isPure(node.key, constantsOnly)) return false;
      return this.isPure(node.value, constantsOnly);
    } else if (t().isUnaryExpression(node)) {
      return this.isPure(node.argument, constantsOnly);
    } else if (t().isTaggedTemplateExpression(node)) {
      return t().matchesPattern(node.tag, "String.raw") && !this.hasBinding("String", true) && this.isPure(node.quasi, constantsOnly);
    } else if (t().isTemplateLiteral(node)) {
      var _arr11 = node.expressions;

      for (var _i13 = 0; _i13 < _arr11.length; _i13++) {
        const expression = _arr11[_i13];
        if (!this.isPure(expression, constantsOnly)) return false;
      }

      return true;
    } else {
      return t().isPureish(node);
    }
  }

  setData(key, val) {
    return this.data[key] = val;
  }

  getData(key) {
    let scope = this;

    do {
      const data = scope.data[key];
      if (data != null) return data;
    } while (scope = scope.parent);
  }

  removeData(key) {
    let scope = this;

    do {
      const data = scope.data[key];
      if (data != null) scope.data[key] = null;
    } while (scope = scope.parent);
  }

  init() {
    if (!this.references) this.crawl();
  }

  crawl() {
    const path = this.path;
    this.references = Object.create(null);
    this.bindings = Object.create(null);
    this.globals = Object.create(null);
    this.uids = Object.create(null);
    this.data = Object.create(null);

    if (path.isLoop()) {
      var _arr12 = t().FOR_INIT_KEYS;

      for (var _i14 = 0; _i14 < _arr12.length; _i14++) {
        const key = _arr12[_i14];
        const node = path.get(key);
        if (node.isBlockScoped()) this.registerBinding(node.node.kind, node);
      }
    }

    if (path.isFunctionExpression() && path.has("id")) {
      if (!path.get("id").node[t().NOT_LOCAL_BINDING]) {
        this.registerBinding("local", path.get("id"), path);
      }
    }

    if (path.isClassExpression() && path.has("id")) {
      if (!path.get("id").node[t().NOT_LOCAL_BINDING]) {
        this.registerBinding("local", path);
      }
    }

    if (path.isFunction()) {
      const params = path.get("params");

      for (var _iterator3 = params, _isArray3 = Array.isArray(_iterator3), _i15 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
        var _ref3;

        if (_isArray3) {
          if (_i15 >= _iterator3.length) break;
          _ref3 = _iterator3[_i15++];
        } else {
          _i15 = _iterator3.next();
          if (_i15.done) break;
          _ref3 = _i15.value;
        }

        const param = _ref3;
        this.registerBinding("param", param);
      }
    }

    if (path.isCatchClause()) {
      this.registerBinding("let", path);
    }

    const parent = this.getProgramParent();
    if (parent.crawling) return;
    const state = {
      references: [],
      constantViolations: [],
      assignments: []
    };
    this.crawling = true;
    path.traverse(collectorVisitor, state);
    this.crawling = false;

    for (var _iterator4 = state.assignments, _isArray4 = Array.isArray(_iterator4), _i16 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
      var _ref4;

      if (_isArray4) {
        if (_i16 >= _iterator4.length) break;
        _ref4 = _iterator4[_i16++];
      } else {
        _i16 = _iterator4.next();
        if (_i16.done) break;
        _ref4 = _i16.value;
      }

      const path = _ref4;
      const ids = path.getBindingIdentifiers();
      let programParent;

      for (const name in ids) {
        if (path.scope.getBinding(name)) continue;
        programParent = programParent || path.scope.getProgramParent();
        programParent.addGlobal(ids[name]);
      }

      path.scope.registerConstantViolation(path);
    }

    for (var _iterator5 = state.references, _isArray5 = Array.isArray(_iterator5), _i17 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
      var _ref5;

      if (_isArray5) {
        if (_i17 >= _iterator5.length) break;
        _ref5 = _iterator5[_i17++];
      } else {
        _i17 = _iterator5.next();
        if (_i17.done) break;
        _ref5 = _i17.value;
      }

      const ref = _ref5;
      const binding = ref.scope.getBinding(ref.node.name);

      if (binding) {
        binding.reference(ref);
      } else {
        ref.scope.getProgramParent().addGlobal(ref.node);
      }
    }

    for (var _iterator6 = state.constantViolations, _isArray6 = Array.isArray(_iterator6), _i18 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();;) {
      var _ref6;

      if (_isArray6) {
        if (_i18 >= _iterator6.length) break;
        _ref6 = _iterator6[_i18++];
      } else {
        _i18 = _iterator6.next();
        if (_i18.done) break;
        _ref6 = _i18.value;
      }

      const path = _ref6;
      path.scope.registerConstantViolation(path);
    }
  }

  push(opts) {
    let path = this.path;

    if (!path.isBlockStatement() && !path.isProgram()) {
      path = this.getBlockParent().path;
    }

    if (path.isSwitchStatement()) {
      path = (this.getFunctionParent() || this.getProgramParent()).path;
    }

    if (path.isLoop() || path.isCatchClause() || path.isFunction()) {
      path.ensureBlock();
      path = path.get("body");
    }

    const unique = opts.unique;
    const kind = opts.kind || "var";
    const blockHoist = opts._blockHoist == null ? 2 : opts._blockHoist;
    const dataKey = `declaration:${kind}:${blockHoist}`;
    let declarPath = !unique && path.getData(dataKey);

    if (!declarPath) {
      const declar = t().variableDeclaration(kind, []);
      declar._blockHoist = blockHoist;

      var _path$unshiftContaine = path.unshiftContainer("body", [declar]);

      declarPath = _path$unshiftContaine[0];
      if (!unique) path.setData(dataKey, declarPath);
    }

    const declarator = t().variableDeclarator(opts.id, opts.init);
    declarPath.node.declarations.push(declarator);
    this.registerBinding(kind, declarPath.get("declarations").pop());
  }

  getProgramParent() {
    let scope = this;

    do {
      if (scope.path.isProgram()) {
        return scope;
      }
    } while (scope = scope.parent);

    throw new Error("Couldn't find a Program");
  }

  getFunctionParent() {
    let scope = this;

    do {
      if (scope.path.isFunctionParent()) {
        return scope;
      }
    } while (scope = scope.parent);

    return null;
  }

  getBlockParent() {
    let scope = this;

    do {
      if (scope.path.isBlockParent()) {
        return scope;
      }
    } while (scope = scope.parent);

    throw new Error("We couldn't find a BlockStatement, For, Switch, Function, Loop or Program...");
  }

  getAllBindings() {
    const ids = Object.create(null);
    let scope = this;

    do {
      (0, _defaults().default)(ids, scope.bindings);
      scope = scope.parent;
    } while (scope);

    return ids;
  }

  getAllBindingsOfKind() {
    const ids = Object.create(null);
    var _arr13 = arguments;

    for (var _i19 = 0; _i19 < _arr13.length; _i19++) {
      const kind = _arr13[_i19];
      let scope = this;

      do {
        for (const name in scope.bindings) {
          const binding = scope.bindings[name];
          if (binding.kind === kind) ids[name] = binding;
        }

        scope = scope.parent;
      } while (scope);
    }

    return ids;
  }

  bindingIdentifierEquals(name, node) {
    return this.getBindingIdentifier(name) === node;
  }

  getBinding(name) {
    let scope = this;

    do {
      const binding = scope.getOwnBinding(name);
      if (binding) return binding;
    } while (scope = scope.parent);
  }

  getOwnBinding(name) {
    return this.bindings[name];
  }

  getBindingIdentifier(name) {
    const info = this.getBinding(name);
    return info && info.identifier;
  }

  getOwnBindingIdentifier(name) {
    const binding = this.bindings[name];
    return binding && binding.identifier;
  }

  hasOwnBinding(name) {
    return !!this.getOwnBinding(name);
  }

  hasBinding(name, noGlobals) {
    if (!name) return false;
    if (this.hasOwnBinding(name)) return true;
    if (this.parentHasBinding(name, noGlobals)) return true;
    if (this.hasUid(name)) return true;
    if (!noGlobals && (0, _includes().default)(Scope.globals, name)) return true;
    if (!noGlobals && (0, _includes().default)(Scope.contextVariables, name)) return true;
    return false;
  }

  parentHasBinding(name, noGlobals) {
    return this.parent && this.parent.hasBinding(name, noGlobals);
  }

  moveBindingTo(name, scope) {
    const info = this.getBinding(name);

    if (info) {
      info.scope.removeOwnBinding(name);
      info.scope = scope;
      scope.bindings[name] = info;
    }
  }

  removeOwnBinding(name) {
    delete this.bindings[name];
  }

  removeBinding(name) {
    const info = this.getBinding(name);

    if (info) {
      info.scope.removeOwnBinding(name);
    }

    let scope = this;

    do {
      if (scope.uids[name]) {
        scope.uids[name] = false;
      }
    } while (scope = scope.parent);
  }

}

exports.default = Scope;
Scope.globals = Object.keys(_globals().default.builtin);
Scope.contextVariables = ["arguments", "undefined", "Infinity", "NaN"];