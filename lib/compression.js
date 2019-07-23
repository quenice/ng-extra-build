const archiver = require("archiver");
const fs = require("fs");
const path = require("path");
const {printErrorLog, printSubTitleLog, printTitleLog, getAbsolutePath} = require("./utils");

function compression({env, buildInfo, packageInfo}) {
    if (!buildInfo.compression || !buildInfo.compression.from || !buildInfo.compression.to) return;
    printSubTitleLog('Compression start...');

    const from = getAbsolutePath(buildInfo.compression.from, env, buildInfo);
    let to = getAbsolutePath(buildInfo.compression.to, env, buildInfo);
    const toName = `${env}-${packageInfo.name}-${packageInfo.version}`;
    to = path.join(to, `${toName}.zip`);

    const output = fs.createWriteStream(to);
    const archive = archiver('zip', {
        zlib: {level: 9}
    });

    output.on('close', function () {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
        printSubTitleLog('Compression finish');
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
        printErrorLog('Compression Failed!');
        throw err;
    });

    archive.pipe(output);
    archive.directory(from, toName);
    archive.finalize();
}

module.exports = compression;
