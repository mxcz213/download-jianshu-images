const runScript = require('runscript');
import { log } from '../utils/log';

//sourceDir：简书文章目录
export const getAllMarkdownFiles = async (sourceDir: string) => {
    //ls **/*.md 查询二级目录下的所有.md后缀的文件
    //stdio: pipe 在父进程和子进程之间建立管道
    const { stdout } = await runScript('ls **/*.md', {
        cwd: sourceDir,
        stdio: 'pipe'
    });
    const files: string[] = stdout.toString().split('\n');

    //去掉ls命令产生的尾部空行
    files.pop();
    log('获取所有的简书文章列表；');
    return files;
}

//获取图片url的markdown写法![](https://....)
export const getMarkdownImageUrls = (fileContent: string) => {
    const urlRegExp = /\!\[.*\]\((https?:\/\/.+?)\)/g;

    const imageUrls: string[] = [];
    while(true) {
        const match = urlRegExp.exec(fileContent);
        if(match === null) {
            break;
        }
        
        const [, url] = match;
        imageUrls.push(url);
    }
    return imageUrls;
}