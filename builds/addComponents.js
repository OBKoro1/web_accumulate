/*
 * @Github: https://github.com/OBKoro1
 * @Author: OBKoro1
 * @Created_time: 2019-06-24 10:13:25
 * @LastEditors: OBKoro1
 * @LastEditTime: 2019-06-25 19:50:41
 * @Description: 查找markdown 添加特殊字符以及评论组件
 */
const fs = require('fs')
const findMarkdown = require('./findMarkdown')

// 查找markdown
findMarkdown.findMarkdown(findMarkdown.source, writeComponents)

// <!-- more --> 获取之前的markdown内容

// markdown文件回调 添加特殊字符以及评论组件
function writeComponents(dir) {
  let content = fs.readFileSync(dir, 'utf8');
  content = content.trim() // 清除首尾空白字符
  fs.writeFile(dir, `${content}\n\n${findMarkdown.specialString}\n<!-- more -->\n<comment-comment articleString=${content}/> \n`, (err) => {
    if (err) throw err
    console.log(`添加组件：${dir}`)
  })
}

