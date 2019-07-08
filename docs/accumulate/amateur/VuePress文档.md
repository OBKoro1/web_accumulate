## 如何搭建本文档

VuePress是尤大为了支持 Vue 及其子项目的文档需求而写的一个项目，VuePress界面十分简洁，并且**非常容易上手，一个小时就可以将项目架构搭好**。现在已经有很多这种类型的文档，如果你有写技术文档/技术博客的需求，VuePress绝对可以成为你的备选项之一。

### VuePress特性：

* 为技术文档而优化的 内置 Markdown 拓展
* 在 Markdown 文件中使用 Vue 组件的能力
* Vue 驱动的自定义主题系统
* 自动生成 Service Worker
* Google Analytics 集成
* 基于 Git 的 “最后更新时间”
* 多语言支持
* 默认主题包含：

建议先看一下[官方文档](https://vuepress.vuejs.org/zh/guide/)


### 效果：

可能你会搭建出一个类似这样的[文档](http://obkoro1.com/web_accumulate/)：

![](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/165b88bde5ddd420?raw=true)

![](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/165b88b39960911b?raw=true)

---

## 搭建：

### 全局安装VuePress

```js
    yarn global add vuepress # 或者：npm install -g vuepress
```

### 新建文件夹

可以手动右键新建，也可以使用下面的命令新建文件夹：

```js
    mkdir project
```

### 项目初始化

进入到`project`文件夹中，使用命令行初始化项目:

```js
    yarn init -y # 或者 npm init -y
```

将会创建一个`package.json`文件，长这样子：

```js
    {
      "name": "project",
      "version": "1.0.0",
      "description": "",
      "main": "index.js",
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      "keywords": [],
      "author": "",
      "license": "ISC"
    }
```

### 在project的根目录下新建docs文件夹：

这个文档将作为项目文档的根目录来使用：

```
    mkdir docs
```

### 在docs文件夹下创建`.vuepress`文件夹：

```js
    mkdir .vuepress
```

所有 VuePress 相关的文件都将会被放在这里

### 在`.vuepress`文件夹下面创建`config.js`:

```js
    touch config.js
```

config.js是VuePress必要的配置文件，它导出一个javascript对象。

你可以先加入如下配置：

```js
    module.exports = {
      title: 'Hello VuePress',
      description: 'Just playing around'
    }
```
    
### 在`.vuepress`文件夹下面创建public文件夹:

```js
    mkdir public
```

这个文件夹是用来放置静态资源的，打包出来之后会放在.vuepress/dist/的根目录。

### 首页(像VuePress文档主页一样)

在docs文件夹下面创建一个`README.md`：

默认的主题提供了一个首页，像下面一样设置`home:true`即可，可以把下面的设置放入`README.md`中，待会儿你将会看到跟`VuePress`一样的主页。

```html
    ---
    home: true
    heroImage: /logo.jpg
    actionText: 快速上手 →
    actionLink: /zh/guide/
    features:
    - title: 简洁至上
      details: 以 Markdown 为中心的项目结构，以最少的配置帮助你专注于写作。
    - title: Vue驱动
      details: 享受 Vue + webpack 的开发体验，在 Markdown 中使用 Vue 组件，同时可以使用 Vue 来开发自定义主题。
    - title: 高性能
      details: VuePress 为每个页面预渲染生成静态的 HTML，同时在页面被加载的时候，将作为 SPA 运行。
    footer: MIT Licensed | Copyright © 2018-present Evan You
    ---
```

ps：你需要放一张图片到public文件夹中。

### 我们的项目结构已经搭好了：

```
    project
    ├─── docs
    │   ├── README.md
    │   └── .vuepress
    │       ├── public
    │       └── config.js
    └── package.json
```

### 在 `package.json` 里添加两个启动命令:

```json
    {
      "scripts": {
        "docs:dev": "vuepress dev docs",
        "docs:build": "vuepress build docs"
      }
    }
```

### 启动你的VuePress：

默认是`localhost:8080`端口。

```js
    yarn docs:dev # 或者：npm run docs:dev
```

### 构建：

build生成静态的HTML文件,默认会在 `.vuepress/dist` 文件夹下

```js
    yarn docs:build # 或者：npm run docs:build
```

---
 
## 基本配置：

最标准的当然是[官方文档](https://vuepress.vuejs.org/zh/default-theme-config/),可以自己的需求来配置`config.js`。

可以参考一下我的`config.js`的配置：

```js
    module.exports = {
      title: '网站标题',
      description: '网站描述',
      // 注入到当前页面的 HTML <head> 中的标签
      head: [
        ['link', { rel: 'icon', href: '/favicon.ico' }], // 增加一个自定义的 favicon(网页标签的图标)
      ],
      base: '/web_accumulate/', // 这是部署到github相关的配置 下面会讲
      markdown: {
        lineNumbers: true // 代码块显示行号
      },
      themeConfig: {
        sidebarDepth: 2, // e'b将同时提取markdown中h2 和 h3 标题，显示在侧边栏上。
        lastUpdated: 'Last Updated' // 文档更新时间：每个文件git最后提交的时间
      }
    };
```

### 导航栏配置：

![](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/165bd71b0c38b87f?raw=true)

```js
    module.exports = {
      themeConfig: {
        nav:[
          { text: '前端算法', link: '/algorithm/' }, // 内部链接 以docs为根目录
          { text: '博客', link: 'http://obkoro1.com/' }, // 外部链接
          // 下拉列表
          {
            text: 'GitHub',
            items: [
              { text: 'GitHub地址', link: 'https://github.com/OBKoro1' },
              {
                text: '算法仓库',
                link: 'https://github.com/OBKoro1/Brush_algorithm'
              }
            ]
          }        
        ]
      }
    }
```


### 侧边栏配置：

侧边栏的配置相对麻烦点，我里面都做了详细的注释，仔细看，自己鼓捣鼓捣 就知道怎么搞了。

```js
    module.exports = {
      themeConfig: {
          sidebar:{
            // docs文件夹下面的accumulate文件夹 文档中md文件 书写的位置(命名随意)
            '/accumulate/': [
                '/accumulate/', // accumulate文件夹的README.md 不是下拉框形式
                {
                  title: '侧边栏下拉框的标题1',
                  children: [
                    '/accumulate/JS/test', // 以docs为根目录来查找文件 
                    // 上面地址查找的是：docs>accumulate>JS>test.md 文件
                    // 自动加.md 每个子选项的标题 是该md文件中的第一个h1/h2/h3标题
                  ]
                }
              ],
              // docs文件夹下面的algorithm文件夹 这是第二组侧边栏 跟第一组侧边栏没关系
              '/algorithm/': [
                '/algorithm/', 
                {
                  title: '第二组侧边栏下拉框的标题1',
                  children: [
                    '/algorithm/simple/test' 
                  ]
                }
              ]
          }
      }
    }
```

---

## 其他：

### 代码块编译错误：

像下面这段代码会导致编译错误，VuePress会去找里面的变量，把它编译成text：

```js
    {{}} 啦 {{}}
```

所以我们的代码块要以这种形式书写：

```js
//```js
{{}} 啦 {{}} // 注释需要打开 这样vuepress会把这里面包裹的当成代码块而不是js
//```
```

并且这样也会让我们的代码高亮显示(下图第一个没有高亮，第二个有高亮)，阅读体验更好：

![](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/165bd98ebe2f65b3?raw=true)

### 自定义容器了解一下：


![](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/165bda20ddcbd209?raw=true)

**更改标题：**

```
    ::: tip 替换tip的标题
    这里是内容。
    :::
```

其实[文档](https://vuepress.vuejs.org/zh/guide/markdown.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E5%AE%B9%E5%99%A8)里有，我这里只是提一下。

### 支持Emoji

![](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/165bdaa634c0839d?raw=true)

文档中只提了支持Emoji,我在GitHub上找到了Emoji的[列表](https://gist.github.com/rxaviers/7360908)，分享一下。


## 一个命令行发布到github上：

### 在 `docs/.vuepress/config.js` 中设置正确的 base:

如果你打算发布到 `https://<USERNAME>.github.io/`，则可以省略这一步，因为 base 默认即是 `"/"`。

如果你打算发布到 `https://<USERNAME>.github.io/<REPO>/`（也就是说你的仓库在 `https://github.com/<USERNAME>/<REPO>`），则将 base 设置为 `"/<REPO>/"`。

```js
module.exports = {
    base: '/test/', // 比如你的仓库是test
}
```

### 创建脚步文件:

在`project`的根目录下，创建一个`deploy.sh`文件：

```
#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io  USERNAME=你的用户名 
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>  REPO=github上的项目
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages

cd -
```

### 设置package.json：

```json
{
    "scripts": {
    "d": "bash deploy.sh"
    }
}
```

### 部署：

然后你每次可以运行下面的命令行，来把最新更改推到`github`上：

```js
npm run d
```

如果你对运行项目和构建项目的命令行觉得很烦，你也可以像我这么做：

```json
"scripts": {
    "dev": "vuepress dev docs", // 本地运行项目 npm run dev
    "build": "vuepress build docs", // 构建项目 nom run build
    "d": "bash deploy.sh" // 部署项目 npm run d
},
```

---

## 更多：

实际上VuePress的配置、用法还有很多，像还可以配置PWA，以及在markdown里面使用Vue组件等，这些功能我也还在摸索，所以大家一定要去看[文档](https://vuepress.vuejs.org/zh/)!

## 小结

上面已经写得尽可能详细了，我遇到的坑都写上去了。搭建起来确实很简单，心动不如行动，随手花一两个小时搭建一下又不吃亏，何乐而不为？

### 鼓励我一下：

觉得还不错的话，给我的项目点个[star](https://github.com/OBKoro1/Brush_algorithm)吧

游泳、健身了解一下：[博客](http://obkoro1.com/)、[前端算法](https://github.com/OBKoro1/Brush_algorithm)、[公众号](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/1631b6f52f7e7015?raw=true)

