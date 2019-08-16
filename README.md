# download-jianshu-images
Node + typescript 实现下载简书文章中所有的图片链接

# 说明

简书网站提供从网站下载自己的文章到本地保存，但是文章中的图片并不能同时下载下来。
为了防止简书出问题，可以将自己的文章备份到本地，防止文章丢失。

前提是先从简书网站下载所有文章。

这个工具就是提供下载简书文章图片到本地。根据每一篇的文章都新建目录，将此文章中用到的图片全都下载到这篇文章的目录下，可以看的更清晰

# 使用方法

## 下载代码

`git clone ...`

## 安装依赖

`npm install`

## 编译ts源码文件到dist目录

`npm run build`

## 下载简书文章的图片到本地

`node . 从简书下载的文章列表路径 图片需要下载到本地的路径 `

### 例如

`node . D:\jianshu_article\user-5541401-1565071963 D:\jianshu_article\article_img`

##使用cli的方式

`jianshu D:\jianshu_article\user-5541401-1565071963 D:\jianshu_article\article_img`
