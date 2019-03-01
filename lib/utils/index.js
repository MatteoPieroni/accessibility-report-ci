const chalk = require('chalk');

const checkTime = (initialTime) => {
    return Math.round((new Date() - initialTime) / 1000);
}

const splitArrayInParts = (array, numberOfElements) => {
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
};

const ProgressBar = (progress) => {
    var units = Math.round(progress / 2)
    return '[' + '='.repeat(units) + ' '.repeat(50 - units) + '] ' + progress + '%'
};

const Loading = (text) => {
    var frame = 0
    var frames = ['-', '\\', '|', '/'];
    frame = (frame + 1) % frames.length
    return frames[frame] + ' ' + text + ' ' + frames[frame];
};

module.exports = {
    checkTime: checkTime,
    splitArrayInParts: splitArrayInParts,
    ProgressBar: ProgressBar,
    Loading: Loading,
}