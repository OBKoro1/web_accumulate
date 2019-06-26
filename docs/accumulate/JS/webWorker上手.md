## 前端er来学习一下webWorker吧

我们都知道，JavaScript 是单线程的，在同一时刻只能处理一个任务，我们会通过 setTimeout()、setInterval()、ajax 和事件处理程序等技术模拟“并行”。但都不是真正意义上的并行:

Web Worker 是 HTML5 标准的一部分，这一规范定义了一套 API，它允许一段 JavaScript 程序运行在主线程之外的另外一个线程中。

这在很大程度上利用了现在不断升级的电脑计算能力：能够在同一时间平行处理两个任务。

> 游泳、健身了解一下：[博客](http://obkoro1.com/)、[前端积累文档](http://obkoro1.com/web_accumulate/accumulate/)、[公众号](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/1631b6f52f7e7015?w=344&h=344&f=jpeg&s=8317?raw=true)、[GitHub](https://github.com/OBKoro1)

### 场景

**当我们有些任务需要花费大量的时间，进行复杂的运算**，就会导致页面卡死：用户点击页面需要很长的时间才能响应，因为前面的任务还未完成，后面的任务只能排队等待。对用户来说，这样的体验无疑是糟糕的，web worker 就是为了解决这种花费大量时间的复杂运算而诞生的！

### WebWorker 的作用：创建 worker 线程

WebWorker 允许在主线程之外再创建一个 worker 线程，**在主线程执行任务的同时，worker 线程也可以在后台执行它自己的任务，互不干扰**。

这样就让 JS 变成多线程的环境了，我们可以把高延迟、花费大量时间的运算，分给 worker 线程，最后再把结果返回给主线程就可以了，因为时间花费多的任务被 web worker 承担了，主线程就会很流畅了！

---

## 主线程

### 我们先来看一下栗子：

[codepen](https://codepen.io/OBKoro1/pen/JevMZY?editors=1000),这里我写了一个 class，里面有详细注释，可以参考一下。

### 创建 worker 对象：

主线程调用`new Worker()`构造函数，新建一个 worker 线程，构造函数的参数是一个 url，生成这个 url 的方法有两种：

1. 脚本文件：

   ```js
   const worker = new Worker('https://~.js');
   ```

   因为 worker 的两个限制：

   1. **分配给 Worker 线程运行的脚本文件，必须与主线程的脚本文件同源**。

   2. **worker 不能读取本地的文件**(不能打开本机的文件系统`file://`)，它所加载的脚本必须来自网络。

   可以看到限制还是比较多的，如果要使用这种形式的话，在项目中推荐把文件放在静态文件夹中，打包的时候直接拷贝进去，这样我们就可以拿到固定的链接了，

2. 字符串形式：

    ```js
    const data = `
        //  worker线程 do something
        `;
    // 转成二进制对象
    const blob = new Blob([data]);
    // 生成url
    const url = window.URL.createObjectURL(blob);
    // 加载url
    const worker = new Worker(url);
    ```

    [栗子](https://codepen.io/OBKoro1/pen/JevMZY?editors=1000)中就是使用这种形式的，方便我们演示。

    在项目中：我们可以把worker线程的逻辑写在js文件里面，然后字符串化，然后再export、import，配合webpack进行模块化管理,这样就很容易使用了。

### 主线程的其他 API：

#### 1. 主线程与 worker 线程通信:

```js
worker.postMessage({
  hello: ['hello', 'world']
});
```

它们**相互之间的通信可以传递对象和数组**，这样我们就可以根据相互之间传递的信息来进行一些操作，比如可以设置一个`type`属性，当值为`hello`时执行什么函数，当值为`world`的时候执行什么函数。

值得注意的是：它们之间通信是通过拷贝的形式来传递数据的，进行传递的对象需要经过序列化，接下来在另一端还需要反序列化。这就意味着：

1.  **我们不能传递不能被序列化的数据**，比如函数，会抛出错误的。
2.  在一端改变数据，另外一端不会受影响，因为数据不存在引用，是拷贝过来的。

#### 2. 监听 worker 线程返回的信息

```js
worker.onmessage = function (e) {
    console.log('父进程接收的数据：', e.data);
    // doSomething();
}
```

#### 3. 主线程关闭 worker 线程

Worker 线程一旦新建成功，就会始终运行，这样有利于随时响应主线程的通信。

这也是 Worker 比较耗费计算机的计算资源(`CPU`)的原因，一旦使用完毕，就应该关闭 worker 线程。

```js
worker.terminate(); // 主线程关闭worker线程
```

#### 4. 监听错误

```js
// worker线程报错
worker.onerror = e => {
    // e.filename - 发生错误的脚本文件名；e.lineno - 出现错误的行号；以及 e.message - 可读性良好的错误消息
    console.log('onerror', e);
};
```

也可以像我给出的[栗子](https://codepen.io/OBKoro1/pen/JevMZY?editors=1000)一样,把两个报错放在一起写，有报错把信息传出来就好了。

---

## Worker 线程

### self 代表 worker 进程自身

worker 线程的执行上下文是一个叫做`WorkerGlobalScope`的东西跟主线程的上下文(window)不一样。

我们可以使用`self`/`WorkerGlobalScope`来访问全局对象。

### 监听主线程传过来的信息：

```js
self.onmessage = e => {
    console.log('主线程传来的信息：', e.data);
    // do something
};
```
### 发送信息给主线程

```js
self.postMessage({
    hello: [ '这条信息', '来自worker线程' ]
});
```

### worker 线程关闭自身

```js
self.close()
```

### worker 线程加载脚本：

Worker 线程能够访问一个全局函数 imprtScripts()来引入脚本，该函数接受 0 个或者多个 URI 作为参数。

```js
importScripts('http~.js','http~2.js');
```

1. 脚本中的全局变量都能被 worker 线程使用。

2. 脚本的下载顺序是不固定的，但执行时会按照传入 importScripts() 中的文件名顺序进行，这个过程是同步的。

### Worker 线程限制

因为 worker 创造了另外一个线程，不在主线程上，相应的会有一些限制，我们无法使用下列对象：

1. window 对象
2. document 对象
3. DOM 对象
4. parent 对象

**我们可以使用下列对象/功能**：

1. 浏览器：navigator 对象

2. URL：location 对象，只读

3. 发送请求：XMLHttpRequest 对象

4. 定时器：setTimeout/setInterval，在 worker 线程轮询也是很棒！

5. 应用缓存：Application Cache

---

### 多个 worker 线程

1. **在主线程内可以创建多个 worker 线程**

   [栗子](https://codepen.io/OBKoro1/pen/JevMZY?editors=1010)最下方有。

2. **worker 线程内还可以新建 worker 线程，使用同源的脚本文件创建**。

   在 worker 线程内再新建 worker 线程就不能使用`window.URL.createObjectURL(blob)`，需要使用同源的脚本文件来创建新的 worker 线程，因为我们无法访问到`window`对象。

   这里不方便演示，跟在主线程创建 worker 线程是一个套路，只是改成了脚本文件形式创建 worker 线程。

### 线程间转移二进制数据

因为主线程与 worker 线程之间的通信是拷贝关系，当我们要传递一个巨大的二进制文件给 worker 线程处理时(worker 线程就是用来干这个的)，这时候使用拷贝的方式来传递数据，无疑会造成性能问题。

**幸运的是，Web Worker 提供了一中转移数据的方式，允许主线程把二进制数据直接转移给子线程**。这种方式比原先拷贝的方式，有巨大的性能提升。

**一旦数据转移到其他线程，原先线程就无法再使用这些二进制数据了，这是为了防止出现多个线程同时修改数据的麻烦局面**

下方栗子出自[浅谈 HTML5 Web Worker](https://juejin.im/post/59c1b3645188250ea1502e46#comment)

```js
// 创建二进制数据
var uInt8Array = new Uint8Array(1024*1024*32); // 32MB
for (var i = 0; i < uInt8Array .length; ++i) {
    uInt8Array[i] = i;
}
console.log(uInt8Array.length); // 传递前长度:33554432
// 字符串形式创建worker线程
var myTask = `
    onmessage = function (e) {
        var data = e.data;
        console.log('worker:', data);
    };
`;

var blob = new Blob([myTask]);
var myWorker = new Worker(window.URL.createObjectURL(blob));

// 使用这个格式(a,[a]) 来转移二进制数据
myWorker.postMessage(uInt8Array.buffer, [uInt8Array.buffer]); // 发送数据、转移数据

console.log(uInt8Array.length); // 传递后长度:0，原先线程内没有这个数据了
```    

> 二进制数据有：File、Blob、ArrayBuffer 等类型，也允许在 worker 线程之间发送，**这对于影像处理、声音处理、3D 运算等就非常方便了，不会产生性能负担**

### 应用场景：

1. 数学运算

2. 图像、影音等文件处理

3. 大量数据检索

   比如用户输入时，我们在后台检索答案，或者帮助用户联想，纠错等操作.

4. 耗时任务都丢到 webworker 解放我们的主线程。

### 兼容：

没有找到具体的制定日期，有篇博客是在 10 年的 7 月份写的，也就是说 web worker 至少出现了八年了，以下兼容摘自[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Using_web_workers)：

Chrome：4, Firefox：3.5, IE：10.0, Opera：10.6, Safari：4

现在兼容还是做的比较好的，如果实在不放心的话：

```js
if (window.Worker) {
    ...
}else{
    ...
}
```

---

## 结语：

Web Worker的出现，给浏览器带来了后台计算的能力，把耗时的任务分配给worker线程来做，在很大程度上缓解了主线程UI渲染阻塞的问题，提升页面性能。

使用起来也不复杂，以后有复杂的问题，记得要丢给我们浏览器的后台(web worker)来处理

看完之后，一定要研究一下文中的栗子，自己鼓捣鼓捣，实践出真知！

PS: 推荐一下我上个月写的[手摸手教你使用WebSocket](https://juejin.im/post/5bcad1326fb9a05cda779d0b)，感兴趣的可以看一下。

 以上2018.11.25
 
 参考资料：
 
 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Using_web_workers)
 
 [Web Worker 使用教程](http://www.ruanyifeng.com/blog/2018/07/web-worker.html)
 
 [浅谈HTML5 Web Worker](https://juejin.im/post/59c1b3645188250ea1502e46)

### 鼓励我一下：

觉得还不错的话，给我的项目点个[star](https://github.com/OBKoro1/Brush_algorithm)吧

游泳、健身了解一下：[博客](http://obkoro1.com/)、[前端算法](https://github.com/OBKoro1/Brush_algorithm)、[公众号](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/1631b6f52f7e7015?w=344&h=344&f=jpeg&s=8317?raw=true)

