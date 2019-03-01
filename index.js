#!/usr/bin/env node
const fs = require('fs');
const chalk = require('chalk');
require('draftlog').into(console);
const argv = require('yargs')
    .usage('Usage:  --config [fileName] || --archive [bool] || --visualizer [bool]')
    .command('acc-generate', 'Generates 2 report files using the given config')
    .describe('config', 'Supply the name of the config file')
    .describe('archive', 'Outputs the archive file')
    .alias('archive', 'a')
    .describe('visualizer', 'Outputs the general report file')
    .alias('visualizer', 'v')
    .argv;

const utils = require('./lib/utils');
const files = require('./lib/files');
const pa11yUtils = require('./lib/pa11y');
const reports = require('./lib/reports');

const outputArchive = (argv.archive) ? true : false;
const outputVisualizer = (argv.visualizer) ? true : false;
const configFileToRead = argv.config || 'acc-report-config.json';

async function analyseUrls(array) {
    const startTime = new Date();

    try {
        const date = new Date();
        let jsonToFile = '';
        
        const resultsToShow = await pa11yUtils.getAllResults(array, config);
        
        if (outputArchive || outputVisualizer) {
            console.log(`All tests completed in ${utils.checkTime(startTime)} seconds...`);
            jsonToFile = JSON.stringify(resultsToShow);
            await files.checkAndCreateFolder(`${config.outputFolder}`);
        }

        if (outputArchive)
            await reports.writeArchiveFile(`${config.outputFolder}/acc-report-${date.getFullYear()}-${date.getMonth() + 1}.json`, jsonToFile);

        if (outputVisualizer)
            await reports.writeReportFile(`${config.outputFolder}/acc-general-report.json`, resultsToShow, JSON.stringify([resultsToShow]))

        console.log(`${(outputArchive || outputVisualizer) ? 'Process' : 'All tests'} completed in ${utils.checkTime(startTime)} seconds...`);
        process.exit(0);

    } catch (error) {

        console.log(chalk.red(`Process errored after ${utils.checkTime(startTime)} seconds...`));
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
        config.threshold = config.threshold || 0;
        config.outputFolder = config.outputFolder || 'accessibility';

        const urlsToTest = utils.splitArrayInParts(config.urls, 10);
        analyseUrls(urlsToTest);
    } catch(err) {
        throw(err);
    }
});