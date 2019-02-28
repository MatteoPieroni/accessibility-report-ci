#!/usr/bin/env node
const fs = require('fs');
const argv = require('yargs')
    .usage('Usage: --general [bool] || --config [fileName]')
    .command('acc-generate', 'Generates 2 report files using the given config')
    .describe('general', 'Set to false to deactivate the general report')
    .describe('config', 'Supply the name of the config file')
    .argv;

const utils = require('./lib/utils');
const files = require('./lib/files');
const pa11yUtils = require('./lib/pa11y');

const outputGeneral = !argv.general || argv.general == 'true';
const configFileToRead = argv.config || 'acc-report-config.json';

function readAndEditGeneralReportData (file, newData) {
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

async function analyseUrls(array) {
    const startTime = new Date();

    try {
        const date = new Date();
        const resultsToShow = await pa11yUtils.getAllResults(array, config);
        console.log('Gathering data completed...')
        const jsonToFile = JSON.stringify(resultsToShow);
        
        if(!files.directoryExists(`${config.outputFolder}`))
            await files.promiseMkDir(`${config.outputFolder}`, {}, () => console.log('Folder created...'));

        console.log('Writing single read file started...')
        await files.promiseWriteFile(`${config.outputFolder}/acc-report-${date.getFullYear()}-${date.getMonth() + 1}.json`, jsonToFile, 'utf8', () => console.log('Writing single read file completed...'));

        if (outputGeneral) {
            let generalReportJson = JSON.stringify([resultsToShow]);
            console.log('Writing general report file started...')
            if (fs.existsSync(`${config.outputFolder}/acc-general-report.json`))
                generalReportJson = await readAndEditGeneralReportData(`${config.outputFolder}/acc-general-report.json`, resultsToShow)
            await files.promiseWriteFile(`${config.outputFolder}/acc-general-report.json`, generalReportJson, 'utf8', () => console.log('Writing general report file completed...'));
        }

        const endTime = new Date();
        var timeDiff = Math.round((endTime - startTime) / 1000);
        console.log('Process completed in ' + timeDiff + ' seconds...');
        process.exit(0)
    } catch (error) {
        const endTime = new Date();
        var timeDiff = Math.round((endTime - startTime) / 1000);
        console.error('Process errored after ' + timeDiff + ' seconds...')
        throw(error);
    }
}

fs.readFile(configFileToRead, (err, confFile) => {
    if(err) {
        throw err;
    }
    try {
        config = JSON.parse(confFile);
        config.defaultOptions = config.defaultOptions || {};
        config.outputFolder = config.outputFolder || 'accessibility';

        const urlsToTest = utils.splitArrayInParts(config.urls, 10);
        analyseUrls(urlsToTest);
    } catch(err) {
        throw(err);
    }
});