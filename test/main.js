const path = require('path')
const {getFileHashcode} = require("../lib/utils");
console.log(getFileHashcode(path.resolve('test/css/test.css')));
