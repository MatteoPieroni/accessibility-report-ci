const chalk = require('chalk');

module.exports = {
    splitArrayInParts: (array, numberOfElements) => {
        const newArray = [];
        const numberOfParts = Math.ceil(array.length / numberOfElements);
        for (var i = 0; i < numberOfParts; i++) {
            if( i == numberOfParts - 1) {
                newArray.push(array.slice(numberOfElements * i, array.length))
            } else {
                newArray.push(array.slice(numberOfElements * i, numberOfElements * (i + 1)))
            }
        }
        return newArray;
    },
    regularLog: (string) => {
        console.log(chalk.cyan(string));
    },
    successLog: (string) => {
        console.log(chalk.green(string));
    },
    errorLog: (string) => {
        console.error(chalk.red(string));
    },
    finishLog: (string) => {
        console.log(chalk.bgGreen(string));
    }
}