'use strict';

class Simulation {
  behaviour; // random, levelled, or greedy
  laneCapacity; // max capacity of each lane
  duration; // total ticks to run simulation for
  timeOnRoadFunction; // linear, exponential, or logarithmic

  constructor({ behaviour, duration, laneCapacity, timeOnRoadFunction }) {
    this.behaviour = behaviour;
    this.duration = duration;
    this.laneCapacity = laneCapacity;
    this.timeOnRoadFunction = timeOnRoadFunction;
  }

  run() {}

  runRandom() {}
  runLevelled() {}
  runGreedy() {}
}

module.exports = Simulation;
