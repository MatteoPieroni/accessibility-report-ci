# Acest - Accessibility testing

Acest is an NPM package you can use to run accessibility tests on different urls at the same time. It works using Pa11y under the hood.

[![npm version](https://badge.fury.io/js/acest.svg)](https://badge.fury.io/js/acest)

You can use it through the command line, you just need a config file!

```sh
npm acest
```

## Table of Content
- [Features](#features)
- [CI/CD](#cicd)
- [Requirements](#requirements)
- [Installation](#installation)
- [Config file](#config)

Features and Commands
---------------------

Acest can be used in 3 different ways:

### As a testing tool

sIt will test your urls and show a pass or fail depending on your set threshold (or the default one).
```sh
npm acest

[==================================================] 100%

TEST FAILED - 18 errors at github.com
TEST PASSED - 3 errors at google.com
All tests completed in 5 seconds...
```

### To generate archives of your pages accessibility score

It will generate .json monthly archive files of your tests, to keep a history of your path to accessibility or a record of your compliance!
```sh
npm acest --archive [-a]
```
You will find the archive file in the folder /accessibility as acest-report-[year]-[month]

### To generate a general report file of the last 12 months

It will generate a .json report file with the record of the latest test of the last 12 months.
```sh
npm acest --visualizer [-v]
```
(**Coming soon**)
A visualization of the data and comparison between different months.
This is useful especially for teams that need buy-in from other departments.

### With a different config file

By default Acest will look for a config file called
**acest.config.js**
at the root of you project (where you are executing the `acest` command).

If you don't like the default name, you can use your own name, just provide the filename as a parameter with the command:

```sh
npm acest --config [name-of-your-file].js
```

CI/CD
-----
Most CI/CD pipelines allow you to execute an NPM command (or YARN) as a step for your build or release. The same goes if you are using Docker.

In this case, as we need to have a reachable version of the website we are going to test, we use it as part of the release pipeline between development, testing and production websites. 

(**Coming soon**)
Use case on Azure Pipelines.

Requirements
------------

As Pa11y requires Node.js 8+ to run, that's the minimum version you need to run Acest.

Installation
------------

To install Acest you need to run

```sh
npm install -g acest
```
N.B. If you don't install Acest globally, but only locally as `npm install --save-dev acest` you will need this command to use it:
```sh
npx acest
```

Config File
--------

`acest.config.js` or your own named config file will set Acest up to handle different configurations. This is what it look like:

```js
module.exports={
    urls: [
        "test.myurl.com",
        ... /* your urls */
    ],
    threshold: 10,
    defaultOptions: {
        timeout: 60000,
        ... /* your other default options */
    },
    specialOptions: {
        matches: [
            "^test\.",
            ... /* all matches for the special options */
        ],
        options: {
            headers: {
                cookie: "your-cookie=value; your-other-cookie=value2;",
            },
            ... /* your other special options */
        }
    },
    outputFolder: 'your-folder'
}
```
### Configuration options:

**`urls`** [array]

**required**

This option is an array of the urls you would like to test.

```js
urls: [
    "https:www.google.com",
    "https:www.github.com"
]
```

**`threshold`** [number]

Default: 0

This option sets the number of errors that will make your page fail the test.

```js
threshold: 10
```

**`defaultOptions`** [object]

Default: {}

This option sets an object of configurations to attach to your Pa11y call, for example `timeout`, `viewport`... See [Pa11y configuration](https://github.com/pa11y/pa11y#configuration) for all the options you can set.

```js
defaultOptions: {
    timeout: 60000
}
```

**`specialOptions`** [object]

Default: {}

This option sets an object with configurations to attach to your Pa11y calls that match specific Regex patterns. It uses 2 properties:

- **`matches`** [array]
An array of Regex patterns to test your urls against.
**N.B. Write your matches without leading and trailing slashes.** 

- **`options`** [object]
An object with the options to use Pa11y with for this specific urls. It can take all the options as `defaultOptions` above.

This is very useful for certain pages that you might be able to reach only if logged-in, for example.

```js
specialOptions: {
    matches: [
        "/account/"
    ],
    options: {
        headers: {
            cookies: "authcookie=myAuThCookie; session=MysEsSioNCOokIe;"
        }
    }
}
```

**`outputFolder`** [string]

Default: "accessibility"

The name of the folder you want your archive files and visualizer to be outputted in.

```js
outputFolder: "my-report-folder"
```

Roadmap
-------

These are the features I am currently working on, they are roughly ordered by priority.
I don't have ETAs for them, but I welcome any contribution.

- Process exit for fail
- Implement the visualizer front end
- Configure the frequency of archives

For any problems or suggestions please use the issues tab here on Github.