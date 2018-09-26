## input 的一些坑点分享

## 本文内容包括：

1. 移动端底部 input 被弹出的键盘遮挡。
2. 控制 input 显/隐密码。
3. 在 input 中输入 emoji 表情导致请求失败。
4. input 多行输入显示换行。
5. 输入框首尾清除空格-trim()
6. 在 input 中监听键盘事件

---

### 移动端底部 input 被弹出的键盘遮挡

input 输入框是通过`position:fixed`一直放在页面底部，当点击 input 进行输入的时候，就会出现如下图片情况（有的机型会遮挡一些）。

当时这个问题是去年在 ios 中遇到的，在最新版的 ios 系统中，貌似解决了这个 bug，但是为了向下兼容以及防止其他其他机型也出现这个问题，大家可以稍微记一下这个解决方法。

![](https://user-gold-cdn.xitu.io/2018/5/12/16353072dcc21218?w=586&h=1038&f=jpeg&s=48097)

在解决这个问题的时候，有试过下面这种方法:

~~在 input 的 focus 事件中，开启一个定时器，然后每隔 300 毫秒进行一次 document.body.scrollTop=document.body.scrollHeight 的调整，运行 3 次即可。~~

当时还以为解决了，但是当你底部评论区还有很多内容，你每次点击 input，想要输入的时候，整个页面通过`scrollTop`就会不断的向下滚动，这个体验不用说自己也知道是相当失败的，然后就再去找解决方法，结果就有了下面这个。

#### Element.scrollIntoView()

[Element.scrollIntoView()](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/scrollIntoView):方法**让当前的元素滚动到浏览器窗口的可视区域内**。

```js
document.querySelector('#inputId').scrollIntoView();
//只要在input的点击事件，或者获取焦点的事件中，加入这个api就好了
```

这个 api 还可以设置对齐方法，选择将 input 放在屏幕的上方/下方，类似的 api 还有:[Element.scrollIntoViewIfNeeded()](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/scrollIntoViewIfNeeded)，这两个是解决同一个问题的，选择一个用就可以了。

---

### 控制 input 显/隐密码

这个就很简单了，只需更改 input 的 type 属性值就可以了。可以看一下 codepen 的[demo](https://codepen.io/OBKoro1/pen/VxxgyG)

```js
//点击函数，获取dom，判断更改属性。
show(){
    let input=document.getElementById("inputId");
    if(input.type=="password"){
        input.type='text';
    }else{
        input.type='password';
    }
}
```

---

### 在 input 中输入 emoji 表情导致请求失败

现在用户输入 emoji 简直已经成为了习惯，如果前后端没有对 emoji 表情进行处理，那么用户在上传的时候，就会请求失败。

**通常这个问题是后端那边处理比较合适的**，前端是做不了这件事的，或者说很难做这件事。

之前看过一篇[文章](https://www.bbsmax.com/A/nAJvkxjY5r/)，这个文章里面讲了怎么在上传和拿数据下来的时候不会报错，但是不能在显示的时候转换为表情。

ps:之前拿微信用户名的时候，有些人可能在微信昵称上面就会包含表情，**如果后端没对表情处理转换，那么普通请求也会出错**。

之所以说这个，当表单请求错误的时候各位如果实在找不到问题可以往这方面考虑一下，我真的被坑过的 o(╥﹏╥)o。

---

### textarea 多行回车换行，显示的时候换行设置：

在使用`textarea`标签输入多行文本的时候，如果没有对多行文本显示处理，会导致没有换行的情况,就比如下面这种情况，用户在`textarea`是有换行的。

![](https://user-gold-cdn.xitu.io/2018/5/12/1635388bf4dca899?w=420&h=531&f=jpeg&s=223202)

#### Css 属性:[white-space](http://www.w3school.com.cn/cssref/pr_text_white-space.asp)

white-space 属性用于设置如何处理元素内的空白，其中包括空白符和换行符。

![](https://user-gold-cdn.xitu.io/2018/5/12/16353927aec80539?w=613&h=240&f=jpeg&s=103831)

只要在**显示内容的地方将该属性设置为`white-space: pre-line`或者`white-space:pre-wrap`，多行文本就可以换行了**。

#### 设置之后，显示效果：

![](https://user-gold-cdn.xitu.io/2018/5/14/1635d9d75136f6d8?w=419&h=506&f=png&s=128663)

---

### 输入框首尾清除空格-trim()

输入框清除首尾空格是 input 较为常见的需求，通常在上传的时候将首尾空格去除掉。一般使用:字符串的原生方法[trim()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/Trim) 从一个字符串的两端删除空白字符。

trim() 方法并不影响原字符串本身，它返回的是一个新的字符串。

#### 原生清除方法:

```js
//原生方法获取值，清除首尾空格上传str2
let str2 = document.getElementById('inputId').trim();
```

#### Vue 清除方法：

Vue 提供了[修饰符](https://cn.vuejs.org/v2/guide/forms.html#trim)删除首尾空格， 加了修饰符`.trim`会自动过滤用户输入的首尾空白字符

```html
<input v-model.trim="msg">
```

貌似 angular 也提供了类似过滤的方法，感兴趣的可以自己去查一下。

---

### 在 input 中监听键盘事件

在用户登录或者搜索框的时候，一般都会监听键盘事件绑定回车按键，来执行登录/搜索 等操作。

#### 原生绑定:

```js
<input onkeydown="keydownMsg(event)" type="text" />;
function keydownMsg(key) {
  keyCode = key.keyCode; //获取按键代码
  if (keyCode == 13) {
    //判断按下的是否为回车键
    // 在input上监听到回车 do something
  }
}
```

#### Vue 按键修饰符

Vue 为监听键盘事件，提供了[按键修饰符](https://cn.vuejs.org/v2/guide/events.html#%E6%8C%89%E9%94%AE%E4%BF%AE%E9%A5%B0%E7%AC%A6)，并且为常用的按键提供了别名，使用方法如下:当回车按键在 input 中被按下的时候，会触发里面的函数。

```html
<input @keyup.enter="enterActive">
```
