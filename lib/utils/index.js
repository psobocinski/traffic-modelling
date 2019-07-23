'use strict';

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
  isSet,
  newArray2D,
};
