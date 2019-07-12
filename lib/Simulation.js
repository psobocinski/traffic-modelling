'use strict';

const Road = require('./Road'),
      SimulationRunner = require('./SimulationRunner'),
      MetricsCalculator = require('./MetricsCalculator');

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
    this.runner.run(this.arrivalSequence, this.road);
    this.metricsCalculator.complete(this.road);
    this.reset();
  }
}

module.exports = Simulation;
