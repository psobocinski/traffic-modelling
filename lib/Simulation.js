'use strict';

const Road = require('./Road'),
      SimulationRunner = require('./SimulationRunner'),
      MetricsCalculator = require('./MetricsCalculator');

class Simulation {
  constructor(behaviour, timeOnRoadFunction, arrivalSequence) {
    this.runner = new SimulationRunner(behaviour);
    this.metricsCalculator = new MetricsCalculator(behaviour);
    this.road = new Road(timeOnRoadFunction, this.metricsCalculator);
    this.arrivalSequence = arrivalSequence;
  }

  run() {
    this.runner.run(this.arrivalSequence, this.road);
    this.metricsCalculator.complete(this.road);
  }
}

module.exports = Simulation;
