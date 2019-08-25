## Object.create实现

### 关键思路：

将传入的对象作为新对象原型

### 代码：

```js
function myCreate(obj) {
  function F() {}
  F.prototype = obj
  return new F()
}
```

### 修改原对象的属性会影响新对象的原型：

```js
var obj1 = { p: 1 };
var obj2 = Object.create(obj1);
obj1.p = 2;
console.log('obj', obj1, obj2,)
```
<!-- 特殊字符串：用于修改/删除markdown的结尾提示语-OBKoro1 -->
### 点个[Star](https://github.com/OBKoro1/codeBlack)支持我一下~

