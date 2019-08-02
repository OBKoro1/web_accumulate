/*
 * @Github: https://github.com/OBKoro1
 * @Author: OBKoro1
 * @Created_time: 2019-06-24 10:13:25
 * @LastEditors: OBKoro1
 * @LastEditTime: 2019-08-02 11:47:17
 * @Description: 查找markdown 添加特殊字符以及评论组件
 */
const fs = require('fs')
const findMarkdown = require('./findMarkdown')

console.log('process.argv1', process.argv)

// 查找markdown
findMarkdown.findMarkdown(findMarkdown.source, writeComponents)

// markdown文件回调 添加特殊字符以及评论组件
function writeComponents(dir) {
  let content = fs.readFileSync(dir, 'utf8');
  content = content.trim() // 清除首尾空白字符

  let [support, content2] = addSupport(dir, content)
  // 删除支持
  content = content2
  // 添加支持
  content = `${content2}${support}`
  // 添加组件
  content = `${content}\n\n${findMarkdown.specialString}\n<!-- more -->\n<comment-comment/>\n`
  fs.writeFile(dir, `${content}`, (err) => {
    if (err) throw err
    console.log(`添加组件：${dir}`)
  })
}


/**
 * @description: 删除旧的支持换成新的支持
 * @Date: 2019-08-01 14:15:13
 */
function addSupport(dir, content) {
  // dir: ./docs/accumulate/CSS/CSS权重规则.md

  let support = addSupport.prototype.getEndString('accumulate')
  let index = content.indexOf(addSupport.prototype.specialString)
  if (index !== -1) {
    // 删除
    content = content.substring(0, index)
  }

  const githubObj = {
    accumulate: 'web_accumulate',
    algorithm: 'Brush_algorithm',
    codeBlack: 'codeBlack'
  }
  for (let key in githubObj) {
    if (dir.indexOf(key) !== -1) {
      support = addSupport.prototype.getEndString(githubObj[key])
    }
  }
  return [support, content]
}
addSupport.prototype.getEndString = function (itemName) {
  return `${addSupport.prototype.specialString}### 点个[Star](https://github.com/OBKoro1/${itemName})支持我一下~`
}
addSupport.prototype.specialString = `\n<!-- 特殊字符串：用于修改/删除markdown的结尾提示语-OBKoro1 -->\n`