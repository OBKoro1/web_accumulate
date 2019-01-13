"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.environmentVisitor = void 0;

function _traverse() {
  const data = _interopRequireDefault(require("@babel/traverse"));

  _traverse = function _traverse() {
    return data;
  };

  return data;
}

function _helperMemberExpressionToFunctions() {
  const data = _interopRequireDefault(require("@babel/helper-member-expression-to-functions"));

  _helperMemberExpressionToFunctions = function _helperMemberExpressionToFunctions() {
    return data;
  };

  return data;
}

function _helperOptimiseCallExpression() {
  const data = _interopRequireDefault(require("@babel/helper-optimise-call-expression"));

  _helperOptimiseCallExpression = function _helperOptimiseCallExpression() {
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

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getPrototypeOfExpression(objectRef, isStatic, file) {
  objectRef = t().cloneNode(objectRef);
  const targetRef = isStatic ? objectRef : t().memberExpression(objectRef, t().identifier("prototype"));
  return t().callExpression(file.addHelper("getPrototypeOf"), [targetRef]);
}

function skipAllButComputedKey(path) {
  if (!path.node.computed) {
    path.skip();
    return;
  }

  const keys = t().VISITOR_KEYS[path.type];

  for (var _iterator = keys, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    const key = _ref;
    if (key !== "key") path.skipKey(key);
  }
}

const environmentVisitor = {
  Function(path) {
    if (path.isMethod()) return;
    if (path.isArrowFunctionExpression()) return;
    path.skip();
  },

  Method(path) {
    skipAllButComputedKey(path);
  },

  "ClassProperty|ClassPrivateProperty"(path) {
    if (path.node.static) return;
    skipAllButComputedKey(path);
  }

};
exports.environmentVisitor = environmentVisitor;

const visitor = _traverse().default.visitors.merge([environmentVisitor, {
  Super(path, state) {
    const node = path.node,
          parentPath = path.parentPath;
    if (!parentPath.isMemberExpression({
      object: node
    })) return;
    state.handle(parentPath);
  }

}]);

const memoized = new WeakMap();
const specHandlers = {
  memoize(superMember) {
    const scope = superMember.scope,
          node = superMember.node;
    const computed = node.computed,
          property = node.property;

    if (!computed) {
      return;
    }

    const memo = scope.maybeGenerateMemoised(property);

    if (!memo) {
      return;
    }

    memoized.set(property, memo);
  },

  get(superMember) {
    const _superMember$node = superMember.node,
          computed = _superMember$node.computed,
          property = _superMember$node.property;
    const thisExpr = t().thisExpression();
    let prop;

    if (computed && memoized.has(property)) {
      prop = t().cloneNode(memoized.get(property));
    } else {
      prop = computed ? property : t().stringLiteral(property.name);
    }

    return t().callExpression(this.file.addHelper("get"), [getPrototypeOfExpression(this.getObjectRef(), this.isStatic, this.file), prop, thisExpr]);
  },

  set(superMember, value) {
    const _superMember$node2 = superMember.node,
          computed = _superMember$node2.computed,
          property = _superMember$node2.property;
    let prop;

    if (computed && memoized.has(property)) {
      prop = t().assignmentExpression("=", t().cloneNode(memoized.get(property)), property);
    } else {
      prop = computed ? property : t().stringLiteral(property.name);
    }

    return t().callExpression(this.file.addHelper("set"), [getPrototypeOfExpression(this.getObjectRef(), this.isStatic, this.file), prop, value, t().thisExpression(), t().booleanLiteral(superMember.isInStrictMode())]);
  },

  call(superMember, args) {
    return (0, _helperOptimiseCallExpression().default)(this.get(superMember), t().thisExpression(), args);
  }

};
const looseHandlers = {
  memoize: specHandlers.memoize,
  call: specHandlers.call,

  get(superMember) {
    const isStatic = this.isStatic,
          superRef = this.superRef;
    const _superMember$node3 = superMember.node,
          property = _superMember$node3.property,
          computed = _superMember$node3.computed;
    let object;

    if (isStatic) {
      object = superRef ? t().cloneNode(superRef) : t().memberExpression(t().identifier("Function"), t().identifier("prototype"));
    } else {
      object = superRef ? t().memberExpression(t().cloneNode(superRef), t().identifier("prototype")) : t().memberExpression(t().identifier("Object"), t().identifier("prototype"));
    }

    let prop;

    if (computed && memoized.has(property)) {
      prop = t().cloneNode(memoized.get(property));
    } else {
      prop = property;
    }

    return t().memberExpression(object, prop, computed);
  },

  set(superMember, value) {
    const _superMember$node4 = superMember.node,
          property = _superMember$node4.property,
          computed = _superMember$node4.computed;
    let prop;

    if (computed && memoized.has(property)) {
      prop = t().assignmentExpression("=", t().cloneNode(memoized.get(property)), property);
    } else {
      prop = property;
    }

    return t().assignmentExpression("=", t().memberExpression(t().thisExpression(), prop, computed), value);
  }

};

class ReplaceSupers {
  constructor(opts) {
    const path = opts.methodPath;
    this.methodPath = path;
    this.isStatic = path.isClassMethod({
      static: true
    }) || path.isObjectMethod();
    this.file = opts.file;
    this.superRef = opts.superRef;
    this.isLoose = opts.isLoose;
    this.opts = opts;
  }

  getObjectRef() {
    return t().cloneNode(this.opts.objectRef || this.opts.getObjectRef());
  }

  replace() {
    const handler = this.isLoose ? looseHandlers : specHandlers;
    (0, _helperMemberExpressionToFunctions().default)(this.methodPath, visitor, Object.assign({
      file: this.file,
      isStatic: this.isStatic,
      getObjectRef: this.getObjectRef.bind(this),
      superRef: this.superRef
    }, handler));
  }

}

exports.default = ReplaceSupers;