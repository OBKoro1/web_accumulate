/*
 * @Github: https://github.com/OBKoro1
 * @Author: OBKoro1
 * @Created_time: 2019-06-24 10:13:04
 * @LastEditors: OBKoro1
 * @LastEditTime: 2019-08-01 20:12:52
 * @Description: 查找markdown+定义公共变量
 */
const fs = require('fs')

// 递归查找markdown
function findMarkdown(dir, callback) {
  // dir: ./docs/accumulate/CSS/CSS权重规则.md
  fs.readdir(dir, function (err, files) {
    if (err) throw err

    files.forEach((fileName) => {
      let innerDir = `${dir}/${fileName}`
      if (fileName.indexOf('.') !== 0) { // 过滤以.开头的文件
        fs.stat(innerDir, function (err, stat) {
          if (stat.isDirectory()) {
            findMarkdown(innerDir, callback)
          } else {
            if (filterFile(innerDir)) {
              callback(innerDir)
            }
          }
        })
      }

    })
  })
}

// 过滤文件
function filterFile(dir) {
  // dir: ./docs/accumulate/CSS/CSS权重规则.md

  const arr = ['about.md', 'template.md', './docs/README.md']
  const index = arr.findIndex(item => {
    return dir.indexOf(item) !== -1 // 找出含有过滤的
  })
  return index === -1 // 不含有为true
}


module.exports = {
  source: './docs', // 查找入口
  // source: './docs/accumulate/CSS', // 查找入口
  findMarkdown,
  specialString: `<!-- '特殊字符串：用于删除编译后的issue组件-OBKoro1 -->`
}

