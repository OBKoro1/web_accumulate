# markdown-img-down-site-change(下载/替换markdown中的图片)
> 搜索目标文件夹中的markdown文件，找到目标图片，提供下载图片，替换图片链接的功能-通常用于markdown 图片失效。

### 简介

这是一个极为轻量的脚本，引用包，设置好参数，通过API即可轻松上手。

### 解决什么问题？

1. 集中下载markdown文件中某个域名下的图片到一个文件夹下。
2. 用新的图片链接替换markdown文件中某个域名的图片链接。

```js
// 1. 下载这两个图片
// ![](https://user-gold-cdn.xitu.io/2019/5/20/图片名字?w=2024&h=1240&f=png&s=339262)
// ![](https://user-gold-cdn.xitu.io/2018/6/16/图片名字)
// 2. 替换成：github的链接
![](https://raw.githubusercontent.com/OBKoro1/articleImg_src/master/juejin/图片名字?w=2024&h=1240&f=png&s=339262)
![](https://raw.githubusercontent.com/OBKoro1/articleImg_src/master/juejin/图片名字)
```

### 安装:

```js
npm i markdown-img-down-site-change -S
```

### 文档：

[Github](https://github.com/OBKoro1/markdown-img-down-site-change)

[API](https://github.com/OBKoro1/markdown-img-down-site-change/wiki/API)

[更新日志](https://github.com/OBKoro1/markdown-img-down-site-change/wiki/%E6%9B%B4%E6%96%B0%E6%97%A5%E5%BF%97)

### 数据安全：

刚上手可能不了解脚本的功能，需要调试一番，这时候万一把`markdown`文件给改坏了，岂不是要哭死？

脚本有两种形式来防止这种情况发生：

1. 脚本会[默认备份](https://github.com/OBKoro1/markdown-img-down-site-change/wiki/API#copy_item_data%E5%A4%87%E4%BB%BD%E9%A1%B9%E7%9B%AE%E7%9A%84%E5%9C%B0%E5%9D%80)你的文件。
2. 默认开启[测试模式](https://github.com/OBKoro1/markdown-img-down-site-change/wiki/API#test%E6%98%AF%E5%90%A6%E5%BC%80%E5%90%AF%E6%B5%8B%E8%AF%95%E6%A8%A1%E5%BC%8F)，等到调试的差不多了，可以关闭测试模式。
3. 建议：再不放心的话，可以先用一两个文件来测试一下脚本


### 使用：20行代码不到

在项目中有一个使用[栗子](https://github.com/OBKoro1/markdown-img-down-site-change/blob/master/example.js)，里面加了蛮多注释和空行的，实际代码20行都不到，可以说很简单了，如下：

```js
// npm i markdown-img-down-site-change -S 
const markdownImageDown = require('markdown-img-down-site-change'); // 文件模块

// 传参： 这也是脚本的默认参数，根据情况可以自行修改
let option = {
    replace_image_url: 'https://user-gold-cdn.xitu.io/',
    read_markdown_src: './source', // 要查找markdown文件的文件夹地址
    down_img_src: './juejin', // 下载图片到这个文件夹
    var_number: 3 // url前半部分的变量数量 比如上面的日期: /2019/5/20/、/2018/6/16/
}

// 初始化
const markdownImage = new markdownImageDown(option)

// 下载外链
markdownImage.checkDownImg();

// 上传下载下来的图片文件夹到云端 用户自己操作

// 上传图片之后 
// 脚本会把以前的外链替换成云端地址+拼接一个图片名
markdownImage.updateOption({
    new_image_url: 'https://xxx.com/目录地址/', // 图片上传的地址
    add_end: '?raw=true' // github图片地址有后缀 直接进去是仓库
})

// 替换外链 
// 把replace_image_url的字符串换成new_image_url字符串
markdownImage.replaceMarkdown();
```
### 运行：

**仔细阅读文本，配置好参数之后**

在项目根节点新建一个`handleImg.js`文件，安装一下脚本，然后用`node`运行该文件：

```js
npm i markdown-img-down-site-change -S
node handleImg.js
```

### 欢迎试用

有需要的小伙伴，赶紧来试试吧！文档写的很全，上手非常轻松，项目将会持续维护，有什么问题，欢迎给我提[issue](https://github.com/OBKoro1/markdown-img-down-site-change/issues)~

如果觉得这个脚本还不错的话，就给[项目](https://github.com/OBKoro1/markdown-img-down-site-change)点个Star吧！