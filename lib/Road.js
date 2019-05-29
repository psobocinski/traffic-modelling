'use strict';

class Road {
  laneCapacity;
  lanes;

  constructor(laneCapacity) {
    this.laneCapacity = laneCapacity;
    this.lanes = {
      left: [],
      right: []
    }
  }

  addCar(car, lane) {
    this.lanes[lane].push(car);
  }

  isAtCapacity() {
    return this.lanes.left.length >= this.laneCapacity && this.lanes.right.length >= this.laneCapacity;
  }
}

module.exports = Road;
