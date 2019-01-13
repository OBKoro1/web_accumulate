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
  let helperName = "taggedTemplateLiteral";
  if (loose) helperName += "Loose";

  function buildConcatCallExressions(items) {
    let avail = true;
    return items.reduce(function (left, right) {
      let canBeInserted = _core().types.isLiteral(right);

      if (!canBeInserted && avail) {
        canBeInserted = true;
        avail = false;
      }

      if (canBeInserted && _core().types.isCallExpression(left)) {
        left.arguments.push(right);
        return left;
      }

      return _core().types.callExpression(_core().types.memberExpression(left, _core().types.identifier("concat")), [right]);
    });
  }

  return {
    visitor: {
      TaggedTemplateExpression(path) {
        const node = path.node;
        const quasi = node.quasi;
        const strings = [];
        const raws = [];
        let isStringsRawEqual = true;
        var _arr = quasi.quasis;

        for (var _i = 0; _i < _arr.length; _i++) {
          const elem = _arr[_i];
          const _elem$value = elem.value,
                raw = _elem$value.raw,
                cooked = _elem$value.cooked;
          const value = cooked == null ? path.scope.buildUndefinedNode() : _core().types.stringLiteral(cooked);
          strings.push(value);
          raws.push(_core().types.stringLiteral(raw));

          if (raw !== cooked) {
            isStringsRawEqual = false;
          }
        }

        const scope = path.scope.getProgramParent();
        const templateObject = scope.generateUidIdentifier("templateObject");
        const helperId = this.addHelper(helperName);
        const callExpressionInput = [_core().types.arrayExpression(strings)];

        if (!isStringsRawEqual) {
          callExpressionInput.push(_core().types.arrayExpression(raws));
        }

        const lazyLoad = _core().template.ast`
          function ${templateObject}() {
            const data = ${_core().types.callExpression(helperId, callExpressionInput)};
            ${templateObject} = function() { return data };
            return data;
          } 
        `;
        scope.path.unshiftContainer("body", lazyLoad);
        path.replaceWith(_core().types.callExpression(node.tag, [_core().types.callExpression(_core().types.cloneNode(templateObject), []), ...quasi.expressions]));
      },

      TemplateLiteral(path) {
        const nodes = [];
        const expressions = path.get("expressions");
        let index = 0;
        var _arr2 = path.node.quasis;

        for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
          const elem = _arr2[_i2];

          if (elem.value.cooked) {
            nodes.push(_core().types.stringLiteral(elem.value.cooked));
          }

          if (index < expressions.length) {
            const expr = expressions[index++];
            const node = expr.node;

            if (!_core().types.isStringLiteral(node, {
              value: ""
            })) {
              nodes.push(node);
            }
          }
        }

        const considerSecondNode = !loose || !_core().types.isStringLiteral(nodes[1]);

        if (!_core().types.isStringLiteral(nodes[0]) && considerSecondNode) {
          nodes.unshift(_core().types.stringLiteral(""));
        }

        let root = nodes[0];

        if (loose) {
          for (let i = 1; i < nodes.length; i++) {
            root = _core().types.binaryExpression("+", root, nodes[i]);
          }
        } else if (nodes.length > 1) {
          root = buildConcatCallExressions(nodes);
        }

        path.replaceWith(root);
      }

    }
  };
});

exports.default = _default;