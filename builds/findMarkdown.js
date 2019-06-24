/*
 * @Github: https://github.com/OBKoro1
 * @Author: OBKoro1
 * @Created_time: 2019-06-24 10:13:04
 * @LastEditors: OBKoro1
 * @LastEditTime: 2019-06-24 10:13:06
 * @Description: 
 */
const fs = require('fs')

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

module.exports = findMarkdown

