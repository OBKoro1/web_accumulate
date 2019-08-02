## 论如何在node使用命令行

演示一下如何在node中使用`git add .`等命令行。

### 项目代码一键上传

在项目根目录创建`deploy.js`, 使用`node`运行该文件：

```js
node deploy.js '参数1' '参数2'
```

对的, 启动node进程是可以传入参数的：

### 启动node进程时传入参数：

[process.argv](http://nodejs.cn/api/process/process_argv.html)是`node`自带的属性，这是一个数组,数组的前两个元素是默认值：

1. `process.argv[0]`: `process.execPath`(返回启动 Node.js 进程的可执行文件的绝对路径名)
2. `process.argv[1]`: 正在执行的 JavaScript 文件的路径
3. `process.argv[2]、process.argv[3]...`: 这里是传入的参数


```js
// process.argv
[ '/usr/local/bin/node',
  '/Users/obkoro1/work/itemName/deploy.js',
  '参数1', '参数2' ]
  ```

### deploy.js

执行命令行主要是靠node自带模块：`child_process`的[execSync](http://nodejs.cn/api/child_process.html#child_process_child_process_execsync_command_options)方法来创建一个子进程运行命令。

运行方法如上所示，拷贝下面的代码来试一试就知道了。

### 代码：

```js
// deploy.js
// node内置模块 同步执行命令行
const execSync = require('child_process').execSync; 
const commitParam = process.argv[2] // commit 参数
myExecSync(`git add . && git commit -m ${commitParam} && git pull && git push`);

/**
 * @description: 同步执行命令行
 * @param {string} cmd 字符串
 * @Date: 2019-08-02 17:43:41
 */
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
      function(err, stdout, stderr) {
        // 进程错误时 回调
        if (err) {
          console.log(`执行命令${cmd}出错:${err}`);
          return;
        }
      }
    );
  } catch (err) {
    console.log(`执行命令${cmd}出错:${err}`);
  }
}
```
<!-- 特殊字符串：用于修改/删除markdown的结尾提示语-OBKoro1 -->
### 点个[Star](https://github.com/OBKoro1/codeBlack)支持我一下~

