'use strict';

class Simulation {
  constructor(laneCapacity, timeOnRoadFunction) {
    // max capacity of each lane
    this.laneCapacity = laneCapacity;

    // linear, exponential, or logarithmic
    this.timeOnRoadFunction = timeOnRoadFunction;
  }

  random(arrivalSequence) {}
  levelled(arrivalSequence) {}
  greedy(arrivalSequence) {}
}

module.exports = Simulation;
