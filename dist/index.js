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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var log_1 = require("./utils/log");
var fs_1 = require("./utils/fs");
var lib_1 = require("./libs/lib");
//入口函数
var main = function () { return __awaiter(_this, void 0, void 0, function () {
    var platform, isWindows, _a, sourceDir, targetDir, files, _i, files_1, file, platFile, filepath, filecontent, newTargetDir, urlList, _b, urlList_1, url;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                platform = process.platform;
                isWindows = platform === 'win32';
                _a = process.argv, sourceDir = _a[2], targetDir = _a[3];
                return [4 /*yield*/, lib_1.getAllMarkdownFiles(sourceDir)];
            case 1:
                files = _c.sent();
                _i = 0, files_1 = files;
                _c.label = 2;
            case 2:
                if (!(_i < files_1.length)) return [3 /*break*/, 10];
                file = files_1[_i];
                platFile = isWindows ? file.split('.md')[0].split('/').join('\\') + ".md" : file;
                filepath = platFile.split('.md')[0];
                filecontent = fs_1.read(path_1.default.join(sourceDir, platFile), { encoding: 'utf8' });
                newTargetDir = path_1.default.join(targetDir, filepath);
                if (!fs_1.isExistDir(newTargetDir)) return [3 /*break*/, 4];
                return [4 /*yield*/, fs_1.deleteDir(newTargetDir)];
            case 3:
                _c.sent();
                _c.label = 4;
            case 4: return [4 /*yield*/, fs_1.createDir(newTargetDir)];
            case 5:
                _c.sent();
                urlList = lib_1.getMarkdownImageUrls(filecontent);
                _b = 0, urlList_1 = urlList;
                _c.label = 6;
            case 6:
                if (!(_b < urlList_1.length)) return [3 /*break*/, 9];
                url = urlList_1[_b];
                return [4 /*yield*/, fs_1.downloadFile(url, newTargetDir)];
            case 7:
                _c.sent();
                _c.label = 8;
            case 8:
                _b++;
                return [3 /*break*/, 6];
            case 9:
                _i++;
                return [3 /*break*/, 2];
            case 10:
                log_1.log('所有文章中的图片已下载成功！');
                return [2 /*return*/];
        }
    });
}); };
main();
