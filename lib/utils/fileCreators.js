
const fs = require('fs');
const { log } = require('./index');

function writeFile(pathAndFileName, fileContent) {
  fs.writeFile(pathAndFileName, `${fileContent}\n`, (error) => {
    if (error) log(error);

    log(`Created file: ${pathAndFileName}`);
  });
}

function createConfigFile(filename, config) {
  const pathAndFileName = `./config/${filename}`;
  const fileContent = JSON.stringify(config, null, 2);

  writeFile(pathAndFileName, fileContent);
}

function createResultsFile({ path, format }, results) {
  const pathAndFileName = `${path}/results.${format}`;

  writeFile(pathAndFileName, results);
}

module.exports = { createConfigFile, createResultsFile };
