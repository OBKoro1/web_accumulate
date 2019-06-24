## js 调用栈机制与ES6尾调用优化介绍 

调用栈的英文名叫做Call Stack，大家或多或少是有听过的，但是对于js调用栈的工作方式以及如何在工作中利用这一特性，大部分人可能没有进行过更深入的研究，这块内容可以说对我们前端来说就是所谓的基础知识，咋一看好像用处并没有很大，但掌握好这个知识点，就可以让我们在以后可以走的更远，走的更快！

> [博客](http://obkoro1.com/)、[前端积累文档](http://obkoro1.com/web_accumulate/accumulate/)、[公众号](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/1631b6f52f7e7015?w=344&h=344&f=jpeg&s=8317?raw=true)、[GitHub](https://github.com/OBKoro1)

---

### 目录

1. 数据结构：栈
2. 调用栈是什么？用来做什么？ 
3. 调用栈的运行机制
4. 调用栈优化内存
5. 调用栈debug大法

### 数据结构：栈

栈是一种遵从**后进先出(`LIFO`)原则的有序集合**，新元素都靠近栈顶，旧元素都接近栈底。

生活中的栗子，帮助一下理解：

餐厅里面堆放的盘子(栈)，一开始放的都在下面(先进)，后面放的都在上面(后进)，洗盘子的时候先从上面开始洗(先出)。

### 调用栈是什么？用来做什么？


1. **调用栈是一种栈结构的数据，它是由调用侦组成的**。
2. **调用栈记录了函数的执行顺序和函数内部变量等信息**。

#### 调用栈的运行机制

**机制**：

程序运行到一个函数，它就会将其添加到调用栈中，当从这个函数返回的时候，就会将这个函数从调用栈中删掉。

看一下例子帮助理解：

```js
// 调用栈中的执行步骤用数字表示
printSquare(5); // 1 添加
function printSquare(x) {
    var s = multiply(x, x); // 2 添加 => 3 运行完成，内部没有再调用其他函数，删掉
    console.log(s); // 4 添加 => 5 删掉
    // 运行完成 删掉printSquare
}
function multiply(x, y) {
    return x * y;
}
```

调用栈中的执行步骤如下(删除multiply的步骤被省略了)：

![](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/16acb4a439190d49?w=1024&h=768&f=png&s=68010?raw=true)

**调用侦**：

每个进入到调用栈中的函数，都会分配到一个单独的栈空间，称为“调用侦”。

在调用栈中每个“调用侦”都对应一个函数，最上方的调用帧称为“当前帧”，调用栈是由所有的调用侦形成的。

找到一张图片，调用侦：

![](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/16ace8030a36c8dd?w=326&h=440&f=png&s=50219?raw=true)

### 调用栈优化内存

**调用栈的内存消耗**：

如上图，函数的变量等信息会被调用侦保存起来，所以**调用侦中的变量不会被垃圾收集器回收**。

当函数嵌套的层级比较深了，调用栈中的调用侦比较多的时候，这些信息对内存消耗是非常大的。

针对这种情况除了我们要尽量避免函数层级嵌套的比较深之外，ES6提供了“尾调用优化”来解决调用侦过多，引起的内存消耗过大的问题。

**何谓尾调用**：

尾调用指的是：**函数的最后一步是调用另一个函数**。

```js
function f(x){
  return g(x); // 最后一步调用另一个函数并且使用return
}
function f(x){
  g(x); // 没有return 不算尾调用 因为不知道后面还有没有操作
  // return undefined; // 隐式的return
}
```

**尾调用优化优化了什么？**

尾调用用来**删除外层无用的调用侦**，只保留内层函数的调用侦，来节省浏览器的内存。

下面这个例子调用栈中的调用侦一直只有一项，如果不使用尾调用的话会出现三个调用侦：

```js
a() // 1 添加a到调用栈
function a(){
    return b(); // 在调用栈中删除a 添加b
}
function b(){
    return c() // 删除b 添加c
}
```

**防止爆栈**：

浏览器对[调用栈都有大小限制](https://codeday.me/bug/20170824/62171.html)，在ES6之前递归比较深的话，很容易出现“爆栈”问题(stack overflow)。

现在可以使用“尾调用优化”来写一个“尾递归”，只保存一个调用侦，来防止爆栈问题。

**注意**：

1. 只有不再用到外层函数的内部变量，内层函数的调用帧才会取代外层函数的调用帧。

> 如果要使用外层函数的变量，可以通过参数的形式传到内层函数中

```js
function a(){
    var aa = 1;
    let b = val => aa + val // 使用了外层函数的参数aa
    return b(2) // 无法进行尾调用优化
}
```
2. 尾调用优化只在严格模式下开启，非严格模式是无效的。
3. 如果环境不支持“尾调用优化”，代码还可以正常运行，是无害的！

**更多**：

关于尾递归以及更多尾调用优化的内容，推荐查阅[ES6入门-阮一峰](http://es6.ruanyifeng.com/#docs/function#%E5%B0%BE%E8%B0%83%E7%94%A8%E4%BC%98%E5%8C%96)

### 调用栈debug大法

**查看调用栈有什么用**

1. 查看函数的调用顺序是否跟预期一致，比如不同判断调用不同函数。
2. 快速定位问题/修改三方库的代码。
    
    当接手一个历史项目，或者引用第三方库出现问题的时候，可以先查看对应API的调用栈，找到其中涉及的关键函数，针对性的修复它。
    
    通过查看调用栈的形式，帮助我快速定位问题，修改三方库的源码。

**如何查看调用栈**

1. 只查看调用栈：`console.trace`

```js
a()
function a() {
    b();
}
function b() {
    c()
}
function c() {
    let aa = 1;
    console.trace()
}
```
如图所示,点击右侧还能查看代码位置：

![](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/16ad3f508ab127a9?w=678&h=318&f=png&s=29341?raw=true)

2. `bugger`打断点形式，这也是我最喜欢的调试方式：

![](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/16ad3ff354f2dac3?w=2024&h=1240&f=png&s=339262?raw=true)


## 结语

本文主要讲了这几个方面的内容：

1. 理解调用栈的运行机制，对代码背后的一些执行机制也可以更加了解，帮助我们在百尺竿头更进一步。
2. 我们应该在日常的code中，有意识的使用ES6的“尾调用优化”，来减少调用栈的长度，节省客户端内存。
2. 利用调用栈，对第三方库或者不熟悉的项目，可以更快速的定位问题，提高我们debug速度。


最后：之前写过一篇关于[垃圾回收机制与内存泄露](https://juejin.im/post/5b40581e5188251ac446c716)的文章，感兴趣的同学可以扩展一下。
 
 以上2019/5/19
 
 参考资料：
 
 [JS垃圾回收机制与常见内存泄露的解决方法](https://juejin.im/post/5b40581e5188251ac446c716)

[ES6入门-阮一峰](http://es6.ruanyifeng.com/#docs/function#%E5%B0%BE%E8%B0%83%E7%94%A8%E4%BC%98%E5%8C%96)

[JavaScript 如何工作：对引擎、运行时、调用堆栈的概述](https://juejin.im/post/5a05b4576fb9a04519690d42)
 
[浅析javascript调用栈](https://segmentfault.com/a/1190000010360316)  

### 支持一下：

觉得还不错的话，给项目点个[star](https://github.com/OBKoro1/Brush_algorithm)吧

[博客](http://obkoro1.com/)、[前端算法](https://github.com/OBKoro1/Brush_algorithm)、[公众号](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/1631b6f52f7e7015?w=344&h=344&f=jpeg&s=8317?raw=true)