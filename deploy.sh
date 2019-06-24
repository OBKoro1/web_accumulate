###
 # @Github: https://github.com/OBKoro1
 # @Author: OBKoro1
 # @Created_time: 2019-06-24 09:47:03
 # @LastEditors: OBKoro1
<<<<<<< HEAD
 # @LastEditTime: 2019-06-24 10:49:10
=======
 # @LastEditTime: 2019-06-24 11:56:11
>>>>>>> f974065bd9fa8a831e45195595901055a6da2da8
 # @Description: 部署 
###

!/usr/bin/env sh

# localhost 8080
# npm run dev

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
echo $1
# npm run d 'commit值'
git commit -m $1

# 如果发布到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages

git push -f git@github.com:OBKoro1/web_accumulate.git master:gh-pages

cd -

git add .

git commit -m $1

git push github master:master # 推到github上

git push # 推到码云上