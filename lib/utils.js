const fs = require("fs");

function printErrorLog(log) {
    console.log('\033[41;30m ' + log + ' \033[0m');
}

function printTitleLog(log) {
    console.log('\033[42;30m ' + log + ' \033[0m');
}

function printSubTitleLog(log) {
    console.log('\033[46;30m ' + log + ' \033[0m');
}


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

function doCopy(from, to) {
    fs.writeFileSync(to, fs.readFileSync(from));
    console.log(`Finish Copied! From:[${from}], To [${to}]`);
}

function getEnvPath(path, env) {
    if (!path) return '';
    return path.replace("$env", env).replace("$root", process.cwd());
}

module.exports = {
    printErrorLog,
    printTitleLog,
    printSubTitleLog,
    deleteFolderRecursive,
    doCopy,
    getEnvPath,
};
