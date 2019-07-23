const fs = require("fs");
const path = require("path");

function generateBuildConfFile() {
    const source = path.resolve("./template/build.conf.json");
    const dest = path.resolve("../../build.conf.json");

    fs.copyFile(source, dest, fs.constants.COPYFILE_EXCL,
        (err) => {
            if (err) {
                console.log(`Not copy template file from [${source}] to [${dest}]. Maybe has exists [${dest}]`);
                return;
            }

            console.log(`Copied template file from [${source}] to [${dest}]`);
        })
}

generateBuildConfFile();
