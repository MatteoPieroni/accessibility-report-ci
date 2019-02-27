const pa11y = require('pa11y');

getSubResults = (array, config) => {
    return new Promise((resolve, reject) => {
        Promise.all (
            array.map(url => {
                if(config.specialOptions) {
                    for (match of config.specialOptions.matches) {
                        if (url.match(match))
                            return pa11y(url, config.specialOptions.options);
                    }
                    return pa11y(url,config.defaultOptions);
                } else {
                    return pa11y(url,config.defaultOptions);
                }
            })
        )
        .then(results => resolve(results))
        .catch(err => reject(err));
    })
}

module.exports = {
    getAllResults: (array, config) => {
        return new Promise (async (resolve, reject) => {
            let newArray = [];
            const date = new Date();
            try {
                console.log('Gathering data... 0%')
                for (var i = 0; i < array.length; i++) {
                    const results = await getSubResults(array[i], config);
                    newArray = [...newArray, ...results];
                    console.log(`Gathering data... ${(i + 1) * 100 / array.length}%`);
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
    }
}