const path = require("path");
const fs = require("fs");
const crypto = require('crypto');

function printErrorLog(log) {
    console.log('\033[41;30m ' + log + ' \033[0m');
}

function printTitleLog(log) {
    console.log('\033[42;30m ' + log + ' \033[0m');
}

function printSubTitleLog(log) {
    console.log('\033[46;30m ' + log + ' \033[0m');
}

/**
 * delete directory recursive
 * @param path
 */
function deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file) {
            const curPath = `${path}/${file}`;
            if (fs.statSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

function getDistPath(buildInfo) {
    const dist = buildInfo.base && buildInfo.base.outDir ? buildInfo.base.outDir : 'dist';
    return path.join(process.cwd(), dist);
}

function getAbsolutePath(path, env, buildInfo) {
    if (!path) return '';
    return path.replace("$env", env)
        .replace("$root", process.cwd())
        .replace("$dist", getDistPath(buildInfo));
}

function getFileHashcode(path) {
    if (!path) return '';
    if (!fs.existsSync(path)) return '';
    const file = fs.readFileSync(path);
    const hash = crypto.createHash('md5');
    hash.update(file);
    return hash.digest('hex');
}

module.exports = {
    printErrorLog,
    printTitleLog,
    printSubTitleLog,
    deleteFolderRecursive,
    getDistPath,
    getAbsolutePath,
    getFileHashcode,
};
