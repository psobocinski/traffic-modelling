'use strict';

class Car {
  constructor(timeOnRoadCalculator, totalCarsInLane) {
    this.timeOnRoadCalculator = timeOnRoadCalculator;
    this.reCalculateTotalTime(totalCarsInLane);
    this.elapsedTime = 0;
  }

  reCalculateTotalTime(totalCarsInLane) {
    this.totalTime = this.timeOnRoadCalculator(totalCarsInLane);
  }

  remainingTime() {
    return Math.max(this.totalTime - this.elapsedTime, 0);
  }

  tick() {
    this.elapsedTime++;
  }
}

module.exports = Car;
