## CSS 权重规则

日常开发中，或多或少都会遇到css规则不生效的问题，为了让我们能够减少调试css规则的时间，深刻理解css权重，就十分关键了.

## 权重规则总结:

1. !important 优先级最高，但也会被权重高的 important 所覆盖
2. 行内样式总会覆盖外部样式表的任何样式(除了!important)
3. 单独使用一个选择器的时候，不能跨等级使 css 规则生效
4. 如果两个权重不同的选择器作用在同一元素上，权重值高的 css 规则生效
5. 如果两个相同权重的选择器作用在同一元素上：以后面出现的选择器为最后规则.
6. 权重相同时，与元素距离近的选择器生效

---

### css 权重优先级用来干嘛？

在同一个元素使用不同的方式，声明了相同的一条或多条 css 规则，**浏览器会通过权重来判断哪一种方式的声明，与这个元素最为相关，从而在该元素上应用这个声明方式声明的所有 css 规则**。

### 权重的五个等级及其权重

- !important;
- 行内样式;
- ID 选择器, 权重:100;
- class,属性选择器和伪类选择器，权重:10;

    属性选择器指的是:根据元素的属性及属性值来选择元素，比如button的type属性等。
    伪类选择器: :active :focus等选项.

- 标签选择器和伪元素选择器，权重:1;

    伪元素选择器： :before :after

### 等级关系:

```js
!important>行内样式>ID选择器 > 类选择器 | 属性选择器 | 伪类选择器 > 元素选择器
```
---

## 权重规则：

### 1.不推荐使用!important

不推荐使用`!important`，因为`!important`根本没有结构与上下文可言，并且很多时候权重的问题，就是因为不知道在哪里定义了一个`!important`而导致的。

#### 覆盖 important:

虽然我们应该尽量避免使用!important，但你应该知道如何覆盖 important，加点权重就可以实现，codepen 的[demo](https://codepen.io/OBKoro1/pen/ZoVxgQ)

```css
//!important 优先级最高，但也会被权重高的important所覆盖
<button id="a" class="a">aaa</button>
#a{
    background: blue  !important;  /* id的important覆盖class的important*/
}
.a{
    background: red  !important;
}
```

### 2.行内样式总会覆盖外部样式表的任何样式,会被`!important`覆盖

### 3.单独使用一个选择器的时候，不能跨等级使 css 规则生效

**无论多少个 class 组成的选择器，都没有一个 ID 选择器权重高**。类似的，无论多少个元素组成的选择器，都没有一个 class 选择器权重高、无论多少个 ID 组成的选择器，都没有行内样式权重高。

codepen 的[demo](https://codepen.io/OBKoro1/pen/ZoVxgQ);

        在demo中使用了11个class组成一个选择器，最后还是一个ID选择器，设置的样式生效。

#### 可以想象在玄幻小说的那种等级制度，没有突破那个等级，就没有可比性。

所以权重是在双方处于同一等级的情况下，才开始对比。

### 4.如果两个权重不同的选择器作用在同一元素上，权重值高的 css 规则生效

选择器可能会包含一个或者多个与权重相关的计算点，若经过权重值计算得到的权重值越大，则认为这个选择器的权重高。举一个简单的栗子:

```css
.test #test{ } // id 100+class 10=110;
.test #test span{} // id 100+class 10+span 1=111;
.test #test .sonClass{} // id 100+class 10+class 10=120; //生效
```
### 5.如果两个相同权重的选择器作用在同一元素上：以后面出现的选择器为最后规则.

[demo](https://codepen.io/OBKoro1/pen/jxXKez)

```css
<div id="app">
    <div class="test" id="test">
    <span >啦啦啦</span>
    </div>
</div>
#test span{
    color:blue;
}
#app span{ // 生效 因为后面出现
    color: red;
}
```

### 6.权重相同时，与元素距离近的选择器生效

比如不同的 style 表，head 头部等,来看下面的栗子：

```css
#content h1 { // css样式表中
    padding: 5px;
}
<style type="text/css">
    #content h1 { // html头部 因为html头部离元素更近一点，所以生效
    padding: 10px;
    }
</style>
```

## 建议：

1. 避免使用`!important`;
2. 利用 id 增加选择器权重;
3. 减少选择器的个数（避免层层嵌套）;

### 鼓励我一下：

觉得还不错的话，给我的项目点个[star](https://github.com/OBKoro1/Brush_algorithm)吧
