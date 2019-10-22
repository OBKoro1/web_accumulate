/*
 * @Github: https://github.com/OBKoro1
 * @Author: OBKoro1
 * @Date: 2019-07-29 15:24:40
 * LastEditors: OBKoro1
 * LastEditTime: 2019-10-22 17:10:24
 * @Description: 
 */

const codeBlack = require('./config/codeBlack')
const accumulate = require('./config/accumulate')
const algorithm = require('./config/algorithm')


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
      '/accumulate/': accumulate,
      '/codeBlack/': codeBlack,
      '/algorithm/': [
        {
          title: '简单',
          collapsable: false,
          children: algorithm.simple
        },
        {
          title: '中等',
          collapsable: false,
          children: algorithm.medium
        }
      ]
    }
  }
}