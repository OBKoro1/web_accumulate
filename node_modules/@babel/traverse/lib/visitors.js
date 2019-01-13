"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.explode = explode;
exports.verify = verify;
exports.merge = merge;

var virtualTypes = _interopRequireWildcard(require("./path/lib/virtual-types"));

function t() {
  const data = _interopRequireWildcard(require("@babel/types"));

  t = function t() {
    return data;
  };

  return data;
}

function _clone() {
  const data = _interopRequireDefault(require("lodash/clone"));

  _clone = function _clone() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function explode(visitor) {
  if (visitor._exploded) return visitor;
  visitor._exploded = true;

  for (const nodeType in visitor) {
    if (shouldIgnoreKey(nodeType)) continue;
    const parts = nodeType.split("|");
    if (parts.length === 1) continue;
    const fns = visitor[nodeType];
    delete visitor[nodeType];

    for (var _iterator = parts, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      const part = _ref;
      visitor[part] = fns;
    }
  }

  verify(visitor);
  delete visitor.__esModule;
  ensureEntranceObjects(visitor);
  ensureCallbackArrays(visitor);

  var _arr = Object.keys(visitor);

  for (var _i2 = 0; _i2 < _arr.length; _i2++) {
    const nodeType = _arr[_i2];
    if (shouldIgnoreKey(nodeType)) continue;
    const wrapper = virtualTypes[nodeType];
    if (!wrapper) continue;
    const fns = visitor[nodeType];

    for (const type in fns) {
      fns[type] = wrapCheck(wrapper, fns[type]);
    }

    delete visitor[nodeType];

    if (wrapper.types) {
      var _arr2 = wrapper.types;

      for (var _i4 = 0; _i4 < _arr2.length; _i4++) {
        const type = _arr2[_i4];

        if (visitor[type]) {
          mergePair(visitor[type], fns);
        } else {
          visitor[type] = fns;
        }
      }
    } else {
      mergePair(visitor, fns);
    }
  }

  for (const nodeType in visitor) {
    if (shouldIgnoreKey(nodeType)) continue;
    const fns = visitor[nodeType];
    let aliases = t().FLIPPED_ALIAS_KEYS[nodeType];
    const deprecratedKey = t().DEPRECATED_KEYS[nodeType];

    if (deprecratedKey) {
      console.trace(`Visitor defined for ${nodeType} but it has been renamed to ${deprecratedKey}`);
      aliases = [deprecratedKey];
    }

    if (!aliases) continue;
    delete visitor[nodeType];

    for (var _iterator2 = aliases, _isArray2 = Array.isArray(_iterator2), _i3 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref2;

      if (_isArray2) {
        if (_i3 >= _iterator2.length) break;
        _ref2 = _iterator2[_i3++];
      } else {
        _i3 = _iterator2.next();
        if (_i3.done) break;
        _ref2 = _i3.value;
      }

      const alias = _ref2;
      const existing = visitor[alias];

      if (existing) {
        mergePair(existing, fns);
      } else {
        visitor[alias] = (0, _clone().default)(fns);
      }
    }
  }

  for (const nodeType in visitor) {
    if (shouldIgnoreKey(nodeType)) continue;
    ensureCallbackArrays(visitor[nodeType]);
  }

  return visitor;
}

function verify(visitor) {
  if (visitor._verified) return;

  if (typeof visitor === "function") {
    throw new Error("You passed `traverse()` a function when it expected a visitor object, " + "are you sure you didn't mean `{ enter: Function }`?");
  }

  for (const nodeType in visitor) {
    if (nodeType === "enter" || nodeType === "exit") {
      validateVisitorMethods(nodeType, visitor[nodeType]);
    }

    if (shouldIgnoreKey(nodeType)) continue;

    if (t().TYPES.indexOf(nodeType) < 0) {
      throw new Error(`You gave us a visitor for the node type ${nodeType} but it's not a valid type`);
    }

    const visitors = visitor[nodeType];

    if (typeof visitors === "object") {
      for (const visitorKey in visitors) {
        if (visitorKey === "enter" || visitorKey === "exit") {
          validateVisitorMethods(`${nodeType}.${visitorKey}`, visitors[visitorKey]);
        } else {
          throw new Error("You passed `traverse()` a visitor object with the property " + `${nodeType} that has the invalid property ${visitorKey}`);
        }
      }
    }
  }

  visitor._verified = true;
}

function validateVisitorMethods(path, val) {
  const fns = [].concat(val);

  for (var _iterator3 = fns, _isArray3 = Array.isArray(_iterator3), _i5 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
    var _ref3;

    if (_isArray3) {
      if (_i5 >= _iterator3.length) break;
      _ref3 = _iterator3[_i5++];
    } else {
      _i5 = _iterator3.next();
      if (_i5.done) break;
      _ref3 = _i5.value;
    }

    const fn = _ref3;

    if (typeof fn !== "function") {
      throw new TypeError(`Non-function found defined in ${path} with type ${typeof fn}`);
    }
  }
}

function merge(visitors, states = [], wrapper) {
  const rootVisitor = {};

  for (let i = 0; i < visitors.length; i++) {
    const visitor = visitors[i];
    const state = states[i];
    explode(visitor);

    for (const type in visitor) {
      let visitorType = visitor[type];

      if (state || wrapper) {
        visitorType = wrapWithStateOrWrapper(visitorType, state, wrapper);
      }

      const nodeVisitor = rootVisitor[type] = rootVisitor[type] || {};
      mergePair(nodeVisitor, visitorType);
    }
  }

  return rootVisitor;
}

function wrapWithStateOrWrapper(oldVisitor, state, wrapper) {
  const newVisitor = {};

  for (const key in oldVisitor) {
    let fns = oldVisitor[key];
    if (!Array.isArray(fns)) continue;
    fns = fns.map(function (fn) {
      let newFn = fn;

      if (state) {
        newFn = function newFn(path) {
          return fn.call(state, path, state);
        };
      }

      if (wrapper) {
        newFn = wrapper(state.key, key, newFn);
      }

      return newFn;
    });
    newVisitor[key] = fns;
  }

  return newVisitor;
}

function ensureEntranceObjects(obj) {
  for (const key in obj) {
    if (shouldIgnoreKey(key)) continue;
    const fns = obj[key];

    if (typeof fns === "function") {
      obj[key] = {
        enter: fns
      };
    }
  }
}

function ensureCallbackArrays(obj) {
  if (obj.enter && !Array.isArray(obj.enter)) obj.enter = [obj.enter];
  if (obj.exit && !Array.isArray(obj.exit)) obj.exit = [obj.exit];
}

function wrapCheck(wrapper, fn) {
  const newFn = function newFn(path) {
    if (wrapper.checkPath(path)) {
      return fn.apply(this, arguments);
    }
  };

  newFn.toString = () => fn.toString();

  return newFn;
}

function shouldIgnoreKey(key) {
  if (key[0] === "_") return true;
  if (key === "enter" || key === "exit" || key === "shouldSkip") return true;

  if (key === "blacklist" || key === "noScope" || key === "skipKeys") {
    return true;
  }

  return false;
}

function mergePair(dest, src) {
  for (const key in src) {
    dest[key] = [].concat(dest[key] || [], src[key]);
  }
}