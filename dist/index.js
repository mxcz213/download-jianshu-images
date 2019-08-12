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
var debug = require('debug')('Jianshu');
var _a = process.argv, sourceDir = _a[2], targetDir = _a[3];
//获取系统平台
var getSysterm = function () {
    return process.platform;
};
var platform = getSysterm();
//sourceDir：简书文章目录
var getAllMarkdownFiles = function (sourceDir) { return __awaiter(_this, void 0, void 0, function () {
    var stdout, files;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, runScript('ls **/*.md', {
                    cwd: sourceDir,
                    stdio: 'pipe'
                })];
            case 1:
                stdout = (_a.sent()).stdout;
                files = stdout.toString().split('\n');
                //去掉ls命令产生的尾部空行
                files.pop();
                debug('GET All jianshu files...');
                return [2 /*return*/, files];
        }
    });
}); };
var handleDir = function (fileItem) {
    var filepath = fileItem.split('.md')[0];
    //处理目录为合法的windows  
    if (platform === 'win32') {
        filepath = fileItem.split('.md')[0].split('/').join('\\');
    }
    ;
    var dirStr = path.join(targetDir, filepath);
    return dirStr;
};
//获取markdown文件内容
var getArticleContent = function (fileitem) {
    var wholePath = fileitem;
    if (platform === 'win32') {
        wholePath = path.join(sourceDir, fileitem.split('/').join('\\'));
    }
    var fileContent = fs.readFileSync(wholePath, { encoding: 'utf8' });
    return fileContent;
};
//获取图片url的markdown写法![](https://....)
var getMarkdownImageUrls = function (fileContent) {
    var markdownUrlReg = /\s!\[\]\(https:\/\/\upload-images.jianshu.io\/upload_images\/[a-zA-Z0-9-_?%./]+\)\s/g;
    var markdownUrl = fileContent.match(markdownUrlReg);
    return markdownUrl;
};
//获取真实的url格式：http://...
var getRealImageUrl = function (markdownUrls) {
    var imageUrlReg = /https:\/\/\upload-images.jianshu.io\/upload_images\/[a-zA-Z0-9-_?%./]+/g;
    var imageUrls = [];
    markdownUrls.forEach(function (item) {
        if (item.match(imageUrlReg).length > 0) {
            imageUrls.push(item.match(imageUrlReg)[0]);
        }
        else {
            return [];
        }
    });
    return imageUrls;
};
//下载图片
var downloadImages = function (imgurl, path) { return __awaiter(_this, void 0, void 0, function () {
    var newUrlArr;
    return __generator(this, function (_a) {
        newUrlArr = getRealImageUrl(imgurl);
        newUrlArr.map(function (url) {
            if (!url)
                return;
            download(url, path);
        });
        return [2 /*return*/];
    });
}); };
//入口函数
var runDownLoader = function () { return __awaiter(_this, void 0, void 0, function () {
    var files;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getAllMarkdownFiles(sourceDir)];
            case 1:
                files = _a.sent();
                files.forEach(function (fileItem) { return __awaiter(_this, void 0, void 0, function () {
                    var fileContent, urlList, dirStr, mkdirShell, deleteDirShell;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (fileItem === null) {
                                    return [2 /*return*/];
                                }
                                fileContent = getArticleContent(fileItem);
                                urlList = getMarkdownImageUrls(fileContent);
                                if (urlList === null)
                                    return [2 /*return*/];
                                dirStr = handleDir(fileItem);
                                mkdirShell = "mkdir " + dirStr;
                                deleteDirShell = "rd /s/q " + dirStr;
                                if (!fs.existsSync(dirStr)) return [3 /*break*/, 2];
                                return [4 /*yield*/, runScript(deleteDirShell)];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2: return [4 /*yield*/, runScript(mkdirShell)];
                            case 3:
                                _a.sent();
                                return [4 /*yield*/, downloadImages(urlList, dirStr)];
                            case 4:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                debug('All Images Download Success!!!');
                return [2 /*return*/];
        }
    });
}); };
runDownLoader();
