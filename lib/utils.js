'use strict';

const fs = require('fs');

function arrayDifference(arr1, arr2) {
  return (arr1.filter(x => !arr2.includes(x)));
}

function createOutputFile({ outputPath, outputFormat }, results) {
  const fileName = `results.${outputFormat}`,
    pathAndFileName = `${outputPath}/${fileName}`;

  fs.writeFile(pathAndFileName, `${results}\n`, function(err) {
    if(err) return console.log(err);

    console.log(`results outputted to file: ${pathAndFileName}`);
  });
}

function indexOfRandomLane(lanes) {
  return Math.floor(Math.random() * lanes.length);
}

function indexOfShortestLane(lanes) {
  return lanes.reduce(({ shortestIndex, shortestLength }, cars, index) => {
    if (shortestIndex === undefined || cars.length < shortestLength)
      [shortestIndex, shortestLength] = [index, cars.length];

    return { shortestIndex, shortestLength };
  }, {}).shortestIndex;
}

function newArray2D(arrayLength) {
  let newArray = [];

  for (let i = 0; i < arrayLength; i++)
    newArray[i] = [];

  return newArray;
}

module.exports = {
  arrayDifference,
  createOutputFile,
  indexOfRandomLane,
  indexOfShortestLane,
  newArray2D,
};
