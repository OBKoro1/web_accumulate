# JS基础-原型、原型链

JS的原型、原型链一直是比较难理解的内容，不少初学者甚至有一定经验的老鸟都不一定能完全说清楚，更多的"很可能"是一知半解，而这部分内容又是JS的核心内容，想要技术进阶的话肯定不能对这个概念一知半解，碰到问题靠“猜”，却不理解它的规则！

## prototype

### 只有函数有prototype属性

```js
let a = {}
let b = function () { }
console.log(a.prototype) // undefined
console.log(b.prototype) // { constructor: function(){...} }
```

#### Object.prototype怎么解释？

其实`Object`是一个全局对象，也是一个构造函数，以及其他基本类型的全局对象也都是构造函数：

```js
function outTypeName(data, type) {
    let typeName =  Object.prototype.toString.call(data)
    console.log(typeName)
}
outTypeName(Object) //[object Function]
outTypeName(String) // [object Function]
outTypeName(Number) // [object Function]
```

### 为什么只有函数有prototype属性

JS通过`new`来生成对象，但是仅靠构造函数，每次生成的对象都不一样。

有时候需要在两个对象之间共享属性，由于JS在设计之初没有类的概念，所以JS使用函数的`prototype`来处理这部分**需要被共享的属性**，通过函数的`prototype`来模拟类：

当创建一个函数时，JS会自动为函数添加`prototype`属性，值是一个有`constructor`的对象。

以下是共享属性`prototype`的栗子：

```js
function People(name) {
    this.name = name
}
People.prototype.age = 23 // 岁数
// 创建两个实例
let People1 = new People('OBKoro1')
let People2 = new People('扣肉')
People.prototype.age = 24 // 长大了一岁
console.log(People1.age, People2.age) // 24 24
```
**为什么`People1`和`People2`可以访问到`People.prototype.age`**？

原因是：`People1`和`People2`的原型是`People.prototype`，答案在下方的：构造函数是什么以及它做了什么。

## 原型链

### `__proto__`和`Object.getPrototypeOf(target)`： 对象的原型

`__proto__ `是对象实例和它的构造函数之间建立的链接，它的值是：构造函数的`prototype。

也就是说：`__proto__ `的值是它所对应的原型对象，是某个函数的`prototype`

`Object.getPrototypeOf(target)`全等于`__proto__ `。

它是ES6的标准，兼容IE9，主流浏览器也都支持，[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/GetPrototypeOf#%E6%B5%8F%E8%A7%88%E5%99%A8%E5%85%BC%E5%AE%B9)，本文将以`Object.getPrototypeOf(target)`指代`__proto__`。

### 不要再使用`__proto__`:

> 本段摘自[阮一峰-ES6入门](http://es6.ruanyifeng.com/#docs/object-methods#__proto__%E5%B1%9E%E6%80%A7%EF%BC%8CObject-setPrototypeOf%EF%BC%8CObject-getPrototypeOf)，具体解析请点击链接查看

1. `__proto__`属性没有写入 ES6 的正文，而是写入了附录。

2. 原因是它本质上是一个内部属性，而**不是一个正式的对外的 API，只是由于浏览器广泛支持，才被加入了 ES6**。

3. 标准明确规定，只有浏览器必须部署这个属性，**其他运行环境不一定需要部署，而且新的代码最好认为这个属性是不存在的**。

4. 所以无论从语义的角度，还是从兼容性的角度，都不要使用这个属性，应该使用：`Object.getPrototypeOf(target)`（读操作）、`Object.setPrototypeOf(target)`（写操作）、`Object.create(target)`（生成操作）代替

### 构造函数是什么、它做了什么
> 出自《你不知道的在js》：在js中, 实际上并不存在所谓的'构造函数'，只有对于函数的'构造调用'。

上文一直提到构造函数，所谓的构造函数，实际上就是通过关键字`new`来调用的函数：

```js
let newObj = new someFn() // 构造调用函数
```

**构造/new调用函数的时候做了什么**：

1. 创建一个全新的对象。
2. 这个新对象的原型(`Object.getPrototypeOf(target)`)指向构造函数的`prototype`对象。
3. 该函数的this会绑定在新创建的对象上。
4. 如果函数没有返回其他对象，那么new表达式中的函数调用会自动返回这个新对象。
5. 我们称这个新对象为构造函数的实例。

**原型继承就是利用构造调用函数的特性**：

```js
SubType.prototype = new SuperType();  // 原型继承：SubType继承SuperType
SubType.prototype.constructor = SubType // 重新指定constructor指向 方便找到构造函数
// 挂载SuperType的this和prototype的属性和方法到SubType.prototype上
```

1. 构造调用的第二点：将新对象的`Object.getPrototypeOf(target)`指向函数的`prototype`
2. 构造调用的第三点：该函数的this会绑定在新创建的对象上。
3. 新对象赋值给`SubType.prototype`

原型类型有个缺点：多个实例对引用类型的操作会被篡改。
> 因为每次实例化引用类型的数据都指向同一个地址，所以它们读/写的是同一个数据，当一个实例对其进行操作，其他实例的数据就会一起更改。

### 原型链是什么

来看个例子：

```js
function foo() { }
const newObj = new foo() // 构造调用foo 返回一个新对象
const newObj__proto__ = Object.getPrototypeOf(newObj) // 获取newObj的原型对象
newObj__proto__ === foo.prototype // true 验证newObj的原型指向foo
const foo__proto__ = Object.getPrototypeOf(foo.prototype) // 获取foo.prototype的原型
foo__proto__ === Object.prototype // true foo.prototype的原型是Object.prototype
``
如果用以前的语法，从`newObj`查找`foo`的原型，是这样的：
```js
newObj.__proto__.__proto__ // 这种关系就是原型链
```

**可以用以下三句话来理解原型链**：

1. **每个对象都拥有一个原型对象**: `newObj`的原型是`foo.prototype`。
2. **对象的原型可能也是继承其他原型对象的**: `foo.prototype`也有它的原型`Object.prototype`。
3. **一层一层的，以此类推，这种关系就是原型链**。

### 一个对象是否在另一个对象的原型链上

> 如果一个对象存在另一个对象的原型链上，我们可以说：它们是继承关系。

判断方式有两种，但都是根据构造函数的`prototype`是否在原型链上来判断的：

1. `instanceof `: 用于测试构造函数的prototype属性是否出现在对象的原型链中的任何位置

语法：`object instanceof constructor`

```js
let test = function () { }
let testObject = new test();
testObject instanceof test // true test.prototype在testObject的原型链上
 testObject instanceof Function // false Function.prototype 不在testObject的原型链上
testObject instanceof Object // true Object.prototype在testObject的原型链上
```
2. `isPrototypeOf `：测试一个对象是否存在于另一个对象的原型链上

语法：`prototypeObj.isPrototypeOf(object)`

```js
let test = function () { }
let testObject = new test();
test.prototype.isPrototypeOf(testObject) // true test.prototype在testObject的原型链上
Object.prototype.isPrototypeOf(testObject) // true Object.prototype在testObject的原型链上
```

### 原型链的终点: `Object.prototype`

`Object.prototype`是原型链的终点，所有对象都是从它继承了方法和属性。

**`Object.prototype`没有原型对象**：

```js
const proto = Object.getPrototypeOf(Object.prototype) // null
```
下面是两个验证例子，有疑虑的同学多写几个测试用例印证一下。

**字符串原型链的终点**：`Object.prototype`

```js
let test = '由String函数构造出来的'
let stringPrototype = Object.getPrototypeOf(test) // 字符串的原型
stringPrototype === String.prototype // true 字符串的原型是String对象
Object.getPrototypeOf(stringPrototype) === Object.prototype // true String对象的原型是Object对象
```

**函数原型链的终点**:`Object.prototype`

```js
let test = function () { }
let fnPrototype = Object.getPrototypeOf(test)
fnPrototype === Function.prototype // true test的原型是Function.prototype
Object.getPrototypeOf(Function.prototype) === Object.prototype // true
```

### 原型链用来做什么？

#### 属性查找：
> 如果试图访问对象(实例instance)的某个属性,会首先在对象内部寻找该属性,直至找不到,然后才在该对象的原型(instance.prototype)里去找这个属性，以此类推

我们用一个例子来形象说明一下：

```js
let test = '由String函数构造出来的'
let stringPrototype = Object.getPrototypeOf(test) // 字符串的原型
stringPrototype === String.prototype // true 字符串的原型是String对象
Object.getPrototypeOf(stringPrototype) === Object.prototype // true String对象的原型是Object对象
```
当你访问`test`的某个属性时，浏览器会进行以下查找：

1. 浏览器首先查找`test` 本身
2. 接着查找它的原型对象：`String.prototype`
3. 最后查找`String.prototype`的原型对象：`Object.prototype`
4. 一旦在原型链上找到该属性，就会立即返回该属性，停止查找。
5. 原型链上的原型都没有找到的话，返回`undefiend`

这种查找机制还解释了字符串为何会有自带的方法: `slice`/`split`/`indexOf`等。

准确的说：
* 这些属性和方法是定义在`String`这个全局对象/函数上的。
* 字符串的原型指向了`String`函数的`prototype`。
* 之后通过查找原型链，在String函数的`prototype`中找到这些属性和方法。

#### 拒绝查找原型链： 

`hasOwnProperty`: 指示对象自身属性中是否具有指定的属性

语法：`obj.hasOwnProperty(prop)`

参数: `prop` 要查找的属性

返回值: 用来判断某个对象是否含有指定的属性的`Boolean`。

```js
let test ={ 'OBKoro1': '扣肉' }
test.hasOwnProperty('OBKoro1');  // true
test.hasOwnProperty('toString'); // false test本身没查找到toString 
```

这个`API`是挂载在`object.prototype`上，所有对象都可以使用，API会忽略掉那些从原型链上继承到的属性。

## 扩展：

### 实例的属性

你知道构造函数的实例对象上有哪些属性吗？这些属性分别挂载在哪个地方？原因是什么？

```js
function foo() {
    this.some = '222'
    let ccc = 'ccc'
    foo.obkoro1 = 'obkoro1'
    foo.prototype.a = 'aaa'
}
foo.koro = '扣肉'
foo.prototype.test = 'test'
let foo1 = new foo() // `foo1`上有哪些属性,这些属性分别挂载在哪个地方
foo.prototype.test = 'test2' // 重新赋值
```

上面这道是考察`JS`基础的题，很多人都没说对，原因是没有彻底掌握`this`、`原型链`、`函数`。

#### 想一下再看解析：
#### 想一下再看解析：
#### 想一下再看解析：
#### 想一下再看解析：
#### 想一下再看解析：

1. `this.some`：`foo1`对象的属性

通过构造调用`foo`的`this`指向`foo1`，所以`this.some`挂载在`foo1`对象下。

属性查找: `foo1.some`

 `foo1.some`直接读取`foo1`的属性。

2. `foo1.test`、`foo1.a`：`foo1`对象的原型

根据上文提到的：构造/new调用函数的时候会创建一个新对象(`foo1`)，自动将`foo1`的原型(`Object.getPrototypeOf(foo1)`)指向构造函数的prototype对象。

构造调用会执行函数，所以` foo.prototype.a = 'aaaaa'`也会执行，单就赋值这个层面来说写在`foo`外面和写在`foo`里面是一样的。

属性查找：`foo1.test`、`foo1.a`

* `foo1`本身没有找到,继续查找
* `foo1`的原型`Object.getPrototypeOf(foo1)`上找到了`a`和`test`，返回它们，停止查找。

3. `foo1.obkoro1`和`foo1.koro`：返回undefined

#### 静态属性: `foo.obkoro1`、`foo.koro`

> 函数在JS中是一等公民，它也是一个对象, 用来模拟类。

这两个属性跟`foo1`没有关系，它是对象`foo`上的两个属性(类似函数的:`arguments`/`prototype`/`length`等属性)，称为**静态属性**。

它们只能通过`foo.obkoro1`和`foo.koro`来访问。

#### 原型对象改变，原型链下游获取的值也会改变 

上面那个例子中的`foo1.test`的值是什么？

```js
foo.prototype.test = 'test'
let foo1 = new foo() // `foo1`上有哪些属性,这些属性分别挂载在哪个地方
foo.prototype.test = 'test2' // 重新赋值
```

`foo1.test`的值是`test2`，原因是：`foo1`的原型对象是`Object.getPrototypeOf(foo1)`存的指针，指向`foo.prototype`的内存地址，不是拷贝，每次读取的值都是当前`foo.prototype`的最新值。

**打印`foo1`**：

![](https://github.com/OBKoro1/articleImg_src/blob/master/2019/2019_8_25_prototype.png?raw=true)

### 小结

写了好几天，之前网上很多图文博客，那些线指来指去，就我个人看来还是比较难以理解的，所以本文纯文字的形式来描述这些概念，相信认真看完的同学肯定都有所收获，如果没看懂的话，建议多看几遍，这部分概念真的很重要！

PS：实际上还有很多引申出来的东西没写全，准备放到其他文章中去写。

#### 觉得我的博客对你有帮助的话，就给我点个[Star](https://github.com/OBKoro1/web_accumulate)吧！

[前端进阶积累](http://obkoro1.com/web_accumulate/)、[公众号](https://user-gold-cdn.xitu.io/2018/5/1/1631b6f52f7e7015?w=344&h=344&f=jpeg&s=8317)、[GitHub](https://github.com/OBKoro1)、wx:OBkoro1、邮箱：obkoro1@foxmail.com
 
 以上2019/8/25


作者：[OBKoro1](https://github.com/OBKoro1)

参考资料：

[MDN:对象原型](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Objects/Object_prototypes)

[JS原型链与继承别再被问倒了](https://juejin.im/post/58f94c9bb123db411953691b#heading-14)

[从__proto__和prototype来深入理解JS对象和原型链](https://github.com/creeperyang/blog/issues/9)
<!-- 特殊字符串：用于修改/删除markdown的结尾提示语-OBKoro1 -->
### 点个[Star](https://github.com/OBKoro1/web_accumulate)支持我一下~

