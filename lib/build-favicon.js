const {printSubTitleLog, doCopy, getAbsolutePath} = require("./utils");

/**
 * copy favicon.ico to dist
 * @param env
 */
function buildFavicon({env, buildInfo}) {
    printSubTitleLog('Build favicon start...');
    if (!buildInfo.favicon || !buildInfo.favicon.to || !buildInfo.favicon.from) return;
    let from = getAbsolutePath(buildInfo.favicon.from, env, buildInfo);
    let to = getAbsolutePath(buildInfo.favicon.to, env, buildInfo);
    doCopy(from, to);
    printSubTitleLog('Build favicon finish');
}

module.exports = buildFavicon;
