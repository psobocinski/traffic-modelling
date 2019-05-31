'use strict';

const Road = require('./Road'),
      Behaviours = require('./Behaviours');

class Simulation {
  constructor(behaviour, laneCapacity, timeOnRoadFunction) {
    this.runner = Behaviours[behaviour];
    this.road = new Road(laneCapacity, timeOnRoadFunction);
  }

  run(arrivalSequence) {
    this.runner(arrivalSequence, this.recordMetricsForTick);
  }

  recordMetricsForTick(carsExited) {
    // TODO: iterate through cars exited:
    //  - calculate throughput per tick
    //  - increment total number of vehicles exited
    //  - increment total elapsed time
  }
}

module.exports = Simulation;
