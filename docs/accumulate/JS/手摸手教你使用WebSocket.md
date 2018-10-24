## 手摸手教你使用WebSocket[其实WebSocket也不难]

![](http://ww1.sinaimg.cn/large/005Y4rColy1fwhfykkrenj30w00k075m.jpg)

在本篇文章之前，`WebSocket`很多人听说过，没见过，没用过，以为是个很高大上的技术，实际上这个技术并不神秘，可以说是个很容易就能掌握的技术，希望在看完本文之后，马上把文中的栗子拿出来自己试一试，实践出真知。

> 游泳、健身了解一下：[博客](http://obkoro1.com/)、[前端积累文档](http://obkoro1.com/web_accumulate/accumulate/)、[公众号](https://user-gold-cdn.xitu.io/2018/5/1/1631b6f52f7e7015?w=344&h=344&f=jpeg&s=8317)、[GitHub](https://github.com/OBKoro1)


### `WebSocket`解决了什么问题：

客户端(浏览器)和服务器端进行通信，只能由客户端发起`ajax`请求，才能进行通信，服务器端无法主动向客户端推送信息。 

当出现类似体育赛事、聊天室、实时位置之类的场景时，客户端要获取服务器端的变化，就只能通过轮询(定时请求)来了解服务器端有没有新的信息变化。

> 轮询效率低，非常浪费资源(需要不断发送请求，不停链接服务器)

**WebSocket的出现，让服务器端可以主动向服务器端发送信息，使得浏览器具备了实时双向通信的能力,这就是`WebSocket`解决的问题**

### 一个超简单的栗子：

**新建一个`html`文件，将本栗子找个地方跑一下试试，即可轻松入门`WebSocket`：**

```js
function socketConnect(url) {
    // 客户端与服务器进行连接
    let ws = new WebSocket(url); // 返回`WebSocket`对象，赋值给变量ws
    // 连接成功回调
    ws.onopen = e => {
        console.log('连接成功', e)
        ws.send('我发送消息给服务端'); // 客户端与服务器端通信
    }
    // 监听服务器端返回的信息
    ws.onmessage = e => {
        console.log('服务器端返回：', e.data)
        // do something
    }
    return ws; // 返回websocket对象
}
let wsValue = socketConnect('ws://121.40.165.18:8800'); // websocket对象
```

上述栗子中`WebSocket`的接口地址出自：[WebSocket 在线测试](http://www.blue-zero.com/WebSocket/)，在开发的时候也可以用于测试后端给的地址是否可用。

### webSocket的class类：

当项目中很多地方使用WebSocket，把它封成一个class类，是更好的选择。

**下面的栗子，做了非常详细的注释，建个html文件也可直接使用**，websocket的常用`API`都放进去了。

**下方注释的代码，先不用管，涉及到心跳机制，用于保持WebSocket连接的**

```js
class WebSocketClass {
    /**
     * @description: 初始化实例属性，保存参数
     * @param {String} url ws的接口
     * @param {Function} msgCallback 服务器信息的回调传数据给函数
     * @param {String} name 可选值 用于区分ws，用于debugger
     */
    constructor(url, msgCallback, name = 'default') {
        this.url = url;
        this.msgCallback = msgCallback;
        this.name = name;
        this.ws = null;  // websocket对象
        this.status = null; // websocket是否关闭
    }
    /**
     * @description: 初始化 连接websocket或重连webSocket时调用
     * @param {*} 可选值 要传的数据
     */
    connect(data) {
        // 新建 WebSocket 实例
        this.ws = new WebSocket(this.url);
        this.ws.onopen = e => {
            // 连接ws成功回调
            this.status = 'open';
            console.log(`${this.name}连接成功`, e)
            // this.heartCheck();
            if (data !== undefined) {
                // 有要传的数据,就发给后端
                return this.ws.send(data);
            }
        }
        // 监听服务器端返回的信息
        this.ws.onmessage = e => {
            // 把数据传给回调函数，并执行回调
            // if (e.data === 'pong') {
            //     this.pingPong = 'pong'; // 服务器端返回pong,修改pingPong的状态
            // }
            return this.msgCallback(e.data);
        }
        // ws关闭回调
        this.ws.onclose = e => {
            this.closeHandle(e); // 判断是否关闭
        }
        // ws出错回调
        this.onerror = e => {
            this.closeHandle(e); // 判断是否关闭
        }
    }
    // heartCheck() {
    //     // 心跳机制的时间可以自己与后端约定
    //     this.pingPong = 'ping'; // ws的心跳机制状态值
    //     this.pingInterval = setInterval(() => {
    //         if (this.ws.readyState === 1) {
    //             // 检查ws为链接状态 才可发送
    //             this.ws.send('ping'); // 客户端发送ping
    //         }
    //     }, 10000)
    //     this.pongInterval = setInterval(() => {
    //         this.pingPong = false;
    //         if (this.pingPong === 'ping') {
    //             this.closeHandle('pingPong没有改变为pong'); // 没有返回pong 重启webSocket
    //         }
    //         // 重置为ping 若下一次 ping 发送失败 或者pong返回失败(pingPong不会改成pong)，将重启
    //         console.log('返回pong')
    //         this.pingPong = 'ping'
    //     }, 20000)
    // }
    // 发送信息给服务器
    sendHandle(data) {
        console.log(`${this.name}发送消息给服务器:`, data)
        return this.ws.send(data);
    }
    closeHandle(e = 'err') {
        // 因为webSocket并不稳定，规定只能手动关闭(调closeMyself方法)，否则就重连
        if (this.status !== 'close') {
            console.log(`${this.name}断开，重连websocket`, e)
            // if (this.pingInterval !== undefined && this.pongInterval !== undefined) {
            //     // 清除定时器
            //     clearInterval(this.pingInterval);
            //     clearInterval(this.pongInterval);
            // }
            this.connect(); // 重连
        } else {
            console.log(`${this.name}websocket手动关闭`)
        }
    }
    // 手动关闭WebSocket
    closeMyself() {
        console.log(`关闭${this.name}`)
        this.status = 'close';
        return this.ws.close();
    }
}
function someFn(data) {
    console.log('接收服务器消息的回调：', data);
}
// const wsValue = new WebSocketClass('ws://121.40.165.18:8800', someFn, 'wsName'); // 这个链接一天只能发送消息50次
const wsValue = new WebSocketClass('wss://echo.websocket.org', someFn, 'wsName'); // 阮一峰老师教程链接
wsValue.connect('立即与服务器通信'); // 连接服务器
// setTimeout(() => {
//     wsValue.sendHandle('传消息给服务器')
// }, 1000);
// setTimeout(() => {
//     wsValue.closeMyself(); // 关闭ws
// }, 10000)
```

栗子里面我直接写在了一起，可以把`class`放在一个js文件里面,`export`出去，然后在需要用的地方再`import`进来，把参数传进去就可以用了。

## WebSocket不稳定

WebSocket并不稳定，在使用一段时间后，可能会断开连接，貌似至今没有一个为何会断开连接的公论，所以我们需要让WebSocket保持连接状态，这里推荐两种方法。

### WebSocket设置变量，判断是否手动关闭连接：

**`class`类中就是用的这种方式**:设置一个变量，在webSocket关闭/报错的回调中，判断是不是手动关闭的，如果不是的话，就重新连接，这样做的优缺点如下：

* 优点：请求较少(相对于心跳连接)，易设置。
* 缺点：可能会导致丢失数据,在断开重连的这段时间中，恰好双方正在通信。

### WebSocket心跳机制：

> 因为第一种方案的缺点，并且可能会有其他一些未知情况导致断开连接而没有触发Error或Close事件。这样就导致实际连接已经断开了，而客户端和服务端却不知道，还在傻傻的等着消息来。

然后聪明的程序猿们想出了一种叫做**心跳机制**的解决方法：

客户端就像心跳一样每隔固定的时间发送一次`ping`，来告诉服务器，我还活着，而服务器也会返回`pong`，来告诉客户端，服务器还活着。

**具体的实现方法，在上面`class`的注释中，将其打开，即可看到效果**。 

## 关于WebSocket

怕一开始就堆太多文字性的内容，把各位吓跑了，现在大家已经会用了，我们再回头来看看WebSocket的其他知识点。

### WebSocket的当前状态:`WebSocket.readyState`

下面是`WebSocket.readyState`的四个值(四种状态)：

* 0: 表示正在连接
* 1: 表示连接成功，可以通信了
* 2: 表示连接正在关闭
* 3: 表示连接已经关闭，或者打开连接失败

我们可以利用当前状态来做一些事情，比如上面栗子中当WebSocket链接成功后，才允许客户端发送`ping`。

```js
if (this.ws.readyState === 1) {
    // 检查ws为链接状态 才可发送
    this.ws.send('ping'); // 客户端发送ping
}
```

### `WebSocket`还可以发送/接收 二进制数据

这里我也没有试过，我是看阮一峰老师的[WebSocket教程](http://www.ruanyifeng.com/blog/2017/05/websocket.html)才知道有这么个东西，有兴趣的可以再去谷歌，大家知道一下就可以。

二进制数据包括：`blob`对象和`Arraybuffer`对象，所以我们需要分开来处理。

```js
    // 接收数据
ws.onmessage = function(event){
    if(event.data instanceof ArrayBuffer){
        // 判断 ArrayBuffer 对象
    }
    
    if(event.data instanceof Blob){
        // 判断 Blob 对象
    }
}

// 发送 Blob 对象的例子
let file = document.querySelector('input[type="file"]').files[0];
ws.send(file);

// 发送 ArrayBuffer 对象的例子
var img = canvas_context.getImageData(0, 0, 400, 320);
var binary = new Uint8Array(img.data.length);
for (var i = 0; i < img.data.length; i++) {
    binary[i] = img.data[i];
}
ws.send(binary.buffer);
```


**如果你要发送的二进制数据很大的话，如何判断发送完毕：**

`webSocket.bufferedAmount`属性，表示还有多少字节的二进制数据没有发送出去：

```js
var data = new ArrayBuffer(10000000);
socket.send(data);
if (socket.bufferedAmount === 0) {
    // 发送完毕
} else {
    // 发送还没结束
}
```
上述栗子出自阮一峰老师的[WebSocket教程](http://www.ruanyifeng.com/blog/2017/05/websocket.html)

### WebSocket的优点：

最后再吹一波WebSocket：

1. 双向通信(一开始说的，也是最重要的一点)。
2. 数据格式比较轻量，性能开销小，通信高效

    协议控制的数据包头部较小，而HTTP协议每次通信都需要携带完整的头部
    
3. 更好的二进制支持
4. 没有同源限制，客户端可以与任意服务器通信
5. 与 HTTP 协议有着良好的兼容性。默认端口也是80和443，并且握手阶段采用 HTTP 协议，因此握手时不容易屏蔽，能通过各种 HTTP 代理服务器


---

## 结语

看了本文之后，如果还是有点迷糊的话，一定要把文中的两个栗子，新建个html文件跑起来，自己鼓捣鼓捣一下。不然读多少博客/教程都没有用，实践才出真知，切勿纸上谈兵。

### 希望看完的朋友可以点个喜欢/关注，您的支持是对我最大的鼓励。

[博客](http://obkoro1.com/)、[前端积累文档](http://obkoro1.com/web_accumulate/accumulate/)、[公众号](https://user-gold-cdn.xitu.io/2018/5/1/1631b6f52f7e7015?w=344&h=344&f=jpeg&s=8317)、[GitHub](https://github.com/OBKoro1)
 
 以上2018.10.22
 
 参考资料：
 
 [WebSocket 教程](http://www.ruanyifeng.com/blog/2017/05/websocket.html)
 
 [理解WebSocket心跳及重连机制](https://www.cnblogs.com/tugenhua0707/p/8648044.html)
 
 [WebSocket协议：5分钟从入门到精通](https://www.cnblogs.com/chyingp/p/websocket-deep-in.html)