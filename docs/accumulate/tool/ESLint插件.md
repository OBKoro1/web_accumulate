## 手摸手教你写个ESLint插件以及了解ESLint的运行原理

这篇文章目的是介绍如何创建一个ESLint插件和创建一个`ESLint` `rule`，用以帮助我们更深入的理解ESLint的运行原理，并且在有必要时可以根据需求创建出一个完美满足自己需求的Lint规则。

### 插件目标

禁止项目中`setTimeout`的第二个参数是数字。

PS： 如果是数字的话，很容易就成为魔鬼数字，没有人知道为什么是这个数字, 这个数字有什么含义。

### 使用模板初始化项目：

#### 1. 安装NPM包

ESLint官方为了方便开发者开发插件，提供了使用Yeoman模板(`generator-eslint`)。

对于Yeoman我们只需知道它是一个脚手架工具，用于生成包含指定框架结构的工程化目录结构。

```js
npm install -g yo generator-eslint
```

#### 2. 创建一个文件夹：

```js
mkdir eslint-plugin-demo
cd eslint-plugin-demo
```

#### 3. 命令行初始化ESLint插件的项目结构:

```js
yo eslint:plugin
```

下面进入命令行交互流程，流程结束后生成ESLint插件项目框架和文件。

```js
? What is your name? OBKoro1
? What is the plugin ID? korolint   // 这个插件的ID是什么
? Type a short description of this plugin: XX公司的定制ESLint rule // 输入这个插件的描述
? Does this plugin contain custom ESLint rules? Yes // 这个插件包含自定义ESLint规则吗?
? Does this plugin contain one or more processors? No // 这个插件包含一个或多个处理器吗
// 处理器用于处理js以外的文件 比如.vue文件
   create package.json
   create lib/index.js
   create README.md
```

现在可以看到在文件夹内生成了一些文件夹和文件，但我们还需要创建规则具体细节的文件。

#### 4. 创建规则
> 上一个命令行生成的是ESLint插件的项目模板，这个命令行是生成ESLint插件具体规则的文件。

```js
yo eslint:rule // 生成 eslint rule的模板文件
```

创建规则命令行交互：

```js
? What is your name? OBKoro1
? Where will this rule be published? (Use arrow keys) // 这个规则将在哪里发布？
❯ ESLint Core  // 官方核心规则 (目前有200多个规则)
  ESLint Plugin  // 选择ESLint插件
? What is the rule ID? settimeout-no-number  // 规则的ID
? Type a short description of this rule: setTimeout 第二个参数禁止是数字  // 输入该规则的描述
? Type a short example of the code that will fail:  占位  // 输入一个失败例子的代码
   create docs/rules/settimeout-no-number.md
   create lib/rules/settimeout-no-number.js
   create tests/lib/rules/settimeout-no-number.js
```

#### 加了具体规则文件的项目结构

```js
.
├── README.md
├── docs // 使用文档
│   └── rules // 所有规则的文档
│       └── settimeout-no-number.md // 具体规则文档
├── lib // eslint 规则开发
│   ├── index.js 引入+导出rules文件夹的规则
│   └── rules // 此目录下可以构建多个规则
│       └── settimeout-no-number.js // 规则细节
├── package.json
└── tests // 单元测试
    └── lib
        └── rules
            └── settimeout-no-number.js // 测试该规则的文件
```

#### 4. 安装项目依赖

```js
npm install
```
---

以上是开发ESLint插件具体规则的准备工作，下面先来看看AST和ESLint原理的相关知识，为我们开发ESLint `rule` 打一下基础。

### AST——抽象语法树

AST是: `Abstract Syntax Tree`的简称，中文叫做：抽象语法树。

#### AST的作用

将代码抽象成树状数据结构，方便后续分析检测代码。

#### 代码被解析成AST的样子

[astexplorer.net](https://astexplorer.net/)是一个工具网站：它能查看代码被解析成AST的样子。

如下图：**在右侧选中一个值时，左侧对应区域也变成高亮区域，这样可以在AST中很方便的选中对应的代码**。

#### AST 选择器：

下图中被圈起来的部分，称为AST selectors(选择器)。

**AST 选择器的作用**：使用代码通过选择器来选中特定的代码片段，然后再对代码进行静态分析。

AST 选择器很多，ESLint官方专门有一个仓库列出了所有类型的选择器: [estree](https://github.com/estree/estree)

下文中开发ESLint `rule`就需要用到选择器，等下用到了就懂了，现在知道一下就好了。

![将代码解析成AST](https://github.com/OBKoro1/articleImg_src/blob/master/2019/2019_11_19_AST.png?raw=true)

---

### ESLint的运行原理

在开发规则之前，我们需要ESLint是怎么运行的，了解插件为什么需要这么写。

### 1. 将代码解析成AST
  
 ESLint使用JavaScript解析器[Espree](https://github.com/eslint/espree)把JS代码解析成AST。

PS：解析器：是将代码解析成AST的工具，ES6、react、vue都开发了对应的解析器所以ESLint能检测它们的，ESLint也是因此一统前端Lint工具的。

### 2. 深度遍历AST，监听匹配过程。

在拿到AST之后，ESLint会以"从上至下"再"从下至上"的顺序遍历每个选择器两次。

#### 3. 触发监听选择器的`rule`回调

在深度遍历的过程中，生效的每条规则都会对其中的某一个或多个选择器进行监听，每当匹配到选择器，监听该选择器的rule，都会触发对应的回调。

#### 4. 具体的检测规则等细节内容。

---

## 开发规则

### 规则默认模板

打开`rule`生成的模板文件`lib/rules/settimeout-no-number.js`, 清理一下文件，删掉不必要的选项：

```js
module.exports = {
    meta: {
        docs: {
            description: "setTimeout 第二个参数禁止是数字",
        },
        fixable: null,  // 修复函数
    },
   // rule 核心
    create: function(context) {
       // 公共变量和函数应该在此定义
        return {
            // 返回事件钩子
        };
    }
};
```

删掉的配置项，有些是ESLint官方核心规则才是用到的配置项，有些是暂时不必了解的配置，需要用到的时候，可以自行查阅[ESLint 文档](https://cn.eslint.org/docs/developer-guide/working-with-rules)

### create方法-监听选择器
> 上文ESLint原理第三部中提到的：在深度遍历的过程中，生效的每条规则都会对其中的某一个或多个选择器进行监听，每当匹配到选择器，监听该选择器的rule，都会触发对应的回调。

`create`返回一个对象，对象的属性设为选择器，ESLint会收集这些选择器，在AST遍历过程中会执行所有监听该选择器的回调。

```js
// rule 核心
create: function(context) {
    // 公共变量和函数应该在此定义
    return {
        // 返回事件钩子
        Identifier: (node) => {
            // node是选中的内容，是我们监听的部分, 它的值参考AST
        }
    };
}
```

### 观察AST：
创建一个ESLint `rule`需要观察代码解析成AST，选中你要检测的代码，然后进行一些判断。

以下代码都是通过[astexplorer.net](https://astexplorer.net/)在线解析的。

```js
setTimeout(()=>{
	console.log('settimeout')
}, 1000)
```

![setTimeout第二个参数为数字时的AST](https://github.com/OBKoro1/articleImg_src/blob/master/2019/AST_setTimeout.png?raw=true)

### rule完整文件

``lib/rules/settimeout-no-number.js``:

```js
module.exports = {
    meta: {
        docs: {
            description: "setTimeout 第二个参数禁止是数字",
        },
        fixable: null,  // 修复函数
    },
    // rule 核心
    create: function (context) {
        // 公共变量和函数应该在此定义
        return {
            // 返回事件钩子
            'CallExpression': (node) => {
                if (node.callee.name !== 'setTimeout') return // 不是定时器即过滤
                const timeNode = node.arguments && node.arguments[1] // 获取第二个参数
                if (!timeNode) return // 没有第二个参数
                // 检测报错第二个参数是数字 报错
                if (timeNode.type === 'Literal' && typeof timeNode.value === 'number') {
                    context.report({
                        node,
                        message: 'setTimeout第二个参数禁止是数字'
                    })
                }
            }
        };
    }
};
```

context.report()：这个方法是用来通知ESLint这段代码是警告或错误的，用法如上。在[这里](https://cn.eslint.org/docs/developer-guide/working-with-rules#the-context-object)查看`context`和`context.report()`的文档。

规则写完了，**原理就是依据`AST`解析的结果，做针对性的检测，过滤出我们要选中的代码，然后对代码的值进行逻辑判断**。

可能现在会有点懵逼，但是不要紧，我们来写一下测试用例，然后用`debugger`来看一下代码是怎么运行的。

### 测试用例：

测试文件`tests/lib/rules/settimeout-no-number.js`:

```js
/**
 * @fileoverview setTimeout 第二个参数禁止是数字
 * @author OBKoro1
 */
"use strict";
var rule = require("../../../lib/rules/settimeout-no-number"), // 引入rule
    RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 7, // 默认支持语法为es5 
    },
});
// 运行测试用例
ruleTester.run("settimeout-no-number", rule, {
    // 正确的测试用例
    valid: [
        {
            code: 'let someNumber = 1000; setTimeout(()=>{ console.log(11) },someNumber)'
        },
        {
            code: 'setTimeout(()=>{ console.log(11) },someNumber)'
        }
    ],
    // 错误的测试用例
    invalid: [
        {
            code: 'setTimeout(()=>{ console.log(11) },1000)',
            errors: [{
                message: "setTimeout第二个参数禁止是数字", // 与rule抛出的错误保持一致
                type: "CallExpression" // rule监听的对应钩子
            }]
        }
    ]
});
```

下面来学习一下怎么在VSCode中调试node文件，用于观察`rule`是怎么运行的。

实际上打`console`的形式，也是可以的，但是在调试的时候打console实在是有点慢，对于node这种节点来说，信息也不全，所以我还是比较推荐通过`debugger`的方式来调试`rule`。

### 在VSCode中调试node文件

1. 点击下图中的设置按钮, 将会打开一个文件`launch.json`
2. 在文件中填入如下内容，用于调试node文件。
3. 在`rule`文件中打`debugger`或者在代码行数那里点一下小红点。
4. 点击图中的开始按钮，进入`debugger`

![vscode 设置](https://github.com/OBKoro1/articleImg_src/blob/master/2019/vscode_set.jpg?raw=true)

```js
{
    // 使用 IntelliSense 了解相关属性。 
    // 悬停以查看现有属性的描述。
    // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "启动程序", // 调试界面的名称
            // 运行项目下的这个文件：
            "program": "${workspaceFolder}/tests/lib/rules/settimeout-no-number.js",
            "args": [] // node 文件的参数
        },
        // 下面是用于调试package.json的命令 之前可以用，貌似vscode出了点bug导致现在用不了了
        {
            "name": "Launch via NPM",
            "type": "node",
            "request": "launch",
            "runtimeExecutable": "npm",
            "runtimeArgs": [
                "run-script", "dev"    //这里的dev就对应package.json中的scripts中的dev
            ],
            "port": 9229    //这个端口是调试的端口，不是项目启动的端口
        },
    ]
}
```


### 运行测试用例进入断点

1. 在`lib/rules/settimeout-no-number.js`中打一些`debugger`
2. 点击开始按钮，以调试的形式运行测试文件`tests/lib/rules/settimeout-no-number.js`
3. 开始调试`rule`。

---

### 发布插件

eslint插件都是以`npm`包的形式来引用的，所以需要把插件发布一下：

1. 注册：如果你还未注册npm账号的话，需要去[注册](https://www.npmjs.com/signup)一下。

2. 登录npm: `npm login`

3. 发布`npm`包: `npm publish`即可，ESLint已经把`package.json`弄好了。

### 集成到项目:

安装`npm`包：`npm i eslint-plugin-korolint  -D`

1. 常规的方法: `引入插件一条条写入规则`

```js
// .eslintrc.js
module.exports = {
  plugins: [ 'korolint' ],
  rules: { 
    "korolint/settimeout-no-number": "error"
 }
}
```

2. `extends`继承插件配置：

当规则比较多的时候，用户一条条去写，未免也太麻烦了，所以ESLint可以[继承插件的配置](https://cn.eslint.org/docs/developer-guide/working-with-plugins#configs-in-plugins)：

修改一下`lib/rules/index.js`文件:

```js
'use strict';
var requireIndex = require('requireindex');
const output = {
  rules: requireIndex(__dirname + '/rules'), // 导出所有规则
  configs: {
    // 导出自定义规则 在项目中直接引用
    koroRule: {
      plugins: ['korolint'], // 引入插件
      rules: {
        // 开启规则
        'korolint/settimeout-no-number': 'error'
      }
    }
  }
};
module.exports = output;
```

使用方法：

使用`extends`来继承插件的配置，`extends`不止这种继承方式，即使你传入一个npm包，一个文件的相对路径地址，eslint也能继承其中的配置。

```js
// .eslintrc.js
module.exports = {
  extends: [ 'plugin:korolint/koroRule' ] // 继承插件导出的配置
}
```
PS : 这种使用方式, npm的包名不能为`eslint-plugin-xx-xx`,只能为`eslint-plugin-xx`否则会有报错，被这个问题搞得头疼o(╥﹏╥)o

## 扩展：

以上内容足够开发一个插件，这里是一些扩展知识点。

### 遍历方向：

上文中说过: 在拿到AST之后，ESLint会以"从上至下"再"从下至上"的顺序遍历每个选择器两次。

我们所监听的**选择器默认会在"从上至下"的过程中触发，如果需要在"从下至上"的过程中执行则需要添加`:exit`**，在上文中`CallExpression`就变为`CallExpression:exit`。

**注意**：一段代码解析后可能包含多次同一个选择器，选择器的钩子也会多次触发。

### fix函数：自动修复rule错误

**修复效果**：

```js
// 修复前
setTimeout(() => {

}, 1000)
// 修复后 变量名故意写错 为了让用户去修改它
const countNumber1 = 1000
setTimeout(() => {

}, countNumber2)
```

1. 在rule的meta对象上打开修复功能:

```js
// rule文件
module.exports = {
  meta: {
    docs: {
      description: 'setTimeout 第二个参数禁止是数字'
    },
    fixable: 'code' // 打开修复功能
  }
}
```

2. 在`context.report()`上提供一个`fix`函数:

把上文的`context.report`修改一下，增加一个`fix`方法即可，更详细的介绍可以看一下[文档](https://cn.eslint.org/docs/developer-guide/working-with-rules#applying-fixes)。

```js
context.report({
    node,
    message: 'setTimeout第二个参数禁止是数字',
    fix(fixer) {
        const numberValue = timeNode.value;
        const statementString = `const countNumber = ${numberValue}\n`
        return [
        // 修改数字为变量
        fixer.replaceTextRange(node.arguments[1].range, 'countNumber'),
        // 在setTimeout之前增加一行声明变量的代码 用户自行修改变量名
        fixer.insertTextBeforeRange(node.range, statementString),
        ];
    }
});
```
### 项目地址:

[eslint-plugin-korolint](https://github.com/OBKoro1/eslint-plugin-korolint)

----

呼~ 这篇博客断断续续，写了好几周，终于完成了！

大家有看到这篇博客的话，建议跟着博客的一起动手写一下，动手实操一下比你mark一百篇文章都来的有用，花不了很长时间的，希望各位看完本文，都能够更深入的了解到ESLint的运行原理。

#### 觉得我的博客对你有帮助的话，就关注一下/点个赞吧！

[前端进阶积累](http://obkoro1.com/web_accumulate/)、[公众号](https://user-gold-cdn.xitu.io/2018/5/1/1631b6f52f7e7015?w=344&h=344&f=jpeg&s=8317)、[GitHub](https://github.com/OBKoro1)、wx:OBkoro1、邮箱：obkoro1@foxmail.com

#### 基友带我飞

ESLint插件是向基友[yeyan1996](https://juejin.im/user/5ba9f38ce51d450e8477bd7a/posts)学习的，在遇到问题的时候，也是他指点我的，特此感谢。

参考资料：

[创建规则](https://cn.eslint.org/docs/developer-guide/working-with-rules)
[ESLint 工作原理探讨](https://zhuanlan.zhihu.com/p/53680918)
<!-- 特殊字符串：用于修改/删除markdown的结尾提示语-OBKoro1 -->
### 点个[Star](https://github.com/OBKoro1/web_accumulate)支持我一下~

