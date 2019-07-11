'use strict';

const Car = require('./Car'),
      Lane = require('./Lane'),
      { arrayDifference } = require('./utils');

class Road {
  constructor(timeOnRoadFunction, metricsCalculator) {
    this.timeOnRoadCalculator = n => eval(timeOnRoadFunction);
    this.metricsCalculator = metricsCalculator;
    this.lanes = [ new Lane(), new Lane() ];
  }

  addCar(laneIndex) {
    const addToLane = this.lanes[laneIndex],
          carToAdd = new Car(this.timeOnRoadCalculator, addToLane.cars.length);

    addToLane.add(carToAdd);
  }

  tick() {
    let exitingCars = [], newlyExitingCars, isDoneAdjustingLanes;

    //  1. Increment the elapsedTime for all cars on the road by 1
    this.lanes.forEach(lane =>
      lane.cars.forEach(car =>
        car.tick()));

    this.lanes.forEach(lane => {
      isDoneAdjustingLanes = false;

      while (!isDoneAdjustingLanes) {
        //  2. If remainingTime equal to 0, those cars exit the road
        newlyExitingCars = lane.cars.filter(car => car.remainingTime() === 0);

        //  3. If any cars founding exiting the lane in step 3:
        if (newlyExitingCars.length > 0) {
          // a: Track exiting cars
          exitingCars = exitingCars.concat(newlyExitingCars);

          // b: Remove exited cars from the lane
          lane.cars = arrayDifference(lane.cars, newlyExitingCars);

          // c: re-calculate totalTime for all cars in that lane
          lane.cars.forEach(car =>
            car.reCalculateTotalTime(lane.cars.length)
          );
        } else {
          // Otherwise (no more cars exited), exit the loop
          isDoneAdjustingLanes = true;
        }
      }
    });

    //  5. Record metrics
    this.metricsCalculator.tick(exitingCars);
  }

  static adjacentLaneIndexFor(laneIndex) {
    return { 0: 1, 1: 0 }[laneIndex];
  }
}

module.exports = Road;
