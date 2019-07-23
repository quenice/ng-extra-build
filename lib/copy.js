const fs = require("fs");
const {printSubTitleLog, getAbsolutePath} = require("./utils");

/**
 * copy file(s)
 * @param env
 * @param buildInfo
 */
function copy({env, buildInfo}) {
    printSubTitleLog('Copy file(s) start...');
    let copyList;
    if (!(copyList = buildInfo.copy) || copyList.length === 0) return;

    for (let copyItem of copyList) {
        if (!copyItem.from || !copyItem.to) continue;
        let from = getAbsolutePath(copyItem.from, env, buildInfo);
        let to = getAbsolutePath(copyItem.to, env, buildInfo);
        fs.copyFileSync(from, to);
        console.log(`Copied from [${from}] to [${to}]`);
    }
    printSubTitleLog('Copy file(s) finish');
}

module.exports = copy;
