const fs = require('fs');
const path = require('path');
const runScript = require('runscript');
const download = require('download');

//windows中用户复制的目录
let sourceDir: string = 'D:\\jianshu_article\\user-5541401-1565071963\\';
let targetDir: string = 'E:\\workCode\\download-jianshu-images\\jianshu_article\\';

try {
    sourceDir = process.argv[2] ? process.argv[2] : sourceDir
    targetDir = process.argv[3] ? process.argv[3] : targetDir
} catch(e) {
    console.log('获取命令参数错误', e)
}

//获取所有markdown文件
const getAllMarkdownFiles = async (sourceDir: string) => {
    const { stdout } = await runScript('ls **/*.md', {
        cwd: sourceDir,
        stdio: 'pipe'
    });
    let files: string[] = stdout.toString().split('\n');
    //去掉ls命令产生的尾部空行
    files.pop();
    return files;
}

//处理目录为合法的windows目录
const handleDir = (fileitem: string) => {
    let filepath: string = fileitem.split('.md')[0].split('/').join('\\');
    let dirStr: string = `${targetDir}\\${filepath}`;
    return dirStr;
}

//获取markdown文件内容
const getArticleContent = (fileitem: string) => {
    let fileContent = fs.readFileSync(path.join(sourceDir, fileitem.split('/').join('\\')), { encoding: 'utf8'});
    return fileContent;
}

//获取图片url的markdown写法![](https://....)
const getMarkdownImageUrls = (fileContent: string) => {
    const readmeUrlReg: RegExp = /\s!\[\]\(https:\/\/\upload-images.jianshu.io\/upload_images\/[a-zA-Z0-9-_?%./]+\)\s/g;
    return fileContent.match(readmeUrlReg);
}

//获取真实的url格式：http://...
const getRealImageUrl = (markdownUrls: string[]) => {
    const imageUrlReg: RegExp = /https:\/\/\upload-images.jianshu.io\/upload_images\/[a-zA-Z0-9-_?%./]+/g;
    let imageUrls: any[] = [];
    markdownUrls.forEach((item: any) => {
        if(item.match(imageUrlReg)){
            imageUrls.push(item.match(imageUrlReg)[0])
        }
    });
    return imageUrls;
}

//下载图片
const downloadImages = (imgurl: string[], path: string) => {   
    let newUrlArr: string[] = getRealImageUrl(imgurl);
    newUrlArr.map((url: string) => {
        download(url, path);
    });
    console.log('all image downloaded');
}

//入口函数
const runDownLoader = async () => {
    let files: string[] = await getAllMarkdownFiles(sourceDir);
    try {
        files.forEach((fileitem: any, index: number) => {
            if(fileitem){
                let dirStr = handleDir(fileitem);                
                runScript(`mkdir ${dirStr}`, { stdio: 'pipe' })
                .then(() => {
                    let fileContent = getArticleContent(fileitem);
                    let urlList: any = getMarkdownImageUrls(fileContent);
                    if(urlList && urlList.length > 0){
                        downloadImages(urlList, dirStr)
                    }
                })
            }
        })
    } catch(e) {
        console.log(e)
    }
}

runDownLoader();




