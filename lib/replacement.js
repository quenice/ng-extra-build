const fs = require("fs");
const {getAbsolutePath, printSubTitleLog} = require("./utils");

function replacement({env, buildInfo}) {
    if (!buildInfo.replacement || buildInfo.replacement.length === 0) return;
    printSubTitleLog("Replacement start...");
    const replacementList = buildInfo.replacement;
    for (let replacementItem of replacementList) {
        replaceItem(replacementItem, env, buildInfo);
    }
    printSubTitleLog("Replacement finish!");
}

function replaceItem(replacementItem, env, buildInfo) {
    if (!replacementItem || !replacementItem.file || !replacementItem.contents || replacementItem.contents.length === 0) return;
    const replacementFilePath = getAbsolutePath(replacementItem.file, env, buildInfo);
    let content = fs.readFileSync(replacementFilePath, {encoding: 'UTF-8'});
    const contents = replacementItem.contents;
    content = content.toString();
    for (let c of contents) {
        const replace = c.replace;
        if (!replace) continue;
        const _with = c.with;
        const withEnv = c.withEnv;
        if (!withEnv) {
            if (!_with) continue;
            content = content.replace(replace, _with);
            console.log(`Replace [${replace}] with [${_with}] in file [${replacementFilePath}]`);
            continue;
        }

        if (withEnv[env]) {
            content = content.replace(replace, withEnv[env]);
            console.log(`Replace [${replace}] with [${withEnv[env]}] in file [${replacementFilePath}]`);
        }
    }
    fs.writeFileSync(replacementFilePath, content);
}

module.exports = replacement;
