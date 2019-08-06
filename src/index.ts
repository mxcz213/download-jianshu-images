const fs = require('fs')
const path = require('path')
const runScript = require('runscript')
const download = require('download')

//windows中用户复制的目录
let originDir: string = 'D:\\jianshu_article\\user-5541401-1565071963\\'
let targetDir: string = 'E:\\workCode\\download-jianshu-images\\jianshu_article\\'

const readmeUrlReg: RegExp = /\s!\[\]\(https:\/\/\upload-images.jianshu.io\/upload_images\/[a-zA-Z0-9-_?%./]+\)\s/g
const imageUrlReg: RegExp = /https:\/\/\upload-images.jianshu.io\/upload_images\/[a-zA-Z0-9-_?%./]+/g

//用户通过命令行工具输入命令比如：node dist/index.js 简书解压目录 目标存储图片目录
process.argv.forEach((val, index) => {
    console.log(`${index}: ${val}`)
});

try {
    originDir = process.argv[2] ? process.argv[2] : originDir
    targetDir = process.argv[3] ? process.argv[3] : targetDir
} catch(e) {
    console.log('获取命令参数错误', e)
}

const downloadImages = (imgurl: string[], path: string) => {   
    let newUrlArr: any[] = []
    imgurl.forEach((item: any) => {
        if(item.match(imageUrlReg)){
            newUrlArr.push(item.match(imageUrlReg)[0])
        }
    })
    console.log(newUrlArr)
    Promise.all(newUrlArr.map((url: string) => {
        download(url, path)
    })).then(() => {
       console.log('all files downloaded')
    })
}

const runFunction = async () => {
    //shell ls拿到所有的.md文章
    const { stdout } = await runScript('ls **/*.md', {
        cwd: originDir,
        stdio: 'pipe'
    })
    let files: string[] = stdout.toString().split('\n')
    let num: number = 0
    try {
        files.forEach((fileitem: any, index: number) => {
            if(fileitem){
                let filepath: string = fileitem.split('.md')[0].split('/').join('\\')
                let dirStr: string = `${targetDir}\\${filepath}`                
                runScript(`mkdir ${dirStr}`, { stdio: 'pipe' })
                .then((stdio: any) => {
                    let fileContent = fs.readFileSync(path.join(originDir, fileitem.split('/').join('\\')), { encoding: 'utf8'})
                    let urlList: any = fileContent.match(readmeUrlReg)
                    if(urlList && urlList.length > 0){
                        downloadImages(urlList, dirStr)
                    }
                })
            }
        })

        //就不全部下载了，图片太多
        // for(let i = 0; i < 4; i++){
        //     let fileitem: string = files[i]
        //      if(fileitem){
        //         let filepath: string = fileitem.split('.md')[0].split('/').join('\\')
        //         let dirStr: string = `${targetDir}\\${filepath}`                
        //         runScript(`mkdir ${dirStr}`, { stdio: 'pipe' })
        //         .then((stdio: any) => {
        //             let fileContent = fs.readFileSync(path.join(originDir, fileitem.split('/').join('\\')), { encoding: 'utf8'})
        //             let urlList: any = fileContent.match(readmeUrlReg)
        //             if(urlList && urlList.length > 0){
        //                 downloadImages(urlList, dirStr)
        //             }
        //         })
        //     }
        // }
    } catch(e) {
        console.log(e)
    }
}

runFunction()




