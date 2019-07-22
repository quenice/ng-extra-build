const archiver = require("archiver");
const fs = require("fs");
const path = require("path");
const sass = require("node-sass");
const {parse, argNames} = require("./args-parser");
const {printErrorLog, printSubTitleLog, printTitleLog, deleteFolderRecursive, doCopy, getEnvPath} = require("./utils");

let packageInfo;
let buildInfo;

function init() {
    const args = parse();
    if (!args) {
        printErrorLog('Please input argument(s) to continue to build');
        return;
    }

    const configValue = args[argNames.config];
    const envValue = args[argNames.env];

    if (!envValue) {
        printErrorLog('Please input value for -env to continue to build');
        return;
    }

    let buildInfoPath;
    if (configValue) {
        buildInfoPath = require.resolve(path.resolve(args[argNames.config]));
    } else {
        buildInfoPath = require.resolve(path.resolve('build.conf.json'));
    }

    const packageInfoPath = require.resolve(path.resolve('package.json'));
    packageInfo = require(packageInfoPath);
    buildInfo = require(buildInfoPath);

    if (!packageInfo || !buildInfo) return;

    printTitleLog('Additional Build Start');


    const env = envValue;
    buildFavicon(env);
    buildStyles(env);
    buildi18n(env);
    replacement(env);
    deletion(env);
    compression(env);
}

function compression(env) {
    if (!buildInfo.compression || !buildInfo.compression.from || !buildInfo.compression.to) return;
    printSubTitleLog('Compress start...');

    const from = getEnvPath(buildInfo.compression.from, env);
    let to = getEnvPath(buildInfo.compression.to, env);
    const toName = `${env}-${packageInfo.name}-${packageInfo.version}`;
    to = path.join(to, `${toName}.zip`);

    const output = fs.createWriteStream(to);
    const archive = archiver('zip', {
        zlib: {level: 9}
    });

    output.on('close', function () {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
        printSubTitleLog('Compress finish');
        printTitleLog('Addition Build Finish');
    });
    output.on('end', function () {
        console.log('Data has been drained');
    });
    archive.on('warning', function (err) {
        if (err.code === 'ENOENT') {
            printErrorLog(err);
        } else {
            throw err;
        }
    });

    archive.on('error', function (err) {
        printErrorLog('Compress Failed!');
        throw err;
    });

    archive.pipe(output);
    archive.directory(from, toName);
    archive.finalize();
}

/**
 * copy favicon.ico to dist
 * @param env
 */
function buildFavicon(env) {
    printSubTitleLog('Build favicon start...');
    if (!buildInfo.favicon || !buildInfo.favicon.to || !buildInfo.favicon.from) return;
    let from = getEnvPath(buildInfo.favicon.from, env);
    let to = getEnvPath(buildInfo.favicon.to, env);
    doCopy(from, to);
    printSubTitleLog('Build favicon finish');
}

/**
 * compile scss and move to dist
 */
function buildStyles(env) {
    printSubTitleLog('Build css start...');
    if (!buildInfo.css || !buildInfo.css.to || !buildInfo.css.from) return;

    let from = getEnvPath(buildInfo.css.from, env);
    let to = getEnvPath(buildInfo.css.to, env);
    const result = sass.renderSync({
        file: from,
        outputStyle: 'compressed',
        sourceMap: false
    });

    const toDir = to.substring(0, to.lastIndexOf('/'));
    if (!fs.existsSync(toDir)) {
        fs.mkdirSync(toDir);
    }
    fs.writeFileSync(to, result.css);
    printSubTitleLog('Build css Finish');
}

function buildi18n(env) {
    printSubTitleLog('Build i8n start...');
    if (!buildInfo.i18n) return;
    let extra = buildInfo.i18n.extra;
    let source = buildInfo.i18n.source;
    let target = buildInfo.i18n.target;
    if (!extra) return;
    if (!source) return;
    if (!target) return;
    extra = getEnvPath(extra, env);
    source = getEnvPath(source, env);
    target = getEnvPath(target, env);

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

function replacement(env) {
    if (!buildInfo.replacement || buildInfo.replacement.length === 0) return;

    const replacementList = buildInfo.replacement;
    for (let replacement of replacementList) {
        const replacementFilePath = getEnvPath(replacement.file, env);
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

function deletion(env) {
    const deletionList = buildInfo.deletion;
    if (!deletionList || deletionList === 0) return;
    for (let deletionDir of deletionList) {
        deletionDir = getEnvPath(deletionDir, env);
        deleteFolderRecursive(deletionDir);
    }
}

module.exports.init = init;
