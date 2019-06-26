## vue 小技巧&小问题1

### 路由变化页面数据不刷新问题

> 场景：比如文章详情数据，依赖路由的`params`参数获取的(ajax 写在 created 生命周期里面)，因为路由懒加载的关系，退出页面再进入另一个文章页面并不会运行 created 组件生命周期，导致文章数据还是上一个文章的数据。

**解决方法：watch 监听路由是否变化**

```js
     watch: {
      '$route' (to, from) { // 监听路由是否变化
        if(this.$route.params.articleId){// 是否有文章id
          // 获取文章数据
        }
      }
    }
```

### setTimeout/setInterval 无法用 this 访问 VUe 实例

**场景**：

```js
      mounted(){
            // this指向改变
            setTimeout(function () { // setInterval同理
              console.log(this);// 此时this指向Window对象
            },1000);
        }
```

**解决方法：使用箭头函数**

```js
// 箭头函数访问this实例
// 因为箭头函数本身没有绑定this 继承上一个不是箭头函数的函数的this
setTimeout(() => {
  console.log(this);
}, 500);
// 使用变量保存this指向 通过变量访问this实例
let self = this;
setTimeout(function() {
  console.log(self); // 使用self变量访问this实例
}, 1000);
```

### setInterval 路由跳转继续运行并没有销毁

**场景**：

比如一些弹幕，走马灯文字，这类需要定时调用的，**路由跳转之后，因为组件已经销毁了，但是 setInterval 还没有销毁**，还在继续后台调用，控制台会不断报错，如果运算量大的话，无法及时清除，会导致严重的页面卡顿。

**解决办法：在组件生命周期 beforeDestroy 停止 setInterval**

组件销毁前执行的钩子函数，跟其他生命周期钩子函数的用法相同。

```js
beforeDestroy(){
    //我通常是把setInterval()定时器赋值给this实例，然后就可以像下面这么暂停。
   clearInterval(this.intervalid);
},
```

### vue 滚动行为(浏览器回退记忆位置)用法

这个我当时做的时候以为很难，后来做好了才发现就是一个设置而已（前提是要开启路由的 History 模式），下面做一个简单的分享。

**路由设置**

1. 要使用这一功能，首先需要开启 vue-router 的 [history 模式](https://router.vuejs.org/zh-cn/essentials/history-mode.html)

如果之前一直使用的是`hash`模式(默认模式)，项目已经开发了一段时间，然后转 history 模式很可能会遇到：[这些问题](https://juejin.im/post/5a3f629cf265da430d5839ed)

2.  滚动行为具体设置如下：

```js
        const router = new VueRouter({
          mode: 'history',
        scrollBehavior (to, from, savedPosition) {
            if (savedPosition) { // 如果savedPosition存在，滚动条会自动跳到记录的值的地方
              return savedPosition
            } else {
              return { x: 0, y: 0 }// savedPosition也是一个记录x轴和y轴位置的对象
             }
            }，
          routes: [...]
        })
```

[vue 滚动行为文档](https://router.vuejs.org/zh-cn/advanced/scroll-behavior.html)，可以进到这里看看更详细的信息。

### vue 路由拦截浏览器后退实现草稿保存类似需求

**场景**：

为了防止用户突然离开，没有保存已输入的信息。

**用法**：

```js
    //在路由组件中：
    mounted(){
    },
    beforeRouteLeave (to, from, next) {
      if(用户已经输入信息){
        // 出现弹窗提醒保存草稿，或者自动后台为其保存
      }else{
        next(true);// 用户离开
      }
    }
```

类似的还有`beforeEach`、`beforeRouteUpdate`，也分为全局钩子和组件钩子，见[路由文档](https://router.vuejs.org/zh-cn/advanced/navigation-guards.html)。

### v-once 只渲染元素和组件一次，优化更新渲染性能

觉得[v-once](https://cn.vuejs.org/v2/api/#v-cloak)这个 api 蛮 6 的，应该很多小伙伴都没有注意到这个 api。

**文档介绍**：

![v-once文档介绍](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/160ffd6c2dcf70e1?w=948&h=716&f=png&s=64938?raw=true)

这个 api 在我看来主要用于那些一次性渲染，并且不会再有操作更改这些渲染的值，这样就可以优化双向绑定的更新性能。

[文档](https://cn.vuejs.org/v2/guide/components.html#对低开销的静态组件使用-v-once)推荐：对低开销的静态组件使用 v-once

尽管在 Vue 中渲染 HTML 很快，不过当组件中包含大量静态内容时，可以考虑使用 v-once 将渲染结果缓存起来，就像这样：

```js
    Vue.component('terms-of-service', {
      template: '\
        <div v-once>\
          <h1>Terms of Service</h1>\
          ...很多静态内容...\
        </div>\
      '
    })
```    

### vue 风格指南推荐：

vue 框架还有一个[风格指南](https://cn.vuejs.org/v2/style-guide/)推荐，如下图所示，大家也可以学习一波。

![vue风格指南](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/160fff0ec0147156?w=1578&h=811&f=png&s=174542?raw=true)

