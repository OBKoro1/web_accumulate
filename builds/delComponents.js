/*
 * @Github: https://github.com/OBKoro1
 * @Author: OBKoro1
 * @Created_time: 2019-06-24 10:13:36
 * @LastEditors: OBKoro1
 * @LastEditTime: 2019-06-25 17:03:16
 * @Description: 根据特殊字段删除编译后的issue组件
 */

const fs = require('fs')
const findMarkdown = require('./findMarkdown')

findMarkdown.findMarkdown(findMarkdown.source, delComponents)

function delComponents(dir) {
    fs.readFile(dir, 'utf-8', (err, content) => {
        if (err) throw err
        content = content.replace(/<comment-comment.*\/>/g, '')
        let index = content.indexOf(findMarkdown.specialString)
        if (index !== -1) {
            content = content.substring(0, index)
        }
        fs.writeFile(dir, content, (err) => {
            if (err) throw err
            console.log(`删除评论组件： ${dir}`)
        })
    })
}

