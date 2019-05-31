'use strict';

const Car = require('./Car');

class Road {
  laneCapacity;
  lanes;

  constructor(laneCapacity, timeOnRoadFunction) {
    this.calculateTimeOnRoad = n => eval(timeOnRoadFunction);
    this.laneCapacity = laneCapacity;
    this.lanes = { left: [], right: [] }
  }

  addCar(lane) {
    const expectedTimeInLane = this.calculateTimeOnRoad(this.lanes[lane].length);
    this.lanes[lane].push(new Car(expectedTimeInLane));
  }

  tick() {
    // TODO:
    //  1. The length of elapsed time for all cars on the road is incremented by 1
    //  2. The remaining time is recalculated. If equal to or less than 0, those cars exit the road
    //  3. Repeat step 2 until no additional cars exit the road
    //  4. Return the exited cars

    this.lanes.forEach(lane => lane.forEach(car => car.tick()));
  }

  isAtCapacity() {
    return this.lanes.left.length >= this.laneCapacity && this.lanes.right.length >= this.laneCapacity;
  }
}

module.exports = Road;
