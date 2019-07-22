const fs = require("fs");
const {getAbsolutePath} = require("./utils");

function replacement({env, buildInfo}) {
    if (!buildInfo.replacement || buildInfo.replacement.length === 0) return;

    const replacementList = buildInfo.replacement;
    for (let replacement of replacementList) {
        const replacementFilePath = getAbsolutePath(replacement.file, env, buildInfo);
        let content = fs.readFileSync(replacementFilePath, {encoding: 'UTF-8'});
        const contents = replacement.contents;
        if (!contents || contents.length === 0) continue;
        content = content.toString();
        for (let c of contents) {
            content = content.replace(c.replace, c.with);
        }
        fs.writeFileSync(replacementFilePath, content);
    }
}

module.exports = replacement;
