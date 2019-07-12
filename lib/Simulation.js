'use strict';

const Road = require('./Road'),
      SimulationRunner = require('./SimulationRunner'),
      MetricsCalculator = require('./MetricsCalculator');

class Simulation {
  constructor(config, arrivalSequence) {
    this.runner = new SimulationRunner(config);
    this.arrivalSequence = arrivalSequence;
    this.metricsCalculator = new MetricsCalculator(config, arrivalSequence);
    this.road = new Road(config, this.metricsCalculator);
  }

  run() {
    this.runner.run(this.arrivalSequence, this.road);
    this.metricsCalculator.complete(this.road);
  }
}

module.exports = Simulation;
