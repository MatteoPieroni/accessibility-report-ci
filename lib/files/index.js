const fs = require('fs');
const path = require('path');

const getCurrentDirectoryBase = () => {
    return path.basename(process.cwd());
};

const directoryExists = (filePath) => {
    try {
        return fs.statSync(filePath).isDirectory();
    } catch (err) {
        return false;
    }
};

const promiseWriteFile = (file, data, options, callback) => {
    return new Promise((resolve, reject) => {
        try {
            fs.writeFile(file, data, options, () => {
                return resolve(callback());
            })
        } catch (err) {
            return reject(err);
        }
    })
};

const checkAndCreateFolder = (folder) => {
    return new Promise((resolve, reject) => {
        try {
            if(!directoryExists(folder))
                return fs.mkdir(folder, options, () => {
                    () => console.log(`Folder ${folder} created...`)
                    return resolve();
                })
            resolve();
        } catch (err) {
            return reject(err);
        }
    })
};

module.exports = {
    getCurrentDirectoryBase: getCurrentDirectoryBase,
    directoryExists: directoryExists,
    promiseWriteFile: promiseWriteFile,
    checkAndCreateFolder: checkAndCreateFolder,
}