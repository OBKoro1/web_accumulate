## Vue 定义全局函数

### 原理

**通过 Vue.prototype 将函数挂载到 Vue 实例上面**，在组件中通过 this.函数名，来运行函数。

### 1. 在 main.js 里面直接写函数

**直接在 main.js 里面写**:

```js
Vue.prototype.test = function() {
  console.log('执行全局函数test');
};
```

**组件中调用**：

```js
this.test(); // 直接通过this运行函数
```

### 2. 写一个模块文件，挂载到 main.js 上面。

想要定义的全局函数比较多的话，推荐写在一个js文件里面，文件位置可以放在跟 main.js 同一级，方便引用

```js
// base.js
exports.install = function(Vue, options) {
  Vue.prototype.text1 = function() {
    console.log('执行成功1');
  };
  Vue.prototype.text2 = function() {
    console.log('执行成功2');
  };
};
```

main.js 入口文件：

```js
import Vue from 'vue'; // vue要在引文件之前
import base from './base.js'; // 引用文件
Vue.use(base); //将全局函数当做插件来进行注册
```

组件里面调用：

```js
this.text1();
this.text2();
```

