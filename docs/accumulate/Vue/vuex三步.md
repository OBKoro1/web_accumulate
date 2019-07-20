## Vuex 的使用入门-极简使用

vuex 是为了解决复杂项目组件之间的数据通信的一个全局状态管理机制，相信很多人都听说过这个东西。有部分人还没有在项目中使用`Vuex`管理过数据状态，实际上`Vuex`的起步使用非常之简单，看完本文之后，赶紧在项目中用起来吧！

### 1. 安装 Vuex 包

```
npm install vuex --save
```

### 2. 新建一个`store.js`文件:

Vuex 必需的内容都在下面这个文件中，文件中做了详细的注释，注意其中的异步操作`actions`和同步操作`mutations`。

```js
// store.js
// 引入vue 和 vuex
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex); // 使用vuex插件,跟router一样
// 直接导出 一个 Store 的实例
export default new Vuex.Store({
  // 这里是要读取或者写入数据的地方,跟组件里的data项一样
  state: {
    name: 'oldName'
  },
  // 通过actions的commit触发mutations来修改state的数据
  // 这里可以包含任意的异步操作，只要最后
  actions: {
    // 第一个参数是用于触发mutations，第二个参数是使用的地方传过来的数据
    nameAction({ commit }, data) {
      // do something 可以是ajax、promise等异步操作
      commit('updateName', data);
    }
  },
  // 同步操作直接修改state里面的数据
  mutations: {
    // 第一个参数是上面的state数据,第二个参数是commit传过来的数据,用以修改state数据。
    updateName(state, data) {
      state.name = data; // 更改state里的数据
    }
  }
});
```

### 3. 引入到`main.js`入口文件中 - 最后一步

这是最后一步了，做完这步，然后我们就可以在项目中使用`Vuex`了。

```js
// main.js
import Vue from 'vue';
import App from './App';
import store from './store'; // 引入store

new Vue({
  el: '#app',
  store, // 挂载在Vue的配置项中
  components: { App },
  template: '<App/>'
});
```

### 在组件中使用 vuex：

在组件中的使用如下，省略了`template`部分:

```js
// 组件中
<script>
export default {
  mounted(){
      console.log('vuex的数据'，this.$store.state.name)
  }
  methods:{
    changeName () {
      // commit只接受一个参数，数据多的话，就用对象传递
      this.$store.dispatch('nameAction', '传过去的新名字') // 先触发actions，再由commit触发mutations来修改数据
  }
}
</script>
```

### 在 js 文件中使用 vuex:

使用方式是一样的，只是调用的名字，稍微有些改变。

**重复引用问题：**

现在项目中基本使用的都是Webpack打包，所以我们不用担心重复引用的问题。

webpack会记忆你之前有没有引用过这个文件/包，整个项目只会引用一次。

```js
// some.js
import store from './store'; // 引入vuex
console.log('vuex的数据', store.state.name);
store.dispatch('nameAction', '传过去的新名字')
```

### 小结

实际上使用 Vuex 只需要`store.js`文件,然后再把文件引到`main.js`入门文件中，挂在`new Vue`的配置项中即可使用。

如此之简单，快点来试试吧！

### Vuex 文档:

这是一个简单的示例，更多内容请阅读[vuex 文档](https://vuex.vuejs.org/zh/)

### 鼓励我一下：

觉得还不错的话，给我的项目点个[star](https://github.com/OBKoro1/Brush_algorithm)吧

[博客](http://obkoro1.com/)、[前端算法](https://github.com/OBKoro1/Brush_algorithm)、[公众号](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/1631b6f52f7e7015.jpeg?raw=true)

