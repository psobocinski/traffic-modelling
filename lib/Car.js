'use strict';

// TODO: include config so that config options do not need to be passed in

class Car {
  constructor(timeOnRoadCalculator, totalCarsInLane) {
    this.timeOnRoadCalculator = timeOnRoadCalculator;
    this.timeInLane = 0;
    this.elapsedTime = 0;
    this.totalTime = this.timeOnRoadCalculator(totalCarsInLane);
    this.priorRemainingTime = this.remainingTime();
  }

  reCalculateTotalTime(totalCarsInLane) {
    this.priorRemainingTime = this.remainingTime();
    this.totalTime = this.timeOnRoadCalculator(totalCarsInLane);
  }

  remainingTime() {
    return Math.max(this.totalTime - this.elapsedTime, 0);
  }

  timeDelayPercent() {
    return (this.remainingTime() - this.priorRemainingTime) / this.priorRemainingTime * 100;
  }

  tick() {
    this.elapsedTime++;
    this.timeInLane++;
  }
}

module.exports = Car;
