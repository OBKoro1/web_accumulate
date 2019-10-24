## instanceof实现原理

### 思路

右边变量的原型存在于左边变量的原型链上

关于原型链不太懂的同学可以看一下，我的这篇文章：[JS基础-函数、对象和原型、原型链的关系](https://juejin.im/post/5d622f14f265da03a1486408)

### 代码：

```js
function myInstanceOf(left, right) {
  let leftValue = left.__proto__
  let rightValue = right.prototype
  while (true) {
    if (leftValue === null) {
      return false
    }
    if (leftValue === rightValue) {
      return true
    }
    leftValue = leftValue.__proto__
  }
}
```
<!-- 特殊字符串：用于修改/删除markdown的结尾提示语-OBKoro1 -->
### 点个[Star](https://github.com/OBKoro1/codeBlack)支持我一下~

