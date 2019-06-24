/*
 * @Github: https://github.com/OBKoro1/markdown-img-down-site-change
 * @Author: OBKoro1
 * @Created_time: 2019-05-31 16:05:19
 * @LastEditors: OBKoro1
 * @LastEditTime: 2019-06-04 20:21:18
 * @Description: 查找指定文件夹的所有markdown文件。
 * 根据参数找出要所有要替换的图片，下载所有图片，替换图片的地址。
 */
// npm i markdown-img-down-site-change -S 
const markdownImageDown = require('markdown-img-down-site-change'); // 文件模块

// 本栗子是处理掘金的外链：
// ![](https://user-gold-cdn.xitu.io/2019/5/20/16ad3ff354f2dac3?w=2024&h=1240&f=png&s=339262)
// ![](https://user-gold-cdn.xitu.io/2018/6/16/164081cfd8400f92)

// 传参： 这也是脚本的默认参数，根据情况可以自行修改
let option = {
    replace_image_url: 'https://user-gold-cdn.xitu.io/',
    read_markdown_src: './source', // 要查找markdown文件的文件夹地址
    down_img_src: './juejin', // 下载图片到这个文件夹
    var_number: 3 // url前半部分的变量数量 比如上面的日期: /2019/5/20/、/2018/6/16/
}

// 初始化
const markdownImage = new markdownImageDown(option)

// 下载目标图片链接
markdownImage.checkDownImg();

// 上传下载下来的图片文件夹到云端 用户自己操作

// 上传图片之后 
// 脚本会把以前的外链替换成云端地址+拼接一个图片名
markdownImage.updateOption({
    new_image_url: 'https://xxx.com/juejin/', // 图片上传的地址
    add_end: '?raw=true' // github图片地址有后缀 直接进去是仓库
})

// 替换图片链接
// 把replace_image_url的字符串换成new_image_url字符串
markdownImage.replaceMarkdown();


// 微博外链：更改一下查找的链接地址和图片的新位置就好了
// let option = {
//     replace_image_url: 'http://ww1.sinaimg.cn/large/', // 要被替换的图片
//     read_markdown_src: './source', // 要查找markdown文件的文件夹地址
//     down_img_src: './weibo', // 下载图片到这个文件夹
// }

// markdownImage.updateOption({
//     new_image_url: 'https://xxx.com/weibo/', // 图片上传的地址
//     add_end: '?raw=true' // github图片地址有后缀 直接进去是仓库
// })