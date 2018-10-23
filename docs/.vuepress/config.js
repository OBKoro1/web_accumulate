module.exports = {
  title: 'OBKoro1前端积累',
  description: '种一棵树最好的时间是十年前，其次就是现在。',
  base: '/web_accumulate/',
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    nav: [
      { text: '前端积累', link: '/accumulate/' },
      { text: '前端算法', link: '/algorithm/' },
      { text: '博客', link: 'http://obkoro1.com/' },
      {
        text: 'GitHub',
        items: [
          { text: 'GitHub地址', link: 'https://github.com/OBKoro1' },
          {
            text: '算法仓库',
            link: 'https://github.com/OBKoro1/Brush_algorithm'
          },
          {
            text: '积累仓库',
            link: 'https://github.com/OBKoro1/web_accumulate'
          },
          {
            text: 'VsCode插件仓库',
            link:
              'https://github.com/OBKoro1/koro1FileHeader/blob/b03ef6c8c5c61bd1276c45fe5f108ad92f3ee7b8/README_zh-cn.md'
          }
        ]
      }
    ],
    sidebar: {
      '/accumulate/': [
        '/accumulate/',
        {
          title: 'JS',
          children: [
            '/accumulate/JS/手摸手教你使用WebSocket',
            '/accumulate/JS/数组API解析合集',
            '/accumulate/JS/时间差与时区转换',
            '/accumulate/JS/Object.defineProperty',
            '/accumulate/JS/函数防抖和函数节流',
            '/accumulate/JS/数组完全乱序',
            '/accumulate/JS/多维数组展开',
            '/accumulate/JS/cookie和storage的使用以及区别',
            '/accumulate/JS/随机数组成的数组'
          ]
        },
        {
          title: 'Vue',
          children: [
            '/accumulate/Vue/vue钩子函数',
            '/accumulate/Vue/你或许不知道Vue的这些小技巧',
            '/accumulate/Vue/vue小技巧',
            '/accumulate/Vue/vue定义全局函数',
            '/accumulate/Vue/极简双向绑定',
            '/accumulate/Vue/弹窗'
          ]
        },
        {
          title: '功能',
          children: [
            '/accumulate/effect/复制粘贴系列',
            '/accumulate/effect/input的一些坑点分享',
            '/accumulate/effect/前端弹幕效果实现思路',
            '/accumulate/effect/正则表达式收集',
            '/accumulate/effect/判断用户浏览器',
            '/accumulate/effect/显示隐藏密码'
          ]
        },
        {
          title: '工具/浏览器/机制',
          children: [
            '/accumulate/tool/koroFileHeader',
            '/accumulate/tool/Eslint自动修复格式错误',
            '/accumulate/tool/js垃圾回收机制',
            '/accumulate/tool/忍者秘籍定时器机制',
            '/accumulate/tool/js事件循环机制',
            '/accumulate/tool/http缓存'
          ]
        },
        {
          title: '面试题',
          children: ['/accumulate/interviewQuestion/树状数组结构转化']
        },
        {
          title: 'CSS',
          children: [
            '/accumulate/CSS/CSS权重规则',
            '/accumulate/CSS/CSS概念-BFC深入浅出'
          ]
        },
        {
          title: '其他',
          children: [
            '/accumulate/amateur/VuePress文档',
            '/accumulate/amateur/高性能js',
            '/accumulate/amateur/推箱子'
          ]
        }
      ],
      '/algorithm/': [
        '/algorithm/',
        {
          title: '入门',
          children: [
            '/algorithm/induction/查找斐波纳契数列中第N个数',
            '/algorithm/induction/数组重复次数',
            '/algorithm/induction/水仙花数',
            '/algorithm/induction/反转3位整数'
          ]
        },
        {
          title: '简单',
          children: [
            '/algorithm/simple/两个字符串是变位词',
            '/algorithm/simple/检测2的幂次',
            '/algorithm/simple/子数组之和',
            '/algorithm/simple/最长单词',
            '/algorithm/simple/爬楼梯',
            '/algorithm/simple/落单的数',
            '/algorithm/simple/中位数',
            '/algorithm/simple/两数之和',
            '/algorithm/simple/比较字符串',
            '/algorithm/simple/最大子数组',
            '/algorithm/simple/字符串密钥格式',
            '/algorithm/simple/搜索二维矩阵',
            '/algorithm/simple/合并排序数组',
            '/algorithm/simple/分解质因数',
            '/algorithm/simple/姓名去重',
            '/algorithm/simple/反转整数',
            '/algorithm/simple/回文'
          ]
        }
      ]
    },
    sidebarDepth: 2,
    lastUpdated: 'Last Updated'
  }
};
