/*
 * @Github: https://github.com/OBKoro1
 * @Author: OBKoro1
 * @Created_time: 2019-06-24 10:13:36
 * @LastEditors: OBKoro1
 * @LastEditTime: 2019-06-24 10:13:37
 * @Description: 
 */
const fs = require('fs')
const findMarkdown = require('./findMarkdown')
const rootDir = './docs'

findMarkdown(rootDir,delComponents)

function delComponents(dir){
    fs.readFile(dir,'utf-8', (err, content) => {
        if (err) throw err

        fs.writeFile(dir, content.replace(/\n \n <comment-comment\/> \n /g,''), (err) => {
            if (err) throw err
            console.log(`del components from ${dir}`)
          })
      })
}

