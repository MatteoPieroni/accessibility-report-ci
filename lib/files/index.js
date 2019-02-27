const fs = require('fs');
const path = require('path');

module.exports = {
    getCurrentDirectoryBase: () => {
        return path.basename(process.cwd());
    },

    directoryExists: (filePath) => {
        try {
        return fs.statSync(filePath).isDirectory();
        } catch (err) {
        return false;
        }
    },
    
    promiseWriteFile: (file, data, options, callback) => {
        return new Promise((resolve, reject) => {
            try {
                fs.writeFile(file, data, options, () => {
                    return resolve(callback());
                })
            } catch (err) {
                return reject(err);
            }
        })
    },

    promiseMkDir: (folder, options = {}, callback) => {
        return new Promise((resolve, reject) => {
            try {
                fs.mkdir(folder, options, () => {
                    return resolve(callback());
                })
            } catch (err) {
                return reject(err);
            }
        })
    }
}