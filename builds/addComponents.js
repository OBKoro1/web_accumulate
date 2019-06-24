/*
 * @Github: https://github.com/OBKoro1
 * @Author: OBKoro1
 * @Created_time: 2019-06-24 10:13:25
 * @LastEditors: OBKoro1
 * @LastEditTime: 2019-06-24 10:13:27
 * @Description: 
 */
const fs = require('fs')
const findMarkdown = require('./findMarkdown')
const rootDir = './docs'

findMarkdown(rootDir, writeComponents)

function writeComponents(dir) {
  fs.appendFile(dir, `\n \n <comment-comment/> \n `, (err) => {
    if (err) throw err
    console.log(`add components to ${dir}`)
  })
}

