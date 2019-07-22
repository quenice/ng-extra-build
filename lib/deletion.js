const path = require("path");
const {deleteFolderRecursive, getAbsolutePath} = require("./utils");

function deletion({env, buildInfo}) {
    const deletionList = buildInfo.deletion;
    if (!deletionList || deletionList === 0) return;
    for (let deletionDir of deletionList) {
        //deny danger operation
        if (deletionDir === "" || deletionDir === "/" || deletionDir === "~") continue;

        deletionDir = getAbsolutePath(deletionDir, env, buildInfo);

        //deny danger operation
        if (deletionDir === "" || deletionDir === "/"
            || deletionDir === "~" || deletionDir === path.resolve("./")
            || deletionDir === path.resolve("~") || deletionDir === path.resolve("/")) continue;

        deleteFolderRecursive(deletionDir);
    }
}

module.exports = deletion;
