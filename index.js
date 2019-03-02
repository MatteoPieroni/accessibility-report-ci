#!/usr/bin/env node
const path = require('path');
require('draftlog').into(console);
const chalk = require('chalk');
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
const acest = require('./bin/acest');

const outputArchive = (argv.archive) ? true : false;
const outputVisualizer = (argv.visualizer) ? true : false;
const configFileToRead = argv.config || 'acc-report.config.js';
let config = '';
try {
    config = require(path.join(process.cwd(), '/' + configFileToRead));
} catch(err) {
    return console.log(chalk.red("Config file not found. Add it on the root of your project or use \"acest --config [yourfilename.js]\""));
}
config.defaultOptions = config.defaultOptions || {};
config.threshold = config.threshold || 0;
config.outputFolder = config.outputFolder || 'accessibility';

const urlsToTest = utils.splitArrayInParts(config.urls, 10);
acest.analyseUrls(urlsToTest, config, outputArchive, outputVisualizer);