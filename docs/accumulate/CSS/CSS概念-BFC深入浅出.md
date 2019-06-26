### CSS 概念-BFC 深入浅出

好记性不如烂笔头，研究了一下 BFC，发现里面比较细的东西也是很多的！关于 BFC，很多人可能都听说过 BFC 这个东西，大概知道这是个啥东西，相信很多人对此并没有一个非常细致的了解，本文预计篇幅较长，认真，耐着性子看，应该都能够比较深入的理解 BFC 这个概念的规则、作用以及用法。希望喜欢的朋友可以点个赞，或者关注一波本人，谢谢。

## BFC 是什么鬼？

**所谓的 BFC 就是 css 布局的一个概念，是一块区域，一个环境。**

先稳住别懵逼，接着往下走。

### 关于 BFC 的定义：

BFC(Block formatting context)直译为"块级格式化上下文"。它**是一个独立的渲染区域**，只有**Block-level box**参与（在下面有解释）， 它规定了内部的 Block-level Box 如何布局，并且与这个区域外部毫不相干。

### 通俗的说:

BFC 可以简单的理解为**某个元素的一个 CSS 属性**，拥有这个属性的元素**对内部元素和外部元素会表现出一些特性，这就是 BFC**。

### 触发条件

**满足下列条件之一就可触发 BFC**

1. 根元素，即 HTML 元素

2. `float`的值不为`none`

3. `overflow`的值不为`visible`

4. `display`的值为`inline-block`、`table-cell`、`table-caption`

5. `position`的值为`absolute`或`fixed`

### BFC 布局规则：

1. 内部的 Box 会在垂直方向，一个接一个地放置。

2. Box 垂直方向的距离由 margin 决定。属于同一个 BFC 的两个相邻 Box 的 margin 会发生重叠

3. 每个元素的 margin box 的左边， 与包含块 border box 的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。

4. BFC 的区域不会与 float box 重叠。

5. BFC 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。

6. 计算 BFC 的高度时，浮动元素也参与计算

### BFC 有哪些作用：

1. 自适应两栏布局
2. 可以阻止元素被浮动元素覆盖
3. 可以包含浮动元素——清除内部浮动
4. 分属于不同的 BFC 时可以阻止 margin 重叠

---

## BFC 的规则和作用介绍:

#### BFC 布局规则 1：内部的 Box 会在垂直方向，一个接一个地放置。

上文定义中提到过的块级盒：block-level box，在这里解析一波：

![这个就是我们平常操作盒子的组成](https://lc-gold-cdn.xitu.io/b80801d8707be24ecbc0)

我们平常说的盒子是由 margin、border、padding、content 组成的，实际上每种类型的四条边定义了一个盒子，分别是分别是**content box、padding box、border box、margin box**，这四种类型的盒子一直存在，即使他们的值为 0.决定块盒在包含块中与相邻块盒的垂直间距的便是 margin-box。

**提示**：Box 之间的距离虽然也可以使用 padding 来控制，但是此时实际上还是属于 box 内部里面，而且使用 padding 来控制的话就不能再使用 border 属性了。

布局规则 1 就是我们**平常 div 一行一行块级放置的样式**，大家想一下就知道了，这里就不展开了。

#### BFC 布局规则 2：Box 垂直方向的距离由 margin 决定。属于同一个 BFC 的两个相邻 Box 的 margin 会发生重叠。

![](https://lc-gold-cdn.xitu.io/6b0fc0e3d34f94875d35.gif)

上文提到过，决定块盒在包含块中与相邻块盒的垂直间距的便是 margin-box。，上面的栗子就是这种情况。

**演示中 css 属性设置**：上面的 box：margin-bottom: 100px;下面的 box：margin-top: 100px;（他们是同一侧的 margin，所以会发生 margin 重叠的情况，两个 div 的距离实际上只有 100px。）

#### BFC 的作用 4：阻止 margin 重叠:

当两个相邻块级子元素**分属于不同的 BFC**时可以**阻止 margin 重叠**

**操作方法**:给其中一个 div 外面包一个 div，然后通过触发外面这个 div 的 BFC，就可以阻止这两个 div 的 margin 重叠

下面是代码：

```html
<div class="aside"></div>
<div class="text">
    <div class="main"></div>
</div>
<!-- css代码 -->
.aside {
  margin-bottom: 100px; //margin属性
  width: 100px;
  height: 150px;
  background: #f66;
}
.main {
  margin-top: 100px; //margin属性
  height: 200px;
  background: #fcc;
}
.text {
  /*盒子main的外面包一个div，通过改变此div的属性使两个盒子分属于两个不同的BFC，以此来阻止margin重叠*/
  overflow: hidden; //此时已经触发了BFC属性。
}
```

**ps**:触发方式可以参考上文给出的触发条件。

#### 这里有一个网址可以在[线演示](http://www.cnblogs.com/xiaohuochai/p/5248536.html)，通过演示，可以更直观一点：

![这里面也是一篇好文章，关于BFC的](https://lc-gold-cdn.xitu.io/6daeb3cbf5f82d1f6db8.gif)

#### BFC 布局规则 3：每个元素的 margin box 的左边， 与包含块 border box 的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。

```html
<div class="par">
    <div class="child"></div>
    //给这两个子div加浮动，浮动的结果，如果没有清除浮动的话，父div不会将下面两个div包裹，但还是在父div的范围之内。
    <div class="child"></div>
</div>
```

**解析**：给这两个子 div 加浮动，浮动的结果，如果没有清除浮动的话，父 div 不会将下面两个 div 包裹，但还是在父 div 的范围之内，**左浮是子 div 的左边接触父 div 的 borderbox 的左边，右浮是子 div 接触父 div 的 borderbox 右边**，除非设置 margin 来撑开距离，否则一直是这个规则。

#### BFC 作用 3：可以包含浮动元素——清除内部浮动

给父 divpar 加上 `overflow: hidden;`

**清除浮动原理**:触发父 div 的 BFC 属性，使下面的子 div 都**处在父 div 的同一个 BFC 区域之内**，此时已成功清除浮动。

![](https://lc-gold-cdn.xitu.io/dfe63a3d19cae8adf5fa.gif)

还可以向同一个方向浮动来达到清除浮动的目的，清除浮动的原理是两个 div 都位于同一个浮动的 BFC 区域之中。

#### BFC 布局规则 4：BFC 的区域不会与 float box 重叠：

```html
<div class="aside"></div>
<div class="text">
    <div class="main"></div>
</div>
.aside {
  width: 100px;
  height: 150px;
  float: left;
  background: #f66;
}
.main {
  height: 200px;
  overflow: hidden; //触发main盒子的BFC
  background: #fcc;
}
.text {
  width: 500px;
}
```

上面 aside 盒子有一个浮动属性，覆盖了 main 盒子的内容，main 盒子没有清除 aside 盒子的浮动。只做了一个动作，就是**触发自身的 BFC**，然后就**不再被 aside 盒子覆盖**了。所以：**BFC 的区域不会与 float box 重叠**。

![](https://lc-gold-cdn.xitu.io/0e2c7b710c4a13111120.gif)

#### BFC 作用：自适应两栏布局。

![](https://lc-gold-cdn.xitu.io/304255779293ba4c2082.gif)

还是上面的代码，此时 BFC 的区域不会与 float box 重叠，因此**会根据包含块（父 div）的宽度，和 aside 的宽度，自适应宽度。**

---

### BFC 与 Layout

IE 作为浏览器中的奇葩，当然不可能按部就班的支持 BFC 标准，于是乎 IE 中有了 Layout 这个东西。**Layout 和 BFC 基本是等价的**，为了处理 IE 的兼容性，在需要触发 BFC 时，我们除了需要用触发条件中的 CSS 属性来触发 BFC，还需要针对 IE 浏览器使用 zoom: 1 来触发 IE 浏览器的 Layout。

### 有趣的文本:

```css
.par {
  margin-top: 3rem;
  border: 5px solid #fcc;
  width: 300px;
}
.child {
  border: 5px solid #f66;
  width: 100px;
  height: 100px;
  float: left;
}
```

![](https://lc-gold-cdn.xitu.io/216207666aa8bef15115)

**原因：**

这里两个 div 被撑开，是因为父 div 被 p 标签撑开了，并不是因为清除浮动的原因，从下面这张图片可以清楚的知道。

![](https://lc-gold-cdn.xitu.io/5f7dc07585ae6c512bb8)

其实以上的几个例子都体现了 BFC 布局规则第五条————

#### BFC 布局规则 5：BFC 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。

**文本环绕 float**：

```html
<div style="float: left; width: 100px; height: 100px; background: #000;">
</div>
<div style="height: 200px; background: #AAA;">
    <div style=" width: 30px; height: 30px; background: red;"></div>
    <p>content</p> <p>content</p> <p>content</p> <p>content</p> <p>content</p>
</div>
```

![](https://lc-gold-cdn.xitu.io/c02b2396d987f4d7439a)

问题：为什么 div 的左上角被覆盖了，而文本却没有被覆盖，float 不是应该跟普通流不在一个层级吗？是因为 float 属性不生效吗？

**解决**：

float 属性定义元素在哪个方向浮动。以往这个属性总应用于图像，**使文本围绕在图像周围**，不过在 CSS 中，**任何元素都可以浮动**。浮动元素会生成一个块级框，而不论它本身是何种元素。

![](https://lc-gold-cdn.xitu.io/5994ed11ebc3e4b971db.gif)

从上图可以看到，float 属性确实生效，将 float 隐藏后，下面还有一个红色的 div，这个 div 是被黑色 div 所覆盖掉的。**div 会被 float 覆盖，而文本却没有被 float 覆盖**，是因为**float 当初设计的时候**就是为了**使文本围绕在浮动对象的周围**。

以上。2017.5.4.

