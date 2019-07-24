

const Car = require('./Car');
const { arrayDifference, defineFunction, newArray2D } = require('../utils');

class Road {
  constructor(
    { laneChangeDelayTicks, timeOnRoadFunction, numberOfLanes },
    laneChangeDecider,
    metricsCalculator,
  ) {
    this.laneChangeDelayTicks = laneChangeDelayTicks;
    this.timeOnRoadCalculator = defineFunction('n', timeOnRoadFunction);
    this.laneChangeDecider = laneChangeDecider;
    this.metricsCalculator = metricsCalculator;
    this.lanes = newArray2D(numberOfLanes);
  }

  addCar(laneIndex) {
    const addToLane = this.lanes[laneIndex];
    const carToAdd = new Car(this.timeOnRoadCalculator, addToLane.length);

    addToLane.push(carToAdd);
  }

  tick() {
    const reCalculateTotalTimeForCar = (car, _, cars) => car.reCalculateTotalTime(cars.length);
    let exitingCars = [];
    let newlyExitingCars;
    let isDoneAdjustingLanes;

    //  1. Increment the elapsedTime for all cars on the road by 1
    this.lanes.forEach(cars => cars.forEach(car => car.tick()));

    for (let laneIndex = 0; laneIndex < this.lanes.length; laneIndex += 1) {
      let cars = this.lanes[laneIndex];

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
          cars.forEach(reCalculateTotalTimeForCar);
        } else {
          // Otherwise (no more cars exited), exit the loop
          isDoneAdjustingLanes = true;
        }
      }

      this.lanes[laneIndex] = cars;
    }

    //  5. Record metrics
    this.metricsCalculator.tick(exitingCars);
  }

  conditionallyChangeLanes() {
    if (!this.laneChangeDecider.hasLaneChangeConditions()) return;

    const carsToSwitch = newArray2D(this.lanes.length); let
      shorterLaneIndex;

    this.lanes.forEach(
      (cars, laneIndex) => {
        carsToSwitch[laneIndex] = cars.filter(
          (car) => {
            shorterLaneIndex = this.shortestAdjacentLaneIndexFor(laneIndex);

            return this.laneChangeDecider.isChangingLanes(car, this.lanes[shorterLaneIndex].length);
          },
        );
      },
    );

    this.changeLanes(carsToSwitch);
  }

  changeLanes(carsToSwitch) {
    let carIndex;
    let newLaneIndex;

    carsToSwitch.forEach((cars, laneIndex) => {
      cars.forEach((car) => {
        carIndex = this.lanes[laneIndex].indexOf(car);
        newLaneIndex = this.shortestAdjacentLaneIndexFor(laneIndex);

        // 1. remove from original lane
        this.lanes[laneIndex].splice(carIndex, 1);

        // 2. add to new lane
        this.lanes[newLaneIndex].push(car);

        // 3. reset elapsed time in lane and add delay for lane change
        car.adjustTimesForLaneChange(this.laneChangeDelayTicks);

        // 4. re-calculate total time
        car.reCalculateTotalTime(this.lanes[newLaneIndex].length);

        // 5. track lane change
        this.metricsCalculator.laneChanges += 1;
      });
    });
  }

  shortestAdjacentLaneIndexFor(laneIndex) {
    const adjacentLaneIndexes = this.adjacentLaneIndexesFor(laneIndex);

    if (adjacentLaneIndexes.length === 1) return adjacentLaneIndexes[0];

    const [leftLaneIndex, rightLaneIndex] = adjacentLaneIndexes;
    const leftLaneLength = this.lanes[leftLaneIndex].length;
    const rightLaneLength = this.lanes[rightLaneIndex].length;

    return rightLaneLength < leftLaneLength ? rightLaneIndex : leftLaneIndex;
  }

  adjacentLaneIndexesFor(laneIndex) {
    const leftLaneIndex = laneIndex - 1;
    const rightLaneIndex = laneIndex + 1;

    if (laneIndex === 0) return [rightLaneIndex];
    if (laneIndex === this.lanes.length - 1) return [leftLaneIndex];
    return [leftLaneIndex, rightLaneIndex];
  }
}

module.exports = Road;
