const fs = require("fs");
const {printSubTitleLog, getAbsolutePath} = require("./utils");

function buildi18n({env, buildInfo}) {
    printSubTitleLog('Build i8n start...');
    if (!buildInfo.i18n) return;
    let extra = buildInfo.i18n.extra;
    let source = buildInfo.i18n.source;
    let target = buildInfo.i18n.target;
    if (!extra) return;
    if (!source) return;
    if (!target) return;
    extra = getAbsolutePath(extra, env, buildInfo);
    source = getAbsolutePath(source, env, buildInfo);
    target = getAbsolutePath(target, env, buildInfo);

    if (!fs.existsSync(extra)) return;
    if (!fs.existsSync(source)) return;

    const sourceFiles = fs.readdirSync(source);
    if (!sourceFiles || sourceFiles.length === 0) return;

    const extraFiles = fs.readdirSync(extra);
    if (!extraFiles || extraFiles.length === 0) return;
    for (let extraFile of extraFiles) {
        const extraFilePath = `${extra}/${extraFile}`;
        if (!sourceFiles.includes(extraFile)) continue;
        const sourceFilePath = `${source}/${extraFile}`;
        const extraFileContent = require(extraFilePath);
        const sourceFileContent = require(sourceFilePath);
        Object.assign(sourceFileContent, extraFileContent);
        fs.writeFileSync(`${target}/${extraFile}`, JSON.stringify(sourceFileContent));
    }
    printSubTitleLog('Build i8n finish');
}

module.exports = buildi18n;
