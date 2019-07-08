## 查找斐波纳契数列中第 N 个数

### 描述

**所谓的斐波纳契数列是指**：

前 2 个数是 0 和 1 。

第 i 个数是第 i-1 个数和第 i-2 个数的和。

**斐波纳契数列的前 10 个数字是**：

```js
    0, 1, 1, 2, 3, 5, 8, 13, 21, 34 ...
```

### 怎样算解成功：

给定 1，返回 0

给定 2，返回 1

给定 10，返回 34

### 题目分析：

值得注意的是：前两个数字可以算成是起始元素，从第三个元素才开始有规则。

### code:

1. 递归解法：

```js
const fibonacci = n => {
  if (!(typeof n === 'number' && n % 1 === 0 && n > 1)) {
    throw '请输入大于0的整数数字';
  }
  var array = [0, 0, 1];
  let temp = n => {
    if (n == 1 || n == 2) return array[n];
    array[n] = temp(n - 1) + temp(n - 2); // 递归获取推算数组每一个元素的值
    return array[n];
  };
  let num = temp(n);
  array.splice(2, 1); // 将数组恢复成 斐波纳契数列
  return num;
};
```

2. 遍历保存结果

```js
const fibonacci = n => {
  let a = 0,
    b = 1,
    c,
    d = [0];
  for (let i = 1; i < n; i++) {
    c = a + b;
    a = b;
    b = c;
    d.push(a); // 加戏 恢复数列
  }
  console.log(d, '斐波纳契数列');
  return a;
};
```

3. 一次遍历 逐步推导所有元素 时间消耗:158ms 最优

```js
const fibonacci = n => {
  let num = new Array(n).fill(0); // 初始化数组，并设置初始值
  num[1] = 1; // 设置第二个元素的值 推导第3个元素
  for (let i = 2; i <= n - 1; i++) {
    num[i] = num[i - 2] + num[i - 1]; // 遍历逐步推导元素值 数组完全符合数列不用进行判断等 运行效率最高。
  }
  return num[n - 1]; // 数组是从0开始计算 所以要减1
};
```

不行，我一定要秀一波，不然心里难受：

![](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/1650894f0e88c323?raw=true)

最后一题的提交，甩的第二名看不到我的车尾灯，开心！

第一回刷算法题，以后要继续坚持！

### [代码地址](https://github.com/OBKoro1/Brush_algorithm/blob/master/codeSource/FibonacciSequence.html)

2018.8.5

