## 一次弄懂 Object.defineProperty

### 基本用法：

```js
let obj = {
  singer: '周杰伦'
};
let value = '青花瓷';
Object.defineProperty(obj, 'music', {
  value: value // music的值
  // configurable: false, // music默认不能删除 要删除须设置为true 设为true 可删除
  // writable: false,  // 默认不能修改music 设为true 可修改
  // enumerable: false, // music默认是不能被枚举(遍历) 设为true 可遍历
});
delete obj.music;
console.log(obj.music); // 青花瓷 删除无效
obj.music = '听妈妈的话';
console.log(obj.music); // 青花瓷 修改无效
for (let key in obj) {
  console.log(key); // singer
}
// music 没有被遍历
```

#### 默认不能修改、不能删除、不能遍历

通过栗子可以发现：通过 defineProperty 设置的属性，**默认不能修改，不能删除，不能遍历**，当然你可以通过设置更改他们。

#### `Object.defineProperty`的作用：

**完全掌控**对象的某个属性，增删改查全都可以设定！

### 设置`get`、`set`：

::: danger 不能同时设置
get,set 设置时不能同时设置 writable 和 value, 他们是一对情侣的存在，交叉设置或同时存在,会报错
:::

```js
let obj = {
  singer: '周杰伦'
};
let value = '青花瓷';
Object.defineProperty(obj, 'music', {
  enumerable: true, // 设置可枚举
  get() {
    // 获取obj.music的时候就会调用get方法
    // let value = "强行设置get的返回值"; // 打开注释 读取属性永远都是‘强行设置get的返回值’
    return value;
  },
  set(val) {
    // value = val; // 将修改的值重新赋给song
    value = '强行设置修改的值';
  }
});

console.log(obj.music); // 青花瓷
delete obj.music; // 删除无效
console.log(obj.music); // 青花瓷
obj.music = '听妈妈的话';
console.log(obj.music); // 强行设置修改的值
for (let key in obj) {
  console.log(key); // singer, music 上面设置了enumerable可枚举
}
```

这个`Object.defineProperty`的用法就是上面两个栗子中所展示的那样，可以将栗子`copy`到本地自己玩一下。

