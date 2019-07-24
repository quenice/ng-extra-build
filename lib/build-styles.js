const fs = require("fs");
const path = require("path");
const sass = require("node-sass");
const {printSubTitleLog, getDistPath, getAbsolutePath, getFileHashcode} = require("./utils");

/**
 * compile css and move to dist
 */
function buildStyles({env, buildInfo}) {
    printSubTitleLog('Build css start...');
    if (!buildInfo.css || !buildInfo.css.to || !buildInfo.css.from) return;

    const from = getAbsolutePath(buildInfo.css.from, env, buildInfo);
    const to = getAbsolutePath(buildInfo.css.to, env, buildInfo);
    const devUrl = buildInfo.css.devUrl;

    if (!fs.existsSync(from)) return;
    const hashcode = getFileHashcode(from);
    const result = sass.renderSync({
        file: from,
        outputStyle: 'compressed',
        sourceMap: false
    });

    if (!fs.existsSync(to)) {
        fs.mkdirSync(to);
    }
    const toFilePath = path.join(to, `${hashcode}.css`);
    fs.writeFileSync(toFilePath, result.css);
    console.log(`Build css from [${from}] to [${toFilePath}]`);

    if (devUrl) {
        // replace content in index.html
        const _to = buildInfo.css.to;
        let contentWith = "";
        let dist = buildInfo.base && buildInfo.base.outDir ? buildInfo.base.outDir : 'dist';
        let $dist = `$${dist}`;
        if (_to.includes($dist)) {
            contentWith = _to.replace($dist, "");
        } else if (_to.includes(`$root/${dist}`)) {
            contentWith = _to.replace(`$root/${dist}`, "");
        }

        if (contentWith === "/") {
            contentWith = "";
        } else if (contentWith.indexOf("/") === 0) {
            contentWith = contentWith.substr(1);
        }

        if(contentWith === "") {
            contentWith += `${hashcode}.css`;
        } else {
            contentWith += `/${hashcode}.css`;
        }

        const indexPath = path.join(getDistPath(buildInfo), "index.html");
        let content = fs.readFileSync(indexPath, {encoding: 'UTF-8'});
        content = content.toString().replace(devUrl, contentWith);
        fs.writeFileSync(indexPath, content);
        console.log(`Replace [${devUrl}] with [${contentWith}] in [${indexPath}]`);
    }

    printSubTitleLog('Build css Finish');
}

module.exports = buildStyles;
