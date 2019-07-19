'use strict';

const fs = require('fs');

function arrayDifference(arr1, arr2) {
  return (arr1.filter(x => !arr2.includes(x)));
}

function calculateAverageResult(results) {
  let resultSums = (new Array(results[0].length)).fill(null);

  results.forEach(resultRow =>
    resultRow.forEach((resultCellValue, index) => {
      if (typeof resultCellValue === 'number')
        resultSums[index] += resultCellValue;
    }));

  return resultSums.map(resultSum => {
    if (typeof resultSum === 'number')
      return Math.round(resultSum / results.length * 100) / 100;
  });
}

function createOutputFile({ path, format }, results) {
  const fileName = `results.${format}`,
    pathAndFileName = `${path}/${fileName}`;

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

function isSet(value) {
  return ![null, undefined].includes(value);
}

function newArray2D(arrayLength) {
  let newArray = [];

  for (let i = 0; i < arrayLength; i++)
    newArray[i] = [];

  return newArray;
}

module.exports = {
  arrayDifference,
  calculateAverageResult,
  createOutputFile,
  indexOfRandomLane,
  indexOfShortestLane,
  isSet,
  newArray2D,
};
