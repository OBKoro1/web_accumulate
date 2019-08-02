## 第 k 大元素

### 难度：中等

### 描述：

在数组中找到第 k 大的元素

### 样例：

给出数组 [9,3,2,4,8]，第三大的元素是 4

给出数组 [1,2,3,4,5]，第一大的元素是 5，第二大的元素是 4，第三大的元素是 3，以此类推

### 思路分析：

### 代码模板：

```js
/**
 * @param n: An integer
 * @param nums: An array
 * @return: the Kth largest element
 */
const kthLargestElement = function(n, nums) {
  // write your code here
};
```

### 想一想再看答案

### 想一想再看答案

### 想一想再看答案

### 代码：

1. 从大到小，移除n个最大值

```js
const kthLargestElement = function(n, nums) {
  let value;
  // 遍历n次，移除n个最大值，最终value即为第n大元素
  for (let i = 0; i < n; i++) {
    let item = Math.max(...nums); // 取出最大值
    value = nums.splice(nums.indexOf(item), 1)[0]; // 删除并保存最大值
  }
  return value;
};
console.log(
  '输出',
  kthLargestElement(3, [9, 3, 2, 4, 8]),
  kthLargestElement(1, [1, 3, 4, 2])
);
```

2. sort排序

```js
const kthLargestElement = function(n, nums) {
  // 降序
  nums.sort((a, b) => {
    return b - a;
  });
  return nums[n - 1]; // 第n大(数组从0开始)
};
console.log(
  '输出',
  kthLargestElement(3, [9, 3, 2, 4, 8]),
  kthLargestElement(1, [1, 3, 4, 2])
);
```
<!-- 特殊字符串：用于修改/删除markdown的结尾提示语-OBKoro1 -->
### 点个[Star](https://github.com/OBKoro1/Brush_algorithm)支持我一下~

<!-- '特殊字符串：用于删除编译后的issue组件-OBKoro1 -->
<!-- more -->
<comment-comment/>
