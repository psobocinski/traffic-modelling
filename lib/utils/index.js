

function arrayDifference(arr1, arr2) {
  return (arr1.filter(x => !arr2.includes(x)));
}

function calculateAverageResult(results) {
  const resultSums = (new Array(results[0].length)).fill(null);

  results.forEach(resultRow => resultRow.forEach((resultCellValue, index) => {
    if (typeof resultCellValue === 'number') resultSums[index] += resultCellValue;
  }));

  return resultSums.map(resultSum => (typeof resultSum === 'number'
    ? Math.round(resultSum / results.length * 100) / 100
    : undefined));
}

function isSet(value) {
  return ![null, undefined].includes(value);
}

function log(...args) {
  // eslint-disable-next-line no-console
  console.log(args);
}

function defineFunction(parameter, functionString) {
  // eslint-disable-next-line no-new-func
  return new Function(parameter, `return ${functionString}`);
}

function newArray2D(arrayLength) {
  const newArray = [];

  for (let i = 0; i < arrayLength; i += 1) newArray[i] = [];

  return newArray;
}

module.exports = {
  arrayDifference,
  calculateAverageResult,
  defineFunction,
  isSet,
  log,
  newArray2D,
};
