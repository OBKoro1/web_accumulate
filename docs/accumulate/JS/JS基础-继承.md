## JS基础-深入浅出继承

上篇文章详细解析了原型、原型链的相关知识点，这篇文章讲的是和原型链有密切关联的继承，它是前端基础中很重要的一个知识点，它对于代码复用来说非常有用，本篇将详细解析JS中的各种继承方式和优缺点进行，希望看完本篇文章能够对继承以及相关概念理解的更为透彻。

#### 本篇文章需要先理解原型、原型链以及`call `的相关知识：

[JS基础-函数、对象和原型、原型链的关系](https://juejin.im/post/5d469e0851882544b85c32ef)

[js基础-面试官想知道你有多理解call,apply,bind？](https://juejin.im/post/5d469e0851882544b85c32ef)

### 何为继承？

> [维基百科](https://zh.wikipedia.org/wiki/%E7%BB%A7%E6%89%BF_(%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%A7%91%E5%AD%A6))：继承可以使得子类具有父类别的各种属性和方法，而不需要再次编写相同的代码。

**继承是一个类从另一个类获取方法和属性的过程**。

PS：或者是多个类

#### JS实现继承的原理
> 记住这个概念，你会发现JS中的继承都是在实现这个目的，差异是它们的实现方式不同。

**复制父类的属性和方法来重写子类原型对象**。

### 原型链继承(new)：

```js
function fatherFn() {
  this.some = '父类的this属性';
}
fatherFn.prototype.fatherFnSome =  '父类原型对象的属性或者方法';
// 子类
function sonFn() {
  this.obkoro1 = '子类的this属性';
}
// 核心步骤：重写子类的原型对象
sonFn.prototype = new fatherFn(); // 将fatherFn的实例赋值给sonFn的prototype
sonFn.prototype.sonFnSome = '子类原型对象的属性或者方法' // 子类的属性/方法声明在后面,避免被覆盖
// 实例化子类
const sonFnInstance = new sonFn();
console.log('子类的实例：', sonFnInstance);
```

#### 原型链子类实例

![原型链子类实例](https://github.com/OBKoro1/articleImg_src/blob/master/2019/2019_9_16_inherit_1.png?raw=true)

#### 原型链继承获取父类的属性和方法

1. `fatherFn`通过this声明的属性/方法都会绑定在`new`期间创建的新对象上。
2. 新对象的原型是`father.prototype`,通过原型链的属性查找到`father.prototype`的属性和方法。

#### 理解`new`做了什么：
> new在本文出现多次，new也是JS基础中很重要的一块内容，很多知识点会涉及到new，不太理解的要多看几遍。

1. 创建一个全新的对象。
2. 这个新对象的原型(`__proto__`)指向函数的`prototype`对象。
3. 执行函数，函数的this会绑定在新创建的对象上。
4. 如果函数没有返回其他对象(包括数组、函数、日期对象等)，那么会自动返回这个新对象。
5. 返回的那个对象为构造函数的实例。

#### 构造调用函数返回其他对象
> **返回其他对象会导致获取不到构造函数的实例，很容易因此引起意外的问题**！

**我们知道了`fatherFn`的`this`和`prototype`的属性/方法都跟`new`期间创建的新对象有关系**。

**如果在父类中返回了其他对象(`new`的第四点)，其他对象没有父类的`this`和`prototype`，因此导致原型链继承失败**。

 我们来测试一下，修改原型链继承中的父类`fatherFn`：

```js
function fatherFn() {
  this.some = '父类的this属性';
  console.log('new fatherFn 期间生成的对象', this)
  return [ '数组对象', '函数对象', '日期对象', '正则对象', '等等等', '都不会返回new期间创建的新对象' ]
}
```

![原型链继承返回其他对象,将导致原型链继承失败](https://github.com/OBKoro1/articleImg_src/blob/master/2019/2019_9_16_inherit_2.png?raw=true)

PS： 本文中构造调用函数都不能返回其他函数，下文不再提及该点。

#### 不要使用对象字面量的形式创建原型方法：
> 这种方式很容易在不经意间，清除/覆盖了原型对象原有的属性/方法，不该为了稍微简便一点，而使用这种写法。

有些人在需要在原型对象上创建多个属性和方法，会使用对象字面量的形式来创建：

```js
sonFn.prototype = new fatherFn();
// 子类的prototype被清空后 重新赋值, 导致上一行代码失效
sonFn.prototype = {
    sonFnSome: '子类原型对象的属性',
    one: function() {},
    two: function() {},
    three: function() {}
}
```

还有一种常见的做法，该方式会导致函数原型对象的属性`constructor`丢失：

```js
function test() {}
test.prototype = {
    ...
}
```

#### 原型链继承的缺点

1. **父类使用`this`声明的属性被所有实例共享**

    原因是：实例化的父类(`sonFn.prototype = new fatherFn()`)是一次性赋值到子类实例的原型(`sonFn.prototype`)上，它会将父类通过`this`声明的属性也在赋值到`sonFn.prototype`上。

> 值得一提的是：很多博客中说，引用类型的属性被所有实例共享，通常会用数组来举例，实际上数组以及其他父类通过`this`声明的属性也只是通过[原型链查找](https://juejin.im/post/5d622f14f265da03a1486408#heading-11)去获取子类实例的原型(`sonFn.prototype`)上的值。

2. 创建子类实例时，无法向父类构造函数传参，不够灵活。

这种模式父类的属性、方法一开始就是定义好的，无法向父类传参，不够灵活。

```js
sonFn.prototype = new fatherFn()
```

### 借用构造函数继承(call)

```js
 function fatherFn(...arr) {
  this.some = '父类的this属性';
  this.params = arr // 父类的参数
}
fatherFn.prototype.fatherFnSome = '父类原型对象的属性或者方法';
function sonFn(fatherParams, ...sonParams) {
  fatherFn.call(this, ...fatherParams); // 核心步骤: 将fatherFn的this指向sonFn的this对象上
  this.obkoro1 = '子类的this属性';
  this.sonParams = sonParams; // 子类的参数
}
sonFn.prototype.sonFnSome = '子类原型对象的属性或者方法'
let fatherParamsArr = ['父类的参数1', '父类的参数2']
let sonParamsArr = ['子类的参数1', '子类的参数2']
const sonFnInstance = new sonFn(fatherParamsArr, ...sonParamsArr); // 实例化子类
console.log('借用构造函数子类实例', sonFnInstance)
```

#### 借用构造函数继承的子类实例

![借用构造函数继承的子类实例](https://github.com/OBKoro1/articleImg_src/blob/master/2019/2019_9_16_inherit_3.png?raw=true)

####  借用构造函数继承做了什么？

声明类，组织参数等，只是辅助的上下文代码，核心是借用构造函数使用`call`做了什么：

**一经调用`call/apply`它们就会立即执行函数，并在函数执行时改变函数的`this`指向**

```js
fatherFn.call(this, ...fatherParams); 
```

1. 在子类中使用`call`调用父类，`fatherFn`将会被立即执行，并且将`fatherFn`函数的this指向`sonFn`的`this`。
2. 因为函数执行了，所以`fatherFn`使用this声明的函数都会被**声明到`sonFn`的`this`对象**下。
3. 实例化子类，this将指向`new`期间创建的新对象，返回该新对象。
4. 对`fatherFn.prototype`没有任何操作，无法继承。

该对象的属性为：子类和父类声明的`this`属性/方法，它的原型是

PS: 关于call/apply/bind的更多细节，推荐查看我的博客：[js基础-面试官想知道你有多理解call,apply,bind？[不看后悔系列]](https://juejin.im/post/5d469e0851882544b85c32ef)

#### 借用构造函数继承的优缺点

优点：

1. 可以向父类传递参数
2. 解决了原型链继承中：父类属性使用`this`声明的属性会在所有实例共享的问题。

缺点：

1. 只能继承父类通过`this`声明的属性/方法，不能继承父类`prototype`上的属性/方法。
2. 父类方法无法复用：因为无法继承父类的`prototype`，所以每次子类实例化都要执行父类函数，重新声明父类`this`里所定义的方法，因此方法无法复用。

### 组合继承(call+new)
> **原理**：使用原型链继承(`new`)将`this`和`prototype`声明的属性/方法继承至子类的`prototype`上，使用借用构造函数来继承父类通过`this`声明属性和方法至子类实例的属性上。

```js
function fatherFn(...arr) {
  this.some = '父类的this属性';
  this.params = arr // 父类的参数
}
fatherFn.prototype.fatherFnSome = '父类原型对象的属性或者方法';
function sonFn() {
  fatherFn.call(this, '借用构造继承', '第二次调用'); // 借用构造继承: 继承父类通过this声明属性和方法至子类实例的属性上
  this.obkoro1 = '子类的this属性';
}
sonFn.prototype = new fatherFn('原型链继承', '第一次调用'); // 原型链继承: 将`this`和`prototype`声明的属性/方法继承至子类的`prototype`上
sonFn.prototype.sonFnSome = '子类原型对象的属性或者方法'
const sonFnInstance = new sonFn();
console.log('组合继承子类实例', sonFnInstance)
```

#### 组合继承的子类实例

![组合继承的子类实例](https://github.com/OBKoro1/articleImg_src/blob/master/2019/2019_9_16_inherit_4.png?raw=true)

从图中可以看到`fatherFn`通过`this`声明的属性/方法，在子类实例的属性上，和其原型上都复制了一份，原因在代码中也有注释：

1. 原型链继承: 父类通过`this`和`prototype`声明的属性/方法继承至子类的`prototype`上。
2. 借用构造继承: 父类通过this声明属性和方法继承至子类实例的属性上。

#### 组合继承的优缺点

优点：

完整继承(又不是不能用)，解决了：

1. 父类通过`this`声明属性/方法被子类实例共享的问题(原型链继承的问题)
    每次实例化子类将重新初始化父类通过`this`声明的属性，实例根据原型链查找规则，每次都会
2. 父类通过`prototype`声明的属性/方法无法继承的问题(借用构造函数的问题)。

缺点：

1. 两次调用父类函数(`new fatherFn()`和`fatherFn.call(this)`)，造成一定的性能损耗。
2. 因调用两次父类,导致父类通过`this`声明的属性/方法，生成两份的问题。
3. 原型链上下文丢失：子类和父类通过prototype声明的属性/方法都存在于子类的prototype上

### 原型式继承(`Object.create()`)

#### 继承对象原型-Object.create()实现

以下是`Object.create()`的模拟实现，使用`Object.create()`可以达成同样的效果，基本上现在都是使用`Object.create()`来做对象的原型继承。

```js
function cloneObject(obj){
  function F(){}
  F.prototype = obj; // 将被继承的对象作为空函数的prototype
  return new F(); // 返回new期间创建的新对象,此对象的原型为被继承的对象, 通过原型链查找可以拿到被继承对象的属性
}
```

PS：上面`Object.create()`实现原理可以记一下，有些公司可能会让你讲一下它的实现原理。

#### 例子：

```js
let oldObj = { p: 1 };
let newObj = cloneObject(oldObj)
oldObj.p = 2
console.log('oldObj newObj', oldObj, newObj)
```
![原型式继承](https://github.com/OBKoro1/articleImg_src/blob/master/2019/2019_9_16_inherit_5.png?raw=true)

#### 原型式继承优缺点：

优点： 兼容性好，最简单的对象继承。

缺点：

1. 因为旧对象(`oldObj`)是实例对象(`newObj`)的原型，多个实例共享被继承对象的属性，存在篡改的可能。
2. 无法传参

### 寄生式继承(封装继承过程)

> 创建一个**仅用于封装继承过程的函数，该函数在内部以某种方式来增强对象**，最后返回对象。

```js
function createAnother(original){
  var clone = cloneObject(original); // 继承一个对象 返回新函数
  // do something 以某种方式来增强对象
  clone.some = function(){}; // 方法
  clone.obkoro1 = '封装继承过程'; // 属性
  return clone; // 返回这个对象
}
```

使用场景：专门为对象来做某种固定方式的增强。

### 寄生组合式继承(call+寄生式封装)

#### 寄生组合式继承原理： 

1. 使用借用构造函数(`call`)来**继承父类this声明的属性/方法**
2. 通过寄生式封装函数设置父类prototype为子类prototype的原型来继**承父类的prototype声明的属性/方法**。

```js
function fatherFn(...arr) {
  this.some = '父类的this属性';
  this.params = arr // 父类的参数
}
fatherFn.prototype.fatherFnSome = '父类原型对象的属性或者方法';
function sonFn() {
  fatherFn.call(this, '借用构造继承'); // 核心1 借用构造继承: 继承父类通过this声明属性和方法至子类实例的属性上
  this.obkoro1 = '子类的this属性';
}
// 核心2 寄生式继承：封装了son.prototype对象原型式继承father.prototype的过程，并且增强了传入的对象。
function inheritPrototype(son, father) {
  const fatherFnPrototype = Object.create(father.prototype); // 原型式继承：浅拷贝father.prototype对象 father.prototype为新对象的原型
  son.prototype = fatherFnPrototype; // 设置father.prototype为son.prototype的原型
  son.prototype.constructor = son; // 修正constructor 指向
}
inheritPrototype(sonFn, fatherFn)
sonFn.prototype.sonFnSome = '子类原型对象的属性或者方法'
const sonFnInstance = new sonFn();
console.log('寄生组合式继承子类实例', sonFnInstance)
```

#### 寄生组合式继承子类实例

![寄生组合式继承子类实例](https://github.com/OBKoro1/articleImg_src/blob/master/2019/2019_9_16_inherit_6.png?raw=true)

#### 寄生组合式继承是最成熟的继承方法：
> 寄生组合式继承是最成熟的继承方法, 也是现在最常用的继承方法，众多JS库采用的继承方案也是它。

寄生组合式继承相对于组合继承有如下优点：

1. 只调用一次父类`fatherFn`构造函数。
2. 避免在子类prototype上创建不必要多余的属性。
3. 使用原型式继承父类的prototype，保持了原型链上下文不变。

    子类的prototype只有子类通过prototype声明的属性/方法和父类prototype上的属性/方法泾渭分明。


### ES6 extends继承：
> ES6继承的原理跟寄生组合式继承是一样的。

ES6 `extends`核心代码：

这段代码是通过[babel在线编译]([https://www.babeljs.cn/repl](https://www.babeljs.cn/repl)
)成es5, 用于子类prototype原型式继承父类`prototype`的属性/方法。

```js
// 寄生式继承 封装继承过程
function _inherits(son, father) {
  // 原型式继承: 设置father.prototype为son.prototype的原型 用于继承father.prototype的属性/方法
  son.prototype = Object.create(father && father.prototype);
  son.prototype.constructor = son; // 修正constructor 指向
  // 将父类设置为子类的原型 用于继承父类的静态属性/方法(father.some)
  if (father) {
    Object.setPrototypeOf
      ? Object.setPrototypeOf(son, father)
      : son.__proto__ = father;
  }
}
```

另外子类是通过借用构造函数继承(`call`)来继承父类通过`this`声明的属性/方法，也跟寄生组合式继承一样。


#### ES5继承与ES6继承的区别：
> 本段摘自[阮一峰-es6入门文档](http://es6.ruanyifeng.com/#docs/class-extends#%E7%AE%80%E4%BB%8B)

* ES5的继承实质上是**先创建子类的实例对象，再将父类的方法添加到this上**。
* ES6的继承是**先创建父类的实例对象this，再用子类的构造函数修改this**。

  因为子类没有自己的this对象，所以必须先调用父类的super()方法。


## 扩展：

### 为什么要修正construct指向？

在寄生组合式继承中有一段如下一段修正constructor 指向的代码，很多人对于它的作用以及为什么要修正它不太清楚。

```js
son.prototype.constructor = son; // 修正constructor 指向
```

#### construct的作用

[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor)的定义：**返回创建实例对象的`Object`构造函数的引用**。

即返回实例对象的构造函数的引用，例如：

```js
let instance = new sonFn()
instance.constructor // sonFn函数
```

#### `construct`的应用场景：

**当我们只有实例对象没有构造函数的引用时**：

某些场景下，我们对实例对象经过多轮导入导出，我们不知道实例是从哪个函数中构造出来或者追踪实例的构造函数，较为艰难。

这个时候就可以通过实例对象的`constructor`属性来得到构造函数的引用：

```js
let instance = new sonFn() // 实例化子类
export instance;
// 多轮导入+导出，导致sonFn追踪非常麻烦，或者不想在文件中再引入sonFn
let  fn = instance.construct
// do something： new fn() / fn.prototype / fn.length / fn.arguments等等
```

#### 保持`construct`指向的一致性：

因此每次重写函数的prototype都应该修正一下`construct`的指向，以保持读取`construct`行为的一致性。

### 小结

继承也是前端的高频面试题，了解本文中继承方法的优缺点，有助于更深刻的理解JS继承机制。除了组合继承和寄生式继承都是由其他方法组合而成的，分块理解会对它们理解的更深刻。

建议多看几遍本文，建个`html`文件试试文中的例子，两相结合更佳！

对prototype还不是很理解的同学，可以再看看：[JS基础-函数、对象和原型、原型链的关系](https://juejin.im/post/5d622f14f265da03a1486408)


#### 觉得我的博客对你有帮助的话，就给我点个[Star](https://github.com/OBKoro1/web_accumulate)吧！

[前端进阶积累](http://obkoro1.com/web_accumulate/)、[公众号](https://user-gold-cdn.xitu.io/2018/5/1/1631b6f52f7e7015?w=344&h=344&f=jpeg&s=8317)、[GitHub](https://github.com/OBKoro1)、wx:OBkoro1、邮箱：obkoro1@foxmail.com
 
 以上2019/9/22


作者：[OBKoro1](https://github.com/OBKoro1)


参考资料：

JS高级程序设计(红宝书)6.3继承

[JavaScript常用八种继承方案](https://juejin.im/post/5bcb2e295188255c55472db0)
<!-- 特殊字符串：用于修改/删除markdown的结尾提示语-OBKoro1 -->
### 点个[Star](https://github.com/OBKoro1/web_accumulate)支持我一下~

