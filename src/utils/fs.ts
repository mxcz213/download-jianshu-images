const fs = require('fs');
const runScript = require('runscript');
const download = require('download');

const read = (path: string, options?: {}) => {
    let fileContent = fs.readFileSync(path, options);
    return fileContent;
}
const createDir = async (targetDir: string) => {
    await runScript(`mkdir ${targetDir}`);
}
const deleteDir = async (targetDir: string) => {
    await runScript(`rd /s/q ${targetDir}`);
}
const isExistDir = (targetDir: string): boolean => {
    return fs.existsSync(targetDir);
}
const downloadFile = async(url: string, targetDir: string) => {
    await download(url, targetDir);
}

export {
    read,
    createDir,
    deleteDir,
    isExistDir,
    downloadFile
}