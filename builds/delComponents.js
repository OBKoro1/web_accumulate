/*
 * @Github: https://github.com/OBKoro1
 * @Author: OBKoro1
 * @Created_time: 2019-06-24 10:13:36
 * @LastEditors: OBKoro1
 * @LastEditTime: 2019-08-02 15:14:00
 * @Description: 
 * 复制readme到codeBlack、Brush_algorithm
 * 更新进阶积累文档readme
 * 根据特殊字段删除编译后的issue组件
 */

const fs = require('fs')
const execSync = require('child_process').execSync; // 执行命令
const findMarkdown = require('./findMarkdown')

findMarkdown.findMarkdown(findMarkdown.source, delComponents)

const commitParam = process.argv[2] // commit 参数

compareFile('./docs/codeBlack/README.md', '../codeBlack')
compareFile('./docs/algorithm/README.md', '../Brush_algorithm')


// 复制文件
function compareFile(file, elesFile) {
    fs.copyFileSync(
        file,
        `${elesFile}/README.md`,
    );
    myExecSync(`ls && cd ${elesFile} && git add . && git commit -m ${commitParam} && git push`)
    function myExecSync(cmd) {
        // 除了该方法直到子进程完全关闭后才返回 执行完毕 返回
        try {
            var output = execSync(
                cmd,
                {
                    encoding: 'utf8',
                    timeout: 0,
                    maxBuffer: 200 * 1024,
                    killSignal: 'SIGTERM',
                    cwd: null,
                    env: null
                },
                function (err, stdout, stderr) {
                    // 进程错误时 回调
                    if (err) {
                        console.log(`报错:${err}`); // 拦截报错
                        return;
                    }
                }
            );
        } catch (err) {
            console.log('执行命令出错:', err);
        }
    }
}

// 更新前端进阶文档
fs.copyFileSync(
    `./docs/accumulate/README.md`,
    `./docs/.vuepress/dist/README.md`,
);

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

