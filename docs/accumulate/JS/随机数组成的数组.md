# 随机数数组

所谓的随机数数组就是：由随机数组成的数组（数组的长度和随机数的范围可自定义）

当然有很多方法，只是用下面这个API只用一行代码就可以实现这个功能，见猎心喜，然后放了上来。

## 原理

1. 先创建一个类似数组的对象(即对象拥有`length`属性)
2. 利用`Array.from`的第二个参数，对每个元素进行处理(生成随机数)。

```js
/**
 * 由随机数组成的数组：长度和随机数范围可自定义
 * @param {number} length 数组的长度
 * @param {number} limit 随机数的范围
 */
const genNumArr = (length, limit) => {
  // Array.from第二个参数 类似数组的map方法，对每个元素进行处理，将处理后的值放入返回的数组
  return Array.from({ length }, () => Math.floor(Math.random() * limit));
};
console.log(genNumArr(1000, 100)); // 数组长度为1000，每个元素的范围在0-99之间
```

[CodePen](https://codepen.io/OBKoro1/pen/MBOQMX)