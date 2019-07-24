

const fs = require('fs');

function writeFile(pathAndFileName, fileContent) {
  fs.writeFile(pathAndFileName, `${fileContent}\n`, (error) => {
    if (error) return console.log(error);

    console.log(`Created file: ${pathAndFileName}`);
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
