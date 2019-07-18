'use strict';

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

class Simulation {
  constructor({ numberOfIterations }, config, executionModel) {
    this.config = config;
    this.executionModel = executionModel;
    this.numberOfIterations = numberOfIterations;
  }

  run() {
    let iterationResults = [];

    for (let i = 0; i < this.numberOfIterations; i ++) {
      iterationResults.push(this.runIteration());
    }

    return calculateAverageResult(iterationResults);
  }

  runIteration() {
    return this.executionModel.run(this.config);
  }
}

module.exports = Simulation;
