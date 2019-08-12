const fs = require('fs');
const path = require('path');
const runScript = require('runscript');
const download = require('download');
const debug = require('debug')('jianshu');
const [, , sourceDir, targetDir] = process.argv;

//获取系统平台
const getSysterm = () => {
    return process.platform;
};

const platform: string = getSysterm();

//sourceDir：简书文章目录
const getAllMarkdownFiles = async (sourceDir: string) => {
    //ls **/*.md 查询二级目录下的所有.md后缀的文件
    //stdio: pipe 在父进程和子进程之间建立管道
    const { stdout } = await runScript('ls **/*.md', {
        cwd: sourceDir,
        stdio: 'pipe'
    });
    const files: string[] = stdout.toString().split('\n');
    //去掉ls命令产生的尾部空行
    files.pop();
    debug('GET All jianshu files...');
    return files;
}

const handleDir = (fileItem: string) => {
    let filepath: string = fileItem.split('.md')[0]; 
    //处理目录为合法的windows  
    if(platform === 'win32'){
        filepath = fileItem.split('.md')[0].split('/').join('\\');
    };
    const dirStr: string = path.join(targetDir, filepath);
    return dirStr;
}

//获取markdown文件内容
const getArticleContent = (fileitem: string) => {
    let wholePath: string = fileitem;
    if(platform === 'win32'){
        wholePath = path.join(sourceDir, fileitem.split('/').join('\\'));
    }
    const fileContent = fs.readFileSync(wholePath, { encoding: 'utf8'});
    return fileContent;
}

//获取图片url的markdown写法![](https://....)
const getMarkdownImageUrls = (fileContent: string) => {
    const markdownUrlReg: RegExp = /\s!\[\]\(https:\/\/\upload-images.jianshu.io\/upload_images\/[a-zA-Z0-9-_?%./]+\)\s/g;
    const markdownUrl = fileContent.match(markdownUrlReg);
    let urls: string[] = markdownUrl === null ? [] : markdownUrl;
    return urls;
}

//获取真实的url格式：http://...
const getRealImageUrl = (markdownUrls: string[]) => {
    const imageUrlReg: RegExp = /https:\/\/\upload-images.jianshu.io\/upload_images\/[a-zA-Z0-9-_?%./]+/g;
    let imageUrls: any[] = [];
    markdownUrls.forEach((item: any) => {
        if(item.match(imageUrlReg).length > 0){
            imageUrls.push(item.match(imageUrlReg)[0])
        } else {
            return [];
        }
    });
    return imageUrls;
}

//下载图片
const downloadImages = async (imgurl: string[], path: string) => {   
    const newUrlArr: string[] = getRealImageUrl(imgurl);
    newUrlArr.map((url: string) => {
        if(!url) return;
        download(url, path);
    });
}

const runDownLoader = async (file: string) => {
    //根据文章内容获取全部的图片url
    const fileContent = getArticleContent(file);
    const urlList: string[] = getMarkdownImageUrls(fileContent);
    if(urlList.length === 0){
        console.log(`文章：【${file}】中没有图片；`);
        return;
    }

    //根据文章创建目录，如果目录存在就删除
    const dirStr = handleDir(file);
    const mkdirShell: string = `mkdir ${dirStr}`;

    //先删除目录，然后下载图片到指定文章目录
    const deleteDirShell: string = `rd /s/q ${dirStr}`;
    if(fs.existsSync(dirStr)){
        await runScript(deleteDirShell);
    }
    await runScript(mkdirShell);
    await downloadImages(urlList, dirStr);
}

//入口函数
const downLoader = async () => {
    const files: string[] = await getAllMarkdownFiles(sourceDir);
    files.forEach((file: string) => {
        runDownLoader(file);
    });
    console.log('所有文章中的图片已下载成功！');
}
downLoader();
