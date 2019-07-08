# var和let/const的区别

`let`和`const`是 ES6 新增的命令，用于声明变量，这两个命令跟 ES5 的`var`有许多不同，并且`let`和`const`也有一些细微的不同，再认真阅读了阮一峰老师的[文档](http://es6.ruanyifeng.com/#docs/let)后，发现还是有一些不知道的细节...

> [博客](http://obkoro1.com/)、[前端积累文档](http://obkoro1.com/web_accumulate/accumulate/)、[公众号](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/1631b6f52f7e7015?raw=true)、[GitHub](https://github.com/OBKoro1)

## 内容：

**`var`和`let`/`const`的区别**

1. 块级作用域

2. 不存在变量提升

3. 暂时性死区

4. 不可重复声明

5. let、const声明的全局变量不会挂在顶层对象下面

**`const`命令两个注意点:**

1. const 声明之后必须马上赋值，否则会报错

2. const 简单类型一旦声明就不能再更改，复杂类型(数组、对象等)指针指向的地址不能更改，内部数据可以更改。


### 为什么需要块级作用域?

ES5只有全局作用域和函数作用域，没有块级作用域。

这带来很多不合理的场景:

1. 内层变量可能覆盖外层变量
2. 用来计数的循环变量泄露为全局变量

```js
var tmp = new Date();
function f() {
  console.log(tmp); // 想打印外层的时间作用域
  if (false) {
    var tmp = 'hello world'; // 这里声明的作用域为整个函数
  }
}
f(); // undefined

var s = 'hello';
for (var i = 0; i < s.length; i++) {
  console.log(s[i]); // i应该为此次for循环使用的变量
}
console.log(i); // 5 全局范围都可以读到
```

### 块级作用域

1. 作用域

```js
function f1() {
  let n = 5;
  if (true) {
    let n = 10;
    console.log(n); // 10 内层的n
  }
  console.log(n); // 5 当前层的n
}
```

2. 块级作用域任意嵌套

```js
{{{{
  {let insane = 'Hello World'}
  console.log(insane); // 报错 读不到子作用域的变量
}}}};
```

3. 块级作用域真正使代码分割成块了

```js
{
let a = ...;
...
}
{
let a = ...;
...
}
```
以上形式，**可以用于测试一些想法，不用担心变量重名，也不用担心外界干扰**

### 块级作用域声明函数：

> 在块级作用域声明函数，因为浏览器的要兼容老代码，会产生一些[问题](http://es6.ruanyifeng.com/#docs/let#%E5%9D%97%E7%BA%A7%E4%BD%9C%E7%94%A8%E5%9F%9F%E4%B8%8E%E5%87%BD%E6%95%B0%E5%A3%B0%E6%98%8E)！

**在块级作用域声明函数，最好使用匿名函数的形式**。

```js
if(true){
  let a = function () {}; // 作用域为块级 令声明的函数作用域范围更清晰
}
```

**ES6 的块级作用域允许声明函数的规则，只在使用大括号的情况下成立，如果没有使用大括号，就会报错**。

```js
// 报错
'use strict';
if (true)
  function f() {} // 我们需要给if加个{}
```

### 不存在变量提升

**变量提升的现象**：在同一作用域下，变量可以在声明之前使用，值为 undefined

ES5 时使用`var`声明变量，经常会出现变量提升的现象。

```js
// var 的情况
console.log(foo); // 输出undefined
var foo = 2;

// let 的情况
console.log(bar); // 报错ReferenceError
let bar = 2;
```

### 暂时性死区：

只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，**只有等到声明变量的那一行代码出现，才可以获取和使用该变量**

```js
var tmp = 123; // 声明
if (true) {
  tmp = 'abc'; // 报错 因为本区域有tmp声明变量
  let tmp; // 绑定if这个块级的作用域 不能出现tmp变量
}
```

**暂时性死区和不能变量提升的意义在于:**

为了减少运行时错误，防止在变量声明前就使用这个变量，从而导致意料之外的行为。

### 不允许重复声明变量

> 在测试时出现这种情况:`var a= '声明';const a = '不报错'`，这种情况是因为babel在转化的时候，做了一些处理，在浏览器的控制台中测试，就成功报错

`let`、`const`不允许在相同作用域内，重复声明同一个变量

```js
function func(arg) {
  let arg; // 报错
}

function func(arg) {
  {
    let arg; // 不报错
  }
}
```

### let、const声明的全局变量不会挂在顶层对象下面

1. 浏览器环境顶层对象是: `window`
2. node环境顶层对象是: `global`
3. var声明的全局变量会挂在顶层对象下面，而let、const不会挂在顶层对象下面。如下面这个栗子

```js
var a = 1;
// 如果在 Node环境，可以写成 global.a
// 或者采用通用方法，写成 this.a
window.a // 1

let b = 1;
window.b // undefined
```

## const命令

1. **一旦声明，必须马上赋值**

    ```js
    let p; var p1; // 不报错
    const p3 = '马上赋值'
    const p3; // 报错 没有赋值
    ```

2. **const一旦声明值就不能改变**

    #### 简单类型:不能改动

    ```js
    const p = '不能改变';
    p = '报错'
    ```

    #### 复杂类型:变量指针不能变

    考虑如下情况：

    ```js
    const p = ['不能改动']
    const p2 = {
      name: 'OBKoro1'
    }
    p[0] = '不报错'
    p2.name = '不报错'
    p = ['报错']
    p2 = {
      name: '报错'
    }
    ```

    const所说的一旦声明值就不能改变，实际上指的是：**变量指向的那个内存地址所保存的数据不得改动**

    * 简单类型(number、string、boolean)：**内存地址就是值,即常量(一变就报错)**.
    * 复杂类型(对象、数组等)：**地址保存的是一个指针，`const`只能保证指针是固定的(总是指向同一个地址),它内部的值是可以改变的(不要以为const就安全了！)**

       所以只要不重新赋值整个数组/对象， 因为保存的是一个指针，所以对数组使用的`push`、`shift`、`splice`等方法也是允许的，你就是把值一个一个全都删光了都不会报错。

    > 复杂类型还有函数，正则等，这点也要注意一下。

## 总结:

再总结一下，看到这些名词，脑子里应该会有对应的理解，如果没有的话，那可以再看看对应的内容。

### `var`和`let`/`const`的区别:

1. 块级作用域
2. 不存在变量提升
3. 暂时性死区
4. 不可重复声明
5. let、const声明的全局变量不会挂在顶层对象下面

### `const`命令两个注意点:

1. `let`可以先声明稍后再赋值,而`const`在 声明之后必须马上赋值，否则会报错

2. const 简单类型一旦声明就不能再更改，复杂类型(数组、对象等)指针指向的地址不能更改，内部数据可以更改。

### let、const使用场景:

1. `let`使用场景：变量，用以替代`var`。
2. `const`使用场景：常量、声明匿名函数、箭头函数的时候。

### 鼓励我一下：

觉得还不错的话，给我的项目点个[star](https://github.com/OBKoro1/Brush_algorithm)吧

[博客](http://obkoro1.com/)、[前端积累文档](http://obkoro1.com/web_accumulate/accumulate/)、[公众号](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/1631b6f52f7e7015?raw=true)、[GitHub](https://github.com/OBKoro1)


参考资料：

[let 和 const 命令](http://es6.ruanyifeng.com/#docs/let)

