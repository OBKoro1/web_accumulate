module.exports = {
  title: 'OBKoro1前端积累',
  description: '种一棵树最好的时间是十年前，其次就是现在。',
  base: '/web_accumulate/',
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
          title: '数组',
          children: ['/accumulate/Array/test', '/accumulate/Array/test2']
        }
      ],
      '/algorithm/': [
        '/algorithm/',
        {
          title: '简单难度',
          children: [
            '/algorithm/simple/姓名去重',
            '/algorithm/simple/反转整数',
            '/algorithm/simple/查找斐波纳契数列中第N个数',
            '/algorithm/simple/回文'
          ]
        }
      ]
    },
    sidebarDepth: 2,
    lastUpdated: 'Last Updated'
  }
};
