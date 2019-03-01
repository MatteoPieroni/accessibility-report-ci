const utils = require('../lib/utils');
const files = require('../lib/files');
const pa11yUtils = require('../lib/pa11y');
const reports = require('../lib/reports');

const analyseUrls = async (array, config, outputArchive, outputVisualizer) => {
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
};

module.exports = {
    analyseUrls: analyseUrls
}