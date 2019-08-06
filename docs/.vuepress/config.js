/*
 * @Github: https://github.com/OBKoro1
 * @Author: OBKoro1
 * @Date: 2019-07-29 15:24:40
 * @LastEditors: OBKoro1
 * @LastEditTime: 2019-08-06 11:36:36
 * @Description: 
 */
module.exports = {
  title: '前端进阶积累',
  description: '种一棵树最好的时间是十年前，其次就是现在。',
  base: '/web_accumulate/',
  markdown: {
    lineNumbers: true // 代码行数
  },
  themeConfig: {
    // repo: 'OBKoro1/web_accumulate',
    docsRepo: 'OBKoro1/web_accumulate',
    docsBranch: 'master', // git 源仓库 仓库分支
    docsDir: 'docs', // 仓库下的文件夹
    editLinks: true, // 编辑链接
    editLinkText: '帮助我改善这个页面', // 链接字段
    serviceWorker: {
      updatePopup: {
        // 刷新内容的弹窗
        message: '发现新内容',
        buttonText: '刷新'
      }
    },
    lastUpdated: '最后更新时间', // 最后更新时间
    sidebarDepth: 3,
    nav: [
      { text: '前端积累', link: '/accumulate/' },
      { text: '前端算法', link: '/algorithm/' },
      { text: '代码块', link: '/codeBlack/' },
      {
        text: 'GitHub',
        items: [
          {
            text: '前端进阶积累',
            link: 'https://github.com/OBKoro1/web_accumulate'
          },
          {
            text: '开箱即用的代码块',
            link: 'https://github.com/OBKoro1/web_accumulate'
          },
          {
            text: '前端算法',
            link: 'https://github.com/OBKoro1/Brush_algorithm'
          },
          {
            text: 'VsCode头部注释插件',
            link:
              'https://github.com/OBKoro1/koro1FileHeader'
          },
          {
            text: '一键替换markdown失效图片外链',
            link: 'https://github.com/OBKoro1/markdown-img-down-site-change'
          },
          {
            text: '浏览器桌面通知npm包',
            link:
              'https://github.com/OBKoro1/notification-Koro1'
          }
        ]
      },
      { text: '关于', link: '/about' }
    ],
    sidebar: {
      '/accumulate/': [
        '/accumulate/JS/JS基础-call和apply还有bind.md',
        '/accumulate/tool/博客外链失效一键替换',
        '/accumulate/tool/koroFileHeader',
        '/accumulate/ES6/js调用栈机制与ES6尾调用优化介绍',
        '/accumulate/ES6/论普通函数和箭头函数的区别以及箭头函数的注意事项和不适用场景',
        '/accumulate/JS/webWorker上手',
        '/accumulate/JS/手摸手教你使用WebSocket',
        '/accumulate/JS/数组API解析合集',
        '/accumulate/tool/浏览器重绘重排',
        '/accumulate/tool/忍者秘籍定时器机制',
        '/accumulate/tool/js事件循环机制',
        '/accumulate/tool/http缓存',
        '/accumulate/tool/js垃圾回收机制',
        '/accumulate/JS/Object.defineProperty',
        '/accumulate/Vue/极简双向绑定',
        '/accumulate/Vue/vue钩子函数',
        '/accumulate/effect/浏览器桌面通知',
        '/accumulate/JS/函数防抖和函数节流',
        '/accumulate/ES6/let和const命令',
        '/accumulate/effect/网页全屏',
        '/accumulate/effect/复制粘贴系列',
        '/accumulate/effect/退出页面发送请求',
        '/accumulate/tool/Eslint自动修复格式错误',
        '/accumulate/tool/一份超级详细的Vue-cli3.0使用教程',
        '/accumulate/amateur/VuePress文档',
        '/accumulate/Vue/vue定义全局函数',
        '/accumulate/Vue/弹窗',
        '/accumulate/effect/input的一些坑点分享',
        '/accumulate/effect/前端弹幕效果实现思路',
        '/accumulate/effect/时间差与时区转换',
        '/accumulate/JS/cookie和storage的使用以及区别',
        '/accumulate/CSS/CSS概念-BFC深入浅出',
        '/accumulate/CSS/CSS权重规则',
        '/accumulate/amateur/高性能js',
        '/accumulate/amateur/推箱子'
      ],
      '/codeBlack/': [
        '/codeBlack/执行shell命令行',
        '/codeBlack/正则表达式收集',
        '/codeBlack/数组交集差集',
        '/codeBlack/数组完全乱序',
        '/codeBlack/树状数组结构转化',
        '/codeBlack/判断用户浏览器',
        '/codeBlack/多维数组展开',
        '/codeBlack/滚动底部',
        '/codeBlack/单行多行文本溢出',
        '/codeBlack/随机数组成的数组',
        '/codeBlack/字符串绑定点击事件',
        '/codeBlack/网页标题闪烁',
        '/codeBlack/显示隐藏密码',
        '/codeBlack/浏览器自动识别数字成电话号码',
        '/codeBlack/你或许不知道Vue的这些小技巧',
        '/codeBlack/vue小技巧',
        '/codeBlack/vuex三步'
      ],
      '/algorithm/': [
        {
          title: '简单',
          collapsable: false,
          children: [
            '/algorithm/induction/数组重复次数',
            '/algorithm/induction/水仙花数',
            '/algorithm/induction/反转3位整数',
            '/algorithm/induction/查找斐波纳契数列中第N个数',
            '/algorithm/simple/回文',
            '/algorithm/simple/反转整数',
            '/algorithm/simple/姓名去重',
            '/algorithm/simple/分解质因数',
            '/algorithm/simple/合并排序数组',
            '/algorithm/simple/搜索二维矩阵',
            '/algorithm/simple/字符串密钥格式',
            '/algorithm/simple/最大子数组',
            '/algorithm/simple/比较字符串',
            '/algorithm/simple/两数之和',
            '/algorithm/simple/中位数',
            '/algorithm/simple/落单的数',
            '/algorithm/simple/爬楼梯',
            '/algorithm/simple/最长单词',
            '/algorithm/simple/子数组之和',
            '/algorithm/simple/检测2的幂次',
            '/algorithm/simple/两个字符串是变位词',
            '/algorithm/simple/删除元素',
            '/algorithm/simple/第一个只出现一次的字符',
            '/algorithm/simple/字符串压缩',
            '/algorithm/simple/判断字符串的循环移动',
            '/algorithm/simple/丢失的数',
            '/algorithm/simple/相亲数',
            '/algorithm/simple/爬楼梯2',
            '/algorithm/simple/奇偶分割数组'
          ]
        },
        {
          title: '中等',
          collapsable: false,
          children: [
            '/algorithm/medium/第k大元素',
            '/algorithm/medium/丑数',
            '/algorithm/medium/统计数字',
            '/algorithm/medium/无重复字符的最长子串',
          ]
        }
      ]
    }
  }
}