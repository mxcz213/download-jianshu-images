import path from 'path';
import { log } from './utils/log';
import { read, createDir, deleteDir, isExistDir, downloadFile } from './utils/fs';
import { getAllMarkdownFiles, getMarkdownImageUrls } from './libs/lib';

//入口函数
const main = async () => {
    //平台判断
    const { platform } = process;
    const isWindows: boolean = platform === 'win32';

    //获取命令行参数
    const [, , sourceDir, targetDir] = process.argv;

    //获取markdown文件列表
    const files: string[] = await getAllMarkdownFiles(sourceDir);

    //下载文件列表中每个文章的图片
    for(const file of files){
        // file 是相对路径 例如："2017-2018/前端模块化总结.md"

        // 兼容 windows 系统路径规则
        let platFile: string = isWindows ? `${file.split('.md')[0].split('/').join('\\')}.md` : file;
        const filepath: string = platFile.split('.md')[0];

        //读取文件内容
        const filecontent = read(path.join(sourceDir, platFile), { encoding: 'utf8'});
        
        //根据 md 文件名，创建目标文件夹，如果目标文件夹存在，则删除重建
        const newTargetDir: string = path.join(targetDir, filepath);
        if(isExistDir(newTargetDir)){
            await deleteDir(newTargetDir);
        }
        await createDir(newTargetDir);

        //找出图片，下载图片到目标目录
        const urlList: string[] = getMarkdownImageUrls(filecontent);
        for(const url of urlList){
            await downloadFile(url, newTargetDir);
        }
    }

    log('所有文章中的图片已下载成功！');
}
main();
