/*
 * @Github: https://github.com/OBKoro1
 * @Author: OBKoro1
 * @Created_time: 2019-06-24 10:13:04
 * @LastEditors: OBKoro1
 * @LastEditTime: 2019-06-25 17:06:09
 * @Description: 查找markdown+定义公共变量
 */
const fs = require('fs')

// 递归查找markdown
function findMarkdown(dir, callback) {
  fs.readdir(dir, function (err, files) {
    if (err) throw err

    files.forEach((fileName) => {
      let innerDir = `${dir}/${fileName}`

      if (fileName.indexOf('.') !== 0) {
        fs.stat(innerDir, function (err, stat) {

          if (stat.isDirectory()) {
            findMarkdown(innerDir, callback)
          } else {
            callback(innerDir)
          }
        })
      }

    })
  })
}

module.exports = {
  // source: './docs', // 查找入口
  source: './docs/accumulate/amateur', // 查找入口
  findMarkdown,
  specialString: `<!-- '特殊字符串：用于删除编译后的issue组件-OBKoro1 -->`
}

