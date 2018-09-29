## VsCode文件头部注释生成

## language

[English](https://github.com/OBKoro1/koro1FileHeader/blob/master/README.md) | 简体中文

## 简介

* vscode扩展插件
* 在文件头中添加注释
* 支持用户自定义文件注释模板对象
* 在你保存文件的时候 自动更新编辑时间

## 安装

在 Vscode 扩展商店中搜索 `koroFileHeader`

## 使用

1. 在 Vscode 中打开文件
2. 按 `ctrl+alt+i`

成功在文件头部插入文件注释



## 注释模板

### 默认注释模板

* 默认配置:

        "fileheader.customMade": {
            "Author": "OBKoro1",
            "Date": "Do not edit",
            "LastEditors": "OBKoro1",
            "LastEditTime": "Do not edit",
            "Description": "",
        }

* 文件注释生成:

        /*
         * @Author:OBKoro1
         * @Date:2018-05-15 16:20:04
         * @LastEditors:OBKoro1
         * @LastEditTime:2018-05-15 16:20:04
         * @Description:
         */

### 推荐模板参数

`Email`、`Company `、`version`等.

### 自定义注释模板

1. 在 VsCode 设置中搜索`fileheader.customMade`
2. 复制默认配置+修改配置
3. 重启 VsCode 生效


#### Example

* 设置：

![](https://user-gold-cdn.xitu.io/2018/5/18/16370e8435d1cbd3?w=865&h=288&f=jpeg&s=161453)

* 文件注释生成:

        /*
         * @Author: OBKoro1
         * @Date: 2018-05-16 12:33:57
         * @LastEditors: OBKoro1
         * @LastEditTime: 2018-05-16 12:33:57
         * @Description: 
         * @Email: your Email
         * @Company: your company
         * @youWant: add you want
         */

## 自动更新编辑时间 示例:

![](https://user-gold-cdn.xitu.io/2018/5/18/16370e8435ed4d71?w=413&h=270&f=gif&s=49647)