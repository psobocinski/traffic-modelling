'use strict';

const Road = require('./Road'),
      SimulationRunner = require('./SimulationRunner'),
      MetricsCalculator = require('./MetricsCalculator');

class Simulation {
  constructor(behaviour, config, arrivalSequence) {
    this.runner = new SimulationRunner(behaviour);
    this.arrivalSequence = arrivalSequence;
    this.metricsCalculator = new MetricsCalculator(behaviour, arrivalSequence);
    this.road = new Road(config, this.metricsCalculator);
  }

  run() {
    this.runner.run(this.arrivalSequence, this.road);
    this.metricsCalculator.complete(this.road);
  }
}

module.exports = Simulation;
