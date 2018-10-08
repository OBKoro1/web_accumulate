## vue 小技巧&小问题2

用Vue开发一个网页并不难，但是也经常会遇到一些问题，其实大部分的问题都在文档中有所提及，再不然我们通过谷歌也能成功搜索到问题的答案，为了帮助小伙伴们提前踩坑，在遇到问题的时候，心里大概有个谱知道该如何去解决问题。这篇文章是将自己知道的一些小技巧，结合查阅资料整理成的一篇文章。

### 文章内容总结:

1. 组件style的scoped
2. Vue 数组/对象更新 视图不更新
3. vue filters 过滤器的使用
4. 列表渲染相关
5. 深度watch与watch立即触发回调
6. 这些情况下不要使用箭头函数
7. 路由懒加载写法
8. 路由的项目启动页和404页面
9. Vue调试神器:vue-devtools

---

### 组件style的scoped:

问题：在组件中用js动态创建的dom，添加样式不生效。

**场景**:

```html
<template>
    <div class="test"></div>
</template>
<script>
    let a=document.querySelector('.test');
    let newDom=document.createElement("div"); // 创建dom
    newDom.setAttribute("class","testAdd" ); // 添加样式
    a.appendChild(newDom); // 插入dom
</script>
<style scoped>
.test{
    background:blue;
    height:100px;
    width:100px;
}
.testAdd{
    background:red;
    height:100px;
    width:100px;
}
</style>
```

**结果**：

```css
// test生效   testAdd 不生效
<div data-v-1b971ada class="test"><div class="testAdd"></div></div>

.test[data-v-1b971ada]{ // 注意data-v-1b971ada
    background:blue;
    height:100px;
    width:100px;
}
```

**原因**:

当 `<style>` 标签有 [scoped](https://vue-loader-v14.vuejs.org/zh-cn/features/scoped-css.html) 属性时，它的 CSS 只作用于当前组件中的元素。

它会**为组件中所有的标签和class样式添加一个`scoped`标识**，就像上面结果中的`data-v-1b971ada`。

所以原因就很清楚了：因为动态添加的dom没有`scoped`添加的标识，**没有跟`testAdd`的样式匹配起来**，导致样式失效。

**解决方式**

* 推荐：去掉该组件的scoped

每个组件的css并不会很多，当设计到动态添加dom，并为dom添加样式的时候，就可以去掉scoped，会比下面的方法方便很多。
* 可以动态添加style

```js
// 上面的栗子可以这样添加样式
newDom.style.height='100px';
newDom.style.width='100px';
newDom.style.background='red';
```

---

### Vue 数组/对象更新 视图不更新

很多时候，我们习惯于这样操作数组和对象:

```js
data() { // data数据
    return {
        arr: [1,2,3],
        obj:{
            a: 1,
            b: 2
        }
    };
},
// 数据更新 数组视图不更新
this.arr[0] = 'OBKoro1';
this.arr.length = 1;
console.log(arr);// ['OBKoro1'];
// 数据更新 对象视图不更新
this.obj.c = 'OBKoro1';
delete this.obj.a;
console.log(obj);  // {b:2,c:'OBKoro1'}
```

由于js的限制，Vue 不能检测以上数组的变动，以及对象的添加/删除，很多人会因为像上面这样操作，出现视图没有更新的问题。

**解决方式:**

1.  **this.$set(你要改变的数组/对象，你要改变的位置/key，你要改成什么value)**

```js
this.$set(this.arr, 0, "OBKoro1"); // 改变数组
this.$set(this.obj, "c", "OBKoro1"); // 改变对象
```

如果还是不懂的话，可以看看这个codepen[demo](https://codepen.io/OBKoro1/pen/oyjdbZ)。

2. **数组原生方法触发视图更新**:

Vue可以监测到数组变化的，**数组原生方法**:

```js
splice()、 push()、pop()、shift()、unshift()、sort()、reverse()
```

意思是**使用这些方法不用我们再进行额外的操作，视图自动进行更新**。

推荐使用`splice`方法会比较好自定义,因为slice可以在数组的任何位置进行删除/添加操作，这部分可以看看我前几天写的一篇文章:[【干货】js 数组详细操作方法及解析合集](https://juejin.im/post/5b0903b26fb9a07a9d70c7e0?utm_source=gold_browser_extension#heading-7)

3. **替换数组/对象**

比方说:你想遍历这个数组/对象，对每个元素进行处理，然后触发视图更新。

```js
// 文档中的栗子: filter遍历数组，返回一个新数组，用新数组替换旧数组
example1.items = example1.items.filter(function (item) {
    return item.message.match(/Foo/)
})
```

**举一反三**：可以先把这个数组/对象保存在一个变量中，然后对这个变量进行遍历，等遍历结束后再用**变量替换对象/数组**。

**并不会重新渲染整个列表**:

Vue 为了使得 DOM 元素得到最大范围的重用而实现了一些智能的、启发式的方法，所以用一个含有相同元素的数组去替换原来的数组是非常高效的操作。

如果你还是很困惑，可以看看[Vue文档](https://cn.vuejs.org/v2/guide/list.html#%E6%95%B0%E7%BB%84%E6%9B%B4%E6%96%B0%E6%A3%80%E6%B5%8B)中关于这部分的解释。

---

### vue filters 过滤器的使用:

过滤器，通常用于后台管理系统，或者一些约定类型，过滤。Vue过滤器用法是很简单，但是很多朋友可能都没有用过，这里稍微讲解一下。

**在html模板中的两种用法**：

```html
<!-- 在双花括号中 -->
{{ message | filterTest }}
<!-- 在 `v-bind` 中 -->
<div :id="message | filterTest"></div>
```

**在组件`script`中的用法**:

```js
export default {    
        data() {
        return {
            message:1   
        }
        },
    filters: {  
        filterTest(value) {
            // value在这里是message的值
            if(value===1){
                return '最后输出这个值';
            }
        }
    }
}
```

用法就是上面讲的这样，可以自己在组件中试一试就知道了，很简单很好用的。

如果不想自己试，可以点这个[demo](https://codepen.io/OBKoro1/pen/rKxBMw)里面修改代码就可以了，demo中包括**过滤器串联**、**过滤器传参**。

推荐看Vue[过滤器](https://cn.vuejs.org/v2/guide/filters.html)文档，你会更了解它的。

---

### 列表渲染相关

**v-for循环绑定model:**

input在v-for中可以像如下这么进行绑定，我敢打赌很多人不知道。

```js
// 数据    
data() {
    return{
        obj: {
            ob: "OB",
            koro1: "Koro1"
        },
        model: {
            ob: "默认ob",
            koro1: "默认koro1"
        }   
    }
},
// html模板
<div v-for="(value,key) in obj">
    <input type="text" v-model="model[key]">
</div>
// input就跟数据绑定在一起了，那两个默认数据也会在input中显示
```

为此，我做了个[demo](https://codepen.io/OBKoro1/pen/gKPOgw),你可以点进去试试。

**一段取值的v-for**

如果我们有一段重复的html模板要渲染，又没有数据关联，我们可以:

```html
<div v-for="n in 5">
    <span>这里会被渲染5次，渲染模板{{n}}</span>
</div>
```

**v-if尽量不要与v-for在同一节点使用**:

v-for 的优先级比 v-if 更高,如果它们处于同一节点的话，那么每一个循环都会运行一遍v-if。

如果你想根据循环中的**每一项的数据来判断是否渲染，那么你这样做是对的**:

```html
<li v-for="todo in todos" v-if="todo.type===1">
    {{ todo }}
</li>
```

如果你想要根据**某些条件跳过循环，而又跟将要渲染的每一项数据没有关系的话，你可以将v-if放在v-for的父节点**：

```html
// 根据elseData是否为true 来判断是否渲染，跟每个元素没有关系    
<ul v-if="elseData">
    <li v-for="todo in todos">
    {{ todo }}
    </li>
</ul>
// 数组是否有数据 跟每个元素没有关系
<ul v-if="todos.length">
    <li v-for="todo in todos">
    {{ todo }}
    </li>
</ul>
<p v-else>No todos left!</p>
```

如上，正确使用v-for与v-if优先级的关系，可以为你节省大量的性能。

---

### 深度watch与watch立即触发回调

watch很多人都在用，但是这watch中的这两个选项`deep`、`immediate`，或许不是很多人都知道，我猜。

**选项：deep**

在选项参数中指定 `deep: true`，可以监听对象中属性的变化。

**选项：immediate**

在选项参数中指定 immediate: true, 将立即以表达式的当前值触发回调，也就是立即触发一次。

```js
watch: {
    obj: {
        handler(val, oldVal) {
        console.log('属性发生变化触发这个回调',val, oldVal);
        },
        deep: true // 监听这个对象中的每一个属性变化
    },
    step: { // 属性
        //watch
        handler(val, oldVal) {
        console.log("默认立即触发一次", val, oldVal);
        },
        immediate: true // 默认立即触发一次
    },
},
```

这两个选项可以同时使用，另外：是的，又有一个[demo](https://codepen.io/OBKoro1/pen/QxyWMa)。

还有下面这一点需要注意。


---

### 这些情况下不要使用箭头函数:

* 不应该使用箭头函数来定义一个生命周期方法
* 不应该使用箭头函数来定义 method 函数
* 不应该使用箭头函数来定义计算属性函数
* 不应该对 data 属性使用箭头函数
* 不应该使用箭头函数来定义 watcher 函数


示例：

```js
// 上面watch的栗子：
handler:(val, oldVal)=> { // 可以执行
    console.log("默认触发一次", val, oldVal);
},
// method：
methods: {
    plus: () => { // 可以执行
        // do something
    }
}
// 生命周期:
created:()=>{ // 可以执行
    console.log('lala',this.obj) 
},
```

是的，没错，这些都能执行。

**but**:

箭头函数绑定了父级作用域的上下文，**this 将不会按照期望指向 Vue 实例**。

也就是说，你**不能使用this来访问你组件中的data数据以及method方法了**。

this将会指向undefined。

---

### 路由懒加载写法:

```js
// 我所采用的方法，个人感觉比较简洁一些，少了一步引入赋值。
const router = new VueRouter({
    routes: [
    path: '/app',
    component: () => import('./app'),  // 引入组件
    ]
})
// Vue路由文档的写法:
const app = () => import('./app.vue') // 引入组件
const router = new VueRouter({
    routes: [
    { path: '/app', component: app }
    ]
})
```

文档的写法在于问题在于：如果我们的路由比较多的话，是不是要在路由上方引入赋值十几行组件？

第一种跟第二种方法相比就是把引入赋值的一步，直接写在`component`上面，本质上是一样的。两种方式都可以的，大家自由选择哈。

---

### 路由的项目启动页和404页面

实际上这也就是一个设置而已:

```js
export default new Router({
    routes: [
    {
        path: '/', // 项目启动页
        redirect:'/login'  // 重定向到下方声明的路由 
    },
    {
        path: '*', // 404 页面 
        component: () => import('./notFind') // 或者使用component也可以的
    },
    ]
})
```

比如你的域名为:`www.baidu.com`

项目启动页指的是: 当你进入`www.baidu.com`，会自动跳转到login登录页。

404页面指的是: 当进入一个没有 声明/没有匹配 的路由页面时就会跳转到404页面。

比如进入`www.baidu.com/testRouter`,就会自动跳转到`notFind`页面。

当你没有声明一个404页面，进入`www.baidu.com/testRouter`，显示的页面是一片空白。

---

### Vue调试神器:vue-devtools

每次调试的时候，写一堆`console`是否很烦？想要**更快知道组件/Vuex内数据的变化**？

那么这款**尤大开发**的调试神器:vue-devtools，你真的要了解一下了。

这波稳赚不赔，真的能提高开发效率。

**安装方法**：

* 谷歌商店+科学上网,搜索vue-devtools即可安装。
* 不会科学上网？[手动安装](https://segmentfault.com/a/1190000009682735)

**安装之后**：

在chrome开发者工具中会看一个vue的一栏，如下对我们网页应用内数据变化，组件层级等信息能够有更准确快速的了解。

![](https://user-gold-cdn.xitu.io/2018/6/3/163c50e5198f6b8c?w=1917&h=324&f=png&s=45776)

---

### 前几个月也写过一篇类似的:

[Vue 实践过程中的几个问题](https://juejin.im/post/5a587b46f265da3e3b7a7677)

---

## 结语

本文的内容很多都在Vue文档里面有过说明，推荐大家可以多看看Vue文档，不止看教程篇，还有文档的Api什么的，也都可以看。然后其实还有两三点想写的，因为预计篇幅都会比较长一点，所以准备留到以后的文章里面吧~ 

### 鼓励我一下：

觉得还不错的话，给我的点个[star](https://github.com/OBKoro1/Brush_algorithm)吧