'use strict';

const Car = require('./Car'),
      arrayDifference = (arr1, arr2) => (arr1.filter(x => !arr2.includes(x)));

class Road {
  constructor(timeOnRoadFunction, recordMetricsOnTick) {
    this.timeOnRoadCalculator = n => eval(timeOnRoadFunction);
    this.metricsRecorder = recordMetricsOnTick;
    this.lanes = { left: [], right: [] };
  }

  laneNames() {
    return Object.keys(this.lanes);
  }

  addCar(lane) {
    this.lanes[lane].push(
      new Car(this.timeOnRoadCalculator, this.lanes[lane].length)
    );
  }

  tick() {
    let exitingCars = [], newlyExitingCars, done;

    this.laneNames().forEach(laneName =>
      this.lanes[laneName].forEach(car =>
        car.tick()));

    this.laneNames().forEach(laneName => {
      done = false;

      while (!done) {
        //  1. Increment the elapsedTime for all cars on the road by 1
        //  2. Recalculate remainingTime for all cars.
        //  3. If remainingTime equal to or less than 0, those cars exit the road
        newlyExitingCars = this.lanes[laneName].filter(car => car.remainingTime() === 0);

        //  4. If any cars exited the lane in step 3:
        if (newlyExitingCars.length > 0) {
          // a: Track exiting cars
          exitingCars = exitingCars.concat(newlyExitingCars);

          // b: Remove exited cars from the lane
          this.lanes[laneName] = arrayDifference(this.lanes[laneName], newlyExitingCars);

          // c: re-calculate totalTime for all cars in that lane
          this.lanes[laneName].forEach(car =>
            car.reCalculateTotalTime(this.lanes[laneName].length)
          );
        } else {
          // no more cars exited, exit the loop
          done = true;
        }
      }
    });

    //  5. Record metrics
    this.metricsRecorder(exitingCars);
  }
}

module.exports = Road;
