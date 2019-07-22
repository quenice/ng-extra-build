const path = require("path");
const {parse, argNames} = require("./args-parser");
const {printErrorLog, printTitleLog} = require("./utils");
const buildStyles = require("./build-styles");
const buildi18n = require("./build-i18n");
const replacement = require("./replacement");
const deletion = require("./deletion");
const compression = require("./compression");
const buildFavicon = require("./build-favicon");

let packageInfo;
let buildInfo;

function init() {
    const args = parse();
    if (!args) {
        printErrorLog('Please input argument(s) to continue to build');
        return;
    }

    let config = args[argNames.config] || 'build.conf.json';
    const env = args[argNames.env];

    if (!env) {
        printErrorLog('Please input value for -env to continue to build');
        return;
    }

    const buildInfoPath = require.resolve(path.resolve(config));
    const packageInfoPath = require.resolve(path.resolve('package.json'));
    packageInfo = require(packageInfoPath);
    buildInfo = require(buildInfoPath);

    if (!packageInfo || !buildInfo) return;

    printTitleLog('Additional Build Start');

    buildFavicon({env, buildInfo});
    buildStyles({env, buildInfo});
    buildi18n({env, buildInfo});
    replacement({env, buildInfo});
    deletion({env, buildInfo});
    compression({env, buildInfo, packageInfo});
}

module.exports.init = init;
