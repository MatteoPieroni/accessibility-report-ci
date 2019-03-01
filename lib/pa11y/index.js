const pa11y = require('pa11y');
const utils = require('../utils');
const chalk = require('chalk');
require('draftlog').into(console);

customPa11y = (url, options, threshold) => {
    return new Promise((resolve, reject) => {
        const update = console.draft(`TESTING - ${url}`);
        pa11y(url, options).then(results => {
            if(results.issues.length < threshold) {
                update(chalk.bgGreen('TEST PASSED') + chalk.green(` - ${results.issues.length} errors at ${url}`));
            } else if (results.issues.length >= threshold) {
                update(chalk.bgRed('TEST FAILED') + chalk.red(` - ${results.issues.length} errors at ${url}`));
            }
            resolve(results);
        }).catch(err => {
            reject(err)
        });
    })
}

getSubResults = (array, config) => {
    let regexToMatch = [];
    const threshold = config.threshold;
    const defaultOptions = config.defaultOptions;
    let specialOptions = {};

    if ((config.specialOptions || {}).matches) {
        specialOptions = config.specialOptions.options;
        regexToMatch = config.specialOptions.matches.map(match => new RegExp(match))
    }
    return new Promise((resolve, reject) => {
        Promise.all (
            array.map(url => {
                if(regexToMatch !== []) {
                    for (match of regexToMatch) {
                        if (url.match(match))
                            return customPa11y(url, specialOptions, threshold);
                    }
                    return customPa11y(url,defaultOptions, threshold);
                } else {
                    return customPa11y(url,defaultOptions, threshold);
                }
            })
        )
        .then(results => resolve(results))
        .catch(err => reject(err));
    })
}

const getAllResults = (array, config) => {
    return new Promise (async (resolve, reject) => {
        let newArray = [];
        const date = new Date();
        try {
            const progressLog = console.draft('Gathering data...');
            for (var i = 0; i < array.length; i++) {
                const results = await getSubResults(array[i], config);
                newArray = [...newArray, ...results];
                progressLog(utils.ProgressBar((i + 1) * 100 / array.length));
            }
            newArray.push({
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getUTCDate(),
            })
            return resolve(newArray);
        } catch(err) {
            return reject(err);
        }
    })
};

module.exports = {
    getAllResults: getAllResults,
}