

const fs = require('fs');

class CommonConfigInitializer {
  static initialize() {
    const templateFileName = './config/common.sample.json';
    const destinationFileName = './config/common.json';

    fs.copyFileSync(templateFileName, destinationFileName);
    console.log(`Common config initialized in ${destinationFileName}:`);
    console.log(`${fs.readFileSync(destinationFileName)}`);
  }
}

module.exports = CommonConfigInitializer;
