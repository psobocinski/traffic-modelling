'use strict';

const { calculateAverageResult } = require('./utils');

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
