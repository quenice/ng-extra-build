const path = require("path");
const fs = require("fs");
const {deleteFolderRecursive, getAbsolutePath, printSubTitleLog} = require("./utils");

function deletion({env, buildInfo}) {
    const deletionList = buildInfo.deletion;
    if (!deletionList || deletionList === 0) return;
    printSubTitleLog('Deletion start...');
    for (let deletionPath of deletionList) {
        //deny danger operation
        if (deletionPath === "" || deletionPath === "/" || deletionPath === "~") continue;

        deletionPath = getAbsolutePath(deletionPath, env, buildInfo);

        //deny danger operation
        if (deletionPath === "" || deletionPath === "/"
            || deletionPath === "~" || deletionPath === path.resolve("./")
            || deletionPath === path.resolve("~") || deletionPath === path.resolve("/")) continue;

        const isExists = fs.existsSync(deletionPath);
        if (!isExists) {
            console.log(`No exists file/direction [${deletionPath}]`);
            continue;
        }
        const fileStat = fs.statSync(deletionPath);
        if (fileStat.isFile()) {
            fs.unlinkSync(deletionPath);
        } else if (fileStat.isDirectory()) {
            deleteFolderRecursive(deletionPath);
        }
        console.log(`Deleted [${deletionPath}]`)
    }
    printSubTitleLog('Deletion finish!');
}

module.exports = deletion;
