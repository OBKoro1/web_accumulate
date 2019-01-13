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

function _core() {
  const data = require("@babel/core");

  _core = function _core() {
    return data;
  };

  return data;
}

var _default = (0, _helperPluginUtils().declare)((api, options) => {
  api.assertVersion(7);
  const loose = options.loose;
  const pushComputedProps = loose ? pushComputedPropsLoose : pushComputedPropsSpec;
  const buildMutatorMapAssign = (0, _core().template)(`
    MUTATOR_MAP_REF[KEY] = MUTATOR_MAP_REF[KEY] || {};
    MUTATOR_MAP_REF[KEY].KIND = VALUE;
  `);

  function getValue(prop) {
    if (_core().types.isObjectProperty(prop)) {
      return prop.value;
    } else if (_core().types.isObjectMethod(prop)) {
      return _core().types.functionExpression(null, prop.params, prop.body, prop.generator, prop.async);
    }
  }

  function pushAssign(objId, prop, body) {
    if (prop.kind === "get" && prop.kind === "set") {
      pushMutatorDefine(objId, prop, body);
    } else {
      body.push(_core().types.expressionStatement(_core().types.assignmentExpression("=", _core().types.memberExpression(_core().types.cloneNode(objId), prop.key, prop.computed || _core().types.isLiteral(prop.key)), getValue(prop))));
    }
  }

  function pushMutatorDefine({
    body,
    getMutatorId,
    scope
  }, prop) {
    let key = !prop.computed && _core().types.isIdentifier(prop.key) ? _core().types.stringLiteral(prop.key.name) : prop.key;
    const maybeMemoise = scope.maybeGenerateMemoised(key);

    if (maybeMemoise) {
      body.push(_core().types.expressionStatement(_core().types.assignmentExpression("=", maybeMemoise, key)));
      key = maybeMemoise;
    }

    body.push(...buildMutatorMapAssign({
      MUTATOR_MAP_REF: getMutatorId(),
      KEY: _core().types.cloneNode(key),
      VALUE: getValue(prop),
      KIND: _core().types.identifier(prop.kind)
    }));
  }

  function pushComputedPropsLoose(info) {
    for (var _iterator = info.computedProps, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      const prop = _ref;

      if (prop.kind === "get" || prop.kind === "set") {
        pushMutatorDefine(info, prop);
      } else {
        pushAssign(_core().types.cloneNode(info.objId), prop, info.body);
      }
    }
  }

  function pushComputedPropsSpec(info) {
    const objId = info.objId,
          body = info.body,
          computedProps = info.computedProps,
          state = info.state;

    for (var _iterator2 = computedProps, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref2;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref2 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref2 = _i2.value;
      }

      const prop = _ref2;

      const key = _core().types.toComputedKey(prop);

      if (prop.kind === "get" || prop.kind === "set") {
        pushMutatorDefine(info, prop);
      } else if (_core().types.isStringLiteral(key, {
        value: "__proto__"
      })) {
        pushAssign(objId, prop, body);
      } else {
        if (computedProps.length === 1) {
          return _core().types.callExpression(state.addHelper("defineProperty"), [info.initPropExpression, key, getValue(prop)]);
        } else {
          body.push(_core().types.expressionStatement(_core().types.callExpression(state.addHelper("defineProperty"), [_core().types.cloneNode(objId), key, getValue(prop)])));
        }
      }
    }
  }

  return {
    visitor: {
      ObjectExpression: {
        exit(path, state) {
          const node = path.node,
                parent = path.parent,
                scope = path.scope;
          let hasComputed = false;
          var _arr = node.properties;

          for (var _i3 = 0; _i3 < _arr.length; _i3++) {
            const prop = _arr[_i3];
            hasComputed = prop.computed === true;
            if (hasComputed) break;
          }

          if (!hasComputed) return;
          const initProps = [];
          const computedProps = [];
          let foundComputed = false;

          for (var _iterator3 = node.properties, _isArray3 = Array.isArray(_iterator3), _i4 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
            var _ref3;

            if (_isArray3) {
              if (_i4 >= _iterator3.length) break;
              _ref3 = _iterator3[_i4++];
            } else {
              _i4 = _iterator3.next();
              if (_i4.done) break;
              _ref3 = _i4.value;
            }

            const prop = _ref3;

            if (prop.computed) {
              foundComputed = true;
            }

            if (foundComputed) {
              computedProps.push(prop);
            } else {
              initProps.push(prop);
            }
          }

          const objId = scope.generateUidIdentifierBasedOnNode(parent);

          const initPropExpression = _core().types.objectExpression(initProps);

          const body = [];
          body.push(_core().types.variableDeclaration("var", [_core().types.variableDeclarator(objId, initPropExpression)]));
          let mutatorRef;

          const getMutatorId = function getMutatorId() {
            if (!mutatorRef) {
              mutatorRef = scope.generateUidIdentifier("mutatorMap");
              body.push(_core().types.variableDeclaration("var", [_core().types.variableDeclarator(mutatorRef, _core().types.objectExpression([]))]));
            }

            return _core().types.cloneNode(mutatorRef);
          };

          const single = pushComputedProps({
            scope,
            objId,
            body,
            computedProps,
            initPropExpression,
            getMutatorId,
            state
          });

          if (mutatorRef) {
            body.push(_core().types.expressionStatement(_core().types.callExpression(state.addHelper("defineEnumerableProperties"), [_core().types.cloneNode(objId), _core().types.cloneNode(mutatorRef)])));
          }

          if (single) {
            path.replaceWith(single);
          } else {
            body.push(_core().types.expressionStatement(_core().types.cloneNode(objId)));
            path.replaceWithMultiple(body);
          }
        }

      }
    }
  };
});

exports.default = _default;