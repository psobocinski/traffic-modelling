'use strict';

const Car = require('./Car');

class Road {
  constructor(timeOnRoadFunction) {
    this.calculateTimeOnRoad = n => eval(timeOnRoadFunction);
    this.lanes = { left: [], right: [] }
  }

  laneNames() {
    return Object.keys(this.lanes);
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

    this.lanes.left.forEach(car => car.tick());
    this.lanes.right.forEach(car => car.tick());
  }
}

module.exports = Road;
