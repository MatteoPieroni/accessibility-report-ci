const fs = require('fs');
require('draftlog').into(console);
const files = require('../files');
const utils = require('../utils');

const writeArchiveFile  = (file, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const singleWrite = console.draft(utils.Loading('Writing archive file started...'));
            await files.promiseWriteFile(file, data, 'utf8', () => singleWrite('Writing archive file completed...'));
            resolve();
        } catch(err) {
            reject(err);
        }
    })
}

const readAndEditGeneralReportData = (file, newData) => {
    return new Promise ((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if (err) 
                reject(err);
            
            try {
                const reportFileData = JSON.parse(data);
                const lastTest = reportFileData[reportFileData.length - 1];
                const lastTestDate = lastTest[lastTest.length - 1];
                const currentTestDate = newData[newData.length - 1];

                if (lastTestDate.year === currentTestDate.year &&
                    lastTestDate.month === currentTestDate.month) {
                    reportFileData.splice(-1,1);
                    reportFileData.push(newData)
                } else {
                    reportFileData.splice(0, 1);
                    reportFileData.push(newData);
                }

                resolve(JSON.stringify(reportFileData));
            } catch (err) {
                reject(err);
            }
        })
    })
}

const writeReportFile = (file, data, jsonData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let generalReportJson = jsonData;

            const generalWrite = console.draft(utils.Loading('Writing report file started...'));

            if (fs.existsSync(file))
                generalReportJson = await readAndEditGeneralReportData(file, data)
            
            await files.promiseWriteFile(file, generalReportJson, 'utf8', () => generalWrite('Writing report file completed...'));
            resolve();
        } catch(err) {
            reject(err);
        }
    })
}

module.exports = {
    writeArchiveFile: writeArchiveFile,
    writeReportFile: writeReportFile,
};
