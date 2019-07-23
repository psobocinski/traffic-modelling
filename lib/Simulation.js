'use strict';

const { calculateAverageResult } = require('./utils');

class Simulation {
  constructor({ numberOfIterations }, config, executionModel) {
    this.config = config;
    this.executionModel = executionModel;
    this.numberOfIterations = numberOfIterations;
  }

  run() {
    const iterationResults = Array(this.numberOfIterations).fill().map(() => this.runIteration());

    return calculateAverageResult(iterationResults);
  }

  runIteration() {
    return this.executionModel.run(this.config);
  }
}

module.exports = Simulation;
