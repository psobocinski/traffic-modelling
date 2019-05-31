'use strict';

const Road = require('./Road'),
      Behaviours = require('./Behaviours');

class Simulation {
  constructor(behaviour, timeOnRoadFunction) {
    this.runner = Behaviours[behaviour];
    this.road = new Road(timeOnRoadFunction);
  }

  run(arrivalSequence) {
    this.runner(arrivalSequence, this.road, this.recordMetricsForTick);
  }

  recordMetricsForTick(carsExited) {
    // TODO: iterate through cars exited:
    //  - calculate throughput per tick
    //  - increment total number of vehicles exited
    //  - increment total elapsed time
  }
}

module.exports = Simulation;
