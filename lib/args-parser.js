const argNames = {
    env: '-env',
    config: '-config'
};

function parse() {
    const args = process.argv.slice(2);
    if (!args || args.length === 0) return null;
    const _argNames = Object.values(argNames);
    const parsed = {};
    for (let arg of args) {
        const arr = arg.split('=');
        if (!_argNames.includes(arr[0])) continue;
        parsed[arr[0]] = arr[1]
    }

    return parsed;
}

module.exports.argNames = argNames;
module.exports.parse = parse;
