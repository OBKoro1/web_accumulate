/*
 * @Github: https://github.com/OBKoro1/markdown-img-down-site-change
 * @Author: OBKoro1
 * @Created_time: 2019-05-28 17:21:41
 * @LastEditors: OBKoro1
 * @LastEditTime: 2019-06-04 20:19:38
 * @Description: 查找指定文件夹的所有markdown文件。
 * 根据参数找出要所有要替换的图片，下载所有图片，替换图片的地址。
 */

const util = require('./util')
const fs = require('fs'); // 文件模块
var request = require('request');
var async = require("async");

class markdownImageDown {
    /**
     * @param {Object} option 配置项
     * new_image_url: '', // 图片上传的地址
     * add_end: '', // 在图片名字后面添加后缀添加后缀
     * read_markdown_src: './source', // 要查找markdown文件的文件夹地址
     * down_img_src: './markdown_img_src', // 下载项目的地址
     * copy_item_data: true, // 默认备份项目 防止项目数据损坏
     * filter_item: [], // 过滤某些文件夹 不去查找markdown
     * new_image_url: '', // 图片上传的地址
     * var_number: 0, // url前半部分的变量数量
     * @Created_time: 2019-05-31 14:30:40
     */
    constructor(option = {}) {
        if (!util.checkDataAction('Object', option, 'option必须为对象')) return
        let defaultOption = {
            replace_image_url: 'http://ww1.sinaimg.cn/large/',
            new_image_url: 'https://xxx.com/目录地址/', // 图片上传的地址
            add_end: '', // 在图片名字后面添加后缀添加后缀
            read_markdown_src: './source', // 要查找markdown文件的文件夹地址
            down_img_src: './markdown_img_src', // 图片下载到这个文件夹下面
            copy_item_data: 'copy_item_obkoro', // 默认备份项目 防止项目数据损坏
            var_number: 0, // url前半部分的变量数量
            is_link: true, // 不止匹配![](),链接也匹配 []()
            test: true, // 测试模式：不修改.md
            write_file_time: 3000, // 修改文件的settimeout时间，为拷贝文件留出的时间
            filter_item: ['.git'], // 过滤某些文件夹 不去查找markdown
        }
        this.imgList = [] // 查找的img
        this.option = Object.assign(defaultOption, option) // 配置参数
        if (this.option.copy_item_data) {
            // 异步复制
            this.copyNow = true
            this.copyDir(this.option.read_markdown_src, this.option.copy_item_data, (err) => {
                console.log('复制文件夹报错：', err)
            });
        }
    }
    // 搜索图片链接 下载图片
    checkDownImg() {
        this.readFile(this.option.read_markdown_src)
        console.log(`图片提取完成共：${this.imgList.length}张`, this.imgList)
        this.downImg()
    }
    // 替换图片链接
    replaceMarkdown() {
        let time = 0
        if (this.copyNow) {
            time = this.option.write_file_time
            this.copyNow = false;
        }
        setTimeout(() => {
            this.readFile(this.option.read_markdown_src, true)
            console.log('修改图片地址成功')
        }, time)
    }
    /**
     * @description: 正则匹配整个url或者部分url
     * @param {String} type 'allUrl'：匹配markdown图片
     * @return: reg 
     * @Created_time: 2019-06-04 10:32:50
     */
    reg(type) {
        let replaceSlash = (str) => {
            str = str.replace(/\//g, '\\/')
            str = str.replace(/\./g, '\\.')
            return str
        }
        let jointReg = (num) => {
            let str = ``
            if (num > 0) {
                let defineStr = `.*\\/`
                str += defineStr.repeat(num)
                str += `)`
            } else {
                str = `)` // 直接提取url
            }
            return str
        }
        let http = this.option.replace_image_url
        let url = '!'
        if (this.option.is_link) {
            url = '' // []() 链接形式的图片也匹配
        }
        let regObj = {
            // 根据url和变量匹配url中要切割的部分
            sectionUrl: new RegExp(`(${replaceSlash(http)}${jointReg(this.option.var_number)}`, 'g'),
            // 根据url匹配整个图片url
            allUrl: new RegExp(`${url}\\[(.*)\\]\\((${replaceSlash(this.option.replace_image_url)}.*?)\\)`, 'g')
        }
        return regObj[type]

    }
    /**
     * 递归查找文件夹，找到markdown文件的图片语法，
     * 匹配要被替换的图片，添加图片到数组/替换图片地址
     * @param {Stying} path 查找的文件夹
     * @param {Bealoon} replace 是否替换查找
     * @return: 
     * @Created_time: 2019-05-29 14:18:28
     */
    readFile(path, replace = false) {
        if (!util.checkDataAction('String', path)) return
        var files = fs.readdirSync(path); // 返回文件数组
        let reg = this.reg('allUrl'); // 提取markdown图片语法
        files.forEach((item) => {
            let url = `${path}/${item}`; // 文件路径
            let isDirectory = fs.statSync(url).isDirectory(); // 判断是否为文件夹
            if (isDirectory) {
                // 递归文件夹
                if (!this.option.filter_item.includes(url)) {
                    return this.readFile(url, replace)
                }
            } else {
                if (item.indexOf('.md') !== -1) {
                    // 读取文件
                    let data = fs.readFileSync(url, 'utf-8'); // 获取文件内容 返回字符串
                    let res;
                    let isChange = false

                    while ((res = reg.exec(data)) !== null) {
                        let regUrl = res[2]
                        // 添加图片到数组 是否找到该字符串
                        if (regUrl.indexOf(this.option.replace_image_url) !== -1) {
                            if (replace) {
                                // 做的操作：
                                // http://ww1.sinaimg.cn/large/aaaaa.jpg，![](https://user-gold-cdn.xitu.io/2019/5/20/16ad3ff354f2dac3?w=2024&h=1240&f=png&s=339262)
                                // 变量0：[ '', 'http://ww1.sinaimg.cn/large/', 'aaaaa.jpg' ]
                                // 变量3(日期)：['![](', 'https://user-gold-cdn.xitu.io/2019/5/20/', '16ad3ff354f2dac3?w=2024&h=1240&f=png&s=339262)']
                                try {
                                    let sectionUrlReg = this.reg('sectionUrl')
                                    let splitArr = regUrl.split(sectionUrlReg)
                                    let replaceUrl = `${this.option.new_image_url}${splitArr[2]}`
                                    // 可以添加后缀 如github查看图片后缀为: ?raw=true
                                    if (this.option.add_end) {
                                        replaceUrl += this.option.add_end
                                    }
                                    // 替换字符串
                                    isChange = true
                                    data = data.replace(regUrl, replaceUrl)
                                } catch (err) {
                                    throw `请检查new_image_url、var_number的设置：${err}`
                                }


                            } else {
                                // 去重
                                if (!this.imgList.includes(regUrl)) {
                                    this.imgList.push(regUrl)
                                }
                            }
                        }
                    }
                    // 修改文件
                    if (replace && isChange) {
                        if (this.option.test) {
                            console.log('测试模式，不修改文件：', url)
                        } else {
                            fs.writeFile(url, data, 'utf-8', () => {
                                console.log('修改成功', url)
                            })
                        }
                    }
                }
            }
        })
    }

    // 下载图片
    downImg() {
        // 创建文件夹
        this.mkdirSync();
        let num = 0
        async.mapSeries(this.imgList, (httpSrc, callback) => {
            // settimeout等待下载函数创建下载 不需要等下载完毕 是并行
            // 时间充裕的话可以下载函数放进函数中 在回调中调callback
            setTimeout(() => {
                // 图片名+后缀
                let sectionUrlReg = this.reg('sectionUrl')
                let splitArr = httpSrc.split(sectionUrlReg)
                try {
                    if (splitArr[2]) {
                        num++
                        this.downloadPic(httpSrc, `${this.option.down_img_src}/${splitArr[2]}`)
                    }
                    callback(null, httpSrc);
                } catch (err) {
                    // 捕获报错 下载失败
                    callback(err, httpSrc);
                }
            }, 400);
        }, (err, res) => {
            if (err) {
                throw err;
            } else {
                console.log('图片下载完成：', res, num)
            }
        });
    }
    /**
     * 下载图片 命名冲突会覆盖旧的文件 
     * @param {String} src 图片的下载地址
     * @param {String} imgPath 图片下载到哪里的地址
     * @Created_time: 2019-05-31 14:35:08
     */
    downloadPic(src, imgPath) {
        request(src).pipe(fs.createWriteStream(imgPath)).on('close', () => {
            console.log('pic saved!', src)
        })
    }
    /**
     * 创建文件夹 储存图片的地址
     * @param {type} 
     * @return: 
     * @Created_time: 2019-05-31 14:37:30
     */
    mkdirSync() {
        try {
            let isDirectory = fs.statSync(this.option.down_img_src).isDirectory(); // 判断是否为文件夹
            if (!isDirectory) {
                fs.mkdirSync(this.option.down_img_src, { recursive: true });
            }
        } catch (err) {
            fs.mkdirSync(this.option.down_img_src, { recursive: true });
        }
    }
    /*
     * 复制目录、子目录，及其中的文件
     * @param src {String} 要复制的目录
     * @param dist {String} 复制到目标目录
     */
    copyDir(src, dist, callback) {
        fs.access(dist, (err) => {
            if (err) {
                // 目录不存在时创建目录
                fs.mkdir(dist, { recursive: true }, (err) => {
                    if (err) throw err;
                    _copy(null, src, dist);
                });
            } else {
                this.copyNow = false
                return
            }
        });

        var _copy = (err, src, dist) => {
            if (err) {
                callback(err);
            } else {
                fs.readdir(src, (err, paths) => {
                    if (err) {
                        callback(err)
                    } else {
                        paths.forEach((path) => {
                            var _src = src + '/' + path;
                            var _dist = dist + '/' + path;
                            fs.stat(_src, (err, stat) => {
                                if (err) {
                                    callback(err);
                                } else {
                                    // 判断是文件还是目录
                                    if (stat.isFile()) {
                                        fs.readFile(_src, (err, data) => {
                                            if (err) throw err;
                                            fs.writeFile(_dist, data, (err) => {
                                                if (err) {
                                                    throw `文件拷贝失败：${err}`;
                                                }
                                                console.log('拷贝', _dist)
                                            });
                                        })
                                    } else if (stat.isDirectory()) {
                                        // 当是目录是，递归复制
                                        this.copyDir(_src, _dist, callback)
                                    }
                                }
                            })
                        })
                    }
                })
            }
        }
    }
    /**
     * @param {Object} newOption 
     * @return: 
     * @Created_time: 2019-05-31 14:33:00
     */
    updateOption(newOption = {}) {
        if (!util.checkDataAction('Object', newOption, 'updateOption的参数为对象')) return
        this.option = Object.assign(this.option, newOption) // 配置参数
    }

}


module.exports = markdownImageDown
