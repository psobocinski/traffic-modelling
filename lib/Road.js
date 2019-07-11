'use strict';

const Car = require('./Car'),
      { arrayDifference, newArray2D } = require('./utils');

class Road {
  constructor({ timeOnRoadFunction, numberOfLanes }, metricsCalculator) {
    this.timeOnRoadCalculator = n => eval(timeOnRoadFunction);
    this.metricsCalculator = metricsCalculator;
    this.lanes = newArray2D(numberOfLanes);
  }

  addCar(laneIndex) {
    const addToLane = this.lanes[laneIndex],
          carToAdd = new Car(this.timeOnRoadCalculator, addToLane.length);

    addToLane.push(carToAdd);
  }

  tick() {
    let exitingCars = [], newlyExitingCars, isDoneAdjustingLanes;

    //  1. Increment the elapsedTime for all cars on the road by 1
    this.lanes.forEach(cars =>
      cars.forEach(car =>
        car.tick()));

    this.lanes.forEach((cars, laneIndex) => {
      isDoneAdjustingLanes = false;

      while (!isDoneAdjustingLanes) {
        //  2. If remainingTime equal to 0, those cars exit the road
        newlyExitingCars = cars.filter(car => car.remainingTime() === 0);

        //  3. If any cars founding exiting the lane in step 3:
        if (newlyExitingCars.length > 0) {
          // a: Track exiting cars
          exitingCars = exitingCars.concat(newlyExitingCars);

          // b: Remove exited cars from the lane
          cars = arrayDifference(cars, newlyExitingCars);

          // c: re-calculate totalTime for all cars in that lane
          cars.forEach(car =>
            car.reCalculateTotalTime(cars.length)
          );
        } else {
          // Otherwise (no more cars exited), exit the loop
          isDoneAdjustingLanes = true;
        }
      }

      this.lanes[laneIndex] = cars;
    });

    //  5. Record metrics
    this.metricsCalculator.tick(exitingCars);
  }

  shortestAdjacentLaneIndexFor(laneIndex) {
    const adjacentLaneIndexes = this.adjacentLaneIndexesFor(laneIndex);
    let leftLaneIndex, rightLaneIndex, leftLaneLength, rightLaneLength;

    if (adjacentLaneIndexes.length === 1)
      return adjacentLaneIndexes[0];

    [leftLaneIndex, rightLaneIndex] = adjacentLaneIndexes;
    leftLaneLength = this.lanes[leftLaneIndex].length;
    rightLaneLength = this.lanes[rightLaneIndex].length;

    return rightLaneLength < leftLaneLength ? rightLaneIndex : leftLaneIndex;
  }

  adjacentLaneIndexesFor(laneIndex) {
    const leftLaneIndex = laneIndex - 1,
          rightLaneIndex = laneIndex + 1;

    return laneIndex === 0
      ? [rightLaneIndex]
      : laneIndex === this.lanes.length - 1
        ? [leftLaneIndex]
        : [leftLaneIndex, rightLaneIndex];
  }
}

module.exports = Road;
