'use strict';

const Road = require('./Road'),
      SimulationRunner = require('./SimulationRunner');

class Simulation {
  constructor(behaviour, timeOnRoadFunction) {
    this.runner = new SimulationRunner(behaviour);
    this.road = new Road(timeOnRoadFunction);
  }

  run(arrivalSequence) {
    this.runner.run(arrivalSequence, this.road, this.recordMetricsForTick);
  }

  recordMetricsForTick(carsExited) {
    // TODO: iterate through cars exited:
    //  - calculate throughput per tick
    //  - increment total number of vehicles exited
    //  - increment total elapsed time
  }
}

module.exports = Simulation;
