'use strict';

const Road = require('./Road'),
      SimulationRunner = require('./SimulationRunner'),
      MetricsCalculator = require('./MetricsCalculator');

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
  constructor(config, arrivalSequence) {
    this.config = config;
    this.runner = new SimulationRunner(config);
    this.arrivalSequence = arrivalSequence;
    this.reset();
  }

  reset() {
    this.metricsCalculator = new MetricsCalculator(this.config, this.arrivalSequence);
    this.road = new Road(this.config, this.metricsCalculator);
  }

  run() {
    let iterationResults = [];

    for (let i = 0; i < this.config.numberOfIterations; i ++) {
      iterationResults.push(this.runIteration());
    }

    return calculateAverageResult(iterationResults);
  }

  runIteration() {
    let iterationResult;

    this.runner.run(this.arrivalSequence, this.road);
    iterationResult = this.metricsCalculator.complete(this.road);
    this.reset();

    return iterationResult;
  }
}

module.exports = Simulation;
