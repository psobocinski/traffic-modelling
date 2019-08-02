
const fs = require('fs');
const { log } = require('./utils');

class CommonConfigInitializer {
  static initialize() {
    const templateFileName = './config/common.sample.json';
    const destinationFileName = './config/common.json';

    if (!fs.existsSync(destinationFileName)) fs.copyFileSync(templateFileName, destinationFileName);

    log(`Common config initialized in ${destinationFileName}:`);
    log(`${fs.readFileSync(destinationFileName)}`);
  }
}

module.exports = CommonConfigInitializer;
