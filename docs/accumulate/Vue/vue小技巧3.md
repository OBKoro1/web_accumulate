## vue 小技巧&小问题3

### vue 点击事件自动传入 dom:

**演示**: [codepen](https://codepen.io/OBKoro1/pen/OrbZQP)

**template**:

```html
<div @click="add">不传参数，点击自动传入dom</div>
```

**JS**:

```js
add(e){
console.log(e,'dom')
}
```

### 鼓励我一下：

觉得还不错的话，给我的项目点个[star](https://github.com/OBKoro1/Brush_algorithm)吧

游泳、健身了解一下：[博客](http://obkoro1.com/)、[前端算法](https://github.com/OBKoro1/Brush_algorithm)、[公众号](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/1631b6f52f7e7015?w=344&h=344&f=jpeg&s=8317?raw=true)
