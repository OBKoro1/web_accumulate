"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = memberExpressionToFunctions;

function t() {
  const data = _interopRequireWildcard(require("@babel/types"));

  t = function t() {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const handle = {
  handle(member) {
    const node = member.node,
          parent = member.parent,
          parentPath = member.parentPath;

    if (parentPath.isUpdateExpression({
      argument: node
    })) {
      const operator = parent.operator,
            prefix = parent.prefix;

      if (this.memoize) {
        this.memoize(member);
      }

      const value = t().binaryExpression(operator[0], t().unaryExpression("+", this.get(member)), t().numericLiteral(1));

      if (prefix) {
        parentPath.replaceWith(this.set(member, value));
      } else {
        const scope = member.scope;
        const ref = scope.generateUidIdentifierBasedOnNode(node);
        scope.push({
          id: ref
        });
        value.left = t().assignmentExpression("=", t().cloneNode(ref), value.left);
        parentPath.replaceWith(t().sequenceExpression([this.set(member, value), t().cloneNode(ref)]));
      }

      return;
    }

    if (parentPath.isAssignmentExpression({
      left: node
    })) {
      const operator = parent.operator,
            right = parent.right;
      let value = right;

      if (operator !== "=") {
        if (this.memoize) {
          this.memoize(member);
        }

        value = t().binaryExpression(operator.slice(0, -1), this.get(member), value);
      }

      parentPath.replaceWith(this.set(member, value));
      return;
    }

    if (parentPath.isCallExpression({
      callee: node
    })) {
      const args = parent.arguments;
      parentPath.replaceWith(this.call(member, args));
      return;
    }

    member.replaceWith(this.get(member));
  }

};

function memberExpressionToFunctions(path, visitor, state) {
  path.traverse(visitor, Object.assign({}, state, handle));
}