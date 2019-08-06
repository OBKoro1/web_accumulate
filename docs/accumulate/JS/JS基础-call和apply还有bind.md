# JS基础系列-重新认识call apply bind

函数原型链中的 apply，call 和 bind 方法是 JavaScript 中相当重要的概念，与 this 关键字密切相关，相当一部分人对它们的理解还是比较浅显，所谓js基础扎实，绕不开这些基础常用的API，这次让我们来彻底掌握它们吧！

### 目录

1. call,apply,bind的基本介绍
2. call/apply/bind的核心理念：借用方法
3. call和apply的应用场景
4. bind的应用场景
5. 中高级面试题：手写call/apply、bind

---

## call,apply,bind的基本介绍

#### 语法：

```js
fun.call(thisArg, param1, param2, ...)
fun.apply(thisArg, [param1,param2,...])
fun.bind(thisArg, param1, param2, ...)
```

#### 返回值：

call/apply：`fun`执行的结果
bind：返回`fun`的拷贝，并拥有指定的`this`值和初始参数

#### 参数

`thisArg`(可选):

1. **`fun`的`this`指向`thisArg`对象**
2. 非严格模式下：thisArg指定为null，undefined，fun中的this指向window对象.
3. 严格模式下：`fun`的`this`为`undefined`
4. 值为原始值(数字，字符串，布尔值)的this会指向该原始值的自动包装对象，如 String、Number、Boolean

`param1,param2`(可选): 传给`fun`的参数。

1. 如果param不传或为 null/undefined，则表示不需要传入任何参数.
2. apply第二个参数为数组，数组内的值为传给`fun`的参数。

### 调用`call`/`apply`/`bind`的必须是个函数

call、apply和bind是挂在Function对象上的三个方法,只有函数才有这些方法。

只要是函数就可以，比如: `Object.prototype.toString`就是个函数，我们经常看到这样的用法：`Object.prototype.toString.call(data)`

### 作用：

改变函数执行时的this指向，目前所有关于它们的运用，都是基于这一点来进行的。

### 如何不弄混call和apply

> 弄混这两个API的不在少数，不要小看这个问题，记住下面的这个方法就好了。

`apply`是以`a`开头，它传给`fun`的参数是`Array`，也是以`a`开头的。

### 区别：

#### call与apply的唯一区别

传给`fun`的参数写法不同：

* `apply`是第2个参数，这个参数是一个数组：传给`fun`参数都写在数组中。
* `call`从第2~n的参数都是传给`fun`的。

#### call/apply与bind的区别

**执行**：

* call/apply改变了函数的this上下文后马上**执行该函数**
* bind则是返回改变了上下文后的函数,**不执行该函数**

**返回值**:

* call/apply 返回`fun`的执行结果
* bind返回fun的拷贝，并指定了fun的this指向，保存了fun的参数。

返回值这段在下方bind应用中有详细的示例解析。

## call/apply/bind的核心理念：借用方法

看到一个非常棒的[例子](https://juejin.im/post/5c493086f265da6115111ce4)：

生活中：

平时没时间做饭的我，周末想给孩子炖个腌笃鲜尝尝。但是没有适合的锅，而我又不想出去买。所以就问邻居借了一个锅来用，这样既达到了目的，又节省了开支，一举两得。

程序中：

A对象有个方法，B对象因为某种原因也需要用到同样的方法，那么这时候我们是单独为 B 对象扩展一个方法呢，还是借用一下 A 对象的方法呢？

当然是借用 A 对象的方法啦，既达到了目的，又节省了内存。

**这就是call/apply/bind的核心理念：借用方法**。

**借助已实现的方法，改变方法中数据的this指向，减少重复代码，节省内存。**

## call和apply的应用场景：

> 这些应用场景，多加体会就可以发现它们的理念都是：借用方法


1. 判断数据类型：

`Object.prototype.toString`用来判断类型再合适不过，借用它我们几乎可以判断所有类型的数据：

```js
function isType(data, type) {
    const typeObj = {
        '[object String]': 'string',
        '[object Number]': 'number',
        '[object Boolean]': 'boolean',
        '[object Null]': 'null',
        '[object Undefined]': 'undefined',
        '[object Object]': 'object',
        '[object Array]': 'array',
        '[object Function]': 'function',
        '[object Date]': 'date', // Object.prototype.toString.call(new Date())
        '[object RegExp]': 'regExp',
        '[object Map]': 'map',
        '[object Set]': 'set',
        '[object HTMLDivElement]': 'dom', // document.querySelector('#app')
        '[object WeakMap]': 'weakMap',
        '[object Window]': 'window',  // Object.prototype.toString.call(window)
        '[object Error]': 'error', // new Error('1')
        '[object Arguments]': 'arguments',
    }
    let name = Object.prototype.toString.call(data) // 借用Object.prototype.toString()获取数据类型
    let typeName = typeObj[name] || '未知类型' // 匹配数据类型
    return typeName === type // 判断该数据类型是否为传入的类型
}
console.log(
    isType({}, 'object'), // true
    isType([], 'array'), // true
    isType(new Date(), 'object'), // false
    isType(new Date(), 'date'), // true
)
```

2. 类数组借用数组的方法：

类数组因为不是真正的数组所有没有数组类型上自带的种种方法，所以我们需要去借用数组的方法。

比如借用数组的push方法：

```js
var arrayLike = {
  0: 'OB',
  1: 'Koro1',
  length: 2
}
Array.prototype.push.call(arrayLike, '添加元素1', '添加元素2');
console.log(arrayLike) // {"0":"OB","1":"Koro1","2":"添加元素1","3":"添加元素2","length":4}
```

3. apply获取数组最大值最小值：

apply直接传递数组做要调用方法的参数，也省一步展开数组，比如使用`Math.max`、`Math.min`来获取数组的最大值/最小值:

```js
const arr = [15, 6, 12, 13, 16];
const max = Math.max.apply(Math, arr); // 16
const min = Math.min.apply(Math, arr); // 6
```

4.  继承 

ES5的继承也都是通过借用父类的构造方法来实现父类方法/属性的继承：

```js
// 父类
function supFather(name) {
    this.name = name;
    this.colors = ['red', 'blue', 'green']; // 复杂类型
}
supFather.prototype.sayName = function (age) {
    console.log(this.name, 'age');
};
// 子类
function sub(name, age) {
    // 借用父类的方法：修改它的this指向,赋值父类的构造函数里面方法、属性到子类上
    supFather.call(this, name);
    this.age = age;
}
// 重写子类的prototype，修正constructor指向
function inheritPrototype(sonFn, fatherFn) {
    sonFn.prototype = Object.create(fatherFn.prototype); // 继承父类的属性以及方法
    sonFn.prototype.constructor = sonFn; // 修正constructor指向到继承的那个函数上
}
inheritPrototype(sub, supFather);
sub.prototype.sayAge = function () {
    console.log(this.age, 'foo');
};
// 实例化子类，可以在实例上找到属性、方法
const instance1 = new sub("OBKoro1", 24);
const instance2 = new sub("小明", 18);
instance1.colors.push('black')
console.log(instance1) // {"name":"OBKoro1","colors":["red","blue","green","black"],"age":24}
console.log(instance2) // {"name":"小明","colors":["red","blue","green"],"age":18} 
```

类似的应用场景还有很多，就不赘述了，关键在于它们借用方法的理念，不理解的话多看几遍。

## call、apply，该用哪个？、

call,apply的效果完全一样，它们的区别也在于

* **参数数量/顺序确定就用call，参数数量/顺序不确定的话就用apply**。
* 考虑可读性：参数数量不多就用call，参数数量比较多的话，把参数整合成数组，使用apply。
* 参数集合已经是一个数组的情况，用apply，比如上文的获取数组最大值/最小值。

参数数量/顺序不确定的话就用apply，比如以下示例：

```js
const obj = {
    age: 24,
    name: 'OBKoro1',
}
const obj2 = {
    age: 777
}
callObj(obj, handle)
callObj(obj2, handle)
// 根据某些条件来决定要传递参数的数量、以及顺序
function callObj(thisAge, fn) {
    let params = []
    if (thisAge.name) {
        params.push(thisAge.name)
    }
    if (thisAge.age) {
        params.push(thisAge.age)
    }
    fn.apply(thisAge, params) // 数量和顺序不确定 不能使用call
}
function handle(...params) {
    console.log('params', params) // do some thing
}
```

## bind的应用场景：

#### 1. 保存函数参数：

首先来看下一道经典的面试题：

```js
for (var i = 1; i <= 5; i++) {
   setTimeout(function test() {
        console.log(i) // 依次输出：6 6 6 6 6
    }, i * 1000);
}
```

造成这个现象的原因是等到`setTimeout`异步执行时,`i`已经变成6了。

关于js事件循环机制不理解的同学，可以看我这篇博客：[Js 的事件循环(Event Loop)机制以及实例讲解](https://juejin.im/post/5b24b116e51d4558a65fdb70)

那么如何使他输出: 1,2,3,4,5呢？

方法有很多：

* 闭包, 保存变量

```js
for (var i = 1; i <= 5; i++) {
    (function (i) {
        setTimeout(function () {
            console.log('闭包:', i); // 依次输出：1 2 3 4 5
        }, i * 1000);
    }(i));
}
```
在这里创建了一个闭包，每次循环都会把`i`的最新值传进去，然后被闭包保存起来。

* **bind**

```js
for (var i = 1; i <= 5; i++) {
    // 缓存参数
    setTimeout(function (i) {
        console.log('bind', i) // 依次输出：1 2 3 4 5
    }.bind(null, i), i * 1000);
}
```
**实际上这里也用了闭包，我们知道bind会返回一个函数，这个函数也是闭包**。

它保存了函数的this指向、初始参数，每次`i`的变更都会被bind的闭包存起来，所以输出1-5。

具体细节，下面有个手写bind方法，研究一下，就能搞懂了。

* `let`

用`let`声明`i`也可以输出1-5: 因为`let`是块级作用域,所以每次都会创建一个新的变量,所以`setTimeout`每次读的值都是不同的,[详解](https://segmentfault.com/q/1010000007541743)。


#### 2. 回调函数this丢失问题：

这是一个常见的问题，下面是我在开发VSCode插件处理`webview`通信时，遇到的真实问题，一开始以为VSCode的API哪里出问题，调试了一番才发现是`this`指向丢失的问题。

```js
class Page {
    constructor(callBack) {
        this.className = 'Page'
        this.MessageCallBack = callBack // 
        this.MessageCallBack('发给注册页面的信息') // 执行PageA的回调函数
    }
}
class PageA {
    constructor() {
        this.className = 'PageA'
        this.pageClass = new Page(this.handleMessage) // 注册页面 传递回调函数 问题在这里
    }
    // 与页面通信回调
    handleMessage(msg) {
        console.log('处理通信', this.className, msg) //  'Page' this指向错误
    }
}
new PageA()
```

#### 回调函数`this`为何会丢失？

显然声明的时候不会出现问题，执行回调函数的时候也不可能出现问题。

问题出在传递回调函数的时候：

```js
this.pageClass = new Page(this.handleMessage)
```
因为传递过去的`this.handleMessage`是一个函数内存地址，没有上下文对象，也就是说该函数没有绑定它的`this`指向。

那它的`this`指向于它所应用的[绑定规则](https://juejin.im/post/5b3715def265da59af40a630#comment)：

```js
class Page {
    constructor(callBack) {
        this.className = 'Page'
        // callBack() // 直接执行的话 由于class 内部是严格模式，所以this 实际指向的是 undefined
        this.MessageCallBack = callBack // 回调函数的this 隐式绑定到class page
        this.MessageCallBack('发给注册页面的信息')
    }
}
```

既然知道问题了，那我们只要绑定回调函数的`this`指向为`PageA`就解决问题了。

**回调函数this丢失的解决方案**：

1. `bind`绑定回调函数的`this`指向：

这是典型bind的应用场景, 绑定this指向，用做回调函数。

```js
this.pageClass = new Page(this.handleMessage.bind(this)) // 绑定回调函数的this指向
```

PS： 这也是为什么`react`的`render`函数在绑定回调函数的时候，也要使用bind绑定一下`this`的指向，也是因为同样的问题以及原理。

2. 箭头函数绑定this指向

箭头函数的this指向定义的时候外层第一个普通函数的this，在这里指的是class类：`PageA`

这块内容，可以看下我之前写的博客：[详解箭头函数和普通函数的区别以及箭头函数的注意事项、不适用场景](https://juejin.im/post/5c76972af265da2dc4538b64#heading-3)

```js
this.pageClass = new Page(() => this.handleMessage()) // 箭头函数绑定this指向
```

## 中高级面试题-手写call/apply、bind：

在大厂的面试中，手写实现call,apply,bind(特别是bind)一直是比较高频的面试题，在这里我们也一起来实现一下这几个函数。

#### 你能手写实现一个`call`吗？

**思路**

1. 根据call的规则设置上下文对象,也就是`this`的指向。
2. 通过设置`context`的属性,将函数的this指向[隐式绑定](https://juejin.im/post/5b3715def265da59af40a630#heading-4)到context上
3. 通过隐式绑定执行函数并传递参数。
4. 删除临时属性，返回函数执行结果

```js
Function.prototype.myCall = function (context, ...arr) {
    if (context === null || context === undefined) {
       // 指定为 null 和 undefined 的 this 值会自动指向全局对象(浏览器中为window)
        context = window 
    } else {
        context = Object(context) // 值为原始值（数字，字符串，布尔值）的 this 会指向该原始值的实例对象
    }
    const specialPrototype = Symbol('特殊属性Symbol') // 用于临时储存函数
    context[specialPrototype] = this; // 函数的this指向隐式绑定到context上
    let result = context[specialPrototype](...arr); // 通过隐式绑定执行函数并传递参数
    delete context[specialPrototype]; // 删除上下文对象的属性
    return result; // 返回函数执行结果
};
```

#### 判断函数的上下文对象：

很多人判断函数上下文对象，只是简单的以`context`是否为false来判断,比如：

```js
// 判断函数上下文绑定到`window`不够严谨
context = context ? Object(context) : window; 
context = context || window; 
```

经过测试,以下三种为false的情况,函数的上下文对象都会绑定到`window`上：

```js
// 网上的其他绑定函数上下文对象的方案: context = context || window; 
function handle(...params) {
    this.test = 'handle'
    console.log('params', this, ...params) // do some thing
}
handle.elseCall('') // window
handle.elseCall(0) // window
handle.elseCall(false) // window
```
而`call`则将函数的上下文对象会绑定到这些原始值的实例对象上：

![原始值的实例对象](https://user-gold-cdn.xitu.io/2019/8/4/16c5bdb742a5f2b0?w=474&h=92&f=png&s=18011)

所以正确的解决方案，应该是像我上面那么做：

```js
// 正确判断函数上下文对象
    if (context === null || context === undefined) {
       // 指定为 null 和 undefined 的 this 值会自动指向全局对象(浏览器中为window)
        context = window 
    } else {
        context = Object(context) // 值为原始值（数字，字符串，布尔值）的 this 会指向该原始值的实例对象
    }
```

### 使用`Symbol`临时储存函数

尽管之前用的属性是`testFn`但不得不承认，还是有跟上下文对象的原属性冲突的风险,经网友提醒使用`Symbol`就不会出现冲突了。

考虑兼容的话,还是用尽量特殊的属性，比如带上自己的ID：`OBKoro1TestFn`。

#### 你能手写实现一个`apply`吗？

思路：

1. 传递给函数的参数处理，不太一样，其他部分跟`call`一样。
2. `apply`接受第二个参数为类数组对象, 这里用了JavaScript权威指南中判断是否为类数组对象的方法。

```js
Function.prototype.myApply = function (context) {
    if (context === null || context === undefined) {
        context = window // 指定为 null 和 undefined 的 this 值会自动指向全局对象(浏览器中为window)
    } else {
        context = Object(context) // 值为原始值（数字，字符串，布尔值）的 this 会指向该原始值的实例对象
    }
    // JavaScript权威指南判断是否为类数组对象
    function isArrayLike(o) {
        if (o &&                                    // o不是null、undefined等
            typeof o === 'object' &&                // o是对象
            isFinite(o.length) &&                   // o.length是有限数值
            o.length >= 0 &&                        // o.length为非负值
            o.length === Math.floor(o.length) &&    // o.length是整数
            o.length < 4294967296)                  // o.length < 2^32
            return true
        else
            return false
    }
    const specialPrototype = Symbol('特殊属性Symbol') // 用于临时储存函数
    context[specialPrototype] = this; // 隐式绑定this指向到context上
    let args = arguments[1]; // 获取参数数组
    let result
    // 处理传进来的第二个参数
    if (args) {
        // 是否传递第二个参数
        if (!Array.isArray(args) && !isArrayLike(args)) {
            throw new TypeError('myApply 第二个参数不为数组并且不为类数组对象抛出错误');
        } else {
            args = Array.from(args) // 转为数组
            result = context[specialPrototype](...args); // 执行函数并展开数组，传递函数参数
        }
    } else {
        result = context[specialPrototype](); // 执行函数 
    }
    delete context[specialPrototype]; // 删除上下文对象的属性
    return result; // 返回函数执行结果
};
```
#### 你能手写实现一个`bind`吗？


**划重点**：

手写`bind`是大厂中的一个高频的面试题，如果面试的中高级前端，只是能说出它们的区别，用法并不能脱颖而出，理解要有足够的深度才能抱得offer归！

**思路**

1. 拷贝源函数:
    *  通过变量储存源函数
    * 使用`Object.create`复制源函数的prototype给fToBind
2. 返回拷贝的函数
3. 调用拷贝的函数：
    * new调用判断：通过`instanceof`判断函数是否通过`new`调用，来决定绑定的`context`
    * 绑定this+传递参数
    * 返回源函数的执行结果

```js
Function.prototype.myBind = function (objThis, ...params) {
    const thisFn = this; // 存储源函数以及上方的params(函数参数)
    // 对返回的函数 secondParams 二次传参
    let fToBind = function (...secondParams) {
        console.log('secondParams',secondParams,...secondParams)
        const isNew = this instanceof fToBind // this是否是fToBind的实例 也就是返回的fToBind是否通过new调用
        const context = isNew ? this : Object(objThis) // new调用就绑定到this上,否则就绑定到传入的objThis上
        return thisFn.call(context, ...params, ...secondParams); // 用call调用源函数绑定this的指向并传递参数,返回执行结果
    };
    fToBind.prototype = Object.create(thisFn.prototype); // 复制源函数的prototype给fToBind
    return fToBind; // 返回拷贝的函数
};
```

### 小结

本来以为这篇会写的很快，结果断断续续的写了好几天，终于把这三个API相关知识介绍清楚了，希望大家看完之后，面试的时候再遇到这个问题，就可以海陆空全方位的装逼了^_^
<!-- 特殊字符串：用于修改/删除markdown的结尾提示语-OBKoro1 -->
### 点个[Star](https://github.com/OBKoro1/web_accumulate)支持我一下~

