## VsCode保存时自动修复Eslint错误

同一个项目，保持代码风格的一致，是非常重要的一个规范。但事实上项目小组成员的代码校验规则、格式化工具通常都不一致，为了避免项目到后期出现无法维护的问题，项目成员使用同一套校验规则，同一个格式化方式是相当好的步骤之一。

> 游泳、健身了解一下：[博客](http://obkoro1.com/)、[前端积累文档](http://obkoro1.com/web_accumulate/accumulate/)、[公众号](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/1631b6f52f7e7015?w=344&h=344&f=jpeg&s=8317?raw=true)

## 保存时自动统一代码风格：

先通过一些简单的配置，然后：

* `Ctrl`+`s` / `command`+`s` 时自动修复代码的格式错误
* 自动修复的规则是读取项目根目录的Eslint规则
* 这样就能保证项目成员都是一套验证规则的代码风格

---

## 配置：

### 1.安装VsCode的`EsLint`和`vetur`插件

如图安装`EsLint`插件：

![](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/165e132647eca15f?w=1132&h=559&f=png&s=205082?raw=true)

### 2.为项目安装`EsLint`包：

![](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/165e136abe3b1feb?w=479&h=423&f=png&s=95954?raw=true)

注意要安装在开发环境上，还有就是如果你使用的是脚手架的话，选了Eslint选项，会自带这些包。

### 3.在项目的根目录下添加`.eslintrc.js`

用于校验代码格式，根据项目情况，可自行编写校验规则：

```js
module.exports = {
    // Eslint规则
}
```

### 4.首选项设置：

将下面这部分放入首选项设置中：

```json
"eslint.autoFixOnSave": true,  //  启用保存时自动修复,默认只支持.js文件
"eslint.validate": [
    "javascript",  //  用eslint的规则检测js文件
    {
        "language": "vue",   // 检测vue文件
        "autoFix": true   //  为vue文件开启保存自动修复的功能
    },
    {
        "language": "html",
        "autoFix": true
    },
],
```      

想了解更多的话，推荐看一下VsCode的[EsLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)插件

### 大功告成：

点开文件，你可能会看到如下报错，无需一个一个去改，只要保存一下文件，就可以自动修复这些代码格式上的问题了。

![](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/165e151df42747c4?w=474&h=335&f=gif&s=22430?raw=true)

**注意：**

如果整个文件都飘红的话，不会一次性修改如果的格式问题，会一下改一部分，你可能需要多按几次保存。

### 一键修复项目格式问题：

遇到下面这两种情况：

* 你刚刚引入这个自动修复，但你项目的文件比较多，且你又比较懒。
* 隔一段时间，修复一下代码格式上的问题

你可以像下面这样，在`package.json`里面的`scripts`里面新增一条如下命令：

```js
"lint": "eslint --ext .js,.vue src --fix"
```

![](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/165e1561a9b92866?w=694&h=111&f=png&s=33155?raw=true)

`--ext`后面跟上的`.js`、`.vue`是你要检测文件的后缀，`.vue`后面的`src`是要检测的哪个目录下面的文件。

`--fix`的作用是自动修复根据你配置的规则检测出来的格式问题

**一键修复:**

输入如下命令行，就可以自动**修复你`src`文件夹下面的所有根据你配置的规则检测出来的格式问题**。

```js
npm run lint
```

### .eslintignore 不检测一些文件：

在项目的根目录创建一个`.eslintignore`文件，用于让`EsLint`不检测一些文件。

比如引的一些别人的文件，插件等,比如文件中：

```
src/test/* 
src/test2/* 
```

文件中的内容像上面这样写，这里第一行是不检测src目录下的test文件夹下面的所有文件。

### 自定义规则：

```js
// .eslintrc.js文件
module.exports = {
    "rules": { // 自定义规则
        "no-console": 0,
        "no-const-assign": 1, 
        "no-extra-bind": 2,
    }
}
```    

**0、1、2的意思：**

* `"off"` 或 0 - 关闭这项规则
* `"warn"` 或 1 - 将规则视为一个警告
* `"error"` 或 2 - 将规则视为一个错误

## 小结

使用自动VsCode+EsLint格式化代码，在团队内部相互去看别人的代码的时候，就可以更容易的看的懂，能够极大的降低团队的沟通成本和提高心情,设置这么方便，赶紧在团队中用起来吧！

### 鼓励我一下：

觉得还不错的话，给我的项目点个[star](https://github.com/OBKoro1/Brush_algorithm)吧

游泳、健身了解一下：[博客](http://obkoro1.com/)、[前端算法](https://github.com/OBKoro1/Brush_algorithm)、[公众号](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/1631b6f52f7e7015?w=344&h=344&f=jpeg&s=8317?raw=true)