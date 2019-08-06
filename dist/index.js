"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var fs = require('fs');
var path = require('path');
var runScript = require('runscript');
var download = require('download');
//windows中用户复制的目录
var originDir = 'D:\\jianshu_article\\user-5541401-1565071963\\';
var targetDir = 'E:\\workCode\\download-jianshu-images\\jianshu_article\\';
var readmeUrlReg = /\s!\[\]\(https:\/\/\upload-images.jianshu.io\/upload_images\/[a-zA-Z0-9-_?%./]+\)\s/g;
var imageUrlReg = /https:\/\/\upload-images.jianshu.io\/upload_images\/[a-zA-Z0-9-_?%./]+/g;
//用户通过命令行工具输入命令比如：node dist/index.js 简书解压目录 目标存储图片目录
process.argv.forEach(function (val, index) {
    console.log(index + ": " + val);
});
try {
    originDir = process.argv[2] ? process.argv[2] : originDir;
    targetDir = process.argv[3] ? process.argv[3] : targetDir;
}
catch (e) {
    console.log('获取命令参数错误', e);
}
var downloadImages = function (imgurl, path) {
    var newUrlArr = [];
    imgurl.forEach(function (item) {
        if (item.match(imageUrlReg)) {
            newUrlArr.push(item.match(imageUrlReg)[0]);
        }
    });
    console.log(newUrlArr);
    Promise.all(newUrlArr.map(function (url) {
        download(url, path);
    })).then(function () {
        console.log('all files downloaded');
    });
};
var runFunction = function () { return __awaiter(_this, void 0, void 0, function () {
    var stdout, files, num;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, runScript('ls **/*.md', {
                    cwd: originDir,
                    stdio: 'pipe'
                })];
            case 1:
                stdout = (_a.sent()).stdout;
                files = stdout.toString().split('\n');
                num = 0;
                try {
                    files.forEach(function (fileitem, index) {
                        if (fileitem) {
                            var filepath = fileitem.split('.md')[0].split('/').join('\\');
                            var dirStr_1 = targetDir + "\\" + filepath;
                            runScript("mkdir " + dirStr_1, { stdio: 'pipe' })
                                .then(function (stdio) {
                                var fileContent = fs.readFileSync(path.join(originDir, fileitem.split('/').join('\\')), { encoding: 'utf8' });
                                var urlList = fileContent.match(readmeUrlReg);
                                if (urlList && urlList.length > 0) {
                                    downloadImages(urlList, dirStr_1);
                                }
                            });
                        }
                    });
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
                }
                catch (e) {
                    console.log(e);
                }
                return [2 /*return*/];
        }
    });
}); };
runFunction();
