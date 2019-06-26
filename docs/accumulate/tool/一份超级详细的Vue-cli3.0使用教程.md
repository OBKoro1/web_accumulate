## 一份超级详细的Vue-cli3.0使用教程

在vue-cli 2.X的时候，也写过一篇类似的[文章](https://juejin.im/post/597eee92f265da3e2e56e37c)，在八月份的时候vue-cli已经更新到了3.X，新版本的脚手架，功能灰常强大，试用过后非常喜欢，写篇教程来帮助各位踩一下坑。


> 游泳、健身了解一下：[博客](http://obkoro1.com/)、[前端积累文档](http://obkoro1.com/web_accumulate/accumulate/)、[公众号](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/1631b6f52f7e7015?w=344&h=344&f=jpeg&s=8317?raw=true)、[GitHub](https://github.com/OBKoro1)

### 主要内容：

1. 零配置启动/打包一个`.vue`文件
2. 详细的搭建过程
3. **重点推荐：使用图形化界面创建/管理/运行项目**

---

## 安装：

### 卸载旧版本：

如果你事先已经全局安装了旧版本的`vue-cli`(1.x 或 2.x),你需要先卸载它:

    npm uninstall vue-cli -g

### Node版本要求：

3.x需要在`Node.js`8.9或更高版本(推荐8.11.0+)，点击这里可以安装[node](http://nodejs.cn/download/)

大多数人都安装过了node,使用下面的命令行**查询你的node版本**:

    node -v

如果你的版本不够，可以使用下面的命令行来把**Node版本更新到最新的稳定版**：

    npm install -g n // 安装模块 这个模块是专门用来管理node.js版本的
    n stable // 更新你的node版本

mac下，更新版本的时候,如果提示你权限不够：

    sudo n stable // 我就遇到了

### 安装vue-cli:

    npm install -g @vue/cli // 安装cli3.x
    vue --version // 查询版本是否为3.x

如果cli3.x用的不舒服，**cli3也能使用2.x模板**：

    npm install -g @vue/cli-init // 安装这个模块
    // 就可以使用2.x的模板：vue init webpack my-project


## 零配置启动/打包一个`.vue`文件：

### 安装扩展：

    npm install -g @vue/cli-service-global

安装完扩展之后，可以随便找个文件夹建一个如下方示例的.vue文件,然后跑起来：

    vue serve App.vue // 启动服务
    vue build App.vue // 打包出生产环境的包并用来部署

### 如下图，只需一个.vue文件，就能迅速启动一个服务：

如图所示，服务启动的时候回生成一个`node_modules`包，稍微测试了一下，**服务支持ES6语法和热更新**，打包的时候会生成一个`dist`文件夹。(新建一个test.vue文件也只有一个`node_modules`/`dist`文件夹)

这是个很棒的功能，用于**开发一个库、组件，做一些小demo等都是非常适合的**！

![](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/166fc87173c427ea?w=1672&h=1754&f=png&s=344139?raw=true)

---

## 第一次创建项目:

### 1. 命令行:

    vue create hello-cli3 

* hello-cli3是文件夹名字，如果不存在会**自动创建文件夹**，如果存在会安装到那个文件夹中。

* 相比2.x的时候需要自己手动创建一个文件夹，这里也算是一个小优化吧。


### 2. 选择模板:

* 一开始只有两个选项: `default`(默认配置)和`Manually select features`(手动配置)

    默认配置只有`babel`和`eslint`其他的都要自己另外再配置，所以我们选第二项手动配置。

* 在每次选择手动配置之后，会询问你是否保存配置，也就是图片中的`koro`选项，这样以后我们在进行创建项目的时候**只需使用原先的配置**就可以了，而不用再进行配置。

![](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/166fca9d5b691cc3?w=507&h=82&f=png&s=10124?raw=true)


### 3. 选择配置：

* 根据你的项目需要来选择配置,空格键是选中与取消，A键是全选

        ? Check the features needed for your project: (Press <space> to select, <a> to toggle all, <i> to invert selection) 
        // 检查项目所需的功能:(按<space>选择，<a>切换所有，<i>反转选择）
        >( ) TypeScript                                 // 支持使用 TypeScript 书写源码
         ( ) Progressive Web App (PWA) Support          // PWA 支持
         ( ) Router                                     // 支持 vue-router
         ( ) Vuex                                       // 支持 vuex
         ( ) CSS Pre-processors                         // 支持 CSS 预处理器。
         ( ) Linter / Formatter                         // 支持代码风格检查和格式化。
         ( ) Unit Testing                               // 支持单元测试。
         ( ) E2E Testing  

### 4. 选择css预处理器:

* 如果你选择了Css预处理器选项，会让你选择这个

        ? Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supported by default):
        // 选择CSS预处理器（默认支持PostCSS，Autoprefixer和CSS模块）：
        > SCSS/SASS
          LESS
          Stylus

### 5. 是否使用路由的`history`模式：

* 这里我建议选No，这样打包出来丢到服务器上可以直接使用了，后期要用的话，也可以自己再开起来。
* 选yes的话需要服务器那边再进行设置。

        Use history mode for router? (Requires proper server setup for index fallback in production) 
        // 路由使用history模式?(在生产环境中需要适当的服务器设置以备索引)

### 6. 选择Eslint代码验证规则：

    > ESLint with error prevention only
      ESLint + Airbnb config
      ESLint + Standard config
      ESLint + Prettier

### 7. 选择什么时候进行代码规则检测：


* 建议选保存就检测，等到commit的时候，问题可能都已经积累很多了。
* 之前写了篇[VsCode保存时自动修复Eslint错误](http://obkoro1.com/web_accumulate/accumulate/tool/Eslint%E8%87%AA%E5%8A%A8%E4%BF%AE%E5%A4%8D%E6%A0%BC%E5%BC%8F%E9%94%99%E8%AF%AF.html#vscode%E4%BF%9D%E5%AD%98%E6%97%B6%E8%87%AA%E5%8A%A8%E4%BF%AE%E5%A4%8Deslint%E9%94%99%E8%AF%AF)推荐一下。

        ? Pick additional lint features: (Press <space> to select, <a> to toggle all, <i> to invert selection)
        >( ) Lint on save // 保存就检测
         ( ) Lint and fix on commit // fix和commit时候检查

### 8. 选择e2e测试:

    ? Pick a E2E testing solution: (Use arrow keys)
    ❯ Cypress (Chrome only) 
      Nightwatch (Selenium-based) 

### 9. 把babel,postcss,eslint这些配置文件放哪：

* 通常我们会选择独立放置，让package.json干净些

        ? Where do you prefer placing config for Babel, PostCSS, ESLint, etc.? (Use arrow keys)
        > In dedicated config files // 独立文件放置
          In package.json // 放package.json里

### 10. 是否保存配置：

    Save this as a preset for future projects? (Y/n) // 是否记录一下以便下次继续使用这套配置
    // 选保存之后，会让你写一个配置的名字：
    Save preset as:  name // 然后你下次进入配置可以直接使用你这次的配置了

### 11. 下载依赖

### 12. webpack配置的目录不见了：

一起来看一下新项目的结构(下图),会发现2.x的webpack配置的目录不见了，也就是没有build、config这两个文件夹了：

* 这种方式的优势**对小白来说非常友好**，不会一上来就两个文件夹，一堆文件，看着脑袋都大了。
* 然后在**引用~~抄~~别人的配置的时候，也非常方便**，直接将文件复制过来就好了。
* **在自定义一下webpack的配置**，我们需要在**根目录新建一个`vue.config.js`文件**，文件中应该导出一个对象，然后进行配置，详情查阅[官方文档](https://cli.vuejs.org/zh/config/)

        // vue.config.js
        module.exports = {
          // 选项...
        }
    
    

* 还有一些小变动像：static文件夹改为public了，router文件夹变成了单个文件之类的(我之前一直这么做,嘿嘿)。

    ![](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/166fcd735ce563ba?w=214&h=520&f=png&s=33855?raw=true)


### 13.启动项目：
    

*  启动项目：npm run serve // **不是之前的 npm run dev**

*  打开`http://localhost:8080`：
    
    ![](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/166fcd823cce157b?w=3352&h=1938&f=png&s=259698?raw=true)

---

## 使用图形化界面创建/管理/运行项目：

### 启动图形化界面

    vue ui 
* 这是个全局的命令 在哪个文件夹都可以打开
* 界面(下图)，重要的项目可以收藏起来(置顶)：
    
    ![](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/166fd034aae0942d?w=1918&h=999&f=png&s=86025?raw=true)


### 创建项目和导入项目：

1. 目录选中之后，导入项目点击下面的导入就可以了。

    ![](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/166fd0f5359fc7ba?w=980&h=389&f=png&s=147646?raw=true)
    
2. 创建项目，填一个文件夹名字：
    
    ![](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/166fd177edf662d3?w=651&h=591&f=png&s=61598?raw=true)

3. 然后选一下预先保存好的设置就可以了，非常方便，建议采用图形界面来创建项目：

    ![](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/166fd1a86f0e7bd5?w=1029&h=558&f=png&s=83704?raw=true)


### 项目管理：

当我们点击hello -cli3项目，就会进入项目管理的界面

#### 1. 仪表盘：

* 这个仪表盘，主要是为了我们操作方便而设置的
* 可以点击右上角的按钮，来添加/移动这些功能选项。

    ![](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/166fd276f5a4de8b?w=1918&h=999&f=png&s=214672?raw=true)
    
#### 2. vue-cli3.x插件：

* vue-cli3的插件功能，详情了解[官方文档](https://cli.vuejs.org/zh/guide/plugins-and-presets.html#%E6%8F%92%E4%BB%B6)

    ![](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/166fd344e9e5edc0?w=1916&h=998&f=png&s=150720?raw=true)

* cli3插件安装的过程：

    ![cli3插件安装的过程](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/166fd3595b37e06a?w=1535&h=972&f=png&s=223096?raw=true)


#### 3. 项目依赖

* 直接在图形界面管理依赖很舒服了！
* 安装依赖的时候，要记得选择开发依赖/运行依赖！

    ![](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/166fd391835d2edb?w=1915&h=996&f=png&s=287780?raw=true)


#### 4. 项目配置

* 可以对cli进行一些配置、Eslint规则修改：

    ![](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/166fd3c81be26fd0?w=1911&h=990&f=png&s=248696?raw=true)

#### 5. 任务：

* serve 运行项目，点击直接运行，再也不用输入命令了！
* 可以清楚的看到各个模块用了多久，方便我们**针对性的进行优化**：


    ![](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/166fd41bde538496?w=1913&h=996&f=png&s=223258?raw=true)

* build 打包项目：这里**主要展示了图表的功能**，比以前2.x生成报告更加直观，超级棒！

    ![](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/166fd42dae770e0d?w=1731&h=906&f=png&s=121200?raw=true)

#### 6. 其他

* 夜间风格界面，我更喜欢这个界面
* 直接打开编辑器,很棒了！
* 还有一些乱七八糟的按钮

    ![](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/166fd4f37d2fd567?w=1913&h=994&f=png&s=145551?raw=true)

---

## 结语

可以说很认真了，希望大家看完能够有些收获，**赶紧试试新版的vue-cli吧**！

### 希望看完的朋友可以点个喜欢/关注，您的支持是对我最大的鼓励。

[博客](http://obkoro1.com/)、[前端积累文档](http://obkoro1.com/web_accumulate/accumulate/)、[公众号](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/1631b6f52f7e7015?w=344&h=344&f=jpeg&s=8317?raw=true)、[GitHub](https://github.com/OBKoro1)
 
 以上2018.11.10
 
 参考资料：
 
 [vue-cli3官方文档](https://cli.vuejs.org/zh/guide/)

 [vue-cli3.0搭建与配置](https://gitee.com/hjm100/codes/rjch7b31l4f59gt8suidn63)

